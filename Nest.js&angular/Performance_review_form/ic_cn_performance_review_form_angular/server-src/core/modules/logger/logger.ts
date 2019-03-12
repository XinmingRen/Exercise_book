import { Logger as NestLogger, LoggerService } from "@nestjs/common";
import utils from "../../../utils";

export class Logger extends NestLogger implements LoggerService {
  public static log(
    message: any,
    context?: string | undefined,
    isTimeDiffEnabled?: boolean | undefined,
  ) {
    utils.logger("[APPLICATION]").info(message);
    super.log(message, context, isTimeDiffEnabled);
  }

  public static warn(
    message: any,
    context?: string | undefined,
    isTimeDiffEnabled?: boolean | undefined,
  ) {
    utils.logger("[APPLICATION]").warn(message);
    super.warn(message, context, isTimeDiffEnabled);
  }

  public static error(
    message: any,
    trace?: string | undefined,
    context?: string | undefined,
    isTimeDiffEnabled?: boolean | undefined,
  ) {
    utils.logger("[APPLICATION]").error(message);
    super.error(message, trace, context, isTimeDiffEnabled);
  }
}
