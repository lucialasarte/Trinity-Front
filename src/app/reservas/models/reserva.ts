import { Documento } from "./documento";

export class Reserva {
    id: number;
    id_propiedad: number;
    id_usuario: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    cantidad_personas: number;
    id_estado: number;
    estado: string;
    fecha_reserva: Date;
    monto_pagado: number;
    monto_total: number;
    // huespedes: Array<Huesped>;
    fecha_cancelacion?: Date;
    documentacion:Array<Documento>;

    constructor(obj?: any){
        this.id = obj && obj.id || null;
        this.id_propiedad = obj && obj.id_propiedad || null;
        this.id_usuario = obj && obj.id_usuario || null;
        this.fecha_inicio = obj && obj.fecha_inicio || null;
        this.fecha_fin = obj && obj.fecha_fin || null;
        this.cantidad_personas = obj && obj.cantidad_personas || null;
        this.id_estado = obj && obj.id_estado || null;
        this.estado = obj && obj.estado || null;
        this.fecha_reserva = obj && obj.fecha_reserva || null;
        this.monto_pagado = obj && obj.monto_pagado || null;
        this.monto_total = obj && obj.monto_total || null;
        // this.huespedes = (obj && obj.huespedes) ? [...obj.huespedes] : [];
        this.fecha_cancelacion = (obj && obj.fecha_cancelacion) ? new Date(obj.fecha_cancelacion) : undefined;
        this.documentacion = (obj && obj.documentacion) ? [...obj.documentacion] : [];
    }

}