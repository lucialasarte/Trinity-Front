import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropiedadesRoutingModule } from './propiedades-routing.module';
import { PropiedadesComponent } from './propiedades.component';
import { FormPropiedadesComponent } from './form-propiedades/form-propiedades.component';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ PropiedadesComponent, FormPropiedadesComponent],
  imports: [
    CommonModule,
    PropiedadesRoutingModule,
    NzZorroModule,
    ReactiveFormsModule,
    NzTableModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    
   
  ]
})
export class PropiedadesModule { }
