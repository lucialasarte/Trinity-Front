import { Pais } from './pais';
import { Rol } from './rol';
import { Tarjeta } from './tarjeta';
import { TipoIdentificacion } from './tipo-identificacion';
import { PermisosUsuario } from './permisos-usuario';

export class Usuario {
  id: number;
  nombre: string;
  correo: string;
  password_hash?: string;
  tipo_identificacion?: TipoIdentificacion;
  numero_identificacion?: string;
  apellido?: string;
  fecha_nacimiento?: string | Date;
  pais?: Pais;
  roles: Rol[];
  tarjetas: Tarjeta[];
  permisos?: PermisosUsuario;
  id_imagenes?: number[];

  constructor(obj?: any) {
    this.id = obj && obj.id || 0;
    this.nombre = obj && obj.nombre || '';
    this.correo = obj && obj.correo || '';
    this.password_hash = obj && obj.password_hash || '';
    this.tipo_identificacion = obj && obj.tipo_identificacion || null;
    this.numero_identificacion = obj && obj.numero_identificacion || '';
    this.apellido = obj && obj.apellido || '';
    this.fecha_nacimiento = obj && obj.fecha_nacimiento || null;
    this.pais = obj && obj.pais || null;
    this.roles = obj && obj.roles || [];
    this.tarjetas = obj && obj.tarjetas || [];
    this.permisos = obj && obj.permisos || null;
    this.id_imagenes = obj && obj.id_imagenes || [];
  }
}
