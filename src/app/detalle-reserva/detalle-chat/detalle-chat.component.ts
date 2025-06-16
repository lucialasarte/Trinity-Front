import { Component, Input } from '@angular/core';
import { Chat } from './models/chat';

@Component({
  selector: 'app-detalle-chat',
  templateUrl: './detalle-chat.component.html',
  styleUrls: ['./detalle-chat.component.css'],
})
export class DetalleChatComponent {
  // @Input() chat: Array<Chat> = [];
  chat = [
    {
      nombre: 'Juan Pérez',
      rol: 3, // Inquilino
      mensaje: 'Hola, ¿cómo están?',
      fecha: new Date('2025-06-15T10:00:00'),
    },
    {
      nombre: 'Ana Gómez',
      rol: 1, // Administrador
      mensaje: 'Hola Juan, ¿todo bien?',
      fecha: new Date('2025-06-15T10:01:00'),
    },
    {
      nombre: 'Luis Encargado',
      rol: 2, // Encargado
      mensaje: '¡Buen día a todos!',
      fecha: new Date('2025-06-15T10:02:00'),
    },
    {
      nombre: 'Juan Pérez',
      rol: 3,
      mensaje: 'Sí, solo quería avisar que la luz del pasillo está apagada.',
      fecha: new Date('2025-06-15T10:03:00'),
    },
    {
      nombre: 'Luis Encargado',
      rol: 2,
      mensaje: 'Gracias por avisar, lo reviso enseguida.',
      fecha: new Date('2025-06-15T10:04:00'),
    },
    {
      nombre: 'Ana Gómez',
      rol: 1,
      mensaje: 'Genial, ¡gracias Luis!',
      fecha: new Date('2025-06-15T10:05:00'),
    },
  ];

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

  esMensajeDerecha(mensajeRol: number): boolean {
    return mensajeRol === this.miRol;
  }
}
