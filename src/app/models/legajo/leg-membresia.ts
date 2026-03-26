import { Interface } from "../general/interface";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegMembresia {
    nLegMemCodigo: number;
    nLegMemPais: number;
    nClasePais: number;
    cLegMemInstitucion: string;
    cLegMemOtraInst: String;
    cLegMemNroRegistro: String;
    dLegMemFechaEmision: Date;
    dLegMemFechaExpiracion: Date;
    nLegMemDatCodigo: number;
    cLegMemValida: boolean | null;
    cLegMemEstado: boolean | null;
    cUsuRegistro: string;
    dFechaRegistro: Date;
    cUsuModifica: string;
    dFechaModifica: Date | null;
    cLegMemInstitucionNavigation: Persona;
    cUsuModificaNavigation: PerUsuario;
    cUsuRegistroNavigation: PerUsuario;
    
    nLegMemDatCodigoNavigation: LegDatosGenerales;
    vPais: Interface;
}
