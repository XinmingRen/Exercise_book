import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ApiController,
  BaseApiController,
} from "../../../../core/modules/api-controller";
import { LoginGuard, RoleGuard } from "../../../../core/modules/authority";
import { TemplateEntity } from "../entities";

@ApiController({
  apiPrefix: "templates",
})
@UseGuards(LoginGuard, RoleGuard)
export class TemplateController extends BaseApiController<TemplateEntity> {
  constructor(
    @InjectRepository(TemplateEntity)
    private readonly templateRepository: Repository<TemplateEntity>,
  ) {
    super(templateRepository);
  }
}
