import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";

import { ConfigurationComponent } from "./configuration.component";
import { IndexComponent } from "./index/index.component";
import { RateComponent } from "./rate/rate.component";
import { RoleComponent } from "./role/role.component";

const routes: Route[] = [
  {
    children: [
      { path: "", redirectTo: "roles", pathMatch: "full" },
      { path: "roles", component: RoleComponent },
      { path: "indexes", component: IndexComponent },
      { path: "rates", component: RateComponent },
    ],
    component: ConfigurationComponent,
    path: "",
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class ConfigurationRoutesModule {}
