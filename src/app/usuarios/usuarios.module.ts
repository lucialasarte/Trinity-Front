import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';

@NgModule({
  imports: [CommonModule, UsuariosRoutingModule],
  declarations: [PerfilUsuarioComponent],
  providers: [],
})
export class UsuariosModule {}
