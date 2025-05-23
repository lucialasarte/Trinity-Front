import { Component, computed } from '@angular/core';
import { Reserva } from '../reservas/models/reserva';
import { PropiedadesService } from '../propiedades/services/propiedades.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from '../propiedades/models/propiedad';
import { Calificacion } from '../shared/models/calificacion';
import { UtilsService } from '../shared/services/utils.service';
import { ReservasService } from '../reservas/services/reservas.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.component.html',
  styleUrls: ['./detalle-reserva.component.css'],
})
export class DetalleReservaComponent {
  reserva: Reserva = new Reserva();
  propiedad: any;
  documentos: any[] = [];
  calificacion: Calificacion | null = null;
  estado: string = ''; 
  puedeCalificar = false;
  usuario = computed(() => this.auth.usuarioActual());

  constructor(
    private propiedadesService: PropiedadesService,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private reservasService: ReservasService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.auth.cargarUsuarioDesdeToken();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.reserva.id = +id;
        this._getReserva(this.reserva.id);
      }
    });
  }

  confirmarReserva(){}

  calificar() {}
  cancelar() {}
  subirDocumentacion() {}
  verPropiedad(id:number){}

  private _getPropiedad(id: number) {
    this.propiedadesService.get_propiedad_id(id).subscribe((data) => {
      console.log(data);
      this.propiedad = data;
    });
  }
  private _getReserva(id: number) {
    this.reservasService.get_reserva_id(id).subscribe((data) => {
      console.log(data);
      this.reserva = data;
      switch (data.id_estado) {
        case 1:
          this.estado = 'Confirmada';
          break;
        case 2:
          this.estado = 'Pendiente';
          break;
        case 3:
          this.estado = 'Cancelada';
          break;
        default:
          this.estado = 'Finalizada';
      }
      this._getPropiedad(this.reserva.id_propiedad);
      this.validarCalificacion();
    }, error => {
      this.utilsService.showMessage({
        title: 'Error al obtener propiedades',
        message:
          'No se pudieron cargar las propiedades. Por favor, intenta nuevamente.',
        icon: 'error',
      });
    }
    );
  }
  
  validarCalificacion(): void {
  if (!this.reserva?.fecha_fin) return;

  const fechaFin = new Date(this.reserva.fecha_fin); // convierte string a Date
  const hoy = new Date();

  // Normalizar fechas a medianoche para evitar diferencias horarias
  fechaFin.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);

  const estadiaFinalizada = fechaFin <= hoy;
  const diasDesdeFin = (hoy.getTime() - fechaFin.getTime()) / (1000 * 60 * 60 * 24);

  this.puedeCalificar = estadiaFinalizada && diasDesdeFin <= 14;
}

  estadoClase(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return 'badge-confirmada';
      case 'pendiente':
        return 'badge-pendiente';
      case 'cancelada':
        return 'badge-cancelada';
      default:
        return 'badge-otros';
    }
  }
}
