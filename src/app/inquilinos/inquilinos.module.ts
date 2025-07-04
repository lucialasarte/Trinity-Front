import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InquilinosComponent } from './inquilinos.component';
import { InquilinosRoutingModule } from './inquilinos-routing.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@NgModule({
  declarations: [InquilinosComponent],
  imports: [
    CommonModule,
    FormsModule,
    InquilinosRoutingModule,
    NzZorroModule,
    ReactiveFormsModule,
    UsuariosModule,

  ],
})
export class InquilinosModule {}
