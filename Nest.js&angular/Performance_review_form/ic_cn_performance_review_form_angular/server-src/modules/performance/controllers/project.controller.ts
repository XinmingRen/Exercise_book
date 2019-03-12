import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";
import { In, Repository } from "typeorm";
import { PREFIX_PATH_ENUM } from "../../../core/shared/enums";
import { UserEntity } from "../../../framework/modules/system/entities";
import { ApprovalEntity } from "../../work-flow/entities";
import {
  ProjectEntity,
  ProjectIndexEntity,
  ProjectPerformanceEntity,
  ProjectPerformanceIndexEntity,
  ProjectRoleEntity,
} from "../entities";
import { ProjectService } from "../services/project.service";

@Controller(`${PREFIX_PATH_ENUM.V1}/projects`)
export class ProjectController {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectRoleEntity)
    private readonly projectRoleRepository: Repository<ProjectRoleEntity>,
    @InjectRepository(ProjectPerformanceEntity)
    private readonly projectPerformanceRepository: Repository<
      ProjectPerformanceEntity
    >,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProjectIndexEntity)
    private readonly projectIndexRepository: Repository<ProjectIndexEntity>,
    @InjectRepository(ProjectPerformanceIndexEntity)
    private readonly projectPerformanceIndexRepository: Repository<
      ProjectPerformanceIndexEntity
    >,
    @InjectRepository(ApprovalEntity)
    private readonly approvalReposity: Repository<ApprovalEntity>,

    private readonly projectService: ProjectService,
  ) { }

  @Get()
  public async getProject(@Request() request: any) {
    const userInfo = request.user; // 当前登陆用户信息
    const authentication: string = this.projectService.authenticate(userInfo);
    if (authentication === "Authority of HR") {
      const projects = await this.projectRepository.find({
        relations: [
          "buHeader",
          "projectManager",
          "roles",
          "performances",
          "performances.user",
          "performances.role",
          "performances.indexs",
        ],
      });
      return projects;
    } else if (authentication === "Authority of PM") {
      const projects = await this.projectRepository.find({
        relations: [
          "buHeader",
          "projectManager",
          "roles",
          "performances",
          "performances.user",
          "performances.role",
          "performances.indexs",
        ],
        where: {
          projectManagerId: userInfo.id,
        },
      });
      return projects;
    } else if (authentication === "Authority of Worker") {
      const performance = await this.projectPerformanceRepository.find({
        userId: userInfo.id,
      });
      const projectIdArray = new Array();
      _.forEach(performance, (value) => {
        projectIdArray.push(value.projectId);
      });
      const projects: any = await this.projectRepository.findByIds(projectIdArray, {
        relations: [
          "buHeader",
          "projectManager",
          "roles",
        ],
      });
      const performances = await this.projectPerformanceRepository.find({ relations: ["user", "role", "indexs"], where: { userId: userInfo.id } });
      _.forEach(projects, (project) => {
        const performanceValueArray = new Array();
        _.forEach(performances, (performanceValue) => {
          if (project.id === performanceValue.projectId) {
            performanceValueArray.push(performanceValue);
          }
        });
        project.performances = performanceValueArray;
      });
      return projects;
    } else {
      return { status: authentication };
    }
  }

  @Post()
  public async createProject(@Body() info: any, @Request() request: any) {
    const userInfo = request.user; // 当前登陆用户信息
    const authentication: string = this.projectService.authenticate(userInfo);
    if (authentication === "Authority of HR") {
      const projectEntityResult = await this.projectRepository.save(info.project);
      const projectRolesArray = new Array();
      _.forEach(info.projectRoles, (value) => {
        const projectRole = {
          comment: value.comment,
          name: value.name,
          projectId: projectEntityResult.id,
        };
        projectRolesArray.push(projectRole);
      });
      const roleEntityResult = await this.projectRoleRepository.save(
        projectRolesArray,
      );

      const projectRolesIndexsArray = new Array();
      const projectPerformanceArray = new Array();
      _.forEach(info.projectRoles, (projectRole, i) => {
        _.forEach(projectRole.indexs, (projectRoleIndex) => {
          const index = {
            explain: projectRoleIndex.explain,
            name: projectRoleIndex.name,
            projectId: projectEntityResult.id,
            roleId: roleEntityResult[i].id,
            standard: projectRoleIndex.standard,
            weight: projectRoleIndex.weight,
          };
          projectRolesIndexsArray.push(index);
        });
        _.forEach(projectRole.projectPerformances, (projectPerformance) => {
          const projectPerformanceTemp = {
            comment: projectPerformance.comment,
            projectId: projectEntityResult.id,
            roleId: roleEntityResult[i].id,
            score: projectPerformance.score,
            status: -99,
            userId: projectPerformance.userId,
            workload: projectPerformance.workload,
          };
          projectPerformanceArray.push(projectPerformanceTemp);
        });
      });
      const projectIndexEntityResult = await this.projectIndexRepository.save(
        projectRolesIndexsArray,
      );
      const projectPerformanceEntityResult = await this.projectPerformanceRepository.save(
        projectPerformanceArray,
      );

      const approvalsArray = new Array(); // 在approvas表中创建PM审批和员工确认的两条未完成记录
      _.forEach(projectPerformanceEntityResult, (value) => {
        const PMApprovalTemp = {
          approverId: info.project.projectManagerId,
          date: new Date(),
          level: 1,
          projectPerformanceId: value.id,
          status: -99,
        };
        const WorkerApprovalTemp = {
          approverId: value.userId,
          date: new Date(),
          level: 1,
          projectPerformanceId: value.id,
          status: -99,
        };
        approvalsArray.push(PMApprovalTemp);
        approvalsArray.push(WorkerApprovalTemp);
      });
      await this.approvalReposity.save(approvalsArray);

      const projectPerformanceIndexArray = new Array();
      let performanceArrayIndex = 0;
      _.forEach(info.projectRoles, (projectRole) => {
        _.forEach(projectRole.projectPerformances, (projectPerformance) => {
          ++performanceArrayIndex;
          _.forEach(projectPerformance.indexs, (projectPerformanceIndex) => {
            const projectPerformanceIndexTemp = {
              comment: projectPerformanceIndex.comment,
              explain: projectPerformanceIndex.explain,
              name: projectPerformanceIndex.name,
              projectId: projectEntityResult.id,
              projectPerformanceId:
                projectPerformanceEntityResult[performanceArrayIndex - 1].id,
              rateId: projectPerformanceIndex.rateId,
              standard: projectPerformanceIndex.standard,
              type: projectPerformanceIndex.type,
              weight: projectPerformanceIndex.weight,
            };
            projectPerformanceIndexArray.push(projectPerformanceIndexTemp);
          });
        });
      });
      await this.projectPerformanceIndexRepository.save(projectPerformanceIndexArray);

      return { status: "success" };
    } else {
      return { status: authentication };
    }
  }

  @Get(":projectPerformancePK")
  public async getProjectPerformance(
    @Param("projectPerformancePK") projectPerformancePK: number,
  ) {
    const projectPerformance = await this.projectPerformanceRepository.findOne(
      projectPerformancePK,
      { relations: ["indexs"] },
    );
    let approval: any;
    if (projectPerformance !== undefined) {
      approval = await this.approvalReposity.findOne({
        approverId: projectPerformance.userId,
        projectPerformanceId: projectPerformancePK,
      });
    }
    const result = {
      approval,
      projectPerformance,
    };
    return result;
  }

  @Post("del")
  public async deleteProject(@Body() info: any, @Request() request: any) {
    const userInfo = request.user; // 当前登陆用户信息
    const authentication: string = this.projectService.authenticate(userInfo); // 验证当前用户身份
    if (authentication === "Authority of HR") {

      const performancesWaitDelete = await this.projectPerformanceRepository.find({ projectId: In(info.projectIds) });
      const projectPerformancesId = new Array();
      _.forEach(performancesWaitDelete, (value) => {
        projectPerformancesId.push(value.id);
      });
      if (projectPerformancesId.length > 0) {
        const approvalWaitDelete = await this.approvalReposity.find({ projectPerformanceId: In(projectPerformancesId) });
        await this.approvalReposity.remove(approvalWaitDelete); // 删除approvals表相应数据
      }

      const performanceIndexsWaitDelete = await this.projectPerformanceIndexRepository.find({ projectId: In(info.projectIds) });
      await this.projectPerformanceIndexRepository.remove(performanceIndexsWaitDelete); // 删除project-performance-indexs表相应数据

      await this.projectPerformanceRepository.remove(performancesWaitDelete); // 删除project-performance表相应数据

      const projectIndexsWaitDelete = await this.projectIndexRepository.find({ projectId: In(info.projectIds) });
      await this.projectIndexRepository.remove(projectIndexsWaitDelete); // 删除project-indexs表相应数据

      const projectRolesWaitDelete = await this.projectRoleRepository.find({ projectId: In(info.projectIds) });
      await this.projectRoleRepository.remove(projectRolesWaitDelete); // 删除project-roles表相应数据

      const projectWaitDelete = await this.projectRepository.findByIds(info.projectIds);
      await this.projectRepository.remove(projectWaitDelete); // 删除project表相应数据

      return { result: "success" };
    } else {
      return { result: authentication };
    }
  }
}
