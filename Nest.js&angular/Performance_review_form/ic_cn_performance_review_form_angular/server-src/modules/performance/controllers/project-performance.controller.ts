import { Body, Controller, Get, Param, Post, Put, Request } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";
import { Repository } from "typeorm";
import { PREFIX_PATH_ENUM } from "../../../core/shared/enums";
import { ApprovalEntity } from "../../work-flow/entities";
import {
  ProjectPerformanceEntity,
  ProjectPerformanceIndexEntity,
} from "../entities";
import { ProjectService } from "../services/project.service";

@Controller(`${PREFIX_PATH_ENUM.V1}/projectperformance`)
export class ProjectPerformanceController {
  constructor(
    @InjectRepository(ProjectPerformanceIndexEntity)
    private readonly projectPerformanceIndexRepository: Repository<
      ProjectPerformanceIndexEntity
    >,
    @InjectRepository(ProjectPerformanceEntity)
    private readonly projectPerformanceRepository: Repository<
      ProjectPerformanceEntity
    >,
    @InjectRepository(ApprovalEntity)
    private readonly approvalRepository: Repository<ApprovalEntity>,

    private readonly projectService: ProjectService,
  ) { }
  @Get() // 测试用
  public async getall(@Request() request: any) {
    // tslint:disable-next-line:no-console
    console.log(request.user);
  }
  @Put(":id") // 评价
  public async evaluatePerformance(@Param() id: number, @Body() info: any, @Request() request: any) {
    const userInfo = request.user; // 当前登陆用户信息
    const performanceInfo = await this.projectPerformanceRepository.findOne(id);
    let authentication: string = this.projectService.authenticate(userInfo); // 调取service的用户验证
    if (performanceInfo !== undefined && performanceInfo.userId === userInfo.id) {// 判断是否是员工确认操作
      authentication = "Personal Confirmation Authority";
    }

    if (authentication === "No Permissions") {// 没有权限的操作
      return { result: authentication };
    } else if (authentication === "Authority of PM") {// 审批权限的操作
      info.projectPerformance = {
        comment: info.projectPerformance.comment,
        score: info.projectPerformance.score,
        status: 0,
        workload: info.projectPerformance.workload,
      };
      await this.projectPerformanceRepository.update(id, info.projectPerformance); // 更新project-performances表
      const performanceIndexsIdArray = new Array(); // 更新project-performance-indexs表
      _.forEach(info.performanceIndexs, (value) => {
        performanceIndexsIdArray.push(value.id);
      });

      let performanceIndexsArray = new Array();
      performanceIndexsArray = await this.projectPerformanceIndexRepository.findByIds(performanceIndexsIdArray);

      const mergeArray = new Array();
      _.forEach(performanceIndexsArray, (value, index) => {
        mergeArray.push(this.projectPerformanceIndexRepository.merge(value, info.performanceIndexs[index]));
      });
      await this.projectPerformanceIndexRepository.save(mergeArray);

      const approval = await this.approvalRepository.findOne({ approverId: request.user.id, projectPerformanceId: id });
      info.approvals = {// 更新work_flow.approvals表
        comment: null,
        date: new Date(),
        status: 0,
      };
      if (approval !== undefined) {
        await this.approvalRepository.update(approval.id, info.approvals);
      }

      return { result: "success" };
    } else if (authentication === "Personal Confirmation Authority") {// 个人确认权限的操作
      const projectPerformance = await this.projectPerformanceRepository.findOne(id);
      const projectPerformanceTemp = {
        status: 99,
      };
      if (projectPerformance !== undefined) {
        await this.projectPerformanceRepository.save(this.projectPerformanceRepository.merge(projectPerformance, projectPerformanceTemp));
      }
      const approval = await this.approvalRepository.findOne({ approverId: request.user.id, projectPerformanceId: id });
      info.approvals = {// 添加work_flow.approvals表
        comment: info.approvals.comment,
        date: new Date(),
        status: 99,
      };
      if (approval !== undefined) {
        await this.approvalRepository.update(approval.id, info.approvals);
      }

      return { result: "success" };
    }
  }

}
