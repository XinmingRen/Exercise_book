import { registerLocaleData } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import zh from "@angular/common/locales/zh";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import _ from "lodash";
registerLocaleData(zh);

@Component({
  templateUrl: "./project.template.html",
})
export class ProjectComponent implements OnInit {
  // 表单Group
  public projectForm: FormGroup;
  public isVisible = false;
  // 获取项目信息
  public projectsLoading: boolean = false;
  public projects: any[] = [];
  public users: any[] = [];
  public loginUserInfo = { loginUserRole: null, userId: 0, userName: null };
  public pmList: any[] = [];
  public workerList: any[] = [];
  public roles: any[] = [];
  public allChecked = false;
  public indeterminate = false;
  public displayData = [];
  public projectDetail = {};
  public projectDelete = {};
  constructor(
    private readonly httpClient: HttpClient,
    // 表单builder
    private fb: FormBuilder,
  ) {}
  // 保存项目
  public async saveProject() {
    // tslint:disable-next-line:forin
    for (const i in this.projectForm.controls) {
      this.projectForm.controls[i].markAsDirty();
      this.projectForm.controls[i].updateValueAndValidity();
    }
    if (!this.projectForm.invalid) {
      const reg = /^[0-9]*$/;
      if (!reg.test(this.projectForm.value.hours)) {
        alert("weight必须为数字，请修改");
      } else {
        this.packageCreateProjectInfo();
        const result = await this.httpClient
          .post("/api/v1/projects", this.projectDetail)
          .toPromise();
        this.hideProjectModal();
        this.getProjects();
      }
    }
  }

  public async ngOnInit() {
    // 项目信息
    this.getLoginUser();
    this.getProjects();
    this.getRoles();
    this.getUser();
    this.formBuild();
  }

  // 获取角色
  public async getRoles() {
    this.roles = (await this.httpClient
      .get("/api/v1/role-templates")
      .toPromise()) as any;
    // 向formgroup控件里添加动态控件
    _.forEach(this.roles, (role) => {
      this.projectForm.addControl(role.name, new FormControl(null, []));
    });
  }
  // 获取项目
  public async getProjects() {
    this.projectsLoading = true;
    this.projects = (await this.httpClient
      .get("/api/v1/projects")
      .toPromise()) as any;
    this.projectsLoading = false;
    // 添加statusName
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.projects.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.projects[i].performances.length; j++) {
        if (this.projects[i].performances[j].status === -99) {
          this.projects[i].performances[j].statusName = "待评价";
        } else if (this.projects[i].performances[j].status === 0) {
          this.projects[i].performances[j].statusName = "待确认";
        } else if (this.projects[i].performances[j].status === 99) {
          this.projects[i].performances[j].statusName = "已完成";
        }
      }
    }
  }

  // 获取用户
  public async getUser() {
    const result = (await this.httpClient
      .get("/api/v1/users?relations=roles")
      .toPromise()) as any;
    this.users = result.data;
    _.forEach(this.users, (value) => {
      _.forEach(value.roles, (name) => {
        if (name.name === "PM") {
          this.pmList.push(value);
        } else if (name.name === "Worker") {
          this.workerList.push(value);
        }
      });
    });
  }
  // 获取登录用户
  public async getLoginUser() {
    const result = (await this.httpClient
      .get("/api/v1/userInfo")
      .toPromise()) as any;
    let roleName;
    _.forEach(result.roles, (value) => {
      if (value.name === "PM") {
        roleName = "PM";
      } else if (value.name === "Worker") {
        roleName = "Worker";
      } else if (value.name === "HR") {
        roleName = "HR";
      }
    });
    this.loginUserInfo.loginUserRole = roleName;
    this.loginUserInfo.userId = result.id;
    this.loginUserInfo.userName = result.englishName;
  }
  // 删除项目
  public async deleteProject(projectId: any) {
    const projectDeleteIds = new Array();
    projectDeleteIds.push(projectId);
    this.projectDelete = { projectIds: projectDeleteIds };
    const result = (await this.httpClient
      .post("/api/v1/projects/del", this.projectDelete)
      .toPromise()) as any;
    if (result.result === "success") {
      alert("删除成功");
    } else {
      alert("删除失败");
    }
    this.getProjects();
  }
  // 包装数据
  public packageCreateProjectInfo() {
    const projectInfo = this.projectForm.value;

    projectInfo.name = projectInfo.projectName;
    delete projectInfo.projectName;

    projectInfo.startDate = projectInfo.rangePickerTime[0];
    projectInfo.endDate = projectInfo.rangePickerTime[1];
    delete projectInfo.rangePickerTime;

    projectInfo.bu = projectInfo.buName;
    delete projectInfo.buName;

    projectInfo.buHeaderId = projectInfo.buHead.id;
    delete projectInfo.buHead;

    projectInfo.projectManagerId = projectInfo.pmName.id;
    delete projectInfo.pmName;

    const roleList = [];
    const performanceList = [];
    const performanceIndex = [];
    // 判断有哪些成员

    // 判空
    // 先把所有的rolename取出来放到数组里
    const roleName = [];
    const roleExist = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roles.length; i++) {
      roleName.push(this.roles[i].name);
    }
    _.forEach(roleName, (value, index) => {
      let roleNameValueArray = new Array();
      roleNameValueArray = projectInfo[value];
      if (roleNameValueArray != null) {
        const performanceIdList = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < roleNameValueArray.length; i++) {
          performanceIdList.push(roleNameValueArray[i].id);
        }
        const performance = { name: value, performanceInfo: performanceIdList };
        // 创建成员列表
        performanceList.push(performance);
        // 说明这个项目有哪个role
        roleExist.push(value);
      }
    });
    // 根据rolename取role数据
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < roleExist.length; i++) {
      for (let j = 0; j < this.roles.length; j++) {
        // 根据已存在的role取role数据
        if (roleExist[i] === this.roles[j].name) {
          // 根据rolename去存放performance
          // tslint:disable-next-line:prefer-for-of
          for (let l = 0; l < performanceList.length; l++) {
            if (performanceList[l].name === this.roles[j].name) {
              // tslint:disable-next-line:prefer-for-of
              for (let m = 0; m < this.roles[j].indexs.length; m++) {
                this.roles[j].indexs[m].type = 1;
              }
              const performanceDetail = [];
              // tslint:disable-next-line:prefer-for-of
              for (
                let n = 0;
                n < performanceList[l].performanceInfo.length;
                n++
              ) {
                performanceDetail.push({
                  indexs: this.roles[j].indexs,
                  status: -99,
                  userId: performanceList[l].performanceInfo[n],
                });
              }
              performanceIndex.push(performanceDetail);
              this.roles[j].projectPerformances = performanceIndex[j];
            }
          }
          roleList.push(this.roles[j]);
        }
      }
    }
    this.projectDetail = { project: projectInfo, projectRoles: roleList };
  }
  // 创建表单
  public formBuild() {
    this.projectForm = this.fb.group({
      buHead: [null, [Validators.required]],
      buName: [null, [Validators.required]],
      hours: [null, [Validators.min(1), Validators.required]],
      pmName: [null, [Validators.required]],
      projectName: [null, [Validators.required]],
      rangePickerTime: [null, [Validators.required]],
    });
  }

  // 分页
  public currentPageDataChange(
    $event: Array<{
      name: string;
      age: number;
      address: string;
      checked: boolean;
      disabled: boolean;
    }>,
  ): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  public refreshStatus(): void {
    const allChecked = this.displayData
      .filter((value) => !value.disabled)
      .every((value) => value.checked === true);
    const allUnChecked = this.displayData
      .filter((value) => !value.disabled)
      .every((value) => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  public checkAll(value: boolean): void {
    this.displayData.forEach((data) => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }
  // 模态框的方法

  public showModal(): void {
    this.projectForm.reset();
    this.isVisible = true;
    if (this.roles.length === 0) {
      alert("请先添加角色！");
      this.isVisible = false;
    }
    _.forEach(this.roles, (rolevalue) => {
      if (rolevalue.indexs.length === 0) {
        alert("有角色未有指标，请先添加角色指标！");
        this.isVisible = false;
      }
    });
  }

  public hideProjectModal(): void {
    this.isVisible = false;
  }
}
