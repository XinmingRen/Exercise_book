import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  templateUrl: "./template.template.html",
})
export class TemplateComponent implements OnInit {
  public templateForm: FormGroup;
  public templatesLoading: boolean = false;
  public templateVisible: boolean = false;
  public templates: any[] = [];
  public template: any;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly formBuilder: FormBuilder,
  ) {}

  public async ngOnInit() {
    this.formBuild();
    this.getTemplates();
  }

  public async getTemplates() {
    this.templatesLoading = true;
    const result = (await this.httpClient
      .get("/api/v1/templates")
      .toPromise()) as any;
    this.templates = result.data;
    this.templatesLoading = false;
  }

  public async deleteTemplate(template: any) {
    if (confirm("是否删除?")) {
      const result = await this.httpClient
        .delete(`/api/v1/templates/${template.id}`)
        .toPromise();
      this.getTemplates();
    }
  }

  public templateModalShow(template?: any) {
    if (template !== undefined) {
      this.template = template;
      this.templateForm.reset({
        code: template.code,
        comment: template.comment,
        content: template.content,
        sender: template.sender,
        title: template.title,
      });
    } else {
      this.templateForm.reset();
      this.template = null;
    }
    this.templateVisible = true;
  }

  public templateModalHide() {
    this.templateVisible = false;
  }

  public async saveForm() {
    // tslint:disable-next-line:forin
    for (const i in this.templateForm.controls) {
      this.templateForm.controls[i].markAsDirty();
      this.templateForm.controls[i].updateValueAndValidity();
    }
    if (!this.templateForm.invalid) {
      if (this.template == null) {
        const data = {
          data: this.templateForm.value,
        };
        const result = await this.httpClient
          .post("/api/v1/templates/one", data)
          .toPromise();
      } else {
        const data = {
          data: this.templateForm.value,
        };
        const result = await this.httpClient
          .put(`/api/v1/templates/${this.template.id}`, data)
          .toPromise();
      }
    }

    this.templateModalHide();
    this.getTemplates();
  }

  public formBuild() {
    this.templateForm = this.formBuilder.group({
      code: [null, [Validators.required]],
      comment: [null],
      content: [null],
      sender: [null, [Validators.required]],
      title: [null, [Validators.required]],
    });
  }
}
