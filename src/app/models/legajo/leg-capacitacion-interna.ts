import { CapacitacionesUss } from "../general/capacitaciones-uss";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegCapacitacionInterna {
  nLegCicodigo: number;
  cLegCicompetenciaMejora: string;
  nCapCodigo: number;
  nLegDatCodigo: number;
  cFile: any,
  cLegCiarchivo: any;
  bLegCiestado: boolean;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date;
  vCapacitacionUSS: CapacitacionesUss;
  vDatosGenerales: LegDatosGenerales
}
