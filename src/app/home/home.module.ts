import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ReservarInquilinoComponent } from './reservar-inquilino/reservar-inquilino.component';
import { ReservarInquilinoRoutingModule } from './reservar-inquilino/reservar-inquilino-routing.module';
import { ReservarEmpleadoComponent } from './reservar-empleado/reservar-empleado.component';



@NgModule({
  declarations: [ HomeComponent, ReservarInquilinoComponent, ReservarEmpleadoComponent, ],
  imports: [
    CommonModule,
    FormsModule,
    NzZorroModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    ReservarInquilinoRoutingModule
  ]
})
export class HomeModule { }
