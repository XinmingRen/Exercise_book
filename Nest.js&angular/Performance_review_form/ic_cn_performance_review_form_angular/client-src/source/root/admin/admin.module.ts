import { NgModule } from "@angular/core";

import { SharedModule } from "../../shared/shared-module";
import { AdminRoutesModule } from "./admin-routes.module";
import { AdminComponent } from "./admin.component";
import { PageComponent } from "./page/page.component";
import { RoleComponent } from "./role/role.component";
import { TemplateComponent } from "./template/template.component";
import { UserComponent } from "./user/user.component";

const modules = [SharedModule, AdminRoutesModule];
const components = [
  AdminComponent,
  PageComponent,
  RoleComponent,
  TemplateComponent,
  UserComponent,
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
})
export class AdminModule {}
