import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuariosService } from './services/usuarios.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private usuariosService: UsuariosService,
    private modal: NzModalService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  getRolesString(usuario: Usuario): string {
    return usuario.roles && usuario.roles.length > 0
      ? usuario.roles.map(r => r.nombre).join(', ')
      : '-';
  }


  abrirModalRegistroUsuario() {
    const modalRef = this.modal.create({
      nzTitle: 'Registrar usuario',
      nzContent: RegistrarUsuarioComponent,
      nzWidth: 700,
      nzFooter: null,
      nzMaskClosable: false // Evita cierre al hacer clic fuera del modal
    });
    modalRef.afterClose.subscribe((usuarioCreado) => {
      if (usuarioCreado) {
        this.loading = true;
        this.usuariosService.getUsuarios().subscribe({
          next: usuarios => {
            this.usuarios = usuarios;
            this.loading = false;
          },
          error: (err: any) => {
            this.error = 'Error al cargar usuarios';
            this.loading = false;
          }
        });
      }
    });
  }
}
