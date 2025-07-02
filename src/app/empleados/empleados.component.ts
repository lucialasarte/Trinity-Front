import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { EmpleadosService } from './services/empleados.service';
import { UtilsService } from '../shared/services/utils.service';

import { RegistrarEmpleadoComponent } from './form-registrar-empleado/registrar-empleado.component';
@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
})
export class EmpleadosComponent {
  @ViewChild(RegistrarEmpleadoComponent)
  formEmpleado!: RegistrarEmpleadoComponent;
  form!: FormGroup;
  cargando: boolean = true;
  empleados: any[] = [];
  empleadosFiltrados: Array<any> = [];
  error: string | null = null;
  isFormValid = false;

  spinnerVisible = false;

  //steps
  visibleSteps = false;
  currentStep = 0;
  emailForm!: FormGroup;
  empleadoExistente: any = null;
  empleadoEliminado = false;
  correoPrellenado: any;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private empleadosService: EmpleadosService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getEmpleados();
    this.emailForm = this.fb.group({
      correo: [null, [Validators.required, Validators.email]],
    });
  }

  onSubmitEmpleado() {
    const empleado = this.formEmpleado.form.getRawValue();
    if (this.empleadoEliminado && this.empleadoExistente) {
      this._reactivarEmpleado(
        this.empleadoExistente.id,
        empleado
      ); 
    } else {
      this._agregarEmpleado(empleado);
    }
  }

  abrirModalEmpleado() {
    this.visibleSteps = true;
    this.currentStep = 0;
    this.emailForm.reset();
    this.empleadoExistente = null;
    this.empleadoEliminado = false;
  }

  buscarEmpleado() {
    const correo = this.emailForm.value.correo;
    if (!this.emailForm.valid) return;

    this.empleadosService.check(correo).subscribe({
      next: (data) => {
        if (data.usuario === null) {
          this.correoPrellenado = correo;
          this.currentStep = 2;
        } else if (data.usuario) {
          this.empleadoEliminado = true;
          this.empleadoExistente = data.usuario;
          this.currentStep = 1;
        }
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al verificar correo',
          icon: 'error',
          message: error.error.error || 'No se pudo verificar el correo.',
        });
      },
    });
  }

  confirmarReactivacion() {
    this.currentStep = 2;
  }

  cancelar() {
    this.visibleSteps = false;
  }

  handleCancel() {
    this.visibleSteps = false;
    this.formEmpleado.form.reset();
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
      },
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

  onFormValidityChange(valid: boolean): void {
    this.isFormValid = valid;
  }

  private _agregarEmpleado(empleado: any) {
    this.spinnerVisible = true;
    this.empleadosService.registrarEmpleado(empleado).subscribe({
      next: () => {
        this.spinnerVisible = false;
        this.utilsService.showMessage({
          title: 'Empleado registrado',
          message: 'El empleado fue registrado exitosamente.',
          icon: 'success',
        });
        this._getEmpleados();
        this.handleCancel();
      },
      error: (error) => {
        this.spinnerVisible = false;
        this.utilsService.showMessage({
          title: 'Error al registrar empleado',
          icon: 'error',
          message: error.error.error || 'No se pudo registrar el empleado.',
        });
      },
    });
  }

  private _reactivarEmpleado(id:number, empleado: any) {
    this.empleadosService.reactivarEmpleado(id, empleado).subscribe({
      next: () => {
        this.utilsService.showMessage({
          title: 'Empleado reactivado',
          message: 'El empleado fue reactivado exitosamente.',
          icon: 'success',
        });
        this._getEmpleados();
        this.handleCancel();
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al registrar empleado',
          icon: 'error',
          message: error.error.error || 'No se pudo registrar el empleado.',
        });
      },
    });
  }

  private _eliminarEmpleado(id: number) {
    this.spinnerVisible = true;
    this.empleadosService.eliminarEmpleado(id).subscribe({
      next: (data) => {
        this.spinnerVisible = false;
        this.utilsService.showMessage({
          icon: 'success',
          message: 'El empleado ha sido eliminado correctamente.',
        });
        this._getEmpleados();
      },
      error: (error) => {
        this.spinnerVisible = false;
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
        this.utilsService.showMessage({
          title: 'Error al obtener empleados',
          icon: 'error',
          message: error.error.error || 'No se pudo obtener los empleados.',
        });
        this.cargando = false;
      },
    });
  }

  private _initForm() {
    this.form = this.fb.group({
      dato: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  rolCompare(a: any, b: any): number {
    const rolOrden = ['Encargado', 'Administrador'];
    return rolOrden.indexOf(a.rol) - rolOrden.indexOf(b.rol);
  }
}
