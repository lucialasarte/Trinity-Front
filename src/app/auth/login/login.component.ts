import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form: FormGroup;
  forgotPasswordForm: FormGroup;
  showForgotPassword = false;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private usuarios: UsuariosService,
    private router: Router,
    private utilsService: UtilsService
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.forgotPasswordForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    const { correo, password } = this.form.value;

    this.auth.login(correo, password).subscribe({
      next: () => {
        const intento = localStorage.getItem('reservaIntento');
        const returnTo = intento ? JSON.parse(intento).returnUrl : '/home';
        this.router.navigateByUrl(returnTo);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.mensaje || 'Credenciales inválidas';
      },
    });
  }

  toggleForgotPassword() {
    this.showForgotPassword = !this.showForgotPassword;
    if (this.showForgotPassword) {
      this.forgotPasswordForm.reset();
    } else {
      this.form.reset();
    }
    this.error = null; // Limpiar errores al cambiar
  }

  handleSendReset() {
    if (this.forgotPasswordForm.invalid) return;
    this.loading = true;
    this.error = null;
    const correo = this.forgotPasswordForm.value.correo;
    this.usuarios.recuperarPassword(correo).subscribe({
      next: () => {
        this.loading = false;
        this.utilsService.showMessage({
          title: 'Solicitud enviada',
          message: 'Se le ha enviado un enlace para recuperar la contraseña.',
          icon: 'success',
        });
        this.toggleForgotPassword();
      },
      error: (err) => {
        this.loading = false;
        console.log(err)
        this.error = err?.error?.mensaje || 'Credenciales inválidas';
      },
    });
  }
}
