import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EmpleadosService } from './services/empleados.service';
import { UtilsService } from '../shared/services/utils.service';

import { RegistrarEmpleadoComponent } from './form-registrar-empleado/registrar-empleado.component';
@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
})
export class EmpleadosComponent {
  form!: FormGroup;
  cargando: boolean = true;
  empleados: any[] = [];
  empleadosFiltrados: Array<any> = [];
  isVisible: boolean = false;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private empleadosService: EmpleadosService,
    private utilsService: UtilsService,
    private modal: NzModalService

  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getEmpleados();
  }

  eliminar(id: number) {
    this.utilsService.showMessage2({
      title: '¿Seguro desea eliminar al encargado?',
      message: 'Una vez eliminado no podrá ser recuperado',
      icon: 'warning',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      showCancelButton: true,
      actionOnConfirm: () => {
        this._eliminarEmpleado(id);
        // this.cambiarEstadoInquilino(id);
      },
    });
  }

  // abrirModalRegistroUsuario() {
  //     const modalRef = this.modal.create({
  //       nzTitle: 'Registrar usuario',
  //       nzContent: RegistrarUsuarioComponent,
  //       nzWidth: 990,
  //       nzFooter: null,
  //     });
  //     modalRef.afterClose.subscribe((usuarioCreado) => {
  //       if (usuarioCreado) {
  //         this._getEmpleados();
  //       }
  //     });
  //   }

  abirModalRegistroEmpleado() {
    const modalRef = this.modal.create({
        nzTitle: 'Registrar Empleado',
        nzContent: RegistrarEmpleadoComponent,
        nzWidth: 990,
        nzFooter: null,
      });
      modalRef.afterClose.subscribe((usuarioCreado) => {
        if (usuarioCreado) {
          this._getEmpleados();
        }
      });
  }

  buscarEmpleados(value: any) {
      const dato = value.dato?.trim()?.toLowerCase();
      if (!dato || dato.length < 4) {
        this.empleadosFiltrados = [...this.empleados];
        return;
      }
  
      this.empleadosFiltrados = this.empleados.filter((empleado) => {
        return (
          empleado.nombre?.toLowerCase().includes(dato) ||
          empleado.apellido?.toLowerCase().includes(dato) ||
          empleado.numero_identificacion?.toLowerCase().includes(dato) ||
          empleado.correo?.toLowerCase().includes(dato)
        );
      });
    }
  private _eliminarEmpleado(id: number) {
    this.empleadosService.eliminarEmpleado(id).subscribe({
      next: (data) => {
        this.utilsService.showMessage({
          title: 'Empleado eliminado',
          icon: 'success',
          message: 'El empleado ha sido eliminado correctamente.',
        });
        this._getEmpleados();
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al eliminar empleado',
          icon: 'error',
          message: error.error.error || 'No se pudo eliminar el empleado.',
        });
      },
    });
  }
  private _getEmpleados() {
    this.empleadosService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.empleadosFiltrados = data;
        this.cargando = false;
      },
      error: (error) => {
        this.utilsService.showMessage ({
          title: 'Error al obtener empleados',
          icon: 'error',
          message: error.error.error || 'No se pudo obtener los empleados.'
        })
        this.cargando = false;
      },
    });
  }
  private _initForm() {
    this.form = this.fb.group({
      dato: [null, [Validators.required, Validators.minLength(4)]],
    });
  }
}
