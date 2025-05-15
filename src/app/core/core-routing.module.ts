// core-routing.module.ts (optimizado)
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgModule } from '@angular/core';

const coreRoutes: Routes = [
  {
    path: 'detalle-propiedad',
    loadChildren: () =>
      import('../detalle-propiedad/detalle-propiedad.module').then(
        (m) => m.DetallePropiedadModule
      ),
  },
  {
    path: 'propiedades',
    loadChildren: () =>
      import('../propiedades/propiedades.module').then(
        (m) => m.PropiedadesModule
      ),
  },
  {
    path: 'reservas',
    loadChildren: () =>
      import('../reservas/reservas.module').then(
        (m) => m.ReservasModule
      ),
  },
  {
    path: 'home',
    loadChildren: () => import('../home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full', 
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(coreRoutes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
