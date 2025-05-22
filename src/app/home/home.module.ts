import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ReservarInquilinoComponent } from './reservar-inquilino/reservar-inquilino.component';
import { ReservarInquilinoRoutingModule } from './reservar-inquilino/reservar-inquilino-routing.module';
import { ReservarEmpleadoComponent } from './reservar-empleado/reservar-empleado.component';



@NgModule({
  declarations: [ HomeComponent, ReservarInquilinoComponent, ReservarEmpleadoComponent, ],
  imports: [
    CommonModule,
    NzZorroModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    NzInputModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    ReservarInquilinoRoutingModule
  ]
})
export class HomeModule { }
