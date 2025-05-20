// src/app/services/propiedades.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropiedadesService {
  private apiUrl = 'http://localhost:5000/propiedades';

  constructor(private http: HttpClient) {}

  // Obtener todas las propiedades
  getTiposPropiedades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  // Crear una propiedad
  createPropiedad(propiedad: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, propiedad);
  }
  // Obtener una propiedad por ID
  getPropiedadById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
