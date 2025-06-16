import { Component, computed, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PropiedadesService } from '../propiedades/services/propiedades.service';
import { UtilsService } from '../shared/services/utils.service';
import { ParametricasService } from '../shared/services/parametricas.service';
import { Search } from '../propiedades/models/search';
import { Propiedad } from '../propiedades/models/propiedad';
import { ReservasService } from '../reservas/services/reservas.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { validarRangoFechas } from './models/validarRangoFechas';
import { environment } from 'src/environments/environment';
import { UsuariosService } from '../usuarios/services/usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  form!: FormGroup;
  formBuscar!: FormGroup;
  today = new Date();
  ciudades: any[] = [];
  propiedades: any[] = [];
  paginaActual = 1;
  pageSize = 4;
  propiedadesPaginadas: any[] = [];
  isVisible = false;
  isVisibleEmpleado = false;
  porpiedadParaReservar: Propiedad = new Propiedad();
  apiUrl = `${environment.apiUrl}/propiedades`;
  usuario = computed(() => this.auth.usuarioActual);
  cargando = false;
  search!: Search;
  idUsuario: number = 0;

  usuarioSeleccionado: any = null;
  isAgregarUsuario: boolean = false;
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService,
    private utilsService: UtilsService,
    private reservasService: ReservasService,
    private router: Router,
    private parametricasService: ParametricasService,
    public auth: AuthService,
    private userService: UsuariosService
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._get_ciudades();
    this._initFormBuscar();
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
    } else if (this.auth.usuarioActual()?.permisos?.gestionar_propiedades) {
      this.isVisibleEmpleado = true;
      this.porpiedadParaReservar = propiedad;
    }
  }
  onSubmitReservaEmpleado() {
    this.cargando = true;
    const reserva = {
      id_propiedad: this.porpiedadParaReservar.id,
      fecha_inicio: this.search.checkin,
      fecha_fin: this.search.checkout,
      cantidad_personas: this.search.huespedes,
      monto_total: this.precioTotal,
      id_estado: this.porpiedadParaReservar.requiere_documentacion ? 2 : 1,
      monto_pagado: this.montoSena,
      id_inquilino: this.idUsuario,
    };
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

  onSubmitReserva() {
    this.cargando = true;

    const reserva = {
      id_propiedad: this.porpiedadParaReservar.id,
      fecha_inicio: this.search.checkin,
      fecha_fin: this.search.checkout,
      cantidad_personas: this.search.huespedes,
      monto_total: this.precioTotal,
      id_estado: this.porpiedadParaReservar.requiere_documentacion ? 2 : 1,
      monto_pagado: this.montoSena,
    };

    const usuario = this.auth.usuarioActual();
    console.log('Usuario actual:', usuario);
    const tarjeta =
      usuario?.tarjetas && usuario.tarjetas.length > 0
        ? usuario.tarjetas[0]
        : undefined;

    let fechaVencimiento: Date | null = null;
    if (tarjeta?.fecha_vencimiento) {
      const [mesStr, anioStr] = tarjeta.fecha_vencimiento.split('/');
      const mes = parseInt(mesStr, 10); // de 1 a 12
      let anio = parseInt(anioStr, 10);

      // Corregir años abreviados tipo "26" → 2026
      if (anio < 100) {
        anio += 2000;
      }

      // Último día del mes
      fechaVencimiento = new Date(anio, mes, 0, 23, 59, 59);
    }

    if (fechaVencimiento && fechaVencimiento < new Date()) {
      this.cargando = false;
      this.utilsService.showMessage({
        title: 'Tarjeta vencida',
        message: 'Tu tarjeta de crédito está vencida.',
        icon: 'error',
      });
      return;
    } else if (usuario?.id == 7) {
      this.cargando = false;
      this.utilsService.showMessage({
        title: 'Pago Rechazado',
        message: 'Fondos insuficientes.',
        icon: 'error',
      });
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
    this.isVisibleEmpleado = false;
    this.porpiedadParaReservar = new Propiedad();
    this.idUsuario = 0;
    this.usuarioSeleccionado = null;
    this.formBuscar.reset();
  }

  agregarUsuario() {
    this.isAgregarUsuario = true;
    this._getUsuarios();
  }

  cargar(usuario: any) {
    this.idUsuario = usuario.id;
    this.usuarioSeleccionado = usuario;
    this.isAgregarUsuario = false;
    this.formBuscar.reset();
    this.usuariosFiltrados = [...this.usuarios];
  }

  quitarUsuarioSeleccionado() {
    this.usuarioSeleccionado = null;
    this.idUsuario = 0;
    this.isAgregarUsuario = true;
    this.formBuscar.reset(); // por si querés limpiar también
  }

  buscarUsuarios(value: any) {
    const dato = value.dato?.trim()?.toLowerCase();
    if (!dato || dato.length < 4) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter((usuario) => {
      return (
        usuario.nombre?.toLowerCase().includes(dato) ||
        usuario.apellido?.toLowerCase().includes(dato) ||
        usuario.numero_identificacion?.toLowerCase().includes(dato) ||
        usuario.correo?.toLowerCase().includes(dato)
      );
    });
  }

  private _initForm() {
    this.form = this.fb.group({
      id: [''],
      fechas: [null, [Validators.required, validarRangoFechas()]],
      huespedes: [
        1,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
    });
  }

  private _initFormBuscar() {
    this.formBuscar = this.fb.group({
      dato: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  private _get_ciudades() {
    this.parametricasService
      .get_ciudades_con_propiedades()
      .subscribe((data) => {
        this.ciudades = data;
      });
  }

  private _getUsuarios() {
    this.userService.getUsuariosPorRol(3).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
      },
      error: (error) => {},
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

  get montoSena(): number {
    switch (this.porpiedadParaReservar.id_pol_reserva as number) {
      case 1: //
        return 0;
      case 2: // Pago del 20% al reservar
        return this.precioTotal * 0.2;
      case 3: //  Pago total al reservar
        return this.precioTotal;

      default:
        return 0;
    }
  }
}
