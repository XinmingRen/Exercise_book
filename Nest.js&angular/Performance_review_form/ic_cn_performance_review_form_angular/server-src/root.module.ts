import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthorityModule } from "./core/modules/authority";
import { ExceptionModule } from "./core/modules/exception";

import { DATABASE_CONFIG } from "./configs";
import { PassportModule, SystemModule } from "./framework/modules";
import { PerformanceModule, WorkFlowModule } from "./modules";

const modules = [
  TypeOrmModule.forRoot(DATABASE_CONFIG),
  AuthorityModule,
  ExceptionModule,
  PassportModule,
  SystemModule,
  PerformanceModule,
  WorkFlowModule,
];

@Module({
  imports: modules,
})
export class RootModule { }
