import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private message: NzMessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // Mensaje más detallado para 403
          this.message.error('Acceso denegado: no tiene permisos suficientes para realizar esta acción o su sesión ha expirado. Si cree que esto es un error, contacte al administrador.', { nzDuration: 5000 });
          this.router.navigate(['/']);
        } else if (error.status === 401) {
          // Mensaje más detallado para 401
          this.message.error('Sesión expirada o no autenticado. Por favor, inicie sesión nuevamente.', { nzDuration: 5000 });
          this.router.navigate(['/iniciar-sesion']);
        } else if (error.status === 500) {
          // Mensaje para error interno del servidor
          this.message.error('Error interno del servidor. Intente nuevamente más tarde.', { nzDuration: 5000 });
        } else if (error.status === 0) {
          // Sin conexión o error de red
          this.message.error('No se pudo conectar con el servidor. Verifique su conexión a internet.', { nzDuration: 5000 });
        }
        return throwError(() => error);
      })
    );
  }
}
