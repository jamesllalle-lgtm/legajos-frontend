import { Constante } from "../general/constante";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegDocumentacionInterna {
  nLegDicodigo: number;
  cLegDiarchivo: any;
  cFile: any;
  nLegDitipoDoc: number;
  nLegValTipoDoc: number;
  cLegDicodigo: string;
  cLegDidescripcion: string;
  bLegDiestado: boolean | null;
  nLegDidatCodigo: number;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  vTipo: Constante;
  vDatosGenerales: LegDatosGenerales;
}
