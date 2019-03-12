import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import _ from "lodash";
import { CookieService } from "ngx-cookie-service";

@Component({
  styleUrls: ["./login.component.css"],
  templateUrl: "./login.template.html",
})
export class LoginComponent {
  public loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private readonly httpClient: HttpClient,
    private router: Router,
    private cookieService: CookieService,
  ) {}

  public ngOnInit(): void {
    this.loginForm = this.fb.group({
      password: [null, [Validators.required]],
      username: [null, [Validators.required]],
    });
  }
  public async saveForm() {
    // tslint:disable-next-line:forin
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (!this.loginForm.invalid) {
      const data = {
        data: this.loginForm.value,
      };
      const result: any = await this.httpClient
        .post("/auth/login", data.data)
        .toPromise();
      if (result.code === 200) {
        this.cookieService.set("userId", result.data.id);
        this.cookieService.set("loginUserRoleList", result.data.roles);
        this.cookieService.set("userName", result.data.englishName);
        this.router.navigateByUrl("/performance/projects");
      } else {
        alert("用户名密码错误");
        this.router.navigateByUrl("/login");
      }
    }
  }
}
