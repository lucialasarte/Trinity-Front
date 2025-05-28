import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private apiUrl = environment.apiUrl + '/usuarios';

  constructor(private http: HttpClient) {}

  // GET /usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/`);
  }

  // POST /usuarios (acepta objeto plano para registro)
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



  subirImagenDocumento(formData: FormData, idUsuario: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/imagenDocumento?id_usuario=${idUsuario}`, formData);
  }

  subirImagenDocAdicional(formData: FormData, idUsuario: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/imagenDoc?id_usuario=${idUsuario}`, formData);
  }

  getImagenesDocUsuario(idUsuario: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/imagenesDoc?id_usuario=${idUsuario}`);
  }

  eliminarImagenDoc(idImagen: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/imagenDoc?id_imagen=${idImagen}`);
  }

}
