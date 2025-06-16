export class Chat{
    rol:number; // 1: Admin, 2: Encargado, 3: Inquilino
    mensaje: string;
    fecha: Date;
    nombre: string;
    
    constructor(obj?: any) {
        this.rol = (obj && obj.rol) || 0; 
        this.mensaje = (obj && obj.mensaje) || '';
        this.fecha = (obj && obj.fecha) ? new Date(obj.fecha) : new Date();
        this.nombre = (obj && obj.nombre) || '';
    }
}