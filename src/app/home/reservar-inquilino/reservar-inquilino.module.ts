import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzZorroModule } from 'src/app/shared/nz-zorro.module';
import { ReservarInquilinoRoutingModule } from './reservar-inquilino-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzZorroModule,
    ReservarInquilinoRoutingModule,
    ReactiveFormsModule
  ]
})
export class ReservarInquilinoModule { }
