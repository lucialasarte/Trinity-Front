import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private apiUrl = 'http://localhost:5000/reservas';

  constructor(
    private http: HttpClient
  ) { }

  createReserva(reserva: any) {
    return this.http.post<any>(`${this.apiUrl}/`, reserva);
  }

  get_reserva_id(id: number) {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
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
}
