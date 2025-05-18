import { Component } from '@angular/core';
import { Reserva } from '../reservas/models/reserva';
import { PropiedadesService } from '../propiedades/services/propiedades.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from '../propiedades/models/propiedad';
import { Calificacion } from '../shared/models/calificacion';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.component.html',
  styleUrls: ['./detalle-reserva.component.css'],
})
export class DetalleReservaComponent {
  reserva: Reserva = new Reserva();
  propiedad: any;
  documentos: any[] = [];
  calificacion: Calificacion = new Calificacion();

  constructor(
    private propiedadesService: PropiedadesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.reserva = new Reserva({
      id: 1,
      id_propiedad: 2,
      id_usuario: 201,
      fecha_inicio: new Date('2023-10-01'),
      fecha_fin: new Date('2023-10-05'),
      cantidad_personas: 2,
      id_estado: 1,
      estado: 'pendiente',
      fecha_reserva: new Date('2023-09-20'),
      monto_pagado: 300,
      monto_total: 500,
      documentos: [
        {
          id: 1,
          nombre: 'Contrato de Reserva',
          url: '/docs/contrato_reserva.pdf',
        },
        {
          id: 2,
          nombre: 'Reglamento Interno',
          url: '/docs/reglamento_interno.pdf',
        },
      ],
    });
    this.calificacion = new Calificacion({
      personal: 5,
      instalaciones: 4,
      servicios: 5,
      limpieza: 3,
      confort: 2,
      precioCalidad: 5,
      ubicacion: 1,
    });
    this._getPropiedad(this.reserva.id_propiedad);
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
