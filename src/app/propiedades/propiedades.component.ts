import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.css'],
})
export class PropiedadesComponent implements OnInit {
  form: FormGroup | undefined;
  propiedades: any[] = [
    {
      id: 1,
      nombre: 'Casa en la Playa',
      tipoPropiedad: 'Casa',
      localidad: 'Mar del Plata',
      provincia: 'Buenos Aires',
      precio: 5000,
      disponible: true,
    },
    {
      id: 2,
      nombre: 'Departamento Centro',
      tipoPropiedad: 'Departamento',
      localidad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      precio: 3000,
      disponible: false,
    },
    {
      id: 3,
      nombre: 'Cabaña de Montaña',
      tipoPropiedad: 'Cabaña',
      localidad: 'Cordoba',
      provincia: 'Cordoba',
      precio: 4000,
      disponible: true,
    },
  ];
  tiposPropiedades: any[] = [
    { id: 1, nombre: 'Casa' },
    { id: 2, nombre: 'Departamento' },
    { id: 3, nombre: 'Cabaña' },
    { id: 4, nombre: 'Chalet' },
  ];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this._initForm();
  }

  eliminar(id: number) {}
  verPropiedad(id: number) {}

  onSubmit() {}

  private _initForm() {
    this.form = this.fb.group({
      nombre: [null],
      descripcion: [null],
      precio: [null],
      direccion: [null],
      ciudad: [null],
      provincia: [null],
      pais: [null],
      codigoPostal: [null],
      tipoPropiedad: [null],
      habitaciones: [null],
      estadoPropiedad: [null],
    });
  }
}
