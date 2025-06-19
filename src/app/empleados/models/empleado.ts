export class Empleado {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  rol: string;

  constructor(obj?: any) {
    this.id = (obj && obj.id) || 0;
    this.nombre = (obj && obj.nombre) || '';
    this.apellido = (obj && obj.apellido) || '';
    this.correo = (obj && obj.correo) || '';
    this.tipoIdentificacion = (obj && obj.tipoIdentificacion) || '';
    this.numeroIdentificacion = (obj && obj.numeroIdentificacion) || '';
    this.rol = (obj && obj.rol) || '    ';
  }
}