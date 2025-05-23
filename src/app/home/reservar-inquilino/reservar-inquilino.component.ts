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
  @Input() checkin!: Date;
  @Input() checkout!: Date;
  @Input() huespedes!: number;
  @Input() precioTotal!: number;
  constructor() {}

  ngOnInit(): void {}

  
}
