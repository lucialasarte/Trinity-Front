export class Propiedad {
  id: number;
  nombre: string;
  idTipoPropiedad: number;
  tipoPropiedad: string;
  calle: string;
  numero: number;
  piso: number | null;
  depto: string | null;
  codigoPostal: string;
  idLocalidad: number;
  localidad: string | null;
  idProvincia: number;
  provincia: string | null;
  precio: number;
  codigoAcceso: string;
  banios: number;
  ambientes: number;
  huespedes: number;
  cocheras: number;

  constructor(obj?: any) {
    this.id = obj && obj.id || null;
    this.nombre = obj && obj.nombre || '';
    this.idTipoPropiedad = obj &&  obj.idTipoPropiedad || null;
    this.tipoPropiedad = obj &&  obj.tipoPropiedad || '';
    this.calle = obj && obj.calle || '';
    this.numero = obj && obj.numero || null;
    this.piso = obj && obj.piso || null;
    this.depto = obj && obj.depto || null;
    this.codigoPostal = obj && obj.codigoPostal || '';
    this.idLocalidad = obj && obj.idLocalidad || null;
    this.localidad = obj && obj.localidad || null;
    this.idProvincia = obj && obj.idProvincia || null;
    this.provincia = obj && obj.provincia || null;
    this.precio = obj && obj.precio || null;
    this.codigoAcceso = obj && obj.codigoAcceso || '0000';
    this.banios = obj && obj.banios || null;
    this.ambientes = obj && obj.ambientes || null;
    this.huespedes = obj && obj.huespedes || null;
    this.cocheras = obj && obj.cocheras || null;
  }	

}