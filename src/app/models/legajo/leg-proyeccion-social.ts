import { Constante } from "../general/constante";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";


export interface LegProyeccionSocial {
  nLegProyCodigo: number;
  cLegProyInstitucion: string;
  cLegProyPais: String;
  cLegProyOtraInst: String;
  nLegProyTipo: number;
  nValorTipo: number;
  cLegProyDescripcion: string;
  dLegProyFechaInicio: Date;
  dLegProyFechaFin: Date;
  cFile: any;
  cLegProyArchivo: any;
  nLegProyDatCodigo: number;
  cLegProyValida: boolean | null;
  cLegProyEstado: boolean | null;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cLegProyInstitucionNavigation: Persona;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vTipo: Constante;
  nLegProyDatCodigoNavigation: LegDatosGenerales;
}
