import httpContext from "express-http-context";
import { IRequest, IResponse } from "../interfaces";

export function httpContextMiddle(
  request: IRequest,
  response: IResponse,
  next: Function,
) {
  if (request.user) {
    httpContext.set("userId", request.user.id);
  }
  next();
}
