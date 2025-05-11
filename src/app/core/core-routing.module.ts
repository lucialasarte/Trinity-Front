// core-routing.module.ts (corregido)
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./not-found/not-found.component";
import { NgModule } from "@angular/core";

const coreRoutes: Routes = [
  { path: '', redirectTo: 'propiedades', pathMatch: 'full' },
  {
    path: 'propiedades',
    loadChildren: () => import('../propiedades/propiedades.module').then(m => m.PropiedadesModule),
  },
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
    imports: [RouterModule.forRoot(coreRoutes)],
    exports: [RouterModule],
})
export class CoreRoutingModule {}
