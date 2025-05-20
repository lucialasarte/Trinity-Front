import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormPropiedadesComponent } from './form-propiedades.component';

const routes: Routes = [{ path: '', component: FormPropiedadesComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes), // Importa correctamente las rutas
  ],
  exports: [RouterModule], // Exporta el RouterModule para que sea accesible
})
export class FormPropiedadesRoutingModule {}
