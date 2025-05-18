
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { DetalleReservaComponent } from './detalle-reserva.component';
import { DetalleReservaRoutingModule } from './detalle-reserva-routing.module';
import { NzRateModule } from 'ng-zorro-antd/rate';

@NgModule({
  declarations: [DetalleReservaComponent],
  imports: [
    CommonModule,
    FormsModule,
    DetalleReservaRoutingModule,
    NzZorroModule,
    ReactiveFormsModule,
    NzRateModule
  ],
})
export class DetalleReservaModule {}
