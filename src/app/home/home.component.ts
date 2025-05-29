import { Component, computed, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropiedadesService } from '../propiedades/services/propiedades.service';
import { UtilsService } from '../shared/services/utils.service';
import { ParametricasService } from '../shared/services/parametricas.service';
import { Search } from '../propiedades/models/search';
import { Propiedad } from '../propiedades/models/propiedad';
import { ReservasService } from '../reservas/services/reservas.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

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
  apiUrl = 'http://localhost:5000/propiedades';
  usuario = computed(() => this.auth.usuarioActual);
  cargando = false;
  search!: Search;

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService,
    private utilsService: UtilsService,
    private reservasService: ReservasService,
    private router: Router,
    private parametricasService: ParametricasService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._get_ciudades();
  }

  actualizarPagina(): void {
    const start = (this.paginaActual - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.propiedadesPaginadas = this.propiedades.slice(start, end);
  }

  buscarPropiedad() {
    this.search = new Search();
    this.propiedadesPaginadas = [];
    const formValue = this.form.getRawValue();

    const [checkin, checkout] = formValue.fechas || [null, null];

    this.search = {
      id: formValue.id,
      checkin: checkin,
      checkout: checkout,
      huespedes: formValue.huespedes,
    };

    this.propiedadesService.search(this.search).subscribe({
      next: (data) => {
        if (!data || (Array.isArray(data) && data.length === 0)) {
          this.utilsService.showMessage({
            title: 'Sin propiedades',
            message:
              'No se encontraron propiedades con los criterios seleccionados.',
            icon: 'info',
          });
          this.propiedades = [];

          return;
        }
        this.propiedades = data;
        this.propiedades.forEach((propiedad) => {
          propiedad.fotoPerfil = this.apiUrl + '/imagenPerfil/' + propiedad.id;
        });
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
    if (!this.auth.usuarioActual()?.permisos?.gestionar_propiedades) {
      this.isVisible = true;
      this.porpiedadParaReservar = propiedad;
    }
  }

  onSubmitReserva() {
    this.cargando = true;

    const reserva = {
      id_propiedad: this.porpiedadParaReservar.id,
      fecha_inicio: this.search.checkin,
      fecha_fin: this.search.checkout,
      cantidad_personas: this.search.huespedes,
      monto_total: this.precioTotal,
      id_estado: this.porpiedadParaReservar.requiere_documentacion ? 2 : 1,
    };
    const usuario = this.auth.usuarioActual();
    const tarjeta =
      usuario?.tarjetas && usuario.tarjetas.length > 0
        ? usuario.tarjetas[0]
        : undefined;

    let fechaVencimiento: Date | null = null;
    if (tarjeta?.fecha_vencimiento) {
      const [mesStr, anioStr] = tarjeta.fecha_vencimiento.split('/');
      const mes = parseInt(mesStr);
      const anio = parseInt(anioStr);
      fechaVencimiento = new Date(anio, mes, 0, 23, 59, 59);
    }

    if (fechaVencimiento && fechaVencimiento < new Date()) {
      this.cargando = false;
      this.utilsService.showMessage({
        title: 'Tarjeta vencida',
        message: 'Tu tarjeta de crédito está vencida. Por favor, actualízala.',
        icon: 'error',
      });
      return;
    } else {
      this.reservasService.createReserva(reserva).subscribe({
        next: (data) => {
          this.cargando = false;
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
          this.cargando = false;
          console.error('Error al crear la reserva:', error);
          this.utilsService.showMessage({
            title: 'Error al crear la reserva',
            message:
              error.error.error ||
              'No se pudo crear la reserva. Por favor, intenta nuevamente.',
            icon: 'error',
          });
        },
      });
    }
  }

  handleCancelReserva() {
    this.isVisible = false;
    this.porpiedadParaReservar = new Propiedad();
  }

  private _initForm() {
    this.form = this.fb.group({
      id: [''],
      fechas: [null, Validators.required],
      huespedes: [
        1,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
    });
  }
  private _get_ciudades() {
    this.parametricasService
      .get_ciudades_con_propiedades()
      .subscribe((data) => {
        this.ciudades = data;
        console.log(this.ciudades);
      });
  }

  disabledDate = (current: Date): boolean => {
    return current < this.clearTime(this.today);
  };

  private clearTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  get fechasSeleccionadas(): [Date | null, Date | null] {
    return this.form.get('fechas')?.value || [null, null];
  }

  get noches(): number {
    const [checkin, checkout] = this.fechasSeleccionadas;

    if (!checkin || !checkout) return 0;

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    checkinDate.setHours(0, 0, 0, 0);
    checkoutDate.setHours(0, 0, 0, 0);

    const diffMs = checkoutDate.getTime() - checkinDate.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    return diffDias > 0 ? diffDias : 0;
  }

  get precioTotal(): number {
    if (!this.porpiedadParaReservar?.precioNoche) return 0;
    return this.noches * this.porpiedadParaReservar.precioNoche;
  }
}
