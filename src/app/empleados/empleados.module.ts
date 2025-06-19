import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadosComponent } from './empleados.component';
import { RouterModule, Routes } from '@angular/router';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { EmpleadosRoutingModule } from './empleados-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: EmpleadosComponent }
];

@NgModule({
  declarations: [EmpleadosComponent],
  imports: [
    CommonModule,
    EmpleadosRoutingModule,
    NzZorroModule,
    ReactiveFormsModule,
  ],
  exports: [EmpleadosComponent]
})
export class EmpleadosModule {}
