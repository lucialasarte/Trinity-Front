import { MarcaTarjeta } from "./marca-tarjeta";
import { TipoTarjeta } from "./tipo-tarjeta";

export class Tarjeta {
  id: number;
  numero: number;
  nombre_titular: string;
  fecha_inicio?: string;
  fecha_vencimiento: string;
  cvv: number;
  usuario_id: number;
  marca?: MarcaTarjeta;
  tipo?: TipoTarjeta;

  constructor(obj?: any) {
    this.id = obj && obj.id || 0;
    this.numero = obj && obj.numero || 0;
    this.nombre_titular = obj && obj.nombre_titular || '';
    this.fecha_inicio = obj && obj.fecha_inicio || null;
    this.fecha_vencimiento = obj && obj.fecha_vencimiento || '';
    this.cvv = obj && obj.cvv || 0;
    this.usuario_id = obj && obj.usuario_id || 0;
    this.marca = obj && obj.marca || null;
    this.tipo = obj && obj.tipo || null;
  }
}
