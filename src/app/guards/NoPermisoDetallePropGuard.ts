import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoPermisoDetallePropGuard implements CanActivate {
  private injector = inject(Injector);
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return runInInjectionContext(this.injector, () => {
      return toObservable(this.auth.usuarioActual).pipe(
        // Esperamos a que el usuario esté definido (no nulo)
        filter(usuario => usuario !== null),
        take(1), // Solo nos interesa la primer emisión que no sea nula
        tap(usuario => {
          const esEmpleado = usuario?.permisos?.gestionar_propiedades;
          if (!esEmpleado) {
            this.router.navigate(['/home']);
          }
        }),
        map(usuario => !!usuario?.permisos?.gestionar_propiedades) // Devuelve true si tiene permiso, false si no
      );
    });
  }
}
