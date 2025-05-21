import { MarcaTarjeta } from "./marca-tarjeta";
import { TipoTarjeta } from "./tipo-tarjeta";

export interface Tarjeta {
  id: number;
  numero: string;
  nombre_titular: string;
  fecha_inicio?: Date;
  fecha_vencimiento: Date;
  cvv: string;
  usuario_id: number;
  anverso_url?: string;
  reverso_url?: string;
  marca?: MarcaTarjeta;
  tipo?: TipoTarjeta;
}
