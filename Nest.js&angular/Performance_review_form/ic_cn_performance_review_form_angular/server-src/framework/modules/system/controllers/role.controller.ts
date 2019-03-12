import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ApiController,
  BaseApiController,
} from "../../../../core/modules/api-controller";
import { LoginGuard, RoleGuard } from "../../../../core/modules/authority";
import { RoleEntity } from "../entities";

@ApiController({
  apiPrefix: "roles",
})
@UseGuards(LoginGuard, RoleGuard)
export class RoleController extends BaseApiController<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super(roleRepository);
  }
}
