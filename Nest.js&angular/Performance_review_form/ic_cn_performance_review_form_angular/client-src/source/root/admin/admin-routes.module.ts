import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";

import { AdminComponent } from "./admin.component";
import { PageComponent } from "./page/page.component";
import { RoleComponent } from "./role/role.component";
import { TemplateComponent } from "./template/template.component";
import { UserComponent } from "./user/user.component";

const routes: Route[] = [
  {
    children: [
      { path: "", redirectTo: "users", pathMatch: "full" },
      { path: "users", component: UserComponent },
      { path: "roles", component: RoleComponent },
      { path: "pages", component: PageComponent },
      { path: "templates", component: TemplateComponent },
    ],
    component: AdminComponent,
    path: "",
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class AdminRoutesModule {}
