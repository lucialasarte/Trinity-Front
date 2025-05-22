// src/app/services/parametricas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametricasService {
  private apiUrl = 'http://localhost:5000/parametricas';

  constructor(private http: HttpClient) {}

  // Obtener todas las provincias
  get_provincias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/provincias`);
  }

  // Obtener ciudades por provincia
  get_ciudades_by_provincia(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ciudades`, { params: { id } });
  }

  // Obtener tipos de propiedad
  get_tipos_propiedad(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos`);
  }

  // Crear un nuevo tipo de propiedad
  create_tipo_propiedad(tipo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tipos`, { tipo });
  }

  // Obtener porcentajes
  get_porcentajes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/politicas`);
  }
  get_ciudades_con_propiedades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ciudadesConPropiedades`);
  }
}
