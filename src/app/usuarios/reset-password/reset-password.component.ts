import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { passwordValidator } from 'src/app/shared/models/passwordValidator';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  form: FormGroup;
  error: string | null = null;
  loading = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarios: UsuariosService,
    private router: Router,
    private route: ActivatedRoute,
    private utilsService: UtilsService
  ) {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, passwordValidator]],
        confirmPassword: ['', [Validators.required, passwordValidator]]
      },
      { validators: this.passwordMatchValidator }
  );
  this.token = this.route.snapshot.queryParamMap.get('token');
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    const { password, confirmPassword } = this.form.value;
    this.usuarios.resetPassword(password, confirmPassword, this.token || undefined).subscribe({
      next: () => {
        this.loading = false;
        this.utilsService.showMessage({
          title: 'Contraseña actualizada',
          message: 'Se ha actualizado la contraseña con éxito.',
          icon: 'success',
        });

        if (this.token) this.router.navigate(['/iniciar-sesion']);
        else this.router.navigate(['usuarios/mi-perfil'])
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.status === 401 ? 'Este enlace ya no puede ser usado' : 'Credenciales inválidas';
      },
    });
  }
}
