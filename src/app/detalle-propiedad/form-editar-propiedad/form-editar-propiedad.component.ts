import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoPropiedad } from '../../propiedades/models/tipoPropiedad';
import Swal from 'sweetalert2';
import { ParametricasService } from 'src/app/shared/services/parametricas.service';
import { EmpleadosService } from 'src/app/empleados/services/empleados.service';
import { PropiedadesService } from 'src/app/propiedades/services/propiedades.service'; // **Importa tu servicio de propiedades**
import { Propiedad } from '../../propiedades/models/propiedad'; // **Importa el modelo de Propiedad si lo tienes**
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { DetallePropiedadComponent } from '../detalle-propiedad.component';

@Component({
  selector: 'app-form-editar-propiedad',
  templateUrl: './form-editar-propiedad.component.html',
  styleUrls: ['../../propiedades/form-propiedades/form-propiedades.component.css'],
})
export class EditarPropiedadComponent {
  @Output() formValidityChange = new EventEmitter<boolean>();
  form!: FormGroup;
  isEditing: boolean = false;
  tipoPropiedades: Array<TipoPropiedad> = [];
  politicasReserva: Array<any> = [];

  provincias: Array<any> = [];
  ciudades: Array<any> = [];
  empleados: Array<any> = [];
  

  constructor(
    @Inject(NZ_MODAL_DATA) public data: { propiedadId: number },
    private fb: FormBuilder,
    private parametricasService: ParametricasService,
    private empleadoService: EmpleadosService,
    private propiedadesService: PropiedadesService,
    private utilsService: UtilsService,
    private modalRef: NzModalRef<DetallePropiedadComponent>
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getTiposPropiedades();
    this._get_provincias();
    this._getPorcentajes();
    this._getEmpleados();

    if (this.data.propiedadId) {
      this.isEditing = true; 
      this._loadPropiedad(this.data.propiedadId);
    }
  }

  private _initForm() {
    this.form = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      id_tipo: [null, Validators.required],
      tipo: [null],
      calle: [null, Validators.required],
      numero: [null, Validators.required],
      entre_calles: [null, Validators.required],
      descripcion: [null, Validators.required],
      piso: [null],
      depto: [null],
      id_pol_reserva: [null, Validators.required],
      id_ciudad: [null, Validators.required],
      id_provincia: [null, Validators.required],
      precioNoche: [null, [Validators.required, Validators.min(0)]],
      codigoAcceso: ['0000', [Validators.pattern(/^\d{4}$/)]],
      banios: [
        null,
        [Validators.required],
      ],
      ambientes: [
        null,
        [Validators.required],
      ],
      huespedes: [
        null,
        [Validators.required],
      ],
      cocheras: [
        null,
        [Validators.required],
      ],
      requiere_documentacion: [false],
      id_encargado: [null],
    });

    this.form.statusChanges.subscribe(() => {
      this.formValidityChange.emit(this.form.valid);
    });   
}
    private _loadPropiedad(id: number): void {
    this.propiedadesService.get_propiedad_id(id).subscribe(
      (propiedad: Propiedad) => {
        this.form.patchValue(propiedad);

        if (propiedad.id_provincia) {
          this.onProvinciaChange(propiedad.id_provincia);
        }
      },
      (error) => {
        console.error('Error al cargar la propiedad:', error);
      }
    );
    }

    onProvinciaChange(idProvincia: number): void {
    if (idProvincia) {
      this.parametricasService
        .get_ciudades_by_provincia(idProvincia)
        .subscribe((data) => {
          this.ciudades = data;
        });
    } else {
      this.ciudades = [];
    }
  }

  private _getTiposPropiedades() {
    this.parametricasService.get_tipos_propiedad().subscribe(
      (data: TipoPropiedad[]) => {
        this.tipoPropiedades = data;
      },
      (error) => {
        console.error('Error al obtener los tipos de propiedades', error);
      }
    );
  }

  private _get_provincias() {
    this.parametricasService.get_provincias().subscribe((data) => {
      this.provincias = data;
    });
  }

  private _getPorcentajes() {
    this.parametricasService.get_porcentajes().subscribe((data) => {
      this.politicasReserva = data;
    });
  }
  private _getEmpleados() {
    this.empleadoService.getEmpleados().subscribe((data) => {
      this.empleados = data;
    });
  }
  onSubmit() {
    if (this.form.valid) {
      const propiedad: Propiedad = this.form.value;
      if (this.isEditing) {
        this.propiedadesService.updatePropiedad(propiedad).subscribe({
          next: (response) => {
            this.utilsService.showMessage({
              title: 'Propiedad actualizada',
              message: 'La propiedad se ha actualizado correctamente.',
              icon: 'success',
            });
            this.modalRef.close(response); 
          },
          error: (error) => {
            
            if (error.status === 400 && error.error) {
              const msg =
                error.error.message ||
                error.error.error ||
                error.statusText ||
                'Error desconocido';
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: msg,
              });
            } else {
              console.error('Error al editar la propiedad:', error);
            }
          },
      });
    } else {
      console.warn('El formulario no es válido');
    }
    }
  }
}