import { AdvancedConsoleLogger, Logger, QueryRunner } from "typeorm";
import utils from "../../../utils";

export class DatabaseLogger implements Logger {
  public advancedConsoleLogger: AdvancedConsoleLogger;

  constructor(
    options?:
      | boolean
      | "all"
      | Array<
          "log" | "info" | "warn" | "query" | "schema" | "error" | "migration"
        >
      | undefined,
  ) {
    this.advancedConsoleLogger = new AdvancedConsoleLogger(options);
  }

  public logQuery(
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.advancedConsoleLogger.logQuery(query, parameters, queryRunner);
  }

  public logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    utils.logger("[DATABASE]").error(error);
    this.advancedConsoleLogger.logQueryError(
      error,
      query,
      parameters,
      queryRunner,
    );
  }

  public logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.advancedConsoleLogger.logQuerySlow(
      time,
      query,
      parameters,
      queryRunner,
    );
  }

  public logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.advancedConsoleLogger.logSchemaBuild(message, queryRunner);
  }

  public logMigration(message: string, queryRunner?: QueryRunner) {
    this.advancedConsoleLogger.logMigration(message, queryRunner);
  }

  public log(
    level: "log" | "info" | "warn",
    message: any,
    queryRunner?: QueryRunner,
  ) {
    utils.logger("[DATABASE]").info(message);
    this.advancedConsoleLogger.log(level, message, queryRunner);
  }
}
