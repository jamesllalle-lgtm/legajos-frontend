import { Constante } from "../general/constante";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";


export interface LegReconocimiento {
  nLegRecCodigo: number;
  nLegRecDocumento: number;
  nValorDocumento: number;
  nLegRecTipo: number;
  nValorTipo: number;
  cLegRecInstitucion: string;
  cLegRecPais: String;
  cLegRecOtraInst: String;
  dLegRecFecha: Date;
  cFile: any;
  cLegRecArchivo: any;
  nLegRecDatCodigo: number;
  cLegRecValida: boolean;
  cLegRecEstado: boolean | null;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cLegRecInstitucionNavigation: Persona;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vDocumento: Constante;
  vTipo: Constante,
  nLegRecDatCodigoNavigation: LegDatosGenerales;
}
