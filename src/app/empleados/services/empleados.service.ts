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

  
}
