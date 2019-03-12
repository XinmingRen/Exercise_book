import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import _ from "lodash";

@Component({
  styleUrls: ["./evaluate.component.css"],
  templateUrl: "./evaluate.template.html",
})
export class EvaluateComponent implements OnInit {
  public allprojectinfo: any = {};
  public evaluateForm: FormGroup;
  public controlArray: any[] = [];
  public projectinfo: any = {};
  public project: any = {};
  public projectid: any;
  public evaluateloading: boolean = false;
  public rates: any[] = [];
  public rate: any;
  public rateid: any[] = [];
  public rateindex: any[] = [];
  public userrate: any[] = [];
  public summary: any = 0;
  public performanceId = this.route.snapshot.paramMap.get("performances.id");
  public performanceIndexsinfo: any[] = [];
  public projectPerformanceinfo: any = {};
  public performanceIndexsobj: any = {};
  public verify: any = {};
  public usercomment: any;
  public projectperformanceindexform: any = {
    approvals: this.verify,
    performanceIndexs: this.performanceIndexsinfo,
    projectPerformance: this.projectPerformanceinfo,
  };

  constructor(
    private readonly httpClient: HttpClient,
    private readonly formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  public async ngOnInit() {
    this.formBuild();
    await this.getProjectPerformancesIndexs();
    this.getProjectinfo();
    this.getRates();
  }

  public async getProjectPerformancesIndexs() {
    this.evaluateloading = true;
    this.allprojectinfo = (await this.httpClient
      .get(`/api/v1/projects/${this.performanceId}`)
      .toPromise()) as any;
    this.project = this.allprojectinfo.projectPerformance;
    _.forEach(this.project.indexs, (index) => {
      this.rateid.push(index.rateId);
      this.rateindex.push(index.explain);
      this.evaluateForm.addControl(
        index.name,
        new FormControl(null, [Validators.required]),
      );
      this.evaluateForm.addControl(
        index.explain,
        new FormControl(null, [Validators.required]),
      );
    });
    this.projectid = this.project.projectId;
    this.evaluateloading = false;
  }
  public async getProjectinfo() {
    this.evaluateloading = true;
    const projects = (await this.httpClient
      .get(`/api/v1/projects`)
      .toPromise()) as any;
    _.forEach(projects, (project, i) => {
      if (project.id === this.projectid) {
        this.projectinfo = project;
      }
    });
    this.evaluateloading = false;
  }

  public async getRates() {
    this.evaluateloading = true;
    this.rates = (await this.httpClient
      .get("/api/v1/performance-rates")
      .toPromise()) as any;
    this.evaluateloading = false;
    _.forEach(this.rates, (value) => {
      _.forEach(this.rateid, (rate) => {
        // tslint:disable-next-line:triple-equals
        if (value.id == rate) {
          this.userrate.push(value.name);
        }
      });
    });
  }

  public async saveForm() {
    if (!this.evaluateForm.invalid) {
      const reg = /^[0-9]*$/;
      if (!reg.test(this.evaluateForm.value.workload)) {
        alert("个人项目时间必须为数字，请修改");
      } else {
        this.packageform();
        const result = await this.httpClient
          .put(
            `/api/v1/projectperformance/${this.performanceId}`,
            this.projectperformanceindexform,
          )
          .toPromise();
        window.history.go(-1);
        await this.getProjectPerformancesIndexs();
        this.getProjectinfo();
        this.getRates();
      }
    }
  }
  public packageform() {
    this.projectPerformanceinfo.workload = this.evaluateForm.value.workload;
    this.projectPerformanceinfo.score = this.summary;
    this.projectPerformanceinfo.comment = this.evaluateForm.value.comment;
    _.forEach(this.project.indexs, (index, i) => {
      this.performanceIndexsobj = {};
      this.performanceIndexsobj.id = index.id;
      _.forEach(this.rates, (rate) => {
        // tslint:disable-next-line:triple-equals
        if (rate.rate == this.evaluateForm.value[index.name]) {
          this.performanceIndexsobj.rateId = rate.id;
          return false;
        }
      });
      // this.performanceIndexsobj.rateId = this.evaluateForm.value[index.name];
      this.performanceIndexsobj.comment = this.evaluateForm.value[
        index.explain
      ];
      this.performanceIndexsinfo.push(this.performanceIndexsobj);
    });
  }

  public formBuild() {
    this.evaluateForm = this.formBuilder.group({
      comment: [null, [Validators.required]],
      workload: [null, [Validators.required]],
    });
  }

  public async savecomment() {
    this.verify.comment = this.usercomment;
    const result = await this.httpClient
      .put(
        `/api/v1/projectperformance/${this.performanceId}`,
        this.projectperformanceindexform,
      )
      .toPromise();
    window.history.go(-1);
    await this.getProjectPerformancesIndexs();
    this.getProjectinfo();
    this.getRates();
  }
  public ratevalueChange() {
    this.summary = 0;
    _.forEach(this.project.indexs, (index) => {
      this.summary +=
        (_.toNumber(this.evaluateForm.value[index.name]) * index.weight) / 100;
    });
    this.summary = this.summary.toFixed(2);
  }
}
