import { Documento } from './documento';

export class Reserva {
  id: number;
  id_propiedad: number;
  id_inquilino: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  cantidad_personas: number;
  id_estado: number;
  estado: string;
  fecha_reserva: Date;
  monto_pagado: number;
  monto_total: number;
  // huespedes: Array<Huesped>;
  //   fecha_cancelacion?: Date;
  documentacion: Array<Documento>;
  id_usuario_carga?: number;
  constructor(obj?: any) {
    this.id = (obj && obj.id) || null;
    this.id_propiedad = (obj && obj.id_propiedad) || null;
    this.id_inquilino = (obj && obj.id_inquilino) || null;
    this.fecha_inicio = (obj && obj.fecha_inicio) || null;
    this.fecha_fin = (obj && obj.fecha_fin) || null;
    this.cantidad_personas = (obj && obj.cantidad_personas) || null;
    this.id_estado = (obj && obj.id_estado) || null;
    this.estado = (obj && obj.estado) || null;
    this.fecha_reserva = (obj && obj.fecha_reserva) || null;
    this.monto_pagado = (obj && obj.monto_pagado) || null;
    this.monto_total = (obj && obj.monto_total) || null;
    // this.huespedes = (obj && obj.huespedes) ? [...obj.huespedes] : [];
    // this.fecha_cancelacion =
    //   obj && obj.fecha_cancelacion
    //     ? new Date(obj.fecha_cancelacion)
    //     : undefined;
    this.documentacion = obj && obj.documentacion ? [...obj.documentacion] : [];
    this.estado = (obj && obj.estado) || null;
  }

  get cantidad_noches(): number {
    if (this.fecha_inicio && this.fecha_fin) {
      const diferencia = this.fecha_fin.getTime() - this.fecha_inicio.getTime();
      return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    }
    return 0;
  }
}
