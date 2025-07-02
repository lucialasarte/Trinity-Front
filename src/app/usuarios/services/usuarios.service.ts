import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { environment } from 'src/environments/environment';
import { Inquilino } from 'src/app/inquilinos/models/inquilino';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/`);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, usuario);
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene los usuarios filtrados por id de rol
   * @param rolId id numérico del rol
   */
  getUsuariosPorRol(rolId: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/por-rol/${rolId}`);
  }

  getUsuarioReducido(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/reducido`);
  }

  subirImagenDocumento(formData: FormData, idUsuario: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/imagenDocumento?id_usuario=${idUsuario}`,
      formData
    );
  }

  subirImagenDocAdicional(
    formData: FormData,
    idUsuario: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/imagenDoc?id_usuario=${idUsuario}`,
      formData
    );
  }

  getImagenesDocUsuario(idUsuario: number): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.apiUrl}/imagenesDoc?id_usuario=${idUsuario}`
    );
  }

  eliminarImagenDoc(idImagen: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/imagen?id_imagen=${idImagen}`);
  }

  cargarImagenDoc(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/imagen`, formData);
  }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }
   cambiar_estado_inquilino(id:number): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/cambiarEstado/${id}`, {});
    }

  // POST /auth/forgot-password
  recuperarPassword(correo: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/forgot-password`, { "correo": correo });
  }

  // POST /auth/forgot-password/reset
  resetPassword(password: string, password_confirmación: string, token?: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post(`${environment.apiUrl}/auth/forgot-password/reset`, {
      "password": password,
      "password_confirmacion": password_confirmación
    }, { headers });
  }

  getInquilinos(): Observable<Inquilino[]> {
    return this.http.get<Inquilino[]>(`${this.apiUrl}/inquilinos`);
  }

  getInquilinosActivos(): Observable<Inquilino[]> {
    return this.http.get<Inquilino[]>(`${this.apiUrl}/inquilinos/activos`);
  }
}
