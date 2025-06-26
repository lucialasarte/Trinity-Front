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
import { EditarUsuarioComponent } from './perfil-usuario/perfil-usuario-editar/perfil-usuario-editar.component';

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
    RegistrarUsuarioComponent,EditarUsuarioComponent,
    ResetPasswordComponent
  ],
  exports: [RegistrarUsuarioComponent,EditarUsuarioComponent],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsuariosModule {}
