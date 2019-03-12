import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { AuthGuard } from "../guard/authGuard";
import { ConfigurationGuard } from "../guard/configurationGuard";
import { EvaluateComponent } from "./evaluate/evaluate.component";
import { PerformanceComponent } from "./performance.component";
import { ProjectComponent } from "./project/project.component";
const routes: Route[] = [
  {
    children: [
      { path: "", redirectTo: "projects", pathMatch: "full" },
      {
        canActivate: [AuthGuard],
        component: ProjectComponent,
        path: "projects",
      },
      // 向evaluate页面传performanceId
      { path: "evaluate/:performances.id", component: EvaluateComponent },
      {
        canActivate: [AuthGuard, ConfigurationGuard],
        loadChildren:
          "./configuration/configuration.module#ConfigurationModule",
        path: "configurations",
      },
    ],
    component: PerformanceComponent,
    path: "",
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
  providers: [AuthGuard, ConfigurationGuard],
})
export class PerformanceRoutesModule {}
