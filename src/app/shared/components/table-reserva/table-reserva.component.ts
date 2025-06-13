import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ReservasService } from 'src/app/reservas/services/reservas.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-table-reserva',
  templateUrl: './table-reserva.component.html',
  styleUrls: ['./table-reserva.component.css']
})
export class TableReservaComponent {
@Input() reservas: any[] = [];
cargando: boolean = true;

constructor(
  private reservasService: ReservasService,
  private router: Router,
  private utilsService: UtilsService
) {}


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
