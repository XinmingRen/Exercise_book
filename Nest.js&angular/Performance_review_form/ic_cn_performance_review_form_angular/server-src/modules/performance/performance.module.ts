import { Module } from "@nestjs/common";
import { RepositoryModule } from "../../core/modules/repository";
import {
  IndexTemplateController,
  PerformanceRateController,
  ProjectController,
  ProjectDeleteController,
  ProjectPerformanceController,
  RoleTemplateController,
  UserInfoController,
} from "./controllers";
import {
  IndexTemplateEntity,
  PerformanceRateEntity,
  ProjectEntity,
  ProjectIndexEntity,
  ProjectPerformanceEntity,
  ProjectPerformanceIndexEntity,
  ProjectRoleEntity,
  RoleTemplateEntity,
} from "./entities";
import { ProjectService } from "./services/project.service";

const entities = [
  IndexTemplateEntity,
  PerformanceRateEntity,
  ProjectEntity,
  ProjectIndexEntity,
  ProjectPerformanceEntity,
  ProjectPerformanceIndexEntity,
  ProjectRoleEntity,
  RoleTemplateEntity,
];
const modules = [RepositoryModule.forFeature(entities)];

@Module({
  controllers: [
    ProjectController,
    IndexTemplateController,
    PerformanceRateController,
    RoleTemplateController,
    ProjectPerformanceController,
    UserInfoController,
  ],
  imports: modules,
  providers: [ProjectService],
})
export class PerformanceModule { }
