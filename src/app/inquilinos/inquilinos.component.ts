import { Component, computed } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  MinLengthValidator,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { min } from 'moment';
import { InquilinosService } from './services/inquilinos.service';
import { UtilsService } from '../shared/services/utils.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RegistrarUsuarioComponent } from '../usuarios/form-registrar-usuario/registrar-usuario.component';

@Component({
  selector: 'app-inquilinos',
  templateUrl: './inquilinos.component.html',
  styleUrls: ['./inquilinos.component.css'],
})
export class InquilinosComponent {
  form!: FormGroup;
  cargando: boolean = true;
  inquilinos: Array<any> = [];
  inquilinosFiltrados: Array<any> = [];
  isVisible: boolean = false;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private userService: UsuariosService,
    private inquilinoService: InquilinosService,
    private utilsService: UtilsService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getInquilinos();
  }

  cambiarEstado(id: number) {
    this.utilsService.showMessage2({
      title: '¿Estás seguro?',
      message: '¿Querés cambiar el estado del inquilino?',
      icon: 'warning',
      confirmButtonText: 'Si, cambiar!',
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      showCancelButton: true,
      actionOnConfirm: () => {
        this.cambiarEstadoInquilino(id);
      },
    });
  }
  eliminarInquilino(id: number) {
    this.utilsService.showMessage2({
      title: '¿Estás seguro?',
      message: '¿Querés eliminar al inquilino?',
      icon: 'warning',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      showCancelButton: true,
      actionOnConfirm: () => {
        this._eliminarInquilino(id);
      },
    });
  }
  cambiarEstadoInquilino(id: number) {
    this.userService.cambiar_estado_inquilino(id).subscribe({
      next: (data) => {
        if (data.is_bloqueado) {
          this.utilsService.showMessage({
            icon: 'success',
            title: 'Inquilino bloqueado',
            message: `El inquilino ha sido bloqueado correctamente.`,
          });
        } else {
          this.utilsService.showMessage({
            icon: 'success',
            title: 'Inquilino desbloqueado',
            message: `El inquilino ha sido desbloqueado correctamente.`,
          });
        }
        this._getInquilinos();
      },
      error: (error) => {
        this.utilsService.showMessage({
          icon: 'error',
          title: 'Error al cambiar estado',
          message: `No se pudo cambiar el estado del inquilino.`,
        });
      },
    });
  }

  abrirModalRegistroUsuario() {
    const modalRef = this.modal.create({
      nzTitle: 'Registrar usuario',
      nzContent: RegistrarUsuarioComponent,
      nzWidth: 990,
      nzFooter: null,
    });
    modalRef.afterClose.subscribe((usuarioCreado) => {
      if (usuarioCreado) {
        this._getInquilinos();
        //console.log('Usuario creado:', usuarioCreado);
        //llamar sevicio link temporal contraseña
      }
    });
  }
  
  buscarInquilinos(value: any) {
    const dato = value.dato?.trim()?.toLowerCase();
    if (!dato || dato.length < 4) {
      this.inquilinosFiltrados = [...this.inquilinos];
      return;
    }

    this.inquilinosFiltrados = this.inquilinos.filter((inquilino) => {
      return (
        inquilino.nombre?.toLowerCase().includes(dato) ||
        inquilino.apellido?.toLowerCase().includes(dato) ||
        inquilino.numero_identificacion?.toLowerCase().includes(dato) ||
        inquilino.correo?.toLowerCase().includes(dato)
      );
    });
  }

  private _getInquilinos() {
    this.inquilinoService.getInquilinos().subscribe({
      next: (data) => {
        this.inquilinos = data;
        this.inquilinosFiltrados = data;
        this.cargando = false;
        console.log('Inquilinos obtenidos:', this.inquilinos);
      },
      error: (error) => {
        console.error('Error fetching inquilinos:', error);
        this.cargando = false;
      },
    });
  }

  private _initForm() {
    this.form = this.fb.group({
      dato: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  private _eliminarInquilino(id: number) {
    this.inquilinoService.eliminarInquilino(id).subscribe({
      next: (data) => {
        this.utilsService.showMessage({
          icon: 'success',
          title: 'Inquilino eliminado',
          message: `El inquilino ha sido eliminado correctamente.`,
        });
        this._getInquilinos();
      },
      error: (error) => {
        this.utilsService.showMessage2({
          icon: 'error',
          title: 'Error al eliminar inquilino',
          message: error.error.error ||`No se pudo eliminar el inquilino.`,
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonText: 'Aceptar',
          actionOnConfirm: () => {
            
          }
        });
      },
    });
  }
}
