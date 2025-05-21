import { Component, OnInit } from '@angular/core';
import { Usuario } from '../usuarios/models/usuario';
import { UsuariosService } from '../usuarios/services/usuarios.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  empleados: Usuario[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    // 2 = id de rol EMPLEADO (ajusta si tu enum cambia)
    this.usuariosService.getUsuariosPorRol(2).subscribe((empleados: Usuario[]) => {
      this.empleados = empleados;
    });
  }

  // Función auxiliar para mostrar los roles como string
  mostrarRoles(user: any): string {
    if (!user || !user.roles) return '';
    return user.roles.map((r: any) => r.nombre).join(', ');
  }

  // Función auxiliar para mostrar el nombre del tipo de identificación
  getTipoIdentificacionNombre(user: any): string {
    if (!user || !user.tipo_identificacion) return '-';
    if (typeof user.tipo_identificacion === 'string') return user.tipo_identificacion;
    return user.tipo_identificacion.nombre || '-';
  }
}
