import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
@Component({
  selector: "web-root",
  styleUrls: ["./root.component.css"],
  templateUrl: "./root.template.html",
})
export class RootComponent {
  public userName: any;
  public userNameLength: number;
  constructor(
    private readonly httpClient: HttpClient,
    private cookieService: CookieService,
    private router: Router,
  ) {}
  public ngOnInit(): void {
    this.userName = this.cookieService.get("userName");
    this.userNameLength = this.userName.length;
  }
  public async logout() {
    const result: any = await this.httpClient
      .post("/auth/logout", "")
      .toPromise();
    this.cookieService.set("userName", "");
    this.userName = this.cookieService.get("userName");
    this.userNameLength = this.userName.length;
    if (result.code === 200) {
      this.router.navigateByUrl("/login");
    }
  }
}
