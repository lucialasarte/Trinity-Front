import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder
} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent {
  reservas: { id: number; fecha_inicio: Date; fecha_fin: Date; estado: 'Pendiente' | 'Confirmada' | 'Cancelada' }[] = [
    { id: 1, fecha_inicio: new Date('2023-10-01'), fecha_fin: new Date('2023-10-05'), estado: 'Confirmada' },
    { id: 2, fecha_inicio: new Date('2023-10-10'), fecha_fin: new Date('2023-10-15'), estado: 'Pendiente' },
    { id: 3, fecha_inicio: new Date('2023-10-20'), fecha_fin: new Date('2023-10-25'), estado: 'Cancelada' },
    { id: 4, fecha_inicio: new Date('2023-10-30'), fecha_fin: new Date('2023-11-05'), estado: 'Confirmada' },
    { id: 5, fecha_inicio: new Date('2023-11-10'), fecha_fin: new Date('2023-11-15'), estado: 'Pendiente' },
    { id: 6, fecha_inicio: new Date('2023-11-20'), fecha_fin: new Date('2023-11-25'), estado: 'Cancelada' },
    { id: 7, fecha_inicio: new Date('2023-11-30'), fecha_fin: new Date('2023-12-05'), estado: 'Confirmada' },
    { id: 8, fecha_inicio: new Date('2023-12-10'), fecha_fin: new Date('2023-12-15'), estado: 'Pendiente' },
  ];

  form!: FormGroup;
  sortEstado = null;
  sortFechaInicio = null;
  sortFechaFin = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      dato: ['']
    });
    console.log(this.reservas);
  }

  buscarReserva() {}

  verReserva(id: number) {
    // this.router.navigate(['/detalle-reserva', id]);
  }

  eliminar(id: number) {}

  stadoCompare(a: any, b: any): number {
    const estadoOrden = ['Pendiente', 'Confirmada', 'Cancelada'];
    return estadoOrden.indexOf(a.estado) - estadoOrden.indexOf(b.estado);
  }

  fechaCompare(a: any, b: any): number {
    return a.fecha_inicio.getTime() - b.fecha_inicio.getTime();
  }
}
