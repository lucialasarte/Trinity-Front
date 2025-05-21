import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropiedadesService } from '../propiedades/services/propiedades.service';
import { UtilsService } from '../shared/services/utils.service';
import { ParametricasService } from '../shared/services/parametricas.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  form!: FormGroup;
  today = new Date();
  ciudades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private propiedadesService: PropiedadesService,
    private utilsService: UtilsService,
    private parametricasService: ParametricasService
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._get_ciudades();
  }

  onCheckInChange(value: Date): void {
    this.form.get('checkOut')?.updateValueAndValidity();
  }

  private _initForm() {
    this.form = this.fb.group({
      lugar: [''],
      checkIn: [null, Validators.required],
      checkOut: [null, Validators.required],
      cantidadPersonas: [
        1,
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
    });
  }
  private _get_ciudades() {
    // this.parametricasService.get_ciudades().subscribe((data) => {
    //   this.ciudades = data;
    //   console.log(this.ciudades);
    // });
  }

  
  disabledCheckInDate = (current: Date): boolean => {
    return current < this.clearTime(this.today);
  };

  
  disabledCheckOutDate = (current: Date): boolean => {
    const checkIn = this.form.get('checkIn')?.value;
    if (!checkIn) {
      return true; 
    }
    return current && current <= checkIn;
  };
 
  private clearTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  buscar(): void {
    if (this.form.invalid) {
      this.utilsService.showMessage({
        title: 'Por favor completá todos los campos obligatorios.',
      });
      return;
    }

    const { checkIn, checkOut } = this.form.value;
    if (new Date(checkOut) <= new Date(checkIn)) {
      this.utilsService.showMessage({
        title: 'La fecha de Check‑out debe ser posterior a la de Check‑in.',
      });
      return;
    }

    console.log('Búsqueda:', this.form.value);

    
  }

  
}
