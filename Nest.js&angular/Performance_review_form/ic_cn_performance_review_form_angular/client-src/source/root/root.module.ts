import { NgModule } from "@angular/core";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CookieService } from "ngx-cookie-service";
import { SharedModule } from "../shared/shared-module";
import { AdminGuard } from "./guard/adminGuard";
import { AuthGuard } from "./guard/authGuard";
import { LoginComponent } from "./login/login.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { RootRoutesModule } from "./root-routes.module";
import { RootComponent } from "./root.component";

const modules = [
  BrowserModule,
  BrowserAnimationsModule,
  SharedModule,
  RootRoutesModule,
];
const components = [RootComponent, LoginComponent, NotFoundComponent];

@NgModule({
  bootstrap: [RootComponent],
  declarations: [...components],
  imports: [...modules],
  providers: [
    AuthGuard,
    AdminGuard,
    CookieService, // 注入服务
  ],
})
export class RootModule {}
