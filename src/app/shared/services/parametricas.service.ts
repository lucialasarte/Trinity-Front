// src/app/services/parametricas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametricasService {
  private apiUrl = environment.apiUrl + '/parametricas';

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

  // Obtener roles
  get_roles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  // Obtener tipos de identificación
  get_tipos_identificacion(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos-identificacion`);
  }

  // Obtener países
  get_paises(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paises`);
  }

  // Crear país
  create_pais(nombre: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/paises`, { nombre });
  }

  // Obtener marcas de tarjeta
  get_marcas_tarjeta(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/marcas-tarjeta`);
  }

  // Obtener tipos de tarjeta
  get_tipos_tarjeta(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos-tarjeta`);
  }


}
