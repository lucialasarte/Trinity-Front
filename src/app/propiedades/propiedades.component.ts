import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { PropiedadesService } from './services/propiedades.service';
import { Propiedad } from './models/propiedad';
import { FormPropiedadesComponent } from './form-propiedades/form-propiedades.component';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.css'],
})
export class PropiedadesComponent implements OnInit {
  @ViewChild(FormPropiedadesComponent)
  formPropiedad!: FormPropiedadesComponent;
  form: FormGroup | undefined;
  // propiedades: any[] = [
  //   {
  //     id: 1,
  //     nombre: 'Casa en la Playa',
  //     tipoPropiedad: 'Casa',
  //     localidad: 'Mar del Plata',
  //     provincia: 'Buenos Aires',
  //     precio: 5000,
  //     disponible: true,
  //   },
  //   {
  //     id: 2,
  //     nombre: 'Departamento Centro',
  //     tipoPropiedad: 'Departamento',
  //     localidad: 'Buenos Aires',
  //     provincia: 'Buenos Aires',
  //     precio: 3000,
  //     disponible: false,
  //   },
  //   {
  //     id: 3,
  //     nombre: 'Cabaña de Montaña',
  //     tipoPropiedad: 'Cabaña',
  //     localidad: 'Cordoba',
  //     provincia: 'Cordoba',
  //     precio: 4000,
  //     disponible: true,
  //   },
  // ];
  // tiposPropiedades: any[] = [
  //   { id: 1, nombre: 'Casa' },
  //   { id: 2, nombre: 'Departamento' },
  //   { id: 3, nombre: 'Cabaña' },
  //   { id: 4, nombre: 'Chalet' },
  // ];

  propiedades: any[] = [];

  isVisible = false;

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService
  ) {}

  ngOnInit(): void {
    this._getPropiedades();
  }

  onSubmitPropiedad() {
    console.log(this.formPropiedad.form);
    if (this.formPropiedad.form.valid) {
      const form = this.formPropiedad.form.getRawValue();
      let propiedad = new Propiedad(form);
      console.log(propiedad);
      this.propiedadesService.createPropiedad(propiedad).subscribe((data) => {
        console.log(data);
        this._getPropiedades();
      });
    } else {
      console.log('Formulario inválido');
    }
  }
  showModal() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
    this.formPropiedad.form.reset();
  }

  eliminar(id: number) {}
  verPropiedad(id: number) {}

  onSubmit() {}

  private _getPropiedades() {
    this.propiedadesService.getPropiedades().subscribe((data) => {
      this.propiedades = data;
      console.log(this.propiedades);
    });
  }
}
