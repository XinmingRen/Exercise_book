import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { CookieService } from "ngx-cookie-service";
@Injectable()
export class AuthGuard implements CanActivate {
  public userName: any;
  public userNameLength: number;
  constructor(private router: Router, private cookieService: CookieService) {}
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    if (this.checkLogin()) {
      return true;
    }
    this.router.navigateByUrl("/login");
    return false;
  }
  private checkLogin(): boolean {
    this.userName = this.cookieService.get("userName");
    this.userNameLength = this.userName.length;
    if (this.userNameLength === 0) {
      alert("请先登录");
      return false;
    }
    return true;
  }
}
