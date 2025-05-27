import {
  Component,
  computed,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadesService } from '../propiedades/services/propiedades.service';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Propiedad } from '../propiedades/models/propiedad';
import { EmpleadosService } from '../empleados/services/empleados.service';
import { HttpClient } from '@angular/common/http';
import { ParametricasService } from '../shared/services/parametricas.service';
import { forkJoin } from 'rxjs';
import { ImagenesService } from '../shared/services/imagenes.service';
import { ReservasService } from '../reservas/services/reservas.service';
import { UtilsService } from '../shared/services/utils.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-detalle-propiedad',
  templateUrl: './detalle-propiedad.component.html',
  styleUrls: ['./detalle-propiedad.component.css'],
})
export class DetallePropiedadComponent implements OnInit {
  @ViewChild('inputImagen') inputImagen!: ElementRef<HTMLInputElement>;
  formCodigo!: FormGroup;
  propiedadId!: number;
  propiedad: Propiedad = new Propiedad();
  reservas: any[] = [];

  imagenes: string[] = [];
  imagenesPaginadas: string[] = [];
  imagenesConId: { id: number; url: string }[] = [];

  paginaActual = 1;
  imagenesPorPagina = 4;
  totalPaginas = 1;

  encargado: any;
  empleados: any[] = [];
  cargando: boolean = true;
  apiUrl = 'http://localhost:5000/propiedades';
  isModalVisible: boolean = false;
  modalTitle: string = '';
  formEmpleado!: FormGroup;
  codigo: boolean = false;
  usuario = computed(() => this.auth.usuarioActual());

  constructor(
    private route: ActivatedRoute,
    private propiedadesService: PropiedadesService,
    private router: Router,
    private fb: FormBuilder,
    private empleadoService: EmpleadosService,
    private reservasService: ReservasService,
    private utilsService: UtilsService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.propiedadId = +id;
        this._getPropiedad(this.propiedadId);
      }
    });
    this.formCodigo = this.fb.group({
      codigo: [null, Validators.required],
    });
  }

  verReserva(id: number) {
    this.router.navigate(['/detalle-reserva', id]);
  }

  handleCancel() {
    this.isModalVisible = false;
    this.codigo = false;
  }

  editarCodigoAcceso() {
    this.codigo = true;
    this.modalTitle = 'Editar código de acceso';
    this._initFormCodigo();
    this.isModalVisible = true;
  }
  editarEncargado() {
    this._getEmpleados();
    this.modalTitle = 'Editar código de acceso';
    this._initFormEncargado();
    this.isModalVisible = true;
  }
  onSubmitForm() {
    if (this.codigo) {
      const codigo = this.formCodigo.get('codigoAcceso')?.value;
      this.propiedadesService.editarCodigo(this.propiedadId, codigo).subscribe({
        next: () => {
          this.utilsService.showMessage({
            title: 'Código editado',
            message: 'El código fue editado correctamente.',
            icon: 'success',
          });
          this._getPropiedad(this.propiedadId);
          this.isModalVisible = false;
        },
        error: (error) => {
          this.utilsService.showMessage({
            title: 'Error al editar el código',
            message:
              error.error.error ||
              'No se pudo editar el código. Por favor, intente nuevamente.',
            icon: 'error',
          });
        },
      });
    } else {
      const id_encargado = this.formEmpleado.get('id_encargado')?.value;
      this.propiedadesService
        .asignarEncargado(this.propiedadId, id_encargado)
        .subscribe({
          next: () => {
            this.utilsService.showMessage({
              title: 'Encargado editado',
              message: 'El encargado fue editado correctamente.',
              icon: 'success',
            });
            this._getPropiedad(this.propiedadId);
          },
          error: (error) => {
            this.utilsService.showMessage({
              title: 'Error al editar el encargado',
              message:
                error.error.error ||
                'No se pudo editar el encargado. Por favor, intente nuevamente.',
              icon: 'error',
            });
          },
        });
      this.isModalVisible = false;
    }
  }
  updatePropiedad(id: number) {}

  estadoFilterFn = (filter: string[], item: any): boolean => {
    return filter.length === 0 || filter.includes(item.estado);
  };

  stadoCompare(a: any, b: any): number {
    const estadoOrden = ['Pendiente', 'Confirmada', 'Cancelada'];
    return estadoOrden.indexOf(a.estado) - estadoOrden.indexOf(b.estado);
  }

  fechaCompare(a: any, b: any): number {
    return a.fecha_inicio.getTime() - b.fecha_inicio.getTime();
  }

  abrirSelectorImagen(): void {
    this.inputImagen.nativeElement.click();
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      const id = this.propiedadId.toString();
      this.propiedadesService.subirImagen(formData, id).subscribe({
        next: () => {
          this.utilsService.showMessage({
            title: 'Imagen subida con éxito',
            message: 'La imagen se ha subido correctamente.',
            icon: 'success',
          });
          this._getPropiedad(this.propiedadId);
        },
        error: (error) => {
          this.utilsService.showMessage({
            title: 'Error al subir la imagen',
            message:
              error.error.error ||
              'No se pudo subir la imagen. Por favor, intente nuevamente.',
            icon: 'error',
          });
        },
      });
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
    }

    // Limpio el input para permitir volver a subir la misma imagen si se desea
    input.value = '';
  }

  private _getPropiedad(id: number) {
    this.propiedadesService.get_propiedad_id(id).subscribe((data) => {
      this.propiedad = data;
      this._getReservas(this.propiedad.id);
      this._cargarImagenes(this.propiedad.id_imagenes);
      if (this.propiedad.id_encargado) {
        this._getEmpleado(this.propiedad.id_encargado);
      }
    });
  }

  private _getEmpleado(id: number) {
    this.empleadoService.getEmpleados().subscribe((data: any[]) => {
      this.encargado = data.find(
        (empleado) => empleado.id === this.propiedad.id_encargado
      );
    });
    console.log(this.encargado);
  }

  private _cargarImagenes(imagenObjs: [number]): void {
    if (!imagenObjs?.length) {
      this.imagenesConId = [];
      this.imagenes = [];
      this.imagenesPaginadas = [];
      this.totalPaginas = 1;
      return;
    }

    this.imagenesConId = imagenObjs.map((img) => ({
      id: img,
      url: `${this.apiUrl}/imagen/${img}`,
    }));

    this.totalPaginas = Math.ceil(
      this.imagenesConId.length / this.imagenesPorPagina
    );
    this.actualizarImagenesPaginadas();
  }
  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarImagenesPaginadas();
    }
  }

  actualizarImagenesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.imagenesPorPagina;
    const fin = inicio + this.imagenesPorPagina;
    this.imagenesPaginadas = this.imagenesConId
      .slice(inicio, fin)
      .map((img) => img.url);
  }

  eliminarImagen(imagenUrl: string) {
    if (this.propiedad.id_imagenes.length === 1) {
      this.utilsService.showMessage({
        title: 'No se puede eliminar',
        message: 'La propiedad debe tener al menos una imagen.',
        icon: 'warning',
      });
    } else {
      const imagen = this.imagenesConId.find((img) => img.url === imagenUrl);
      if (!imagen) return;

      this.utilsService.showMessage({
        title: '¿Estás seguro?',
        message: '¿Querés eliminar esta imagen?',
        icon: 'warning',
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'Cancelar',
        showConfirmButton: true,
        showCancelButton: true,
        actionOnConfirm: () => {
          this.propiedadesService.eliminarImagen(imagen.id).subscribe({
            next: () => {
              this.utilsService.showMessage({
                title: 'Imagen eliminada',
                message: 'La imagen fue eliminada correctamente.',
                icon: 'success',
              });

              // Actualizamos el array
              this.imagenesConId = this.imagenesConId.filter(
                (img) => img.id !== imagen.id
              );
              this.totalPaginas = Math.ceil(
                this.imagenesConId.length / this.imagenesPorPagina
              );
              if (this.paginaActual > this.totalPaginas) {
                this.paginaActual = this.totalPaginas;
              }
              this.actualizarImagenesPaginadas();
            },
            error: (err) => {
              console.error('Error al eliminar imagen:', err);
              this.utilsService.showMessage({
                title: 'Error',
                message: 'No se pudo eliminar la imagen.',
                icon: 'error',
              });
            },
          });
        },
      });
    }
  }

  private _getReservas(id: number) {
    this.cargando = true;
    this.reservasService.getReservasByPropiedad(id).subscribe({
      next: (data) => {
        this.reservas = data;
        this.cargando = false;
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al obtener reservas',
          message:
            'No se pudieron cargar las reservas. Por favor, intente nuevamente.',
          icon: 'error',
        });
      },
    });
  }

  private _initFormEncargado() {
    this.formEmpleado = this.fb.group({
      id_encargado: [this.encargado.id, Validators.required],
    });
  }
  private _initFormCodigo() {
    this.formCodigo = this.fb.group({
      codigoAcceso: [
        this.propiedad.codigoAcceso,
        [
          Validators.required,
          Validators.pattern(/^\d{4}$/),
          // opcionales pero explícitos:
          Validators.minLength(4),
          Validators.maxLength(4),
        ],
      ],
    });
  }

  private _getEmpleados() {
    this.empleadoService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al obtener empleados',
          message:
            'No se pudieron cargar los empleados. Por favor, intente nuevamente.',
          icon: 'error',
        });
      },
    });
  }
}
