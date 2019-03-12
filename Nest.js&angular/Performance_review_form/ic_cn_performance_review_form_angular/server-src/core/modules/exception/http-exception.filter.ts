import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import _ from "lodash";
import utils from "../../../utils";
import { HTTP_STATUS_CODE_ENUM } from "../../shared/enums";
import { IResponse } from "../../shared/interfaces";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException | Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response: IResponse = context.getResponse();
    let code = HTTP_STATUS_CODE_ENUM.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      code = exception.getStatus();
    }
    response.status(200).json(utils.createResult(exception, code));
  }
}
