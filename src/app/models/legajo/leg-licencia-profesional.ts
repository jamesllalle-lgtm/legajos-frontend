import { Interface } from "../general/interface";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegLicenciaProfesional {
    nLegLicCodigo: number;
    nLegLicPais: number;
    nClasePais: number;
    cLegLicInstitucion: string;
    cLegLicOtraInst: String;
    cLegLicNroRegistro: String;
    nLegLicCondicion: number;
    nClaseCondicion: number;
    dLegLicFechaEmision: Date;
    dLegLicFechaExpiracion: Date;
    nLegLicDatCodigo: number;
    cLegLicValida: boolean | null;
    cLegLicEstado: boolean | null;
    cUsuRegistro: string;
    dFechaRegistro: Date;
    cUsuModifica: string;
    dFechaModifica: Date | null;
    cLegLicInstitucionNavigation: Persona;
    cUsuModificaNavigation: PerUsuario;
    cUsuRegistroNavigation: PerUsuario;
    
    nLegLicDatCodigoNavigation: LegDatosGenerales;
    vPais: Interface;
    vCondicion: Interface;
}
