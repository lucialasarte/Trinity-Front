import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Inquilino } from '../models/inquilino';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class InquilinosService {

    private apiURL = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) {}
    getInquilinos(): Observable<Inquilino[]> {
      return this.http.get<Inquilino[]>(`${this.apiURL}/inquilinos`);
    }

    registrarInquilino(usuario: any): Observable<any> {
    return this.http.post(`${this.apiURL}/registrarInquilino`, usuario);
  }

  
  eliminarInquilino(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/eliminarInquilino/${id}`);
  }
}
