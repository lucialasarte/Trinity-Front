import {
  Component,
  computed,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadesService } from '../propiedades/services/propiedades.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Propiedad } from '../propiedades/models/propiedad';
import { EmpleadosService } from '../empleados/services/empleados.service';
import { ReservasService } from '../reservas/services/reservas.service';
import { UtilsService } from '../shared/services/utils.service';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { EditarPropiedadComponent } from './form-editar-propiedad/form-editar-propiedad.component';
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
  imagenesPorPagina = 3;
  totalPaginas = 1;

  encargado: any;
  empleados: any[] = [];
  cargando: boolean = true;
  apiUrl = `${environment.apiUrl}/propiedades`;
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
    public auth: AuthService,
    private modal: NzModalService
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

  editarCodigoAcceso() {
    this.codigo = true;
    this.modalTitle = 'Editar código de acceso';
    this._initFormCodigo();
    this.isModalVisible = true;
  }

  editarEncargado() {
    this._getEmpleados();
    this.modalTitle = 'Editar Encargado';
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

  updatePropiedad(id: number) {
    const modalRef = this.modal.create({
      nzTitle: 'Editar Propiedad',
      nzContent: EditarPropiedadComponent,
      nzWidth: 990,
      nzFooter: null,
      nzData: {
        propiedadId: id,
      },
    });
    modalRef.afterClose.subscribe((usuarioCreado) => {
      if (usuarioCreado) {
        this._getPropiedad(id);
      }
    });
  }

  handleCancel() {
    this.isModalVisible = false;
    this.codigo = false;
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

    input.value = '';
  }

  eliminarImagen(imagenUrl: string) {
    if (this.imagenesConId.length === 1) {
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

  estadoFilterFn = (filter: string[], item: any): boolean => {
    return filter.length === 0 || filter.includes(item.estado);
  };

  stadoCompare(a: any, b: any): number {
    const estadoOrden = ['Pendiente', 'Confirmada', 'Cancelada'];
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

  private _getPropiedad(id: number) {
    this.propiedadesService.get_propiedad_id(id).subscribe({
      next: (data) => {
        this.propiedad = data;
        this._getReservas(this.propiedad.id);
        this._cargarImagenes(this.propiedad.id_imagenes);
        if (this.propiedad.id_encargado) {
          this._getEmpleado(this.propiedad.id_encargado);
        }
      },
      error: (error) => {
        const errorMessage =
          error.error?.error ||
          'No se pudo cargar la propiedad. Por favor, intenta nuevamente.';

        this.utilsService.showMessage({
          title: 'Error al cargar propiedad',
          message: errorMessage,
          icon: 'error',
        });
        if (error.status === 422) {
          if (this.auth.usuarioActual()?.permisos?.gestionar_propiedades) {
            this.router.navigate(['/propiedades']);
          } else {
            this.router.navigate(['/home']);
          }
        }
      },
    });
  }

  private _getEmpleado(id: number) {
    this.empleadoService.getEmpleados().subscribe((data: any[]) => {
      this.encargado = data.find(
        (empleado) => empleado.id === this.propiedad.id_encargado
      );
    });
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
            error.error.error ||
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
          Validators.minLength(4),
          Validators.maxLength(4),
        ],
      ],
    });
  }

  private _getEmpleados() {
    this.empleadoService.getEncargados().subscribe({
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
