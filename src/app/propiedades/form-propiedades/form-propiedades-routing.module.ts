import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormPropiedadesComponent } from './form-propiedades.component';
import { Routes } from '@angular/router';


const routes : Routes = [
  {path: '', component: FormPropiedadesComponent},
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class FormPropiedadesRoutingModule { }
