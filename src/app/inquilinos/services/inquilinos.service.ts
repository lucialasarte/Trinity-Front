import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class InquilinosService {

    private apiURL = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) {}

    // cambiar_estado_inquilino(id:number): Observable<any> {
    //     return this.http.patch<any>(`${this.apiURL}/cambiarEstado/${id}`, {});
    // }
}