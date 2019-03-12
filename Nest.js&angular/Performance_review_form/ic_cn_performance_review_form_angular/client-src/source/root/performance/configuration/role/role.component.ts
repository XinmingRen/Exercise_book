import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  templateUrl: "./role.template.html",
})
export class RoleComponent implements OnInit {
  public roleForm: FormGroup;
  public rolesLoading: boolean = false;
  public roleVisible: boolean = false;
  public roles: any[] = [];
  public role: any;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly formBuilder: FormBuilder,
  ) {}

  public async ngOnInit() {
    this.formBuild();
    this.getRoles();
  }

  public async getRoles() {
    this.rolesLoading = true;
    this.roles = (await this.httpClient
      .get("/api/v1/role-templates")
      .toPromise()) as any;
    this.rolesLoading = false;
  }

  public async deleteRole(role: any) {
    if (confirm("是否删除?")) {
      const result = await this.httpClient
        .delete(`/api/v1/role-templates/${role.id}`)
        .toPromise();
      this.getRoles();
    }
  }

  public roleModalShow(role?: any) {
    if (role !== undefined) {
      this.role = role;
      this.roleForm.reset({
        comment: role.comment,
        name: role.name,
      });
    } else {
      this.role = null;
      this.roleForm.reset();
    }
    this.roleVisible = true;
  }

  public roleModalHide() {
    this.roleVisible = false;
  }

  public async saveForm() {
    // tslint:disable-next-line:forin
    for (const i in this.roleForm.controls) {
      this.roleForm.controls[i].markAsDirty();
      this.roleForm.controls[i].updateValueAndValidity();
    }
    if (!this.roleForm.invalid) {
      if (this.role == null) {
        const result = await this.httpClient
          .post("/api/v1/role-templates", this.roleForm.value)
          .toPromise();
      } else {
        const result = await this.httpClient
          .put(`/api/v1/role-templates/${this.role.id}`, this.roleForm.value)
          .toPromise();
      }
    }

    this.roleModalHide();
    this.getRoles();
  }

  public formBuild() {
    this.roleForm = this.formBuilder.group({
      comment: [null],
      name: [null, [Validators.required]],
    });
  }
}
