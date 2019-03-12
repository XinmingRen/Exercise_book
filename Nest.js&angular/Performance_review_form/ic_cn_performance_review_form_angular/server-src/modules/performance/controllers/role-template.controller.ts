import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoginGuard, RoleGuard } from "../../../core/modules/authority";
import { IndexTemplateEntity, RoleTemplateEntity } from "../entities";

@Controller("/api/v1/role-templates")
@UseGuards(LoginGuard, RoleGuard)
export class RoleTemplateController {
  constructor(
    @InjectRepository(RoleTemplateEntity)
    private readonly roleTemplateRepository: Repository<RoleTemplateEntity>,
  ) {}
  @Get()
  public async getRoles() {
    return await this.roleTemplateRepository.find({
      relations: ["indexs"],
    });
  }

  @Post()
  public async createRole(@Body() data: any) {
    return await this.roleTemplateRepository.save(data);
  }

  @Put(":id")
  public async updateRole(@Param("id") id: number, @Body() data: any) {
    let role = await this.roleTemplateRepository.findOne(id);
    role = await this.roleTemplateRepository.save(
      this.roleTemplateRepository.merge(role as any, data),
    );
    return role;
  }

  @Delete(":id")
  public async deleteRole(@Param("id") id: number) {
    return await this.roleTemplateRepository.delete(id);
  }
}
