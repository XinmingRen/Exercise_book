import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";

const modules = [
  CommonModule,
  HttpClientModule,
  FormsModule,
  ReactiveFormsModule,
  NgZorroAntdModule,
];

@NgModule({
  exports: [...modules],
  imports: modules,
})
export class SharedModule {}
