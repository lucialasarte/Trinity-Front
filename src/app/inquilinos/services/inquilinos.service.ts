import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class InquilinosService {

    private apiURL = `${environment.apiUrl}/inquilinos`;

    constructor(private http: HttpClient) {}

    cambiarEstadoInquilino(id:number): Observable<any> {
        return this.http.patch<any>(`${this.apiURL}/cambiarEstado/${id}`, {});
    }
}