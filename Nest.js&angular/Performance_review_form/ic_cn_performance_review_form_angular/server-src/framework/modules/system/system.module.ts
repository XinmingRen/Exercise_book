import { Module } from "@nestjs/common";
import { ApiControllerModule } from "../../../core/modules/api-controller";
import { RepositoryModule } from "../../../core/modules/repository";
import {
  PageController,
  RoleController,
  TemplateController,
  UserController,
} from "./controllers";
import { PageEntity, RoleEntity, TemplateEntity, UserEntity } from "./entities";

const entities = [PageEntity, RoleEntity, TemplateEntity, UserEntity];
const modules = [ApiControllerModule, RepositoryModule.forFeature(entities)];
const controllers = [
  PageController,
  RoleController,
  TemplateController,
  UserController,
];
const services = [];

@Module({
  controllers,
  imports: [...modules],
  providers: [...services],
})
export class SystemModule {}
