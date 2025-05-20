export class Calificacion {
    personal: number;  
    instalaciones: number;  
    servicios: number;  
    limpieza: number;  
    confort: number;  
    precioCalidad: number;  
    ubicacion: number;  

    constructor(obj?: any) {
        this.personal = (obj && obj.personal) || null;
        this.instalaciones = (obj && obj.instalaciones) || null;
        this.servicios = (obj && obj.servicios) || null;
        this.limpieza = (obj && obj.limpieza) || null;
        this.confort = (obj && obj.confort) || null;
        this.precioCalidad = (obj && obj.precioCalidad) || null;
        this.ubicacion = (obj && obj.ubicacion) || null;
    }
}