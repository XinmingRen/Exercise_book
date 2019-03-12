import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
@Component({
  templateUrl: "./role.template.html",
  // tslint:disable-next-line:object-literal-sort-keys
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
})
export class RoleComponent {
  public roles: any[] = [];
  public role: any;
  public pages: any[] = [];
  public page: any = {};
  public savepage: any[] = [];
  public pageList: any[] = [];
  public roleForm: FormGroup;

  // 模态框
  public roleVisible: boolean = false;
  constructor(
    // 构造函数
    private fb: FormBuilder,
    private readonly httpClient: HttpClient,
  ) { }
  public async ngOnInit() {
    this.formBuild();
    this.getRoles();
    this.getPage();
  }

  public roleModalHide() {
    this.roleVisible = false;
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < this.savepage.length; j++) {
      this.savepage[j].checked = false;
    }
  }
  public async getPage() {
    const results = (await this.httpClient
      .get("/api/v1/pages")
      .toPromise()) as any;
    this.pages = results.data;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.pages.length; i++) {
      this.savepage.push({
        label: this.pages[i].name,
        value: this.pages[i].id,
      });
    }
  }
  // 查询
  public async getRoles() {
    const result = (await this.httpClient
      .get("/api/v1/roles?relations=pages")
      .toPromise()) as any;
    this.roles = result.data;
  }
  // 添加
  public roleshowModal(role?: any) {
    if (role !== undefined) {
      this.role = role;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.savepage.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.role.pages.length; j++) {
          // tslint:disable-next-line:no-conditional-assignment
          // tslint:disable-next-line:triple-equals
          if (this.savepage[i].value == this.role.pages[j].id) {
            // tslint:disable-next-line:no-string-literal
            this.savepage[i]["checked"] = "true";
          }
        }
      }
      this.roleForm.reset({
        comment: role.comment,
        name: role.name,
      });
    } else {
      this.roleForm.reset();
      this.role = null;
    }
    this.roleVisible = true;
  }

  public async saveForm() {
    // tslint:disable-next-line:forin
    for (const i in this.roleForm.controls) {
      this.roleForm.controls[i].markAsDirty();
      this.roleForm.controls[i].updateValueAndValidity();
    }
    if (!this.roleForm.invalid) {
      if (this.role == null) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.savepage.length; j++) {
          if (this.savepage[j].checked === true) {
            this.pageList.push({ id: this.savepage[j].value });
          }
        }
        const roleInfo = this.roleForm.value;
        roleInfo.pages = this.pageList;
        const data = {
          data: this.roleForm.value,
        };
        const result = await this.httpClient
          .post("/api/v1/roles/one", data)
          .toPromise();
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.savepage.length; j++) {
          this.savepage[j].checked = false;
        }
        this.pageList = [];
      } else {
        this.pageList = [];
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.savepage.length; j++) {
          if (this.savepage[j].checked) {
            this.pageList.push({ id: this.savepage[j].value });
          }
        }
        const roleInfo = this.roleForm.value;
        roleInfo.pages = this.pageList;
        const data = {
          data: this.roleForm.value,
        };
        const result = await this.httpClient
          .put(`/api/v1/roles/${this.role.id}`, data)
          .toPromise();
      }
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.savepage.length; j++) {
        this.savepage[j].checked = false;
      }
      this.pageList = [];
    }
    this.roleModalHide();
    this.getRoles();
  }

  public submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.roleForm.controls) {
      this.roleForm.controls[i].markAsDirty();
      this.roleForm.controls[i].updateValueAndValidity();
    }
  }

  public formBuild(): void {
    this.roleForm = this.fb.group({
      comment: [null],
      name: [null, [Validators.required]],
      remember: [true],
    });
  }

  public async deleterole(role: any) {
    if (confirm("是否删除?")) {
      const result = await this.httpClient
        .delete(`/api/v1/roles/${role.id}`)
        .toPromise();
      this.getRoles();
    }
  }
}
