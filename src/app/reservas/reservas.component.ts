import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import { ReservasService } from './services/reservas.service';
import { Reserva } from './models/reserva';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})
export class ReservasComponent {
  form!: FormGroup;
  sortEstado = null;
  sortFechaInicio = null;
  sortFechaFin = null;
  reservas: Array<Reserva> = [];
  estado: string = '';
  cargando: boolean = true;
  calificacion: any = [];

  constructor(
    private fb: FormBuilder,
    private reservasService: ReservasService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      dato: [''],
    });
    this._getReservas();
  }

  buscarReserva() {}

  verReserva(id: number) {
    this.router.navigate(['/detalle-reserva', id]);
  }

  eliminar(id: number) {
    if (id) {
      this.utilsService.showMessage({
        title: '¿Estás seguro?',
        message: '¿Querés cancelar esta reserva?',
        icon: 'warning',
        confirmButtonText: 'Si, cancelar!',
        cancelButtonText: 'Cancelar',
        showConfirmButton: true,
        showCancelButton: true,
        actionOnConfirm: () => {
          this.reservasService.cancelarReserva(id).subscribe({
            next: () => {
              this.utilsService.showMessage({
                title: 'Reserva cancelada',
                message: 'La reserva fue cancelada correctamente.',
                icon: 'success',
              });

              this._getReservas();
            },
            error: (err) => {
              console.error('Error al cancelar la reserva:', err);
              this.utilsService.showMessage({
                title: 'Error',
                message: 'No se pudo cancelar la reserva.',
                icon: 'error',
              });
            },
          });
        },
      });
    }
  }
  stadoCompare(a: any, b: any): number {
    const estadoOrden = ['Pendiente', 'Confirmada', 'Cancelada', 'Finalizada'];
    return estadoOrden.indexOf(a.estado) - estadoOrden.indexOf(b.estado);
  }

  fechaCompare(a: any, b: any): number {
    return a.fecha_inicio.getTime() - b.fecha_inicio.getTime();
  }

  estadoFilterFn = (filter: string[], item: any): boolean => {
    return filter.length === 0 || filter.includes(item.estado);
  };

  private _getReservas() {
    this.reservasService.get_reservas().subscribe({
      next: (data) => {
        console.log(data);
        this.reservas = data;
        this.reservas = data.map((reserva: any) => ({
          ...reserva,
          estado: this.obtenerEstadoTexto(reserva.id_estado),
        }));
        this.cargando = false;
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al cargar reservas',
          message:
            error.error.error ||
            'No se pudieron cargar las reservas. Por favor, intenta nuevamente.',
          icon: 'error',
        });
      },
    });
  }

  private obtenerEstadoTexto(id_estado: number): string {
    switch (id_estado) {
      case 1:
        return 'Confirmada';
      case 2:
        return 'Pendiente';
      case 3:
        return 'Cancelada';
      default:
        return 'Finalizada';
    }
  }
}
