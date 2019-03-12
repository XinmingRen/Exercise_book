import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import UrlPattern from "url-pattern";
import { APP_CONFIG } from "../../../configs";
import { UserEntity } from "../../../framework/modules/system/entities";
import utils from "../../../utils";
import { IRequest } from "../../shared/interfaces";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const { roleGuardEnable } = APP_CONFIG;
    const request: IRequest = context.switchToHttp().getRequest();
    let isAuthenticated: boolean = false;
    if (!roleGuardEnable) {
      isAuthenticated = true;
    }
    if (!isAuthenticated && roleGuardEnable && request.user) {
      const user = await this.userRepository.findOne(request.user, {
        relations: ["roles", "roles.pages"],
      });
      if (user !== undefined) {
        isAuthenticated = this.validateUserAuthority(request, user);
      }
    }
    return isAuthenticated;
  }

  public validateUserAuthority(request: IRequest, user: UserEntity): boolean {
    let isAuthenticated = false;
    utils.forEach(user.roles, (role) => {
      if (isAuthenticated) {
        return false;
      }
      utils.forEach(role.pages, (page) => {
        if (isAuthenticated) {
          return false;
        }
        if (page.requests !== null) {
          const requests = page.requests.split(",");
          utils.forEach(requests, (data) => {
            if (data.split("_").length === 2) {
              let [method, path] = data.split("_");
              method = method.toUpperCase();
              path = new UrlPattern(path).stringify(
                this.getParams(path, request.params),
              );
              if (method === request.method && path === request.path) {
                isAuthenticated = true;
                return false;
              }
            }
          });
        }
      });
    });
    return isAuthenticated;
  }

  public getParams(path: string, params: any): any {
    const paths = path.split("/");
    // tslint:disable-next-line:no-shadowed-variable
    utils.forEach(paths, (path) => {
      if (path.substring(0, 1) === ":") {
        params[path.substring(1)] = params[path.substring(1)] || "";
      }
    });
    return params;
  }
}
