import { TipoReporte } from "./tipo-reporte";
import { Usuario } from "./usuario";

export interface DataReport {
    id: number;
    usuario: Usuario;
    tipoReporte: TipoReporte;
    fechaCreacion: string;
    fechaModificacion: string;
}
