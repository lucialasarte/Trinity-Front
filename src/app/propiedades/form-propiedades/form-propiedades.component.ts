import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoPropiedad } from '../models/tipoPropiedad';
import { PropiedadesService } from '../services/propiedades.service';
import { ParametricasService } from 'src/app/shared/services/parametricas.service';
import { EmpleadosService } from 'src/app/empleados/services/empleados.service';

@Component({
  selector: 'app-form-propiedades',
  templateUrl: './form-propiedades.component.html',
  styleUrls: ['./form-propiedades.component.css'],
})
export class FormPropiedadesComponent {
  @Output() formValidityChange = new EventEmitter<boolean>();
  form!: FormGroup;
  isEditing: boolean = false;
  tipoPropiedades: Array<TipoPropiedad> = [];
  politicasReserva: Array<any> = [];

  provincias: Array<any> = [];
  ciudades: Array<any> = [];
  empleados: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private parametricasService: ParametricasService,
    private empleadoService: EmpleadosService
    
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getTiposPropiedades();
    this._get_provincias();
    this._getPorcentajes();
    this._getEmpleados();
  }

  private _initForm() {
    this.form = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      id_tipo: [null, Validators.required],
      tipo: [null],
      calle: [null, Validators.required],
      numero: [null, Validators.required],
      entre_calles: [null,Validators.required],
      descripcion: [null, Validators.required],
      piso: [null],
      depto: [null],
      id_pol_reserva: [null, Validators.required],
      id_ciudad: [null, Validators.required],
      id_provincia: [null, Validators.required],
      precioNoche: [null, [Validators.required, Validators.min(0)]],
      codigoAcceso: ['0000', [Validators.pattern(/^\d{4}$/)]],
      banios: [null, [Validators.required, Validators.min(0)]],
      ambientes: [null, [Validators.required, Validators.min(0)]],
      huespedes: [null, [Validators.required, Validators.min(0)]],
      cocheras: [null, [Validators.required, Validators.min(0)]],
      requiere_documentacion: [false],
      id_encargado: [null],
    });

    this.form.statusChanges.subscribe(() => {
      this.formValidityChange.emit(this.form.valid);
    });
  }

  onProvinciaChange(idProvincia: number): void {
    if (idProvincia) {
      this.parametricasService
        .get_ciudades_by_provincia(idProvincia)
        .subscribe((data) => {
          this.ciudades = data;
          this.form.patchValue({ id_ciudad: null });
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
      console.log(this.provincias);
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
      console.log(this.empleados);
    });
  }
}
