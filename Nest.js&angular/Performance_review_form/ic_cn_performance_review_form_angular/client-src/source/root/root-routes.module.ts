import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { AdminGuard } from "./guard/adminGuard";
import { AuthGuard } from "./guard/authGuard";
import { LoginComponent } from "./login/login.component";
import { NotFoundComponent } from "./not-found/not-found.component";
const routes: Route[] = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    loadChildren: "./performance/performance.module#PerformanceModule",
    path: "performance",
  },
  {
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: "./admin/admin.module#AdminModule",
    path: "admin",
  },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard, AdminGuard],
})
export class RootRoutesModule {}
