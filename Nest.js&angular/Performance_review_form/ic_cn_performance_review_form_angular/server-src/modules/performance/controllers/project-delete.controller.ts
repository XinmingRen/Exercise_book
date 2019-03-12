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
import bodyParser = require("body-parser");
import _ from "lodash";
import { Repository } from "typeorm";
import { PREFIX_PATH_ENUM } from "../../../core/shared/enums";
import {
  ProjectEntity,
  ProjectIndexEntity,
  ProjectPerformanceEntity,
  ProjectPerformanceIndexEntity,
  ProjectRoleEntity,
} from "../entities";

@Controller(`${PREFIX_PATH_ENUM.V1}/projectdelete`)
export class ProjectDeleteController {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectRoleEntity)
    private readonly projectRoleRepository: Repository<ProjectRoleEntity>,
    @InjectRepository(ProjectPerformanceEntity)
    private readonly projectPerformanceRepository: Repository<
      ProjectPerformanceEntity
    >,
    @InjectRepository(ProjectIndexEntity)
    private readonly projectIndexRepository: Repository<ProjectIndexEntity>,
    @InjectRepository(ProjectPerformanceIndexEntity)
    private readonly projectPerformanceIndexRepository: Repository<
      ProjectPerformanceIndexEntity
    >,
  ) {}

  @Get(":id")
  public async getProject(@Param("id") id: any) {
    const projects = await this.projectRepository.findOne(id);
    return projects;
    // _.forEach(projects, (e) => {
    //   console.log(e);
    //   console.log(typeof e);
    // });
  }
  @Get()
  public async gteall() {
    return await this.projectRepository.find();
  }
  @Delete(":id")
  public async deleteProject(@Param("id") id: number) {
    // 删除  remove（user）
    const projects = await this.projectRepository.findOne(id);
    const arrays = new Array();
    _.forEach(projects, (e) => {
      arrays.push(e);
    });
    const projectId = arrays[0];
    console.log("projectId:", projectId);
    // console.log(arrays);
    // 删除projectperformanceindex表
    let projectPerformanceIndexArrays = new Array();
    projectPerformanceIndexArrays = await this.projectPerformanceIndexRepository.find();

    _.forEach(projectPerformanceIndexArrays, (e) => {
      if (projectId === e.projectId) {
        console.log("ok", e.projectId);
        this.projectPerformanceIndexRepository.remove(projectId);
      }
    });
    // 删除projectindex表
    let projectIndexArrays = new Array();
    projectIndexArrays = await this.projectIndexRepository.find();
    let projectIndexRoleId = null;
    _.forEach(projectIndexArrays, (e) => {
      projectIndexRoleId = e.roleId; //  将index的roleid保存
      if (projectId === e.projectId) {
        console.log("ok", e.projectId);
        this.projectIndexRepository.remove(projectId);
      }
    });
    console.log("将index的roleid保存::", projectIndexRoleId);
    // 删除projectperformance表
    let ProjectPerformanceArrays = new Array();
    ProjectPerformanceArrays = await this.projectPerformanceRepository.find();

    _.forEach(ProjectPerformanceArrays, (e) => {
      if (projectId === e.projectId) {
        console.log("ok", e.projectId);
        this.projectPerformanceRepository.remove(projectId);
      }
    });
    console.log("projectperfromance pass already ");
    // 删除projectRoles表
    let projectRoleArrays = new Array();
    projectRoleArrays = await this.projectRoleRepository.find();

    _.forEach(projectRoleArrays, (e) => {
      const roleId = e.id;
      if (projectId === e.projectId && projectIndexRoleId === e.id) {
        console.log("ok", e.projectId);
        this.projectRoleRepository.remove(projectId);
      }
    });
    // 删除project表
    let projectArrays = new Array();
    projectArrays = await this.projectRepository.find();

    _.forEach(projectArrays, (e) => {
      if (projectId === e.projectId) {
        console.log("ok", e.projectId, e.roleId);
        this.projectRepository.remove(projectId);
      }
    });
    console.log("ok", "it's end ");
  }
}

// this.projectIndexRepository.delete(projectId);
// this.projectPerformanceRepository.delete(projectId);
// this.projectRoleRepository.delete(projectId);
// this.projectRepository.delete(projectId);
