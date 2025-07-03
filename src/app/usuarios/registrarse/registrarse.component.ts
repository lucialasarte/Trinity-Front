import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Pais } from '../models/pais';
import { Rol } from '../models/rol';
import { TipoIdentificacion } from '../models/tipo-identificacion';
import { AuthService } from 'src/app/auth/auth.service';
import { ParametricasService } from 'src/app/shared/services/parametricas.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { UsuariosService } from '../services/usuarios.service';
import { finalize } from 'rxjs';
import { passwordValidator } from 'src/app/shared/models/passwordValidator';
import { fechaNoVencidaValidator, fechaNoVencidaValidatorError } from 'src/app/shared/models/validadorVenida';
import { mayorDeEdadValidator } from 'src/app/shared/models/validatorMayor';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.css'],
})
export class RegistrarseComponent {
  @ViewChild('inputImagen') inputImagen!: ElementRef<HTMLInputElement>;
  form!: FormGroup;
  tarjetaHoverIndex: number | null = null;
  paises: Pais[] = [];
  roles: Rol[] = [];
  tiposIdentificacion: TipoIdentificacion[] = [];
  creandoUsuario = false;
  imagenes: { id: number; url: string }[] = [];
  rol: number[] = [3];

  apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private fb: FormBuilder,
    private parametricasService: ParametricasService,
    private usuariosService: UsuariosService,
    private auth: AuthService,
    private utilsService: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._loadPaises();
    this._loadTiposIdentificacion();
    this._initForm();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.creandoUsuario = true;
    const formValue = this.form.value;

    const payload = {
      ...formValue,
      roles: [3], // rol inquilino
      id_imagenes: this.imagenes.map((img) => img.id),
    };

    this.usuariosService
      .registrarUsuario(payload)
      .pipe(finalize(() => (this.creandoUsuario = false)))
      .subscribe({
        next: () => {
          this.utilsService.showMessage({
            title: 'Usuario creado',
            message: 'Te registraste correctamente. Iniciando sesión...',
            icon: 'success',
          });

          // Login automático con los mismos datos
          this.auth.login(formValue.correo, formValue.password_hash).subscribe({
            next: () => {
              const intento = localStorage.getItem('reservaIntento');
              const returnTo = intento
                ? JSON.parse(intento).returnUrl
                : '/home';
              this.router.navigateByUrl(returnTo);
            },
            error: (err) => {
              console.error('Error al iniciar sesión:', err);
              this.utilsService.showMessage({
                title: 'Error',
                message: 'No se pudo iniciar sesión automáticamente.',
                icon: 'error',
              });
            },
          });
        },
        error: (error) => {
          let msg =
            error?.error?.message ||
            error?.error?.error ||
            error?.statusText ||
            'Error desconocido al crear el usuario';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: msg,
          });

          console.error('Error al crear el usuario:', error);
        },
      });
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      this.usuariosService.cargarImagenDoc(formData).subscribe({
        next: (data) => {
          this.utilsService.showMessage({
            title: 'Imagen subida con éxito',
            message: 'La imagen se ha subido correctamente.',
            icon: 'success',
          });
          const imagenId = data.id;
          const imagenUrl = this.apiUrl + '/imagenDoc/' + imagenId;
          this.imagenes?.push({ id: data.id, url: imagenUrl });
        },
        error: (error) => {
          this.utilsService.showMessage({
            title: 'Error al subir la imagen',
            message:
              error.error.error ||
              'No se pudo subir la imagen. Por favor, intente nuevamente.',
            icon: 'error',
          });
        },
      });
      formData.forEach((value, key) => {});
    }

    input.value = '';
  }

  abrirSelectorImagen(): void {
    this.inputImagen.nativeElement.click();
  }

  eliminarImagen(id: number) {
    this.usuariosService.eliminarImagenDoc(id).subscribe({
      next: () => {
        this.utilsService.showMessage({
          title: 'Imagen eliminada',
          message: 'La imagen fue eliminada correctamente.',
          icon: 'success',
        });
        this.imagenes = this.imagenes.filter((img) => img.id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar imagen:', err);
        this.utilsService.showMessage({
          title: 'Error',
          message: err.err.err || 'No se pudo eliminar la imagen.',
          icon: 'error',
        });
      },
    });
  }
  private _initForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password_hash: ['', [Validators.required, passwordValidator]],
      tipo_identificacion: [null, Validators.required],
      numero_identificacion: ['', Validators.required],
      fecha_nacimiento: [null, [Validators.required, mayorDeEdadValidator]],
      pais: [null, Validators.required],
      tarjetas: this.fb.array([this._createTarjetaFormGroup()]),
    });
  }

  private _createTarjetaFormGroup(): FormGroup {
    return this.fb.group({
      numero: [null, Validators.required],
      nombre_titular: [null, Validators.required],
      fecha_vencimiento: [null, [Validators.required, fechaNoVencidaValidatorError]],
      cvv: [null, Validators.required],
      usuario_id: [null],
    });
  }

  get tarjetas(): FormArray {
    return this.form.get('tarjetas') as FormArray;
  }

  agregarTarjeta() {
    this.tarjetas.push(this._createTarjetaFormGroup());
  }

  eliminarTarjeta(index: number) {
    if (this.tarjetas.length === 1) {
      this.tarjetas.at(0).reset({
        marca: null,
        tipo: 1,
        numero: null,
        nombre_titular: null,
        fecha_inicio: null,
        fecha_vencimiento: null,
        cvv: null,
        usuario_id: null,
      });
    } else {
      this.tarjetas.removeAt(index);
    }
  }

  private _loadPaises(): void {
    this.parametricasService
      .get_paises()
      .subscribe((data) => (this.paises = data));
  }

  private _loadTiposIdentificacion(): void {
    this.parametricasService
      .get_tipos_identificacion()
      .subscribe((data) => (this.tiposIdentificacion = data));
  }

  onFileChange(event: any, i: number, campo: 'anverso_url' | 'reverso_url') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.tarjetas.at(i).get(campo)?.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onFechaInicioBlur(event: any, index: number) {
    this.validateFecha(event.target.value, index, 'fecha_inicio');
  }

  onFechaVencimientoBlur(event: any, index: number) {
    this.validateFecha(event.target.value, index, 'fecha_vencimiento');
  }

  private validateFecha(value: string, index: number, controlName: string) {
    if (!value) return; // Si está vacío, no validar (a menos que sea requerido)

    const match = value.match(/^(\d{2})\/(\d{4})$/);
    let isValid = false;

    if (match) {
      const mes = parseInt(match[1], 10);
      const anio = parseInt(match[2], 10);

      // Validar mes entre 01-12 y año razonable
      isValid = mes >= 1 && mes <= 12 && anio >= 2020 && anio <= 2040;
    }

    const control = this.tarjetas.at(index).get(controlName);

    if (!isValid) {
      control?.setErrors({ ...control.errors, invalidDate: true });
    } else {
      // Remover solo el error de fecha inválida
      const currentErrors = control?.errors;
      if (currentErrors) {
        delete currentErrors['invalidDate'];
        const hasOtherErrors = Object.keys(currentErrors).length > 0;
        control?.setErrors(hasOtherErrors ? currentErrors : null);
      }
    }
  }
}
