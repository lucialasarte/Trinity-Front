import { Component, computed, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { ParametricasService } from '../../../shared/services/parametricas.service';
import { Pais } from '../../models/pais';
import { Rol } from '../../models/rol';
import { TipoIdentificacion } from '../../models/tipo-identificacion';

import { UsuariosService } from '../../services/usuarios.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { RolEnum } from '../../enums/rol.enum';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from 'sweetalert2';
import { mayorDeEdadValidator } from 'src/app/shared/models/validatorMayor';
import { fechaNoVencidaValidator } from 'src/app/shared/models/validadorVenida';
import { passwordValidator } from 'src/app/shared/models/passwordValidator';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-editar-usuario',
  templateUrl: './perfil-usuario-editar.component.html',
  styleUrls: ['./perfil-usuario-editar.component.css'],
})
export class EditarUsuarioComponent implements OnInit {
  @ViewChild('inputImagen') inputImagen!: ElementRef<HTMLInputElement>;
  form!: FormGroup;
  tarjetaHoverIndex: number | null = null;
  paises: Pais[] = [];
  roles: Rol[] = [];
  tiposIdentificacion: TipoIdentificacion[] = [];
  editandoUsuario = false; 
  tieneSesion = false;
  imagenes: { id: number; url: string }[] = [];
  rol: number = 1;
  esAdministrador = false;
  @Input()esInquilino = true;
  @Output() usuarioEditado = new EventEmitter<boolean>();
  
  apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    @Inject(NZ_MODAL_DATA) public data: { usuarioId: number,rol:number },
    private fb: FormBuilder,
    private parametricasService: ParametricasService,
    private usuariosService: UsuariosService,
    private modalRef: NzModalRef<EditarUsuarioComponent>,
    private auth: AuthService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this._loadPaises();
    this._loadTiposIdentificacion();
    this._initForm();

    if (this.data.usuarioId) {
      this._loadUsuario(this.data.usuarioId);
    }
    
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
      tarjeta: this._createTarjetaFormGroup()
    });
    this.form.statusChanges.subscribe(() => {
      this.usuarioEditado.emit(this.form.valid);
    }); 
  }

  private _loadUsuario(id: number): void {
    this.usuariosService.getUsuarioPorId(id).subscribe({
      next: (usuario: Usuario) => {

        if (usuario.roles[0].id == 3) {
          const fechaFormateada = usuario.tarjetas[0].fecha_vencimiento.slice(0, 3) + usuario.tarjetas[0].fecha_vencimiento.slice(5);
          this.tarjetaFormGroup.patchValue(usuario.tarjetas[0]);
          this.tarjetaFormGroup.get('fecha_vencimiento')?.setValue(fechaFormateada)
          this.tarjetaFormGroup.updateValueAndValidity();


          this.imagenes = usuario.id_imagenes?.map((img: any) => ({
              id: img,
              url: `${this.apiUrl}/imagenDoc/${img}`,
          })) || [];
            
        }
        
        const userDataForPatch: any = {
            ...usuario,
            pais: usuario.pais?.id || null,
            tipo_identificacion: usuario.tipo_identificacion?.id || null,
        };

        const { password_hash, tarjetas, id_imagenes, ...restOfUserTransformed } = userDataForPatch;
        this.form.patchValue(restOfUserTransformed);

      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
        this.utilsService.showMessage({
          title: 'Error',
          message: 'No se pudo cargar la información del usuario.',
          icon: 'error',
        });
      },
    });}
    
get tarjetaFormGroup(): FormGroup { // <--- CAMBIO CLAVE
    return this.form.get('tarjeta') as FormGroup;
  }
  private _createTarjetaFormGroup(): FormGroup {
    return this.fb.group({
      numero: [null, Validators.required],
      nombre_titular: [null, Validators.required],
      fecha_vencimiento: [null, [Validators.required, fechaNoVencidaValidator()]],
      cvv: [null, Validators.required],
      usuario_id: [null],
    });
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

  onSubmit() {
    if (this.form.valid) {
      this.editandoUsuario = true;
      const formValue = this.form.value;
      if (this.data.rol === RolEnum.Inquilino) {
        formValue.tarjetas = [formValue.tarjeta]; // Convierte el objeto 'tarjeta' en un array de una tarjeta
      }
      delete formValue.tarjeta; 

      const payload = {
        ...formValue,
        roles: [this.data.rol], 
        id_imagenes: this.imagenes.map((img) => img.id),
      };
      this.usuariosService
        .actualizarUsuario(this.data.usuarioId,payload)
        .pipe(
          finalize(() => {
            this.editandoUsuario = false; 
          })
        )
        .subscribe({
          next: (response) => {
            this.utilsService.showMessage({
              title: 'Edicion exitosa',
              message: 'Actualización de usuario exitosa.',
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
              console.error('Error al editar:', error);
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