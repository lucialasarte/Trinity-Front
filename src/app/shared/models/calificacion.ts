export class Calificacion {
    personal: number;  
    instalaciones_servicios: number;    
    limpieza: number;  
    confort: number;  
    precio_calidad: number;  
    ubicacion: number;  

    constructor(obj?: any) {
        this.personal = (obj && obj.personal) || null;
        this.instalaciones_servicios = (obj && obj.instalaciones_servicios) || null;
        this.limpieza = (obj && obj.limpieza) || null;
        this.confort = (obj && obj.confort) || null;
        this.precio_calidad = (obj && obj.precio_calidad) || null;
        this.ubicacion = (obj && obj.ubicacion) || null;
    }
}