import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared-module";
import { AuthGuard } from "../guard/authGuard";
import { EvaluateComponent } from "./evaluate/evaluate.component";
import { PerformanceRoutesModule } from "./performance-routes.module";

import { ConfigurationGuard } from "../guard/configurationGuard";
import { PerformanceComponent } from "./performance.component";
import { ProjectComponent } from "./project/project.component";
const modules = [SharedModule, PerformanceRoutesModule];
const components = [PerformanceComponent, ProjectComponent, EvaluateComponent];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  providers: [AuthGuard, ConfigurationGuard],
})
export class PerformanceModule {}
