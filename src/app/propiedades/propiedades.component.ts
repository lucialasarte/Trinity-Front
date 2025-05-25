import { Component, computed, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { PropiedadesService } from './services/propiedades.service';
import { Propiedad } from './models/propiedad';
import { FormPropiedadesComponent } from './form-propiedades/form-propiedades.component';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';
import { ParametricasService } from '../shared/services/parametricas.service';
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

  // propiedades: any[] = [];

  isVisible = false;
  propiedades: any[] = [];
  propiedadesEliminadas: any[] = [];
  isFormValid = false;
  cargando = true;
  

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService,
    private router: Router,
    private utilsService: UtilsService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      dato: ['']
    });
    this._getPropiedades();
    this._getPropiedadesEliminadas();
    this.auth.cargarUsuarioDesdeToken();
  }

  onSubmitPropiedad() {
    const form = this.formPropiedad.form.getRawValue();
    let propiedad = new Propiedad(form);
    propiedad.precioNoche = Number(form.precioNoche);
    propiedad.is_habilitada = true;
    propiedad.requiere_documentacion = false;

    this.propiedadesService.createPropiedad(propiedad).subscribe({
      next: () => {
        this._getPropiedades();
        this.utilsService.showMessage({
          title: 'Propiedad creada',
          message: 'La propiedad ha sido creada correctamente.',
          icon: 'success',
        });
        this.formPropiedad.form.reset();
        this.isVisible = false;
      },
      error: (err) => {
        console.error('Error al crear la propiedad:', err);
        this.utilsService.showMessage({
          title: 'Error al crear la propiedad',
          message:
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

  buscarPropiedad() {
    
  }

  eliminar(id: number) {
    this.utilsService.showMessage2({
      title: '¿Desea cancelar las reservas futuras?',
      message:
        'Las reservas futuras se cancelarán y la propiedad será eliminada. Caso contrario, la propiedad será deshabilitada hasta que se concrete la última reserva.',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      showDenyButton: true,
      cancelButtonText: 'Deshabilitar',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Cancelar Reservas',
      cancelButtonColor: '#d33',
      actionOnConfirm: () => {
        this.propiedadesService.eliminar_propiedad(id).subscribe({
          next: (data) => {
            this.utilsService.showMessage({
              title: 'Reservas canceladas',
              message:
                'Las reservas futuras han sido canceladas y la propiedad ha sido eliminada.',
              icon: 'success',
            });
            this._getPropiedades();
            this._getPropiedadesEliminadas();
          },
          error: (error) => {
            this.utilsService.showMessage({
              icon: 'error',
              title: 'Error al eliminar propiedad',
              message:
                'No se pudo eliminar la propiedad. Por favor, intente nuevamente más tarde.',
            });
            console.error(error);
          },
        });
      },
      actionOnCancel: () => {
        this.propiedadesService.eliminar_con_reservas(id).subscribe({
          next: (data) => {
            this.utilsService.showMessage({
              title: 'Propiedad deshabilitada',
              message: 'La propiedad ha sido deshabilitada correctamente.',
              icon: 'success',
            });
            this._getPropiedades();
            this._getPropiedadesEliminadas();
          },
          error: (error) => {
            this.utilsService.showMessage({
              icon: 'error',
              title: 'Error al deshabilitar propiedad',
              message:
                'No se pudo deshabilitar la propiedad. Por favor, intente nuevamente más tarde.',
            });
            console.error(error);
          },
        });
      },
      actionOnDeny: () => {
        // this.utilsService.showMessage({
        //   title: 'Operación cancelada',
        //   message: 'La operación ha sido cancelada.',
        //   icon: 'info',
        // });
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

  search(){}

  private _initForm() {
    this.form = this.fb.group({
      busqueda: [null],
    });
  }

  private _getPropiedades() {
    this.propiedadesService.getPropiedades().subscribe((data) => {
      this.propiedades = data;
      this.cargando = false;
    }, (error) => {
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
      console.log(this.propiedadesEliminadas);
    });
  }

  private _habilitar(propiedad: Propiedad) {
    if (propiedad.is_habilitada) {
      this.propiedadesService.cambiar_estado_propiedad(propiedad.id).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
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
        next: (data) => {
          console.log('Respuesta del servidor:', data);
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
}
