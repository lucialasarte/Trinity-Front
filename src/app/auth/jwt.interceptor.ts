import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private ignoredUrls: string[] = [
    '/auth/login',
    '/auth/register', // Ignora el endpoint de registro
    // ...otros endpoints públicos
  ];

  constructor(
    private authService: AuthService,
    private message: NzMessageService, // Servicio de mensajes visuales
    private router: Router // Para redirección manual
  ) {}

  /**
   * Intercepta las peticiones HTTP para agregar el token JWT y manejar errores globales.
   * Si ocurre un 401, cierra sesión. Si ocurre un 403, muestra notificación y redirige al home.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const shouldIgnore = this.ignoredUrls.some(url => req.url.includes(url));
    const token = this.authService.getToken();
    let request = req;
    if (token && !shouldIgnore) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            // Solo cerrar sesión y mostrar mensaje si hay usuario logueado y NO es endpoint público
            if (this.authService.isLoggedIn() && !shouldIgnore) {
              this.authService.logout();
              this.message.error('Sesión expirada o no autenticado. Por favor, inicie sesión nuevamente.');
            }
            // Si es endpoint público, NO mostrar mensaje ni hacer logout
          }
        }
        return throwError(() => error);
      })
    );
  }
}
