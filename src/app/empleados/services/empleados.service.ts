import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiUrl}/usuarios`;
  
  getEmpleados() {
    return this.http.get<any[]>(`${this.apiUrl}/empleados`);
  }

  getEncargados() {
    return this.http.get<any[]>(`${this.apiUrl}/encargados`);
  }

  registrarEmpleado(empleado: any) {
    
    return this.http.post<any>(`${this.apiUrl}/registrarEmpleado`, empleado);
  }
  
  eliminarEmpleado(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
}
