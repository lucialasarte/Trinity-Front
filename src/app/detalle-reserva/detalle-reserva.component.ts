import { Component, computed, ElementRef, ViewChild} from '@angular/core';
import { Reserva } from '../reservas/models/reserva';
import { PropiedadesService } from '../propiedades/services/propiedades.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from '../propiedades/models/propiedad';
import { Calificacion } from '../shared/models/calificacion';
import { UtilsService } from '../shared/services/utils.service';
import { ReservasService } from '../reservas/services/reservas.service';
import { AuthService } from '../auth/auth.service';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chat } from './detalle-chat/models/chat';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.component.html',
  styleUrls: ['./detalle-reserva.component.css'],
})
export class DetalleReservaComponent {
  @ViewChild('inputImagen') inputImagen!: ElementRef<HTMLInputElement>;
  reserva: Reserva = new Reserva();
  chatReserva: Chat[] = [];
  formMensaje!: FormGroup;
  formCalificacion!: FormGroup;
  formCalificacionInquilino!: FormGroup;
  inquilino: any;
  encargado: any;
  propiedad: any;
  documentos: any[] = [];
  calificacionPropiedad: Calificacion | null = null;
  calificacionInquilino: number | null = null;
  estado: string = '';
  puedeCalificar = false;
  usuario = computed(() => this.auth.usuarioActual());
  cargando = false;
  isVisibleChat = false;
  isVisibleCalificar = false;
  isVisibleCalificarInquilino = false;
  esAdmin: boolean = false;
  esEncargado: boolean = false;
  esInquilino: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private reservasService: ReservasService,
    public auth: AuthService,
    private router: Router,
    private userService: UsuariosService
  ) {}

  ngOnInit() {
    this.auth.cargarUsuarioDesdeToken();
    const usuario = this.auth.usuarioActual();
    this.esAdmin = !!usuario?.permisos?.gestionar_empleados;
    this.esEncargado =
      !this.esAdmin && !!usuario?.permisos?.gestionar_propiedades;
    this.esInquilino = !this.esAdmin && !this.esEncargado;
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.reserva.id = +id;
        this._getReserva(this.reserva.id);
        this._getChatReserva(this.reserva.id);
      }
    });
    this._initFormMensaje();
    this._initFormCalificacion();
    this._initFormCalificacionInquilino();
  }

  onSubmitCalificacion() {
    const calificacion = this.formCalificacion.value;
    this.reservasService
      .calificarPropiedad(this.reserva.id, calificacion)
      .subscribe({
        next: (res) => {
          this.calificacionPropiedad = calificacion;
          this.utilsService.showMessage({
            title: 'Calificación exitosa',
            message: 'La calificación fue registrada correctamente.',
            icon: 'success',
          });
          this.handleCancel();
        },
        error: (error) => {
          this.utilsService.showMessage({
            title: 'Error al calificar.',
            message:
              error.error.error || 'No se pudo registrar la calificación.',
            icon: 'error',
          });
        },
      });
  }

  onSubmitCalificacionInquilino() {
    const calificacion =
      this.formCalificacionInquilino.get('calificacion')?.value;
    this.reservasService
      .calificarInquilino(this.reserva.id, { calificacion })
      .subscribe({
        next: (res) => {
          this.calificacionInquilino = calificacion;
          this._getInquilino(this.reserva.id_inquilino);

          this.utilsService.showMessage({
            title: 'Calificación exitosa',
            message: 'La calificación fue registrada correctamente.',
            icon: 'success',
          });
          this.handleCancel();
        },
        error: (error) => {
          this.utilsService.showMessage({
            title: 'Error al calificar.',
            message:
              error.error.error || 'No se pudo registrar la calificación.',
            icon: 'error',
          });
        },
      });
  }

  onSubmitMensaje() {
    const mensaje = this.formMensaje.value;
    this.reservasService.enviarMensajeChat(this.reserva.id, mensaje).subscribe({
      next: () => {
        this.utilsService.showMessage({
          title: 'Mensaje enviado',
          message: 'El mensaje fue enviado correctamente.',
          icon: 'success',
        });
        this.handleCancel();
        this._getChatReserva(this.reserva.id);
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al enviar el mensaje.',
          message: error.error.error || 'No se pudo enviar el mensaje.',
          icon: 'error',
        });
      },
    });
  }

  confirmarReserva() {
    this.utilsService.showMessage({
      title: '¿Estás seguro?',
      message: '¿Querés confirmar esta reserva?',
      icon: 'warning',
      confirmButtonText: 'Si, confirmar!',
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      showCancelButton: true,
      actionOnConfirm: () => {
        this._confirmarReserva();
      },
    });
  }

  calificar() {
    const usuario = this.auth.usuarioActual();
    this.esAdmin = !!usuario?.permisos?.gestionar_empleados;
    this.esEncargado =
      !this.esAdmin && !!usuario?.permisos?.gestionar_propiedades;
    this.esInquilino = !this.esAdmin && !this.esEncargado;

    if (this.esInquilino) {
      this.isVisibleCalificarInquilino = true;
    } else {
      this.isVisibleCalificar = true;
    }
  }

  cancelar(id: number) {
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
          this.cargando = true;
          this.reservasService.cancelarReserva(id).subscribe({
            next: () => {
              this.cargando = false;
              this.utilsService.showMessage({
                title: 'Reserva cancelada',
                message: 'La reserva fue cancelada correctamente.',
                icon: 'success',
              });

              this._getReserva(this.reserva.id);
            },
            error: (err) => {
              this.cargando = false;
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

  subirDocumentacion() {
    this.inputImagen.nativeElement.click();
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      const id = this.reserva.id.toString();
      this.reservasService.subirDocumentacion(formData, id).subscribe({
        next: () => {
          this.utilsService.showMessage({
            title: 'Imagen subida con éxito',
            message: 'La imagen se ha subido correctamente.',
            icon: 'success',
          });
          this._getReserva(this.reserva.id);
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
    }

    input.value = '';
  }
  
  eliminarDocumentacion(doc: string){
    this.utilsService.showMessage({
        title: '¿Estás seguro?',
        message: '¿Querés eliminar esta imagen?',
        icon: 'warning',
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'Cancelar',
        showConfirmButton: true,
        showCancelButton: true,
        actionOnConfirm: () => {
          this.reservasService.eliminarDocumentacion(doc).subscribe({
            next: () => {
              this.utilsService.showMessage({
                title: 'Imagen eliminada',
                message: 'La imagen fue eliminada correctamente.',
                icon: 'success',
              }); 
              this._getReserva(this.reserva.id);          
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

  verPropiedad(id: number) {
    this.router.navigate(['/detalle-propiedad', id]);
  }

  chat() {
    const usuario = this.auth.usuarioActual();

    this.esAdmin = !!usuario?.permisos?.gestionar_empleados;
    this.esEncargado =
      !this.esAdmin && !!usuario?.permisos?.gestionar_propiedades;
    this.esInquilino = !this.esAdmin && !this.esEncargado;
    if(usuario?.id == this.propiedad.id_encargado){
      this.esEncargado = true;
    }

    this.isVisibleChat = true;
  }

  handleCancel() {
    this.isVisibleChat = false;
    this.isVisibleCalificar = false;
    this.isVisibleCalificarInquilino = false;
    // Resetear formularios al cerrar el modal
    this.formCalificacion.reset();
    this.formMensaje.reset();
    this.formCalificacionInquilino.reset();
  }

  private _getReserva(id: number) {
    this.reservasService.get_reserva_id(id).subscribe({
      next: (data) => {
        this.reserva = data.reserva;
        this._getInquilino(this.reserva.id_inquilino);
        this.propiedad = data.propiedad;
        this.calificacionPropiedad = data.calificacion_propiedad;
        this.documentos = data.reserva.id_doc;
        this._getEncargado(this.propiedad.id_encargado);
        this.calificacionInquilino = data.calificacion_inquilino?.calificacion;
        this.validarCalificacion();
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al obtener la reserva',
          message: error.error.error || 'No se pudo cargar la reserva.',
          icon: 'error',
        });
      },
    });
  }

  private _getChatReserva(id: number) {
    this.reservasService.getChatReserva(id).subscribe({
      next: (data) => {
        this.chatReserva = data.mensajes;
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al obtener el chat',
          message: error.error.error || 'No se pudo cargar el chat.',
          icon: 'error',
        });
      },
    });
  }

  private _getInquilino(id: number) {
    this.userService.getUsuarioReducido(id).subscribe({
      next: (data) => {
        this.inquilino = data;
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al obtener el inquilino',
          message: error.error.error || 'No se pudo cargar el inquilino.',
          icon: 'error',
        });
      },
    });
  }

  private _confirmarReserva() {
    this.reservasService.confirmar(this.reserva.id).subscribe({
      next: () => {
        this.utilsService.showMessage({
          title: 'Reserva confirmada',
          message: 'La reserva fue confirmada correctamente.',
          icon: 'success',
        });
        this._getReserva(this.reserva.id);
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al confirmar la reserva',
          message: error.error.error || 'No se pudo confirmar la reserva.',
          icon: 'error',
        });
      },
    });
  }

  private _getEncargado(id: number) {
    this.userService.getUsuarioReducido(id).subscribe({
      next: (data) => {
        this.encargado = data;
      },
      error: (error) => {
        this.utilsService.showMessage({
          title: 'Error al obtener el encargado',
          message: error.error.error || 'No se pudo cargar el encargado.',
          icon: 'error',
        });
      },
    });
  }

  private _initFormMensaje() {
    this.formMensaje = this.fb.group({
      mensaje: [null, [Validators.required, Validators.minLength(1)]],
    });
  }

  private _initFormCalificacion() {
    this.formCalificacion = this.fb.group({
      confort: [null, Validators.required],
      instalaciones_servicios: [null, Validators.required],
      limpieza: [null, Validators.required],
      personal: [null, Validators.required],
      precio_calidad: [null, Validators.required],
      ubicacion: [null, Validators.required],
    });
  }

  private _initFormCalificacionInquilino() {
    this.formCalificacionInquilino = this.fb.group({
      calificacion: [3, Validators.required],
    });
  }

  validarCalificacion(): void {
    if (!this.reserva?.fecha_fin) {
      this.puedeCalificar = false;
      return;
    }

    const fechaFin = new Date(this.reserva.fecha_fin);
    const hoy = new Date();

    fechaFin.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    const tiempoTranscurrido = hoy.getTime() - fechaFin.getTime();
    const diasDesdeFin = Math.floor(tiempoTranscurrido / (1000 * 60 * 60 * 24));

    const estadiaFinalizada = fechaFin <= hoy;
    this.puedeCalificar = estadiaFinalizada && diasDesdeFin <= 14;
  }

  estadoClase(estado: string): string {
    switch (estado) {
      case 'Confirmada':
        return 'badge-confirmada';
      case 'Pendiente':
        return 'badge-pendiente';
      case 'Cancelada':
        return 'badge-cancelada';
      default:
        return 'badge-otros';
    }
  }

  get noches(): number {
    const checkin = this.reserva.fecha_inicio;
    const checkout = this.reserva.fecha_fin;

    if (!checkin || !checkout) return 0;

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    // Normalizar a medianoche (00:00:00)
    checkinDate.setHours(0, 0, 0, 0);
    checkoutDate.setHours(0, 0, 0, 0);

    const diffMs = checkoutDate.getTime() - checkinDate.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    return diffDias > 0 ? diffDias : 0;
  }

  get isEliminada(): boolean {
    if (
      this.propiedad.delete_at === null ||
      this.propiedad.delete_at === undefined
    ) {
      return false; // No está eliminada
    }
    if (this.propiedad.delete_at) {
      const fechaEliminacion = new Date(this.propiedad.delete_at);
      const hoy = new Date();
      return fechaEliminacion <= hoy;
    }
    return false;
  }

  get puedeEnviarMensajes(): boolean {
    if (
      !this.reserva?.fecha_inicio ||
      !this.reserva?.fecha_fin ||
      this.reserva.id_estado === 3
    )
      return false;

    const ahora = new Date();
    const inicio = new Date(this.reserva.fecha_inicio);
    const fin = new Date(this.reserva.fecha_fin);

    const esAntes = ahora < inicio;
    const esDurante = ahora >= inicio && ahora <= fin;

    if (this.esInquilino && (esAntes || esDurante)) return true;
    if (this.esAdmin && esAntes) return true;
    if (this.esEncargado && esDurante) return true;

    return false;
  }

  isEnCurso(): boolean {
    if (!this.reserva || this.reserva.id_estado !== 1) return false;

    const hoy = new Date();
    const inicio = new Date(this.reserva.fecha_inicio);
    const fin = new Date(this.reserva.fecha_fin);

    return hoy >= inicio && hoy <= fin;
  }

  puedeAcciones(): boolean {
  const usuario = this.auth.usuarioActual();
  if (!usuario) return false;

  const esEncargado = this.propiedad.id_encargado === usuario.id;
  const esInquilino = this.reserva.id_inquilino === usuario.id;
  const esAdmin = !!usuario.permisos?.gestionar_empleados;

  return esEncargado || esInquilino || esAdmin;
}


  puedePropiedad(): boolean {
    const usuario = this.auth.usuarioActual();
    if (!usuario) return false;

    const esAdmin = !!usuario.permisos?.gestionar_empleados;
    const esEncargado = this.propiedad.id_encargado === usuario.id;

    return esAdmin || esEncargado;
  }

}
