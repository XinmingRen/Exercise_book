import { registerLocaleData } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import zh from "@angular/common/locales/zh";
import { NullAstVisitor } from "@angular/compiler";
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import _ from "lodash";
registerLocaleData(zh);
@Component({
  styles: [
    `
      .login-form {
        max-width: 300px;
      }

      .login-form-forgot {
        float: right;
      }

      .login-form-button {
        width: 100%;
      }
      [nz-form] {
        max-width: 600px;
    `,
  ],
  templateUrl: "./user.template.html",

})
export class UserComponent {
  // 多选框

  // 模态框
  public roles: any[] = [];
  public role: any = {};
  public users: any[] = [];
  public saverole: any[] = [];
  public roleList: any[] = [];
  public user: any;
  public userForm: FormGroup;

  // 模态框
  public userVisible: boolean = false;
  constructor(
    // 构造函数
    private fb: FormBuilder,
    private readonly httpClient: HttpClient,
  ) { }
  public async ngOnInit() {
    this.formBuild();
    this.getUsers();
    this.getRoles();
  }
  public async getRoles() {
    const results = (await this.httpClient
      .get("/api/v1/roles")
      .toPromise()) as any;
    this.roles = results.data;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roles.length; i++) {
      this.saverole.push({
        label: this.roles[i].name,
        value: this.roles[i].id,
      });
    }
  }
  public userModalHide() {
    this.userVisible = false;
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < this.saverole.length; j++) {
      this.saverole[j].checked = false;
    }
  }
  // 查询
  public async getUsers() {
    const result = (await this.httpClient
      .get("/api/v1/users?relations=roles")
      .toPromise()) as any;
    this.users = result.data;
  }
  // 添加&修改
  public usershowModal(user?: any) {
    if (user !== undefined) {
      this.userVisible = true;
      this.user = user;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.saverole.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.user.roles.length; j++) {
          // tslint:disable-next-line:no-conditional-assignment
          // tslint:disable-next-line:triple-equals
          if (this.saverole[i].value == this.user.roles[j].id) {
            // tslint:disable-next-line:no-string-literal
            this.saverole[i]["checked"] = "true";
          }
        }
      }
      this.userForm.reset({
        avatar: user.avatar,
        chinesehName: user.chinesehName,
        comment: user.comment,
        email: user.email,
        englishName: user.englishName,
        lineManagerId: _.toString(user.lineManagerId),
        password: user.password,
        username: user.username,
      });
    } else {
      this.userForm.reset();
      this.user = null;

      if (this.roles.length === 0) {
        alert("请先添加角色！");
      } else {
        this.userVisible = true;
      }
    }
  }
  // 保存
  public async saveForm() {
    // tslint:disable-next-line:forin
    for (const i in this.userForm.controls) {
      this.userForm.controls[i].markAsDirty();
      this.userForm.controls[i].updateValueAndValidity();
    }
    if (!this.userForm.invalid) {
      if (this.user == null) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.saverole.length; j++) {
          // tslint:disable-next-line:triple-equals
          if (this.saverole[j].checked) {
            this.roleList.push({ id: this.saverole[j].value });
          }
        }
        const userInfo = this.userForm.value;
        userInfo.roles = this.roleList;
        const data = {
          data: this.userForm.value,
        };
        const result = await this.httpClient
          .post("/api/v1/users/one", data)
          .toPromise();

        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.saverole.length; j++) {
          this.saverole[j].checked = false;
        }
        this.roleList = [];
      } else {
        this.roleList = [];
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.saverole.length; j++) {
          if (this.saverole[j].checked) {
            this.roleList.push({ id: this.saverole[j].value });
          }
        }
        const userInfo = this.userForm.value;
        userInfo.roles = this.roleList;

        const data = {
          data: this.userForm.value,
        };

        const result = await this.httpClient
          .put(`/api/v1/users/${this.user.id}`, data)
          .toPromise();
      }
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.saverole.length; j++) {
        this.saverole[j].checked = false;
      }
      this.roleList = [];
    }
    this.userModalHide();
    this.getUsers();
  }

  public submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.userForm.controls) {
      this.userForm.controls[i].markAsDirty();
      this.userForm.controls[i].updateValueAndValidity();
    }
  }

  public formBuild(): void {
    this.userForm = this.fb.group({
      avatar: [null],
      chinesehName: [null],
      comment: [null],
      email: [null, [Validators.email, Validators.required]],
      englishName: [null],
      lineManagerId: [NullAstVisitor],
      password: [null, [Validators.required]],
      username: [null, [Validators.required]],
    });
  }

  public async deleteuser(user: any) {
    if (confirm("是否删除?")) {
      const result = await this.httpClient
        .delete(`/api/v1/users/${user.id}`)
        .toPromise();
      this.getUsers();
    }
  }
}
