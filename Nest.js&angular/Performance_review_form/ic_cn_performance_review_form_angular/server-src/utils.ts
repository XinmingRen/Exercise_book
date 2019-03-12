import { HttpException } from "@nestjs/common";
import ejs from "ejs";
import httpContext from "express-http-context";
import _ from "lodash";
import log4js from "log4js";
import path from "path";
import { APP_CONFIG } from "./configs";
import { Logger } from "./core/modules/logger";
import { ENVIRONMENT_ENUM, HTTP_STATUS_CODE_ENUM } from "./core/shared/enums";
import { IResult } from "./core/shared/interfaces";

let getLogger: log4js.Logger;

interface ILodashMixin extends _.LoDashStatic {
  toBoolean(value: any): boolean;
  getRootPath(): string;
  getPath(...paths: string[]): string;
  render(template: string, data?: ejs.Data, options?: ejs.Options): string;
  logger(category?: string | undefined): log4js.Logger;
  isLocal(): boolean;
  isDevelopment(): boolean;
  isProduction(): boolean;
  getCurrentUserId(): number | null;
  createResult(data: any): IResult;
  createResult(error: Error): IResult;
  createResult(data: any, code: number): IResult;
  createResult(error: Error, code: number): IResult;
  createResult(error: HttpException, code: number): IResult;
}

function toBoolean(value: any): boolean {
  if (value === "true") {
    return true;
  }
  return false;
}

function getRootPath(): string {
  return process.cwd();
}

function getPath(...paths: string[]): string {
  return path.resolve(getRootPath(), ...paths);
}

function render(template: string, data?: ejs.Data, options?: ejs.Options) {
  return ejs.render(template, data, options);
}

function logger(category?: string | undefined): log4js.Logger {
  if (_.isEmpty(getLogger)) {
    const { debugFolder, debugLevel } = APP_CONFIG;
    log4js.configure({
      appenders: {
        app: {
          alwaysIncludePattern: true,
          filename: debugFolder,
          pattern: "yyyy-MM-dd.log",
          type: "dateFile",
        },
      },
      categories: {
        default: {
          appenders: ["app"],
          level: debugLevel,
        },
      },
    });
    getLogger = log4js.getLogger(category);
  }
  return getLogger;
}

function isLocal(): boolean {
  return APP_CONFIG.environment === ENVIRONMENT_ENUM.LOCAL;
}

function isDevelopment(): boolean {
  return APP_CONFIG.environment === ENVIRONMENT_ENUM.DEVELOPMENT;
}

function isProduction(): boolean {
  return APP_CONFIG.environment === ENVIRONMENT_ENUM.PRODUCTION;
}

function getCurrentUserId(): number | null {
  const userId =
    httpContext.get("userId") === undefined
      ? null
      : utils.toNumber(httpContext.get("userId"));
  return userId;
}

function createResult(
  dataOrError: any | Error | HttpException,
  code?: number,
): IResult {
  let data = {};
  if (dataOrError instanceof HttpException) {
    if (code === undefined) {
      code = HTTP_STATUS_CODE_ENUM.INTERNAL_SERVER_ERROR;
    }
    Logger.error(dataOrError.message.message);
  } else if (dataOrError instanceof Error) {
    if (code === undefined) {
      code = HTTP_STATUS_CODE_ENUM.INTERNAL_SERVER_ERROR;
    }
    Logger.error(dataOrError.stack);
  } else {
    data = dataOrError;
    code = HTTP_STATUS_CODE_ENUM.OK;
  }
  return { data, code };
}

_.mixin({
  createResult,
  getCurrentUserId,
  getPath,
  getRootPath,
  isDevelopment,
  isLocal,
  isProduction,
  logger,
  render,
  toBoolean,
});

const utils: ILodashMixin = _ as any;

export default utils as ILodashMixin;
