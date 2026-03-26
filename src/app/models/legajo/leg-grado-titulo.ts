import { Interface } from "../general/interface";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegGradoTitulo {
    nLegGraCodigo: number;
    nLegGraGradoAcad: number;
    nClaseGradoAcad: number;
    cLegGraInstitucion: string;
    cLegGraOtraInst: String;
    cLegGraCarreraProf: string;
    nLegGraPais: number;
    nClasePais: number;
    nLegGraUbigeo: number;
    nClaseUbigeo: number;
    dLegGraFecha: Date;
    cFile: any;
    cLegGraArchivo: any;
    nLegGraDatCodigo: number;
    cLegGraValida: boolean | null;
    cLegGraEstado: boolean | null;
    cUsuRegistro: string;
    dFechaRegistro: Date;
    cUsuModifica: string;
    dFechaModifica: Date | null;
    cLegGraInstitucionNavigation: Persona;
    cUsuModificaNavigation: PerUsuario;
    cUsuRegistroNavigation: PerUsuario;
    vGradoAcad: Interface;
    vUbigeo: Interface;
    nLegGraDatCodigoNavigation: LegDatosGenerales;
    vPais: Interface;
}