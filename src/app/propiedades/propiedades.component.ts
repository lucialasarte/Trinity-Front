import { Component, computed, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropiedadesService } from './services/propiedades.service';
import { Propiedad } from './models/propiedad';
import { FormPropiedadesComponent } from './form-propiedades/form-propiedades.component';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.css'],
})
export class PropiedadesComponent implements OnInit {
  @ViewChild(FormPropiedadesComponent)
  formPropiedad!: FormPropiedadesComponent;
  form!: FormGroup;
  usuario = computed(() => this.auth.usuarioActual());
  isVisible = false;
  propiedades: any[] = [];
  propiedadesFiltradas: any[] = [];
  propiedadesEliminadas: any[] = [];
  isFormValid = false;
  cargando = true;
  eliminando = false;

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService,
    private router: Router,
    private utilsService: UtilsService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getPropiedades();
    this._getPropiedadesEliminadas();
    this.auth.cargarUsuarioDesdeToken();
  }

  onSubmitPropiedad() {
    const form = this.formPropiedad.form.getRawValue();
    let propiedad = new Propiedad(form);
    propiedad.precioNoche = Number(form.precioNoche);
    propiedad.is_habilitada = false;

    this.propiedadesService.createPropiedad(propiedad).subscribe({
      next: (data) => {
        this._getPropiedades();
        this.utilsService.showMessage({
          title: 'Propiedad creada',
          message: 'La propiedad ha sido creada correctamente.',
          icon: 'success',
        });
        this.formPropiedad.form.reset();
        this.isVisible = false;
        this.verPropiedad(data.id);
      },
      error: (err) => {
        this.utilsService.showMessage({
          title: 'Error al crear la propiedad',
          message:
            err.error.error ||
            'No se pudo crear la propiedad. Por favor, intente nuevamente.',
          icon: 'error',
        });
      },
    });
  }

  showModal() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
    this.formPropiedad.form.reset();
  }

  buscarPropiedad(value: any) {
    const dato = value.dato?.trim()?.toLowerCase();
    if (!dato || dato.length < 4) {
      this.propiedadesFiltradas = [...this.propiedades];
      return;
    }

    this.propiedadesFiltradas = this.propiedades.filter((propiedad) => {
      return (
        propiedad.nombre.toLowerCase().includes(dato) ||
        propiedad.descripcion.toLowerCase().includes(dato) ||
        propiedad.tipo.toLowerCase().includes(dato) ||
        propiedad.ciudad.toLowerCase().includes(dato) ||
        propiedad.provincia?.toLowerCase().includes(dato)
      );
    });
  }

  eliminarPropiedad(id: number) {
    this.propiedadesService.tieneActivas(id).subscribe({
      next: (data) => {
        let ok: boolean = Boolean(data.tieneActivas);
        if (ok) {
          this.comoEliminar(id);
        } else {
          this._deseaEliminar(id);
        }
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al verificar reservas',
          message:
            'No se pudo verificar las reservas activas. Por favor, intente nuevamente más tarde.',
          icon: 'error',
        });
      },
    });
  }

  comoEliminar(id: number) {
    this.utilsService.showMessage2({
      title: '¿Desea cancelar las reservas futuras?',
      message:
        'Las reservas futuras se cancelarán y la propiedad será eliminada. Caso contrario, la propiedad será deshabilitada hasta que se concrete la última reserva.',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      showDenyButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Cancelar reservas',
      cancelButtonColor: '#d33',
      denyButtonText: 'No cancelar reservas',
      actionOnConfirm: () => {
        this.eliminando = true;
        this._eliminarCancelandoReservas(id);
      },
      actionOnCancel: () => {},
      actionOnDeny: () => {
        this.eliminando = true;
        this._eliminarDeshabilitando(id);
      },
    });
  }

  cambiarEstado(propiedad: Propiedad) {
    if (propiedad.is_habilitada) {
      this.utilsService.showMessage2({
        title: '¿Seguro desea deshabilitar la propiedad?',
        message:
          'Una vez deshabilitada no aparecerá en el listado de propiedades para reservar',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Si, deshabilitar!',
        actionOnConfirm: () => {
          this._habilitar(propiedad);
        },
      });
    } else {
      this.utilsService.showMessage2({
        title: '¿Seguro desea habilitar la propiedad?',
        message:
          'Una vez habilitada aparecerá en el listado de propiedades para reservar',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Si, habilitar!',
        actionOnConfirm: () => {
          this._habilitar(propiedad);
        },
      });
    }
  }

  verPropiedad(id: number) {
    this.router.navigate(['detalle-propiedad', id]);
  }

  deshabilitar(propiedad: Propiedad) {
    this._habilitar(propiedad);
  }

  onFormValidityChange(valid: boolean): void {
    this.isFormValid = valid;
  }

  private _initForm() {
    this.form = this.fb.group({
      dato: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  private _getPropiedades() {
    this.propiedadesService.getPropiedades().subscribe(
      (data) => {
        this.propiedades = data;
        this.propiedadesFiltradas = data;
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.utilsService.showMessage({
          title: 'Error al obtener propiedades',
          message:
            'No se pudieron cargar las propiedades. Por favor, intenta nuevamente.',
          icon: 'error',
        });
      }
    );
  }

  private _getPropiedadesEliminadas() {
    this.propiedadesService.getPropiedadesEliminadas().subscribe((data) => {
      this.propiedadesEliminadas = data;
    });
  }

  private _habilitar(propiedad: Propiedad) {
    if (propiedad.is_habilitada) {
      this.propiedadesService.cambiar_estado_propiedad(propiedad.id).subscribe({
        next: (data) => {
          this.utilsService.showMessage({
            title: 'Propiedad deshabilitada',
            message: 'La propiedad ha sido deshabilitada correctamente.',
            icon: 'success',
          });
          this._getPropiedades();
        },
        error: (err) => {
          console.error('Error al habilitar propiedad:', err);
          this.utilsService.showMessage({
            title: 'Error al habilitar propiedad',
            message:
              'No se pudo deshabilitar la propiedad. Por favor, intenta nuevamente.',
            icon: 'error',
          });
        },
      });
    } else {
      this.propiedadesService.cambiar_estado_propiedad(propiedad.id).subscribe({
        next: () => {
          this.utilsService.showMessage({
            title: 'Propiedad habilitada',
            message: 'La propiedad ha sido habilitada correctamente.',
            icon: 'success',
          });
          this._getPropiedades();
        },
        error: (err) => {
          console.error('Error al habilitar propiedad:', err);
          this.utilsService.showMessage({
            title: 'Error al habilitar propiedad',
            message:
              'No se pudo habilitar la propiedad. Por favor, intenta nuevamente.',
            icon: 'error',
          });
        },
      });
    }
  }

  private _eliminarCancelandoReservas(id: number) {
    this.propiedadesService.eliminar_con_reservas(id).subscribe({
      next: () => {
        this.eliminando = false;
        this.utilsService.showMessage({
          title: 'Propiedad eliminada',
          message:
            'Las reservas han sido canceladas y la propiedad ha sido eliminada correctamente.',
          icon: 'success',
        });
        this._getPropiedades();
        this._getPropiedadesEliminadas();
      },
      error: (error) => {
        this.eliminando = false;
        this.utilsService.showMessage({
          icon: 'error',
          title: 'Error al eliminar propiedad',
          message:
            'No se pudo eliminar la propiedad. Por favor, intente nuevamente más tarde.',
        });
        console.error(error);
      },
    });
  }

  private _eliminarDeshabilitando(id: number) {
    this.propiedadesService.eliminar_propiedad(id).subscribe({
      next: () => {
        this.eliminando = false;
        this.utilsService.showMessage({
          title: 'Propiedad pendiente de eliminación',
          message:
            ' Esta propiedad se eliminará al finalizar su ultima reserva.',
          icon: 'success',
        });

        this._getPropiedades();
        this._getPropiedadesEliminadas();
      },
      error: (error) => {
        this.eliminando = false;
        this.utilsService.showMessage({
          icon: 'error',
          title: 'Error al deshabilitar propiedad',
          message:
            'No se pudo deshabilitar la propiedad. Por favor, intente nuevamente más tarde.',
        });
      },
    });
  }

  private _eliminarPropiedad(id: number) {
    this.propiedadesService.eliminar_con_reservas(id).subscribe({
      next: () => {
        this.eliminando = false;
        this.utilsService.showMessage({
          title: 'Propiedad eliminada',
          message: 'La propiedad ha sido eliminada correctamente.',
          icon: 'success',
        });
        this._getPropiedades();
        this._getPropiedadesEliminadas();
      },
      error: (error) => {
        this.eliminando = false;
        this.utilsService.showMessage({
          icon: 'error',
          title: 'Error al eliminar propiedad',
          message:
            'No se pudo eliminar la propiedad. Por favor, intente nuevamente más tarde.',
        });
        console.error(error);
      },
    });
  }

  private _deseaEliminar(id: number): void {
    this.utilsService.showMessage2({
      title: '¿Seguro desea eliminar la propiedad?',
      message: 'Una vez eliminada no podrá ser recuperada.',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar!',
      actionOnConfirm: () => {
        this.eliminando = true;
        this._eliminarPropiedad(id);
      },
    });
  }
}
