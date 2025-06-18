import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { RegistrarUsuarioComponent } from './form-registrar-usuario/registrar-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzZorroModule } from '../shared/nz-zorro.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';

@NgModule({
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ReactiveFormsModule,
    NzZorroModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  declarations: [
    UsuariosComponent,
    PerfilUsuarioComponent,
    RegistrarUsuarioComponent,
    ResetPasswordComponent,
  ],
  exports: [RegistrarUsuarioComponent],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsuariosModule {}
