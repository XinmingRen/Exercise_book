import { Body, Param, Query } from "@nestjs/common";
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  Repository,
} from "typeorm";
import utils from "../../../utils";
import { HTTP_STATUS_CODE_ENUM } from "../../shared/enums";
import { IResult } from "../../shared/interfaces";
import { ParseNumberPipe } from "../../shared/pipes";
import { ParseOrderPipe, ParseRelationsPipe, ParseWherePipe } from "./pipes";

export abstract class BaseApiController<Entity extends ObjectLiteral> {
  constructor(private readonly repository: Repository<Entity>) {}

  public async findAndCount(
    @Query("order", new ParseOrderPipe()) order: any,
    @Query("relations", new ParseRelationsPipe()) relations: string[],
    @Query("skip", new ParseNumberPipe()) skip: number,
    @Query("take", new ParseNumberPipe()) take: number,
    @Query("where", new ParseWherePipe()) where: FindManyOptions<Entity>,
  ): Promise<IResult> {
    const [entities, count] = await this.repository.findAndCount({
      order,
      relations,
      skip,
      take,
      where,
    });
    return utils.createResult({ entities, count }, HTTP_STATUS_CODE_ENUM.OK);
  }

  public async find(
    @Query("order", new ParseOrderPipe()) order: any,
    @Query("relations", new ParseRelationsPipe()) relations: string[],
    @Query("skip", new ParseNumberPipe()) skip: number,
    @Query("take", new ParseNumberPipe()) take: number,
    @Query("where", new ParseWherePipe()) where: FindManyOptions<Entity>,
  ): Promise<IResult> {
    const entities = await this.repository.find({
      order,
      relations,
      skip,
      take,
      where,
    });
    return utils.createResult(entities, HTTP_STATUS_CODE_ENUM.OK);
  }

  public async findOneByFilter(
    @Query("relations", new ParseRelationsPipe()) relations: string[],
    @Query("where", new ParseWherePipe()) where: FindOneOptions<Entity>,
  ): Promise<IResult> {
    let code = HTTP_STATUS_CODE_ENUM.OK;
    const entity = await this.repository.findOne({ relations, where });
    if (entity === null) {
      code = HTTP_STATUS_CODE_ENUM.NOT_FOUND;
    }
    return utils.createResult(entity, code);
  }

  public async findOneById(
    @Param("id", new ParseNumberPipe()) id: number,
    @Query("relations", new ParseRelationsPipe()) relations: string[],
    @Query("where", new ParseWherePipe()) where: FindOneOptions<Entity>,
  ): Promise<IResult> {
    let code = HTTP_STATUS_CODE_ENUM.OK;
    const entity = await this.repository.findOne(id, {
      relations,
      where,
    });
    if (entity === null) {
      code = HTTP_STATUS_CODE_ENUM.NOT_FOUND;
    }
    return utils.createResult(entity, code);
  }

  public async create(
    @Body("data") data: Array<DeepPartial<Entity>>,
  ): Promise<IResult> {
    let code = HTTP_STATUS_CODE_ENUM.CREATED;
    const entities = await this.repository.save(data);
    if (entities.length === 0) {
      code = HTTP_STATUS_CODE_ENUM.BAD_REQUEST;
    }
    return utils.createResult(entities, code);
  }

  public async createOne(
    @Body("data") data: DeepPartial<Entity>,
  ): Promise<IResult> {
    let code = HTTP_STATUS_CODE_ENUM.CREATED;
    const entity = await this.repository.save(data);
    if (entity === null) {
      code = HTTP_STATUS_CODE_ENUM.BAD_REQUEST;
    }
    return utils.createResult(entity, code);
  }

  public async update(
    @Query("where", new ParseWherePipe()) where: FindManyOptions<any>,
    @Body("data") data: Entity,
  ): Promise<IResult> {
    let code = HTTP_STATUS_CODE_ENUM.OK;
    const entities = await this.repository.find({ where });
    if (entities.length === 0) {
      code = HTTP_STATUS_CODE_ENUM.BAD_REQUEST;
    } else {
      await this.repository.save(
        utils.map(entities, (entity) => this.repository.merge(entity, data)),
      );
    }
    return utils.createResult({}, code);
  }

  public async updateOneByFilter(
    @Query("where", new ParseWherePipe()) where: FindOneOptions<any>,
    @Body("data") data: Entity,
  ): Promise<IResult> {
    let code = HTTP_STATUS_CODE_ENUM.OK;
    const entity = await this.repository.findOne({ where });
    if (entity === undefined) {
      code = HTTP_STATUS_CODE_ENUM.BAD_REQUEST;
    } else {
      await this.repository.save(this.repository.merge(entity, data));
    }
    return utils.createResult({}, code);
  }

  public async updateOneById(
    @Param("id", new ParseNumberPipe()) id: number,
    @Body("data") data: Entity,
  ): Promise<IResult> {
    let code = HTTP_STATUS_CODE_ENUM.OK;
    const entity = await this.repository.findOne(id);
    if (entity === undefined) {
      code = HTTP_STATUS_CODE_ENUM.BAD_REQUEST;
    } else {
      await this.repository.save(this.repository.merge(entity, data));
    }
    return utils.createResult({}, code);
  }

  public async delete(
    @Query("where", new ParseWherePipe()) where: FindManyOptions<any>,
  ): Promise<IResult> {
    let code = HTTP_STATUS_CODE_ENUM.NO_CONTENT;
    const entities = await this.repository.find({ where });
    if (entities.length === 0) {
      code = HTTP_STATUS_CODE_ENUM.BAD_REQUEST;
    } else {
      await this.repository.delete(utils.flatMap(entities, "id"));
    }
    return utils.createResult({}, code);
  }

  public async deleteOneByFilter(
    @Query("where", new ParseWherePipe()) where: FindOneOptions<any>,
  ): Promise<IResult> {
    let code = HTTP_STATUS_CODE_ENUM.NO_CONTENT;
    const entity = await this.repository.findOne({ where });
    if (entity === undefined) {
      code = HTTP_STATUS_CODE_ENUM.BAD_REQUEST;
    } else {
      await this.repository.delete(entity.id);
    }
    return utils.createResult({}, code);
  }

  public async deleteOneById(
    @Param("id", new ParseNumberPipe()) id: number,
  ): Promise<IResult> {
    await this.repository.delete(id);
    return utils.createResult({}, HTTP_STATUS_CODE_ENUM.NO_CONTENT);
  }
}
