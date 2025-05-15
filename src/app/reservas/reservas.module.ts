import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasComponent } from './reservas.component';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ReservasRoutingModule } from './reservas-routing.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [ReservasComponent],
  imports: [
    CommonModule,
    NzZorroModule,
    ReactiveFormsModule,
    ReservasRoutingModule,
    NzTableModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
  ],
})
export class ReservasModule {}
