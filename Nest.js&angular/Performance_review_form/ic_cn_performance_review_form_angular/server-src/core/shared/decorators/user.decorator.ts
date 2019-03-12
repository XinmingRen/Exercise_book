import { createParamDecorator, UnauthorizedException } from "@nestjs/common";
import { IRequest } from "../interfaces";

export const User = createParamDecorator((data, request: IRequest) => {
  if (request.user === null || request.user === undefined) {
    throw new UnauthorizedException();
  }
  return request.user;
});
