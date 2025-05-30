import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Propiedad } from 'src/app/propiedades/models/propiedad';

@Component({
  selector: 'app-reservar-inquilino',
  templateUrl: './reservar-inquilino.component.html',
  styleUrls: ['./reservar-inquilino.component.css'],
})
export class ReservarInquilinoComponent implements OnInit {
  @Input() propiedad: Propiedad = new Propiedad();
  @Input() checkin: Date | null = null;
  @Input() checkout: Date | null = null;
  @Input() huespedes!: number;
  @Input() precioTotal!: number;
  imagenActualIndex = 0;

  imagenes: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.imagenes = this.propiedad.id_imagenes.map(
      (imagen) => `http://localhost:5000/propiedades/imagen/${imagen}`
    );
    
  }
  get imagenActual(): string {
    return this.imagenes[this.imagenActualIndex];
  }
  
  siguienteImagen(): void {
    if (this.imagenActualIndex < this.imagenes.length - 1) {
      this.imagenActualIndex++;
    }
  }
  
  anteriorImagen(): void {
    if (this.imagenActualIndex > 0) {
      this.imagenActualIndex--;
    }
  }
}
