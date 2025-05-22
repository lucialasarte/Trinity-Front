import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropiedadesService } from '../propiedades/services/propiedades.service';
import { UtilsService } from '../shared/services/utils.service';
import { ParametricasService } from '../shared/services/parametricas.service';
import { Search } from '../propiedades/models/search';
import { Propiedad } from '../propiedades/models/propiedad';

import { ReservasService } from '../reservas/services/reservas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  form!: FormGroup;
  today = new Date();
  ciudades: any[] = [];
  propiedades: any[] = [];
  paginaActual = 1;
  pageSize = 4;
  propiedadesPaginadas: any[] = [];
  isVisible = false;
  porpiedadParaReservar: Propiedad = new Propiedad();

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService,
    private utilsService: UtilsService,
    private reservasService: ReservasService,
    private router: Router,
    private parametricasService: ParametricasService
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._get_ciudades();
  }

  onCheckInChange(value: Date): void {
    this.form.get('checkOut')?.updateValueAndValidity();
  }
  actualizarPagina(): void {
    const start = (this.paginaActual - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.propiedadesPaginadas = this.propiedades.slice(start, end);
  }

  buscarPropiedad() {
    const form = this.form.getRawValue();
    console.log('Form:', form);
    let search = new Search(form);
    console.log('Search:', search);
    this.propiedadesService.search(search).subscribe({
      next: (data) => {
        console.log('Propiedades:', data);
        this.propiedades = data;
        this.paginaActual = 1;
        this.actualizarPagina();
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al buscar propiedades',
          message:
            'No se pudieron cargar las propiedades. Por favor, intenta nuevamente.',
          icon: 'error',
        });
      },
    });
  }

  verPropiedad(propiedad: Propiedad) {
    this.isVisible = true;
    this.porpiedadParaReservar = propiedad;
  }
  onSubmitReserva() {
    const reserva = {
      id_propiedad: this.porpiedadParaReservar.id,
      fecha_inicio: this.form.get('checkin')?.value,
      fecha_fin: this.form.get('checkout')?.value,
      cantidad_personas: this.form.get('huespedes')?.value,
      monto_total: this.precioTotal
    };

    console.log('Reserva:', reserva);

    this.reservasService.createReserva(reserva).subscribe({
      next: (data) => {
        console.log('Reserva creada:', data);
        this.utilsService.showMessage({
          title: 'Reserva creada con éxito',
          message: 'Tu reserva ha sido creada exitosamente.',
          icon: 'success',
        });
        this.handleCancelReserva();
        this.form.reset();
        this.router.navigate(['/detalle-reserva', data.id]);
      },
      error: (error) => {
        console.error('Error al crear la reserva:', error);
        this.utilsService.showMessage({
          title: 'Error al crear la reserva',
          message:
            'No se pudo crear la reserva. Por favor, intenta nuevamente.',
          icon: 'error',
        });
      },
    });
  }

  handleCancelReserva() {
    this.isVisible = false;
    this.porpiedadParaReservar = new Propiedad();
  }

  private _initForm() {
    this.form = this.fb.group({
      id: [''],
      checkin: [null, Validators.required],
      checkout: [null, Validators.required],
      huespedes: [
        1,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
    });
  }
  private _get_ciudades() {
    this.parametricasService.get_ciudades_con_propiedades().subscribe((data) => {
      this.ciudades = data;
      console.log(this.ciudades);
    });
  }

  disabledCheckInDate = (current: Date): boolean => {
    return current < this.clearTime(this.today);
  };

  disabledCheckOutDate = (current: Date): boolean => {
    const checkIn = this.form.get('checkin')?.value;
    if (!checkIn) {
      return true;
    }
    return current && current <= checkIn;
  };

  private clearTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  buscar(): void {
    if (this.form.invalid) {
      this.utilsService.showMessage({
        title: 'Por favor completá todos los campos obligatorios.',
      });
      return;
    }

    const { checkIn, checkOut } = this.form.value;
    if (new Date(checkOut) <= new Date(checkIn)) {
      this.utilsService.showMessage({
        title: 'La fecha de Check‑out debe ser posterior a la de Check‑in.',
      });
      return;
    }

    console.log('Búsqueda:', this.form.value);
  }

  get noches(): number {
    const checkin = this.form.get('checkin')?.value;
    const checkout = this.form.get('checkout')?.value;

    if (!checkin || !checkout) return 0;

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    const diffMs = checkoutDate.getTime() - checkinDate.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    return diffDias > 0 ? diffDias : 0;
  }

  get precioTotal(): number {
    if (!this.porpiedadParaReservar?.precioNoche) return 0;
    return this.noches * this.porpiedadParaReservar.precioNoche;
  }
}
