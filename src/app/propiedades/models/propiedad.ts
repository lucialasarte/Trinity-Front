export class Propiedad {
  id: number;
  nombre: string;
  descripcion: string;
  entre_calles : string;
  id_tipo: number;
  tipo: string;
  calle: string;
  numero: number;
  piso: number | null;
  depto: string | null;
  id_ciudad: number;
  ciudad: string | null;
  id_provincia: number;
  provincia: string | null;
  precioNoche: number;
  codigoAcceso: string;
  banios: number;
  ambientes: number;
  huespedes: number;
  cocheras: number;
  id_pol_reserva: number;
  pol_reserva: string;
  is_habilitada: boolean;
  requiere_documentacion: boolean;
  id_encargado: number;
  id_imagenes: [number];
  delete_at: Date | null;
  fotoPerfil: any;

  constructor(obj?: any) {
    this.id = obj && obj.id || null;
    this.nombre = obj && obj.nombre || '';
    this.id_tipo = obj &&  obj.id_tipo || null;
    this.tipo = obj &&  obj.tipo || '';
    this.calle = obj && obj.calle || '';
    this.numero = obj && obj.numero || null;
    this.piso = obj && obj.piso || null;
    this.depto = obj && obj.depto || null;
    this.id_ciudad = obj && obj.id_ciudad || null;
    this.id_provincia = obj && obj.id_provincia || null;
    this.provincia = obj && obj.provincia || null;
    this.precioNoche = obj && obj.precio || null;
    this.codigoAcceso = obj && obj.codigoAcceso || '0000';
    this.banios = obj && obj.banios || '0';
    this.ambientes = obj && obj.ambientes || '0';
    this.huespedes = obj && obj.huespedes || '0';
    this.cocheras = obj && obj.cocheras || '0';
    this.id_pol_reserva = obj && obj.id_pol_reserva || null;
    this.descripcion = obj && obj.descripcion || null;
    this.entre_calles = obj && obj.entre_calles || null;
    this.ciudad = obj && obj.ciudad || null;
    this.is_habilitada = obj && obj.is_habilitada || false;
    this.requiere_documentacion = obj && obj.requiere_documentacion || false;
    this.id_encargado = obj && obj.id_encargado || null;
    this.pol_reserva = obj && obj.pol_reserva || null;
    this.id_imagenes = obj && obj.id_imagenes || [];
    this.delete_at = obj && obj.delete_at || null;
    this.fotoPerfil = obj && obj.fotoPerfil || null;
  }	

}