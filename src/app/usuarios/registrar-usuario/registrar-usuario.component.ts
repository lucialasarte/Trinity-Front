import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
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

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent implements OnInit {
  form!: FormGroup;
  tarjetaHoverIndex: number | null = null;
  paises: Pais[] = [];
  roles: Rol[] = [];
  tiposIdentificacion: TipoIdentificacion[] = [];
  marcasTarjeta: MarcaTarjeta[] = [];
  tiposTarjeta: TipoTarjeta[] = [];
  creandoUsuario = false; // Nueva propiedad
  tieneSesion = false;

  constructor(
    private fb: FormBuilder,
    private parametricasService: ParametricasService,
    private usuariosService: UsuariosService,
    private modalRef: NzModalRef<RegistrarUsuarioComponent>, // Inyecta NzModalRef
    private auth: AuthService,
    private message: NzMessageService // Inyecta NzMessageService
  ) {
  }

  ngOnInit(): void {
    this._loadPaises();
    this._loadRoles();
    this._loadTiposIdentificacion();
    this._loadMarcasTarjeta();
    this._loadTiposTarjeta();
    this._initForm();

    this.tieneSesion = !!this.auth.usuarioActual();
    // El seteo por defecto del rol ahora se hace en _loadRoles usando RolEnum
  }

  private _initForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password_hash: ['', [Validators.required, Validators.minLength(6)]],
      tipo_identificacion: [null, Validators.required],
      numero_identificacion: ['', Validators.required],
      fecha_nacimiento: [null, Validators.required],
      pais: [null, Validators.required],
      roles: [[], Validators.required],
      tarjetas: this.fb.array([this._createTarjetaFormGroup()])
    });
  }

  private _createTarjetaFormGroup(): FormGroup {
    return this.fb.group({
      marca: [null, Validators.required],
      tipo: [1, Validators.required],
      numero: [null, Validators.required],
      nombre_titular: [null, Validators.required],
      fecha_inicio: [null],
      fecha_vencimiento: [null, Validators.required],
      cvv: [null, Validators.required],
      usuario_id: [null],
    })
  }

  get tarjetas(): FormArray {
    return this.form.get('tarjetas') as FormArray;
  }

  agregarTarjeta() {
    this.tarjetas.push(this._createTarjetaFormGroup());
  }

  eliminarTarjeta(index: number) {
    // Si solo hay una tarjeta, resetea el form en vez de eliminar para evitar errores de controles
    if (this.tarjetas.length === 1) {
      this.tarjetas.at(0).reset({
        marca: null,
        tipo: 1,
        numero: null,
        nombre_titular: null,
        fecha_inicio: null,
        fecha_vencimiento: null,
        cvv: null,
        usuario_id: null
      });
    } else {
      this.tarjetas.removeAt(index);
    }
  }

  private _loadPaises(): void {
    this.parametricasService.get_paises().subscribe(data => this.paises = data);
  }

  private _loadRoles(): void {
    this.parametricasService.get_roles().subscribe(data => {
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
    this.parametricasService.get_tipos_identificacion().subscribe(data => this.tiposIdentificacion = data);
  }

  private _loadMarcasTarjeta(): void {
    this.parametricasService.get_marcas_tarjeta().subscribe(data => this.marcasTarjeta = data);
  }

  private _loadTiposTarjeta(): void {
    this.parametricasService.get_tipos_tarjeta().subscribe(data => this.tiposTarjeta = data);
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




  getFormControlValue(control: AbstractControl, campo: string): any {
    return control?.get(campo)?.value;
  }

  onSubmit() {
    if (this.form.valid) {
      this.creandoUsuario = true;
      // Usar getRawValue para incluir campos deshabilitados
      const formValue = this.form.getRawValue();

      console.log(formValue);

    // Permite roles como [{id: 3}] o [3]
    const roles_ids = Array.isArray(formValue.roles)
      ? formValue.roles.map((r: any) => typeof r === 'object' && r !== null ? r.id : r).filter((id: any) => id !== undefined && id !== null)
      : [];

    const id_tipo_identificacion = formValue.tipo_identificacion;
    const id_pais = formValue.pais;

    // Validaciones extra
    if (!roles_ids.length) {
      alert('Debe seleccionar al menos un rol.');
      return;
    }
    if (!id_tipo_identificacion) {
      alert('Debe seleccionar un tipo de identificación.');
      return;
    }
    if (!id_pais) {
      alert('Debe seleccionar un país.');
      return;
    }

    // Mapear tarjetas al formato requerido
    const tarjetas = (formValue.tarjetas || []).map((t: any) => ({
      numero: t.numero,
      nombre_titular: t.nombre_titular,
      fecha_inicio: t.fecha_inicio,
      fecha_vencimiento: t.fecha_vencimiento,
      cvv: t.cvv,
      id_marca: t.marca?.id ?? t.marca, // Soporta objeto o id
      id_tipo: t.tipo?.id ?? t.tipo      // Soporta objeto o id
    }));

    const usuario = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      correo: formValue.correo,
      password: formValue.password_hash,
      roles_ids,
      id_tipo_identificacion,
      numero_identificacion: formValue.numero_identificacion,
      fecha_nacimiento: formValue.fecha_nacimiento,
      id_pais,
      tarjetas
    };

    console.log(usuario);
    this.usuariosService.crearUsuario(usuario)
      .pipe(
        finalize(() => {
          this.creandoUsuario = false; // Asegura que se desactive al finalizar
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Usuario creado exitosamente:', response);
          this.modalRef.close(response); // Retorna el usuario creado al llamador
        },
        error: (error) => {
          // SweetAlert2: mostrar mensaje de error 400 del backend
          if (error.status === 400 && error.error) {
            const msg = error.error.message || error.error.error || error.statusText || 'Error desconocido';
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: msg
            });
          } else {
            console.error('Error al crear el usuario:', error);
          }
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
