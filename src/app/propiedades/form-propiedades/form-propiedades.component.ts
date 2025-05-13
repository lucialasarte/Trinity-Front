import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoPropiedad } from '../models/tipoPropiedad';
import { PropiedadesService } from '../services/propiedades.service';

@Component({
  selector: 'app-form-propiedades',
  templateUrl: './form-propiedades.component.html',
  styleUrls: ['./form-propiedades.component.css']
})
export class FormPropiedadesComponent {

  form!: FormGroup;
  isEditing: boolean = false;
  tipoPropiedades: Array<TipoPropiedad>=[
    { id: 1, nombre: 'Casa' },
    { id: 2, nombre: 'Departamento' },
    { id: 3, nombre: 'Cabaña' },
    { id: 4, nombre: 'Chalet' },
    { id: 5, nombre: 'Casa de Campo' },
    { id: 6, nombre: 'Loft' },
    { id: 7, nombre: 'Estudio' },
    { id: 8, nombre: 'Duplex' }
  ];
  partidos: Array<any> = [];
  provincias: Array<any> = [];
  localidades: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService
  ) {}
  ngOnInit(): void {
    this._initForm();
    //this._getTiposPropiedades();
    //this._getProvincias();
  }
  onSubmit() {}

  private _initForm() {
    this.form = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      idTipoPropiedad: [null, Validators.required],
      tipoPropiedad: [''],
      calle: [null, Validators.required],
      numero: [null, Validators.required],
      piso: [null],
      depto: [null],
      codigoPostal: [null, Validators.required],
      idLocalidad: [null, Validators.required],
      localidad: [null],
      idProvincia: [null, Validators.required],
      provincia: [null],
      precio: [null, [Validators.required, Validators.min(0)]],
      codigoAcceso: ['0000', [ Validators.pattern(/^\d{4}$/)]], 
      banios: [null, [Validators.required, Validators.min(0)]],
      ambientes: [null, [Validators.required, Validators.min(0)]],
      huespedes: [null, [Validators.required, Validators.min(0)]],
      cocheras: [null, [Validators.required, Validators.min(0)]],
    });
  }
  private _getTiposPropiedades() {
    // this.propiedadesService.getTiposPropiedades().subscribe(
    //   (response: TipoPropiedad[]) => {
    //     this.tiposPropiedades = response;
    //   },
    //   (error) => {
    //     console.error('Error al obtener los tipos de propiedades', error);
    //   }
    // );
  }
  private _getProvincias() {
    // this.propiedadesService.getProvincias().subscribe(
    //   (response: any[]) => {
    //     this.provincias = response;
    //   },
    //   (error) => {
    //     console.error('Error al obtener las provincias', error);
    //   }
    // );
  }
  private _getPartidos() {
    // this.propiedadesService.getPartidos().subscribe(
    //   (response: any[]) => {
    //     this.partidos = response;
    //   },
    //   (error) => {
    //     console.error('Error al obtener los partidos', error);
    //   }
    // );
  }
  }