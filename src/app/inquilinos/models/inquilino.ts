export class Inquilino {
  id: number;
  nombre: string;
  correo: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  is_bloqueado: boolean;
  calificacion?: number;

  constructor(obj?: any) {
    this.id = (obj && obj.id) || 0;
    this.nombre = (obj && obj.nombre) || '';
    this.correo = (obj && obj.correo) || '';
    this.tipoIdentificacion = (obj && obj.tipoIdentificacion) || '';
    this.numeroIdentificacion = (obj && obj.numeroIdentificacion) || '';
    this.calificacion = (obj && obj.calificacion) || 0;
    this.is_bloqueado = (obj && obj.is_bloqueado) || false;
  }
}
