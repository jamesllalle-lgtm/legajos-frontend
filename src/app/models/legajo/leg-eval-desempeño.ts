
import { Constante } from "../general/constante";
import { Interface } from "../general/interface";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegEvaluacionDesemp {
  nLegEvalCodigo: number;
  nLegEvalCargo: number;
  nLegValCargo: number;
  nLegEvalArea: number;
  nLegValArea: number;
  cLegEvalSemestre: string;
  cLegEvalAnio: string;
  nLegEvalPuntaje: number;
  nLegEvalNivel: number;
  nLegValNivel: number;
  cLegEvalArchivo: any;
  cFile: any;
  bLegEvalEstado: boolean | null;
  nLegEvalDatCodigo: number;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  vArea: Interface;
  vCargo: Interface;
  vNivel: Constante;
  vDatosGenerales: LegDatosGenerales;
}
