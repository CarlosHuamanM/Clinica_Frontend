import { TipoDocumento } from "./tipo-documento";

export interface Usuario {
    id: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;

    numeroIdentidad: string;
    sexo: string;
    fechaNacimiento: string;
    correo: string;
    imagenPerfil: string;
    estado: boolean;
    rol: string;
    tipoDocumento: TipoDocumento;

    fechaCreacion: string;
    fechaModificacion: string;
}
