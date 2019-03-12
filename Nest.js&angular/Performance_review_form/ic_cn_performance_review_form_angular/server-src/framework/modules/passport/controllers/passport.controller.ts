import { Controller, Get, Post, Request, Response } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import passport from "passport";
import { Repository } from "typeorm";
import { HTTP_STATUS_CODE_ENUM } from "../../../../core/shared/enums";
import {
  IRequest,
  IResponse,
  IResult,
} from "../../../../core/shared/interfaces";
import utils from "../../../../utils";
import { UserEntity } from "../../system/entities";

@Controller("auth")
export class PassportController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Get("user")
  public async getUser(@Request() request: IRequest): Promise<IResult> {
    const user = await this.userRepository.findOne(request.user, {
      relations: ["roles", "roles.pages"],
    });
    return utils.createResult(user, HTTP_STATUS_CODE_ENUM.OK);
  }

  @Post("login")
  public async localLogin(
    @Request() request: IRequest,
    @Response() response: IResponse,
  ) {
    passport.authenticate("local")(request, response, () => {
      response.send(utils.createResult(request.user, HTTP_STATUS_CODE_ENUM.OK));
    });
  }

  @Post("logout")
  public async logout(
    @Request() request: IRequest,
    @Response() response: IResponse,
  ) {
    request.logout();
    response.send(utils.createResult({}, HTTP_STATUS_CODE_ENUM.OK));
  }
}
