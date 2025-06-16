import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InquilinosComponent } from './inquilinos.component';
import { InquilinosRoutingModule } from './inquilinos-routing.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { RegistrarUsuarioComponent } from '../usuarios/registrar-usuario/registrar-usuario.component';

@NgModule({
  declarations: [InquilinosComponent],
  imports: [
    CommonModule,
    InquilinosRoutingModule,
    NzZorroModule,
    ReactiveFormsModule,
    UsuariosModule,
  ],
})
export class InquilinosModule {}
