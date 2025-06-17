export class Chat {
  rol: number; // 1: Admin, 2: Encargado, 3: Inquilino
  mensaje: string;
  fecha: Date;
  nombre: string;

  constructor(obj?: any) {
    this.rol = (obj && obj.rol) || 0;
    this.mensaje = (obj && obj.mensaje) || '';
    this.fecha = obj && obj.fecha ? new Date(obj.fecha) : new Date();
    this.nombre = (obj && obj.nombre) || '';
  }
}

export class ChatResponse {
  id: number;
  mensajes: Chat[];
  constructor(obj?: any) {
    this.id = (obj && obj.id) || 0;
    this.mensajes =
      obj && obj.mensajes
        ? obj.mensajes.map((item: any) => new Chat(item))
        : [];
  }
}
