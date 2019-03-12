import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { APP_CONFIG } from "../../../configs";
import { IRequest } from "../../shared/interfaces";

@Injectable()
export class LoginGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const { loginGuardEnable } = APP_CONFIG;
    const request: IRequest = context.switchToHttp().getRequest();
    let isAuthenticated: boolean = false;
    if (!loginGuardEnable) {
      isAuthenticated = true;
    } else {
      isAuthenticated = !!request.user;
    }
    return isAuthenticated;
  }
}
