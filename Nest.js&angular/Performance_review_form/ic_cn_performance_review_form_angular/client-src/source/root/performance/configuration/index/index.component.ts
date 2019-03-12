import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import _ from "lodash";

@Component({
  templateUrl: "./index.template.html",
})
export class IndexComponent implements OnInit {
  public indexForm: FormGroup;
  public indexesLoading: boolean = false;
  public indexVisible: boolean = false;
  public index: any;
  public indexes: any[] = [];
  public roles: any[] = [];
  public role: any;
  public weightsum: any = 0;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly formBuilder: FormBuilder,
  ) {}

  public async ngOnInit() {
    this.formBuild();
    this.getRoles();
    this.getIndexes();
  }
  public async getIndexes() {
    this.indexes = (await this.httpClient
      .get("/api/v1/index-templates")
      .toPromise()) as any;
  }
  public async getRoles() {
    this.indexesLoading = true;

    this.roles = (await this.httpClient
      .get("/api/v1/role-templates")
      .toPromise()) as any;
    this.indexesLoading = false;
  }
  public async deleteIndex(index: any) {
    if (confirm("是否删除?")) {
      const result = await this.httpClient
        .delete(`/api/v1/index-templates/${index.id}`)
        .toPromise();
      this.getRoles();
      this.getIndexes();
    }
  }

  public indexModalShow(index?: any) {
    if (index !== undefined) {
      this.indexVisible = true;
      this.index = index;
      this.indexForm.reset({
        explain: index.explain,
        name: index.name,
        roleTemplateId: _.toString(index.roleTemplateId),
        standard: index.standard,
        weight: index.weight,
      });
    } else {
      this.index = null;
      this.indexForm.reset();
      if (this.roles.length === 0) {
        alert("请先添加角色！");
      } else {
        this.indexVisible = true;
      }
    }
  }

  public indexModalHide() {
    this.indexVisible = false;
  }

  public async saveForm() {
    // tslint:disable-next-line:forin
    for (const i in this.indexForm.controls) {
      this.indexForm.controls[i].markAsDirty();
      this.indexForm.controls[i].updateValueAndValidity();
    }
    if (!this.indexForm.invalid) {
      if (this.index == null) {
        const reg = /^[0-9]*$/;
        if (!reg.test(this.indexForm.value.weight)) {
          alert("weight必须为数字，请修改");
        } else {
          this.weightsum = 0;
          _.forEach(this.indexes, (indexinfo) => {
            // tslint:disable-next-line:triple-equals
            if (
              // tslint:disable-next-line:triple-equals
              indexinfo.roleTemplateId == this.indexForm.value.roleTemplateId
            ) {
              this.weightsum += indexinfo.weight;
            }
          });
          if (this.weightsum + _.toNumber(this.indexForm.value.weight) <= 100) {
            const result = await this.httpClient
              .post("/api/v1/index-templates", this.indexForm.value)
              .toPromise();
            this.indexModalHide();
          } else {
            alert("该角色权重超过100，请调整！");
          }
        }
      } else {
        const result = await this.httpClient
          .put(`/api/v1/index-templates/${this.index.id}`, this.indexForm.value)
          .toPromise();
        this.indexModalHide();
      }

      this.getRoles();
      this.getIndexes();
    }
  }
  public formBuild() {
    this.indexForm = this.formBuilder.group({
      explain: [null, [Validators.required]],
      name: [null, [Validators.required]],
      roleTemplateId: [null, [Validators.required]],
      standard: [null, [Validators.required]],
      weight: [null, [Validators.required]],
    });
  }
}
