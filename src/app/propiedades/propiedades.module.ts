import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropiedadesRoutingModule } from './propiedades-routing.module';
import { PropiedadesComponent } from './propiedades.component';
import { FormPropiedadesComponent } from './form-propiedades/form-propiedades.component';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ PropiedadesComponent, FormPropiedadesComponent],
  imports: [
    CommonModule,
    PropiedadesRoutingModule,
    NzZorroModule,
    ReactiveFormsModule,
   
  ]
})
export class PropiedadesModule { }
