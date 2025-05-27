import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Usuario } from '../usuarios/models/usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  // Signal que mantiene el usuario logueado actual (null si no hay sesión)
  // Su tipo es Usuario para exponer todos los datos completos del usuario autenticado.
  usuarioActual = signal<Usuario | null>(null);

  /**
   * Devuelve true si hay un usuario autenticado actualmente.
   * Útil para guards y lógica de UI.
   */
  // Devuelve true si hay un usuario autenticado (getter para guards)
  isLoggedIn(): boolean {
    return !!this.usuarioActual();
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Realiza login contra el backend, guarda el token y obtiene el usuario completo.
   * @param correo Email del usuario
   * @param password Contraseña
   * @returns Observable con la respuesta del backend
   */
  login(correo: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { correo, password }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token); // Guarda el token JWT
          // Decodifica el token para extraer el id de usuario
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          const userId = payload.sub || payload.identity || payload.id;
          // Si hay id, obtiene el usuario completo desde la API y lo setea en el signal
          if (userId) {
            this.cargarUsuarioPorId(Number(userId));
          }
          this.router.navigate(['/home']); // Redirige al home tras login
        }
      })
    );
  }

  /**
   * Cierra la sesión: elimina el token, limpia el usuario y redirige al login.
   */
  logout() {
    localStorage.removeItem('jwt_token'); // Elimina el token JWT
    this.usuarioActual.set(null); // Limpia el usuario actual
    this.router.navigate(['/iniciar-sesion']); // Redirige al login
  }

  /**
   * Si el token JWT cambia (por login, refresh, etc.), este método actualiza el usuarioActual
   * con los datos completos del usuario correspondiente al nuevo token.
   * Es importante llamar a este método después de cualquier cambio de token.
   *
   * Ejemplo de uso tras refresh token:
   *   localStorage.setItem('jwt_token', nuevoToken);
   *   this.cargarUsuarioDesdeToken();
   */
  cargarUsuarioDesdeToken() {
    const token = this.getToken(); // Obtiene el token actual
    if (token && this.decodificarTokenYSetearUsuario(token)) {
      return;
    }
    // Si no hay token válido, limpiar usuario pero NO redirigir automáticamente
    this.usuarioActual.set(null);
    // No redirigir aquí, deja que los guards o componentes lo manejen si es necesario
  }

  /**
   * Realiza login programático con un token JWT recibido (por ejemplo, tras registro o login social).
   * Guarda el token, decodifica el userId y carga el usuario completo.
   * Si se provee el usuario completo, lo setea directamente sin llamar a la API.
   * @param token JWT recibido del backend
   * @param usuarioCompleto (opcional) usuario ya resuelto desde el backend
   */
  loginConToken(token: string, usuarioCompleto?: Usuario) {
    this.setToken(token);
    this.decodificarTokenYSetearUsuario(token, usuarioCompleto);
  }

  /**
   * Obtiene el usuario completo por id y actualiza el signal usuarioActual.
   * @param userId id del usuario
   */
  private cargarUsuarioPorId(userId: number) {
    this.http.get<Usuario>(`${environment.apiUrl}/usuarios/${userId}`).subscribe((usuario: Usuario) => {
      this.usuarioActual.set(usuario);
      console.log(usuario);

    });
  }

  /**
   * Decodifica un token JWT, extrae el userId y carga el usuario correspondiente.
   * Si se provee el usuario completo, lo setea directamente sin llamar a la API.
   * @param token JWT a decodificar
   * @param usuarioCompleto (opcional) usuario ya resuelto desde el backend
   * @returns true si el usuario fue cargado correctamente, false si el token es inválido
   */
  private decodificarTokenYSetearUsuario(token: string, usuarioCompleto?: Usuario): boolean {
    try {
      if (usuarioCompleto) {
        this.usuarioActual.set(usuarioCompleto);
        return true;
      }
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.sub || payload.identity || payload.id;
      if (userId) {
        this.cargarUsuarioPorId(Number(userId));
        return true;
      }
    } catch (e) {
      // Token inválido
    }
    return false;
  }

  /**
   * Obtiene el token JWT almacenado (o null si no existe).
   * @returns El token JWT o null
   */
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Guarda el token JWT en localStorage.
   * @param token El token JWT a guardar
   */
  setToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  /**
   * Fuerza la recarga del usuario actual desde la API usando su id.
   */
  refrescarUsuarioActual() {
    const usuario = this.usuarioActual();
    if (usuario && usuario.id) {
      this.cargarUsuarioPorId(usuario.id);
    }
  }
}

/**
 * USO RECOMENDADO EN COMPONENTES:
 *
 * import { computed } from '@angular/core';
 * usuario = computed(() => this.auth.usuarioActual());
 *
 * En la plantilla:
 * <ng-container *ngIf="usuario() as user"> ... </ng-container>
 */
