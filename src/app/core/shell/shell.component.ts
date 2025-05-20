import { Component, OnInit, computed } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

/**
 * Define la estuctura o maqueta del sitio. definiendo un orden entre los componentes principales del template.
 */
@Component({
  selector: 'trinity-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent implements OnInit {
  isEnglish: boolean = false;
  // Signal computado que obtiene el usuario actual desde AuthService
  usuario = computed(() => this.auth.usuarioActual());
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.cargarUsuarioDesdeToken();
  }

  toggleLanguage() {
    this.isEnglish = !this.isEnglish;
  }

  // Función auxiliar para mostrar los roles como string
  mostrarRoles(user: any): string {
    if (!user || !user.roles) return '';
    return user.roles.map((r: any) => r.nombre).join(', ');
  }

  // Función auxiliar para mostrar el primer rol del usuario
  mostrarPrimerRol(user: any): string {
    if (!user) return '';
    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      return user.roles[0].nombre;
    }
    if (user.rol && user.rol.nombre) {
      return user.rol.nombre;
    }
    return '';
  }
}
