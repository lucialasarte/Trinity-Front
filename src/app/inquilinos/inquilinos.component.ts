import { Component, computed } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, RequiredValidator, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { min } from 'moment';
import { InquilinosService } from './services/inquilinos.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-inquilinos',
  templateUrl: './inquilinos.component.html',
  styleUrls: ['./inquilinos.component.css']
})
export class InquilinosComponent {

  form!:FormGroup;
  cargando: boolean = true;
  inquilinos: Array<any> = [];
  inquilinosFiltrados: Array<any> = [];
  isVisible: boolean = false;
  

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private userService: UsuariosService,
    private inquilinosService: InquilinosService,
    private utilsService: UtilsService
  ) { }

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
      }
    });
  }
  
  cambiarEstadoInquilino(id:number) {
    this.inquilinosService.cambiarEstadoInquilino(id).subscribe({
      next: (data) => {
        if(data.is_bloqueado) {
        this.utilsService.showMessage({
          icon: 'success',
          title: 'Inquilino bloqueado',
          message: `El inquilino ha sido bloqueado correctamente.`
        })}else {
          this.utilsService.showMessage({
          icon: 'success',
          title: 'Inquilino desbloqueado',
          message: `El inquilino ha sido desbloqueado correctamente.`
        });
        }
        this._getInquilinos(); 
      },
      error: (error) => {
        this.utilsService.showMessage({
          icon: 'error',
          title: 'Error al cambiar estado',
          message: `No se pudo cambiar el estado del inquilino.`
        });
      }
    });
  }
  buscarInquilinos(value: any) {
  const dato = value.dato?.trim()?.toLowerCase();
  if (!dato || dato.length < 4) {
    this.inquilinosFiltrados = [...this.inquilinos]; 
    return;
  }

  this.inquilinosFiltrados = this.inquilinos.filter(inquilino => {
    return (
      inquilino.nombre?.toLowerCase().includes(dato) ||
      inquilino.apellido?.toLowerCase().includes(dato) ||
      inquilino.numero_identificacion?.toLowerCase().includes(dato) ||
      inquilino.correo?.toLowerCase().includes(dato)
    );
  });
}

  showModal() {
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
  }

  onSubmitInquilino(){}

  private _getInquilinos() {
    this.userService.getUsuariosPorRol(2).subscribe({
      next: (data) => {
        this.inquilinos = data;
        this.inquilinosFiltrados = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error fetching inquilinos:', error);
        this.cargando = false;
      }
    });
  }

 private _initForm() {
  this.form = this.fb.group({
    dato: [null, [Validators.required, Validators.minLength(4)]]
  });
}


}
