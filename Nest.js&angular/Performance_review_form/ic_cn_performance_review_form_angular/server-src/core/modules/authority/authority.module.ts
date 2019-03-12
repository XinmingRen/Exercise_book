import { Module } from "@nestjs/common";
import { LoginGuard } from "./login.guard";
import { RoleGuard } from "./role.guard";

const guards = [LoginGuard, RoleGuard];

@Module({
  exports: [...guards],
  providers: [...guards],
})
export class AuthorityModule {}
