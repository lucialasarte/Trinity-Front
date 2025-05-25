import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  private apiUrl = 'http://localhost:5000/imagenes';

  constructor(
    private http: HttpClient,
  ) { }

  getImagenPorId(id: number): Observable<any> {
  return this.http.get(<any>`${this.apiUrl}/id/${id}`); 
}
}
