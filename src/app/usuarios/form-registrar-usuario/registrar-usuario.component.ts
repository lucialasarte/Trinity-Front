import { Component, computed, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Usuario } from '../models/usuario';
import { ParametricasService } from '../../shared/services/parametricas.service';
import { Pais } from '../models/pais';
import { Rol } from '../models/rol';
import { TipoIdentificacion } from '../models/tipo-identificacion';
import { MarcaTarjeta } from '../models/marca-tarjeta';
import { TipoTarjeta } from '../models/tipo-tarjeta';
import { UsuariosService } from '../services/usuarios.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { RolEnum } from '../enums/rol.enum';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';
import { mayorDeEdadValidator } from 'src/app/shared/models/validatorMayor';
import { fechaNoVencidaValidator } from 'src/app/shared/models/validadorVenida';
import { passwordValidator } from 'src/app/shared/models/passwordValidator';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { environment } from 'src/environments/environment';
import { InquilinosService } from 'src/app/inquilinos/services/inquilinos.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
})
export class RegistrarUsuarioComponent implements OnInit {
  @ViewChild('inputImagen') inputImagen!: ElementRef<HTMLInputElement>;
  form!: FormGroup;
  tarjetaHoverIndex: number | null = null;
  paises: Pais[] = [];
  roles: Rol[] = [];
  tiposIdentificacion: TipoIdentificacion[] = [];
  creandoUsuario = false; // Nueva propiedad
  tieneSesion = false;
  imagenes: { id: number; url: string }[] = [];
  rol: number[] = [3];
  esAdministrador = false;
  @Input()esInquilino = true;

  apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private fb: FormBuilder,
    private parametricasService: ParametricasService,
    private usuariosService: UsuariosService,
    private modalRef: NzModalRef<RegistrarUsuarioComponent>, // Inyecta NzModalRef
    private auth: AuthService,
    private utilsService: UtilsService,
    private inquilinoService: InquilinosService
  ) {}

  ngOnInit(): void {
    this._loadPaises();
    this._loadRoles();
    this._loadTiposIdentificacion();
    this._initForm();

    this.tieneSesion = !!this.auth.usuarioActual();
    this.esAdministrador = this.auth.esAdministrador();
    console.log('es administrador:', this.esAdministrador);
  }

  private _initForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      //password_hash: ['', [Validators.required, passwordValidator]],
      tipo_identificacion: [null, Validators.required],
      numero_identificacion: ['', Validators.required],
      fecha_nacimiento: [null, [Validators.required, mayorDeEdadValidator]],
      pais: [null, Validators.required],
      // roles: [[], Validators.required],
      tarjetas: this.fb.array([this._createTarjetaFormGroup()]),
    });
  }

  private _createTarjetaFormGroup(): FormGroup {
    return this.fb.group({
      numero: [null, Validators.required],
      nombre_titular: [null, Validators.required],
      fecha_vencimiento: [null, [Validators.required, fechaNoVencidaValidator]],
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

  private _loadRoles(): void {
    this.parametricasService.get_roles().subscribe((data) => {
      const usuario = this.auth.usuarioActual();
      if (usuario) {
        const idsRoles = usuario.roles?.map((r: any) => r.id) || [];
        if (idsRoles.includes(RolEnum.Encargado)) {
          // Si es Encargado, solo puede ver el rol Inquilino
          this.roles = data.filter((rol: any) => rol.id === RolEnum.Inquilino);
          // Setea por defecto el rol Inquilino usando el enum
          if (this.roles.length > 0) {
            this.form.get('roles')?.setValue([RolEnum.Inquilino]);
            this.form.get('roles')?.disable();
          }
        } else {
          // Si es Administrador u otro, muestra todos los roles
          this.roles = data;
        }
      } else {
        // Si no hay sesión, muestra solo Inquilino (ya está forzado en el form)
        this.roles = data.filter((rol: any) => rol.id === RolEnum.Inquilino);
        if (this.roles.length > 0) {
          this.form.get('roles')?.setValue([RolEnum.Inquilino]);
          this.form.get('roles')?.disable();
        }
      }
    });
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



  onSubmit() {
    if (this.form.valid) {
      this.creandoUsuario = true;
      const formValue = this.form.value;

      const payload = {
        ...formValue,
        roles: [3], 
        id_imagenes: this.imagenes.map((img) => img.id),
      };
      this.inquilinoService
        .registrarInquilino(payload)
        .pipe(
          finalize(() => {
            this.creandoUsuario = false; 
          })
        )
        .subscribe({
          next: (response) => {
            this.utilsService.showMessage({
              title: 'Usuario creado',
              message: 'El usuario se ha creado correctamente.',
              icon: 'success',
            });
            this.modalRef.close(response); 
          },
          error: (error) => {
            
            if (error.status === 400 && error.error) {
              const msg =
                error.error.message ||
                error.error.error ||
                error.statusText ||
                'Error desconocido';
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: msg,
              });
            } else {
              console.error('Error al crear el usuario:', error);
            }
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
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
      formData.forEach((value, key) => {
      });
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
}
