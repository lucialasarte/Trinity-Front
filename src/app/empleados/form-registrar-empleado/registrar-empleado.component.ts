import { Component, computed, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Empleado } from '../models/empleado';
import { ParametricasService } from '../../shared/services/parametricas.service';
import { Pais } from '../../usuarios/models/pais';
import { Rol } from '../../usuarios/models/rol';
import { TipoIdentificacion } from '../../usuarios/models/tipo-identificacion';
import { MarcaTarjeta } from '../../usuarios/models/marca-tarjeta';
import { TipoTarjeta } from '../../usuarios/models/tipo-tarjeta';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { RolEnum } from '../../usuarios/enums/rol.enum';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';
import { mayorDeEdadValidator } from 'src/app/shared/models/validatorMayor';
import { fechaNoVencidaValidator } from 'src/app/shared/models/validadorVenida';
import { passwordValidator } from 'src/app/shared/models/passwordValidator';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { environment } from 'src/environments/environment';
import { EmpleadosService } from '../services/empleados.service';

@Component({
  selector: 'app-registrar-empleado',
  templateUrl: './registrar-empleado.component.html',
  styleUrls: ['../../usuarios/form-registrar-usuario/registrar-usuario.component.css'],
})
export class RegistrarEmpleadoComponent implements OnInit {
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
    //private usuariosService: UsuariosService,
    private empleadosService: EmpleadosService,
    private modalRef: NzModalRef<RegistrarEmpleadoComponent>, // Inyecta NzModalRef
    private auth: AuthService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this._loadPaises();
    this._loadRoles();
    this._loadTiposIdentificacion();
    this._initForm();

    this.tieneSesion = !!this.auth.usuarioActual();
    this.esAdministrador = this.auth.esAdministrador();
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
      roles: [[], Validators.required],
      //tarjetas: this.fb.array([this._createTarjetaFormGroup()]),
    });
  }


  get tarjetas(): FormArray {
    return this.form.get('tarjetas') as FormArray;
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


  onSubmit() {
    if (this.form.valid) {
      this.creandoUsuario = true;
      const formValue = this.form.value;

      
      this.empleadosService
        .registrarEmpleado({...formValue})
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

}
