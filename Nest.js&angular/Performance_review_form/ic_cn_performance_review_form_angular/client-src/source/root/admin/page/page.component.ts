import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
@Component({
  templateUrl: "./page.template.html",
})
export class PageComponent {
  // 模态框
  public pages: any[] = [];
  public page: any;
  // 模态框
  public pageVisible: boolean = false;
  public pageForm: FormGroup;

  constructor(
    // 构造函数
    private fb: FormBuilder,
    private readonly httpClient: HttpClient,
  ) { }
  public async ngOnInit() {
    this.formBuild();
    this.getPages();
  }

  public pageModalHide() {
    this.pageVisible = false;
  }

  public async getPages() {
    const result = (await this.httpClient
      .get("/api/v1/pages")
      .toPromise()) as any;
    this.pages = result.data;
  }

  public pageshowModal(page?: any) {
    if (page !== undefined) {
      this.page = page;
      this.pageForm.reset({
        comment: page.comment,
        name: page.name,
        requests: page.requests,
        url: page.url,
      });
    } else {
      this.pageForm.reset();
      this.page = null;
    }
    this.pageVisible = true;
  }
  // 保存
  public async saveForm() {
    // tslint:disable-next-line:forin
    for (const i in this.pageForm.controls) {
      this.pageForm.controls[i].markAsDirty();
      this.pageForm.controls[i].updateValueAndValidity();
    }
    if (!this.pageForm.invalid) {
      if (this.page == null) {
        const data = {
          data: this.pageForm.value,
        };
        const result = await this.httpClient
          .post("/api/v1/pages/one", data)
          .toPromise();
      } else {
        const data = {
          data: this.pageForm.value,
        };
        const result = await this.httpClient
          .put(`/api/v1/pages/${this.page.id}`, data)
          .toPromise();
      }
    }
    this.pageModalHide();
    this.getPages();
  }

  public submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.pageForm.controls) {
      this.pageForm.controls[i].markAsDirty();
      this.pageForm.controls[i].updateValueAndValidity();
    }
  }

  public formBuild(): void {
    this.pageForm = this.fb.group({
      comment: [null],
      name: [null, [Validators.required]],
      remember: [true],
      requests: [null],
      url: [null, [Validators.required]],
    });
  }

  public async deletepage(page: any) {
    if (confirm("是否删除?")) {
      const result = await this.httpClient
        .delete(`/api/v1/pages/${page.id}`)
        .toPromise();
      this.getPages();
    }
  }
}
