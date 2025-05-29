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
  cancelando: boolean = false;

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
          this.cancelando = true;
          this.reservasService.cancelarReserva(id).subscribe({
            next: () => {
              this.cancelando = false;
              this.utilsService.showMessage({
                title: 'Reserva cancelada',
                message: 'La reserva fue cancelada correctamente.',
                icon: 'success',
              });

              this._getReservas();
            },
            error: (err) => {
              this.cancelando = false;
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

  fechaInicioCompare = (a: any, b: any): number => {
    return (
      new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime()
    );
  };

  fechaFinCompare = (a: any, b: any): number => {
    return new Date(a.fecha_fin).getTime() - new Date(b.fecha_fin).getTime();
  };

  estadoFilterFn = (filter: string[], item: any): boolean => {
    return filter.length === 0 || filter.includes(item.estado);
  };

  private _getReservas() {
    this.reservasService.get_reservas().subscribe({
      next: (data) => {
        console.log(data);
        this.reservas = data;
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
}
