import { Constante } from "../general/constante";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegResolucion {
  nLegResCodigo: number;
  nLegResTipo: number;
  nLegValTipo: number;
  dLegResFecha: Date;
  cLegResResuelve: string;
  cLegResNroResolucion: string;
  cLegResArchivo: any;
  cFile: any;
  bLegResEstado: boolean;
  nLegResDatCodigo: number;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  vResolucion: Constante;
  vDatosGenerales: LegDatosGenerales;
}
