import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadesService } from '../propiedades/services/propiedades.service';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detalle-propiedad',
  templateUrl: './detalle-propiedad.component.html',
  styleUrls: ['./detalle-propiedad.component.css'],
})
export class DetallePropiedadComponent implements OnInit {
  formCodigo: FormGroup = new FormGroup({});
  propiedadId!: number;
  propiedad: any;
  reservas: {
    id: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    estado: 'Pendiente' | 'Confirmada' | 'Cancelada';
  }[] = [
    {
      id: 1,
      fecha_inicio: new Date('2023-10-01'),
      fecha_fin: new Date('2023-10-05'),
      estado: 'Confirmada',
    },
    {
      id: 2,
      fecha_inicio: new Date('2023-10-10'),
      fecha_fin: new Date('2023-10-15'),
      estado: 'Pendiente',
    },
    {
      id: 3,
      fecha_inicio: new Date('2023-10-20'),
      fecha_fin: new Date('2023-10-25'),
      estado: 'Cancelada',
    },
    {
      id: 4,
      fecha_inicio: new Date('2023-10-30'),
      fecha_fin: new Date('2023-11-05'),
      estado: 'Confirmada',
    },
    {
      id: 5,
      fecha_inicio: new Date('2023-11-10'),
      fecha_fin: new Date('2023-11-15'),
      estado: 'Pendiente',
    },
    {
      id: 6,
      fecha_inicio: new Date('2023-11-20'),
      fecha_fin: new Date('2023-11-25'),
      estado: 'Cancelada',
    },
    {
      id: 7,
      fecha_inicio: new Date('2023-11-30'),
      fecha_fin: new Date('2023-12-05'),
      estado: 'Confirmada',
    },
    {
      id: 8,
      fecha_inicio: new Date('2023-12-10'),
      fecha_fin: new Date('2023-12-15'),
      estado: 'Pendiente',
    },
  ];

  imagenes: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private propiedadesService: PropiedadesService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.propiedadId = +id;
        this._getPropiedad(this.propiedadId);
      }
    });
    this._cargarImagenes();
    this.formCodigo = this.fb.group({
      codigo: [null, Validators.required],
    });
  }

  verReserva(id: number) {
    this.router.navigate(['/detalle-reserva', id]);
  }

  editarCodigoAcceso() {}

  updatePropiedad(id: number) {}

  estadoFilterFn = (filter: string[], item: any): boolean => {
  return filter.length === 0 || filter.includes(item.estado);
};


  _getPropiedad(id: number) {
    this.propiedadesService.get_propiedad_id(id).subscribe((data) => {
      console.log(data);
      this.propiedad = data;
    });
  }
  stadoCompare(a: any, b: any): number {
    const estadoOrden = ['Pendiente', 'Confirmada', 'Cancelada'];
    return estadoOrden.indexOf(a.estado) - estadoOrden.indexOf(b.estado);
  }

  fechaCompare(a: any, b: any): number {
    return a.fecha_inicio.getTime() - b.fecha_inicio.getTime();
  }

  private _cargarImagenes(): void {
    // Asumiendo que las imágenes están en 'assets/'
    this.imagenes = [
      `assets/propiedades/1.jpeg`,
      `assets/propiedades/2.jpeg`,
      `assets/propiedades/3.jpg`,
    ];
  }
}
