import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DetallePropiedadRoutingModule } from './detalle-propiedad-routing.module';
import { DetallePropiedadComponent } from './detalle-propiedad.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@NgModule({
  declarations: [DetallePropiedadComponent],
  imports: [
    CommonModule,
    FormsModule,
    DetallePropiedadRoutingModule,
    NzZorroModule,
    ReactiveFormsModule,
    NzCarouselModule
  ],
})
export class DetallePropiedadModule {}
