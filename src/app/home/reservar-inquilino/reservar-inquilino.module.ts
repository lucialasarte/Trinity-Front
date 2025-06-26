import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzZorroModule } from 'src/app/shared/nz-zorro.module';
import { ReservarInquilinoRoutingModule } from './reservar-inquilino-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NzZorroModule,
    ReservarInquilinoRoutingModule,
    ReactiveFormsModule
  ]
})
export class ReservarInquilinoModule { }
