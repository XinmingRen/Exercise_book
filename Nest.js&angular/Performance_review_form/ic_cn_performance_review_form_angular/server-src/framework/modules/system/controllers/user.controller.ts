import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ApiController,
  BaseApiController,
} from "../../../../core/modules/api-controller";
import { LoginGuard, RoleGuard } from "../../../../core/modules/authority";
import { UserEntity } from "../entities";

@ApiController({
  apiPrefix: "users",
})
@UseGuards(LoginGuard, RoleGuard)
export class UserController extends BaseApiController<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
}
