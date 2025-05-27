import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {
  private apiUrl = environment.apiUrl + '/imagenes';

  constructor(private http: HttpClient) {}

  // Subir imagen (formData debe tener el campo 'image')
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, formData);
  }

  // Obtener todas las imágenes
  getImagenes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  // Obtener imagen por filename
  getImagenPorNombre(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${filename}`, { responseType: 'blob' });
  }

  // Obtener imagen por id
  /* getImagenPorId(imagen_id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/id/${imagen_id}`, { responseType: 'blob' });
  } */
  getImagenPorId(id: number): Observable<any> {
    return this.http.get(<any>`${this.apiUrl}/id/${id}`);
  }
}
