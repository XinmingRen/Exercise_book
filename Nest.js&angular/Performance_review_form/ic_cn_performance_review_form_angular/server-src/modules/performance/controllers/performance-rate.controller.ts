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
import { PerformanceRateEntity } from "../entities";

@Controller("/api/v1/performance-rates")
@UseGuards(LoginGuard, RoleGuard)
export class PerformanceRateController {
  constructor(
    @InjectRepository(PerformanceRateEntity)
    private readonly performanceRateRepository: Repository<
      PerformanceRateEntity
    >,
  ) {}
  @Get()
  public async getRates() {
    return await this.performanceRateRepository.find();
  }
  @Post()
  public async createRate(@Body() data: any) {
    return await this.performanceRateRepository.save(data);
  }

  @Put(":id")
  public async updateRate(@Param("id") id: number, @Body() data: any) {
    let rate = await this.performanceRateRepository.findOne(id);
    rate = await this.performanceRateRepository.save(
      this.performanceRateRepository.merge(rate as any, data),
    );
    return rate;
  }

  @Delete(":id")
  public async deleteRate(@Param("id") id: number) {
    return await this.performanceRateRepository.delete(id);
  }
}
