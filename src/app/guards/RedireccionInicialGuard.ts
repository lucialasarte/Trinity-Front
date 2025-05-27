import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RedireccionInicialGuard implements CanActivate {
  private injector = inject(Injector); // ✅ obtenemos el injector válido
  private router = inject(Router);
  private auth = inject(AuthService);

  canActivate(): Observable<boolean> {
    // ✅ corremos dentro del contexto de inyección correcto
    return runInInjectionContext(this.injector, () => {
      return toObservable(this.auth.usuarioActual).pipe(
        filter(usuario => usuario !== null), // Espera que esté cargado
        take(1),
        tap(usuario => {
          const esEmpleado = usuario?.permisos?.gestionar_propiedades;
          console.log('RedireccionInicialGuard', esEmpleado);

          if (esEmpleado) {
            this.router.navigate(['/propiedades']);
          } else {
            this.router.navigate(['/home']);
          }
        }),
        map(() => false) // bloquea navegación, ya que redirige
      );
    });
  }
}
