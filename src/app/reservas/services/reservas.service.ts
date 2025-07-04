import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva';
import { environment } from 'src/environments/environment';
import {
  Chat,
  ChatResponse,
} from 'src/app/detalle-reserva/detalle-chat/models/chat';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) {}

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
    return this.http.patch<any>(
      `${this.apiUrl}/calificarPropiedad/${reservaId}`,
      calificacion
    );
  }

  calificarInquilino(reservaId: number, calificacion: any) {
    return this.http.patch<any>(
      `${this.apiUrl}/calificarInquilino/${reservaId}`,
      calificacion
    );
  }

  getChatReserva(id: number) {
    return this.http.get<ChatResponse>(`${this.apiUrl}/chat/${id}`);
  }

  enviarMensajeChat(idReserva: number, mensaje: Chat) {
    return this.http.post<ChatResponse>(
      `${this.apiUrl}/chat/${idReserva}`,
      mensaje
    );
  }

  confirmar(id: number) {
    return this.http.patch<any>(`${this.apiUrl}/confirmar/${id}`, {});
  }

  subirDocumentacion(formData: FormData, idReserva: string) {
    return this.http.post<string>(
      `${this.apiUrl}/documentacion/${idReserva}`,
      formData
    );
  }
  eliminarDocumentacion(idDocumento: string) {
    return this.http.delete(`${this.apiUrl}/documentacion/${idDocumento}`);
  }
}
