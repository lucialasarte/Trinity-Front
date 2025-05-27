// src/app/services/propiedades.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Search } from '../models/search';
import { Propiedad } from '../models/propiedad';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PropiedadesService {
  private apiUrl = environment.apiUrl + '/propiedades';

  constructor(private http: HttpClient) {}

  // Obtener todas las propiedades
  getPropiedades(): Observable<any[]> {
    return this.http.get<Propiedad[]>(`${this.apiUrl}/`);
  }
  getPropiedadesEliminadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/eliminadas`);
  }

  // Crear una propiedad
  createPropiedad(propiedad: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, propiedad);
  }

  get_propiedad_id(id: number): Observable<Propiedad> {
    return this.http.get<Propiedad>(`${this.apiUrl}/id/${id}`);
  }

  cambiar_estado_propiedad(id: number) {
    return this.http.patch<any[]>(`${this.apiUrl}/cambiarEstado/${id}`, {});
  }

  eliminar_propiedad(prop_id: number) {
    return this.http.patch<any[]>(`${this.apiUrl}/eliminar/${prop_id}`, {});
  }
  eliminar_con_reservas(prop_id: number) {
    return this.http.patch<any[]>(
      `${this.apiUrl}/eliminarConReservas/${prop_id}`,
      {}
    );
  }

  search(params: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, {
      params,
    });
  }

  getImagenPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/imagen/${id}`);
  }

  subirImagen(formData: FormData, idPropiedad: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/imagen?id_propiedad=${idPropiedad}`,
      formData
    );
  }

  eliminarImagen(id: number) {
    return this.http.delete(`${this.apiUrl}/deleteImagen?id_imagen=${id}`);
  }

  editarCodigo(id: number, codigoAcceso: string) {
    return this.http.patch<any>(`${this.apiUrl}/editarCodigo`, {
      id,
      codigoAcceso,
    });
  }
  asignarEncargado(
    id_propiedad: number,
    id_encargado: number
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/setEncargado?id_propiedad=${id_propiedad}&id_encargado=${id_encargado}`,
      {}
    );
  }
  imagenPerfil(id_propiedad: number) {
    return this.http.get<any>(`${this.apiUrl}/imagenPerfil/${id_propiedad}`);
  }
}
