import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservarInquilinoComponent } from './reservar-inquilino.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{ path: '', component: ReservarInquilinoComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes), // Importa correctamente las rutas
  ],
  exports: [RouterModule], // Exporta el RouterModule para que sea accesible
})
export class ReservarInquilinoRoutingModule { }
