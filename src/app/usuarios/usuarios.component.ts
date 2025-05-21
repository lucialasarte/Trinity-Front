import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/usuario';
import { UsuariosService } from './services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;
  error: string | null = null;

  constructor(private usuariosService: UsuariosService) {}

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
}
