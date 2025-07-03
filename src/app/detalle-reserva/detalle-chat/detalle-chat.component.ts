import { Component, Input, SimpleChanges } from '@angular/core';
import { Chat } from './models/chat';

@Component({
  selector: 'app-detalle-chat',
  templateUrl: './detalle-chat.component.html',
  styleUrls: ['./detalle-chat.component.css'],
})
export class DetalleChatComponent {
  @Input() chat: Chat[]= [];
  @Input() id_estado: number = 1;

  @Input() esEncargado: boolean = false;
  @Input() esAdmin: boolean = false;
  @Input() esInquilino: boolean = false;

  constructor() {}

  get miRol(): number {
    if (this.esAdmin) return 1;
    if (this.esEncargado) return 2;
    if (this.esInquilino) return 3;
    return -1; // por si no se seteó ninguno
  }
  ngOnChanges(changes: SimpleChanges) {
  console.log('Cambios en inputs de DetalleChat:', changes);
}


  esMensajeDerecha(mensajeRol: number): boolean {
    return mensajeRol === this.miRol;
  }
}
