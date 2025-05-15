import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { PropiedadesService } from './services/propiedades.service';
import { Propiedad } from './models/propiedad';
import { FormPropiedadesComponent } from './form-propiedades/form-propiedades.component';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';
import { ParametricasService } from '../shared/services/parametricas.service';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.css'],
})
export class PropiedadesComponent implements OnInit {
  @ViewChild(FormPropiedadesComponent)
  formPropiedad!: FormPropiedadesComponent;
  form!: FormGroup;

  // propiedades: any[] = [];

  isVisible = false;
  propiedades: any[] = [];
  isFormValid = false;

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this._getPropiedades();
  }

  onSubmitPropiedad() {
    const form = this.formPropiedad.form.getRawValue();
    let propiedad = new Propiedad(form);
    propiedad.precioNoche = Number(form.precioNoche);
    propiedad.is_habilitada = true;

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

  buscarPropiedad() {}

  eliminar(id: number) {
    this.utilsService.showMessage2({
      title: '¿Desea cancelar las reservas futuras?',
      message:
        'Las reservas futuras se cancelarán y la propiedad será eliminada. Caso contrario, la propiedad será deshabilitada hasta que se concrete la última reserva.',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
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
        this.propiedadesService.eliminar_propiedad(id).subscribe({
          next: (data) => {
            this.utilsService.showMessage({
              title: 'Propiedad deshabilitada',
              message: 'La propiedad ha sido deshabilitada correctamente.',
              icon: 'success',
            });
            this._getPropiedades();
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
    });
  }

  verPropiedad(id: number) {
    this.router.navigate(['detalle-propiedad', id]);
  }

  deshabilitar(id: number) {
    this._habilitar(id);
  }
  onFormValidityChange(valid: boolean): void {
    this.isFormValid = valid;
  }

  private _getPropiedades() {
    this.propiedadesService.getPropiedades().subscribe((data) => {
      this.propiedades = data;
      console.log(this.propiedades);
    });
  }

  private _habilitar(id: number) {
    this.propiedadesService.cambiar_estado_propiedad(id).subscribe((data) => {
      console.log(data);
      this._getPropiedades();
    });
  }
}
