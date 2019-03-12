import { NgModule } from "@angular/core";

import { SharedModule } from "../../../shared/shared-module";
import { ConfigurationRoutesModule } from "./configuration-routes.module";

import { ConfigurationComponent } from "./configuration.component";
import { IndexComponent } from "./index/index.component";
import { RateComponent } from "./rate/rate.component";
import { RoleComponent } from "./role/role.component";

const modules = [SharedModule, ConfigurationRoutesModule];
const components = [
  ConfigurationComponent,
  IndexComponent,
  RateComponent,
  RoleComponent,
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
})
export class ConfigurationModule {}
