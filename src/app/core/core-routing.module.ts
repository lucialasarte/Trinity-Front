import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./not-found/not-found.component";
import { NgModule } from "@angular/core";

const coreRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },  
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];
@NgModule({
    imports: [
      RouterModule.forRoot(coreRoutes),
    ],
    providers: [],
    exports: [RouterModule],
  })
  export class CoreRoutingModule {}
  