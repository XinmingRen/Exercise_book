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
import { ProjectPerformanceIndexEntity } from "./../entities/project-performance-index.entity";
import { IndexTemplateController } from "./index-template.controller";
@Controller("/api/v1/index-templates")
@UseGuards(LoginGuard, RoleGuard)
export class IndexTemplateController {
  constructor(
    @InjectRepository(IndexTemplateEntity)
    private readonly indexTemplateRepository: Repository<IndexTemplateEntity>,
    @InjectRepository(RoleTemplateEntity)
    private readonly roleTemplateRepository: Repository<RoleTemplateEntity>,
  ) {}
  @Get()
  public async getIndexes() {
    return await this.indexTemplateRepository.find({
      relations: ["roleTemplate"],
    });
  }
  @Get(":id")
  public async getUser(@Param("id") id: any) {
    return await this.roleTemplateRepository.findOne(id);
  }
  @Post()
  public async createIndex(@Body() data: any) {
    return await this.indexTemplateRepository.save(data);
  }

  @Put(":id")
  public async updateIndex(@Param("id") id: number, @Body() data: any) {
    let index = await this.indexTemplateRepository.findOne(id);
    index = await this.indexTemplateRepository.save(
      this.indexTemplateRepository.merge(index as any, data),
    );
    return index;
  }

  @Delete(":id")
  public async deleteIndex(@Param("id") id: number) {
    return await this.indexTemplateRepository.delete(id);
  }
}
