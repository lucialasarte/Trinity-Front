

export class Tarjeta {
  id: number;
  numero: number;
  nombre_titular: string;
  fecha_vencimiento: string;
  cvv: number;

  constructor(obj?: any) {
    this.id = obj && obj.id || 0;
    this.numero = obj && obj.numero || 0;
    this.nombre_titular = obj && obj.nombre_titular || '';
    this.fecha_vencimiento = obj && obj.fecha_vencimiento || '';
    this.cvv = obj && obj.cvv || 0;
  }
}
