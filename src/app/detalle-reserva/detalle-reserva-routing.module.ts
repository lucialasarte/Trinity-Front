import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleReservaComponent } from './detalle-reserva.component';

const routes : Routes= [
  { 
    path: ':id', 
    component: DetalleReservaComponent
  }

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DetalleReservaRoutingModule {}