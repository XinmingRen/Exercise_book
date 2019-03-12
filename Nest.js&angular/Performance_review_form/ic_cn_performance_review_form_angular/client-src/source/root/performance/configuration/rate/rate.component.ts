import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  templateUrl: "./rate.template.html",
})
export class RateComponent implements OnInit {
  public rateForm: FormGroup;
  public ratesLoading: boolean = false;
  public rateVisible: boolean = false;
  public rates: any[] = [];
  public rate: any;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly formBuilder: FormBuilder,
  ) {}

  public async ngOnInit() {
    this.formBuild();
    this.getRates();
  }

  public async getRates() {
    this.ratesLoading = true;
    this.rates = (await this.httpClient
      .get("/api/v1/performance-rates")
      .toPromise()) as any;
    this.ratesLoading = false;
  }

  public async deleteRate(rate: any) {
    if (confirm("是否删除?")) {
      const result = await this.httpClient
        .delete(`/api/v1/performance-rates/${rate.id}`)
        .toPromise();
      this.getRates();
    }
  }

  public rateModalShow(rate?: any) {
    if (rate !== undefined) {
      this.rate = rate;
      this.rateForm.reset({
        comment: rate.comment,
        name: rate.name,
        rate: rate.rate,
      });
    } else {
      this.rate = null;
      this.rateForm.reset();
    }
    this.rateVisible = true;
  }

  public rateModalHide() {
    this.rateVisible = false;
  }

  public async saveForm() {
    // tslint:disable-next-line:forin
    for (const i in this.rateForm.controls) {
      this.rateForm.controls[i].markAsDirty();
      this.rateForm.controls[i].updateValueAndValidity();
    }
    if (!this.rateForm.invalid) {
      if (this.rate == null) {
        const reg = /^[0-9]*$/;
        if (!reg.test(this.rateForm.value.rate)) {
          alert("rate必须为数字，请修改");
        } else {
          const result = await this.httpClient
            .post("/api/v1/performance-rates", this.rateForm.value)
            .toPromise();
          this.rateModalHide();
        }
      } else {
        const result = await this.httpClient
          .put(`/api/v1/performance-rates/${this.rate.id}`, this.rateForm.value)
          .toPromise();
        this.rateModalHide();
      }
    }

    this.getRates();
  }

  public formBuild() {
    this.rateForm = this.formBuilder.group({
      comment: [null],
      name: [null, [Validators.required]],
      rate: [null, [Validators.required]],
    });
  }
}
