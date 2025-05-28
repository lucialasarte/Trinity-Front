// import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from '../auth/auth.service';
// import { toObservable } from '@angular/core/rxjs-interop';
// import { take, tap, map } from 'rxjs/operators';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class RedireccionInicialGuard implements CanActivate {
//   private injector = inject(Injector); 
//   private router = inject(Router);
//   private auth = inject(AuthService);

//   canActivate(): Observable<boolean> {
//     return runInInjectionContext(this.injector, () => {
//       return toObservable(this.auth.usuarioActual).pipe(
//         take(1),
//         tap(usuario => {
//           if (usuario === null) {
//             // Usuario visitante
//             console.log('Visitante, redirigiendo a /home');
//             this.router.navigate(['/home']);
//           } else if (usuario?.permisos?.gestionar_propiedades) {
//             // Usuario encargado o administrador
//             console.log('Empleado, redirigiendo a /propiedades');
//             this.router.navigate(['/propiedades']);
//           } else {
//             // Usuario logueado sin permisos especiales
//             console.log('Usuario registrado sin permisos, redirigiendo a /home');
//             this.router.navigate(['/home']);
//           }
//         }),
//         map(() => false) // Cancela la activación de la ruta original
//       );
//     });
//   }
// }
