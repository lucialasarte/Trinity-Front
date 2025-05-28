import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoPermisoHomeGuard implements CanActivate {
  private injector = inject(Injector);
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return runInInjectionContext(this.injector, () => {
      return toObservable(this.auth.usuarioActual).pipe(
        filter(usuario => usuario !== undefined),
        take(1),
        tap(usuario => {
          const esEmpleado = usuario?.permisos?.gestionar_propiedades;
          if (esEmpleado) {
            console.log('NoPermisoHomeGuard bloqueó acceso a /home');
            this.router.navigate(['/propiedades']);
          }
        }),
        map(usuario => !usuario?.permisos?.gestionar_propiedades)
      );
    });
  }
}
