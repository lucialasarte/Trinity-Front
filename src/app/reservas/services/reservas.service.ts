import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(
    private http: HttpClient
  ) { }

  createReserva(reserva: any) {
    return this.http.post<any>(`${this.apiUrl}/`, reserva);
  }

  get_reserva_id(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  get_reservas() {
    return this.http.get<Reserva[]>(`${this.apiUrl}/`);
  }

  getReservasByPropiedad(id: number) {
    return this.http.get<Reserva[]>(`${this.apiUrl}/propiedad/${id}`);
  }

  cancelarReserva(id: number) {
    return this.http.patch<any>(`${this.apiUrl}/cancelar/${id}`, {});
  }

  calificarPropiedad(reservaId: number, calificacion: any) {
    return this.http.patch<any>(`${this.apiUrl}/calificarPropiedad/${reservaId}`, calificacion);
  }

  calificarInquilino(reservaId: number, calificacion: any) {
    return this.http.patch<any>(`${this.apiUrl}/calificarInquilino/${reservaId}`, calificacion);
  }
}
