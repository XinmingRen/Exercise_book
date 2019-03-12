import { UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ApiController,
  BaseApiController,
} from "../../../../core/modules/api-controller";
import { LoginGuard, RoleGuard } from "../../../../core/modules/authority";
import { PageEntity } from "../entities";

@ApiController({
  apiPrefix: "pages",
})
@UseGuards(LoginGuard, RoleGuard)
export class PageController extends BaseApiController<PageEntity> {
  constructor(
    @InjectRepository(PageEntity)
    private readonly pageRepository: Repository<PageEntity>,
  ) {
    super(pageRepository);
  }
}
