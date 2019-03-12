import { Module } from "@nestjs/common";
import { RepositoryModule } from "../../core/modules/repository";
import { ApprovalEntity } from "./entities";

const entities = [ApprovalEntity];
const modules = [RepositoryModule.forFeature(entities)];

@Module({
  imports: modules,
})
export class WorkFlowModule {}
