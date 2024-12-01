import { TipoDocumento } from "./tipo-documento";

export interface Dentista {
    id: number;
    ncolegiatura: string;
    estado: boolean;
    especializacion: string;
    usuarioId: number;
    nombres: string;
    correo: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: TipoDocumento;
    numeroIdentidad: string;
    sexo: string;
    telefono: string;
    fechaNacimiento: string;
}
