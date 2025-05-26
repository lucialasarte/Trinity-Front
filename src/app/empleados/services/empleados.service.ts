import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:5000/usuarios';
  // Obtener todos los empleados
  getEmpleados() {
    return this.http.get<any[]>(`${this.apiUrl}/empleados`);
  }

  getEncargados() {
    return this.http.get<any[]>(`${this.apiUrl}/encargados`);
  }

  
}
