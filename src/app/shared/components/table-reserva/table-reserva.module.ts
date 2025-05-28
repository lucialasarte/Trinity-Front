import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { NzZorroModule } from '../../nz-zorro.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzZorroModule,
    NzSpinModule
  ]
})
export class TableReservaModule { }
