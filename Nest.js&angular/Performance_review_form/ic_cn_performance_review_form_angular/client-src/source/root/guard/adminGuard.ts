import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from "@angular/router";
import _ from "lodash";
@Injectable()
export class AdminGuard implements CanActivate {
  public loginUserInfo = { loginUserRole: null, userId: 0, userName: null };
  constructor(private readonly httpClient: HttpClient) {}
  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    const result = (await this.httpClient
      .get("/api/v1/userInfo")
      .toPromise()) as any;

    let roleName;
    _.forEach(result.roles, (value) => {
      if (value.name === "PM") {
        roleName = "PM";
      } else if (value.name === "Worker") {
        roleName = "Worker";
      } else if (value.name === "HR") {
        roleName = "HR";
      } else if (value.name === "Admin") {
        roleName = "Admin";
      }
    });
    this.loginUserInfo.loginUserRole = roleName;
    this.loginUserInfo.userId = result.id;
    this.loginUserInfo.userName = result.englishName;
    if (this.loginUserInfo.loginUserRole === "Admin") {
      return true;
    } else {
      alert("无权限");
      return false;
    }
  }
}
