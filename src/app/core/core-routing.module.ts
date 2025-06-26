// core-routing.module.ts (optimizado)
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgModule } from '@angular/core';
// import { NoPermisoHomeGuard } from '../guards/NoPermisoHomeGuard';
// import { RedireccionInicialGuard } from '../guards/RedireccionInicialGuard';
// import { NoPermisoDetallePropGuard } from '../guards/NoPermisoDetallePropGuard';

const coreRoutes: Routes = [
  {
    path: 'detalle-reserva',
    loadChildren: () =>
      import('../detalle-reserva/detalle-reserva.module').then(
        (m) => m.DetalleReservaModule
      ),
  },
  {
    path: 'detalle-propiedad',
    loadChildren: () =>
      import('../detalle-propiedad/detalle-propiedad.module').then(
        (m) => m.DetallePropiedadModule
      ),
    // canActivate: [NoPermisoDetallePropGuard],
  },

  {
    path: 'propiedades',
    loadChildren: () =>
      import('../propiedades/propiedades.module').then(
        (m) => m.PropiedadesModule
      ),
    // canActivate: [NoPermisoDetallePropGuard],
  },
  {
    path: 'inquilinos',
    loadChildren: () =>
      import('../inquilinos/inquilinos.module').then((m) => m.InquilinosModule),
    // canActivate: [NoPermisoDetallePropGuard],
  },
  {
    path: 'reservas',
    loadChildren: () =>
      import('../reservas/reservas.module').then((m) => m.ReservasModule),
  },
  {
    path: 'home',
    loadChildren: () => import('../home/home.module').then((m) => m.HomeModule),
    // canActivate: [NoPermisoHomeGuard],
  },
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'empleados',
    loadChildren: () =>
      import('../empleados/empleados.module').then((m) => m.EmpleadosModule),
  },
  {
    path: 'usuarios',
    loadChildren: () =>
      import('../usuarios/usuarios.module').then((m) => m.UsuariosModule),
  },
  {
    path:'registrarse',
    loadChildren: () =>
      import('../usuarios/registrarse/registrarse.module').then(
        (m) => m.RegistrarseModule
      ),  
  },
  // {
  //   path: '',
  //   component: NotFoundComponent,
  //   canActivate: [RedireccionInicialGuard],
  //   pathMatch: 'full',
  // }
  { path: '', redirectTo: 'home', pathMatch: 'full' },
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
  imports: [
    RouterModule.forRoot(coreRoutes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
