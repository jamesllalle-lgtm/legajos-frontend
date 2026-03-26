import { Constante } from "../general/constante";
import { Interface } from "../general/interface";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegContrato {
  nLegConCodigo: number;
  nLegConCargo: number ;
  nLegValCargo: number ;
  nLegConArea: number ;
  nLegValArea: number ;
  dLegConFechaInicio: Date;
  dLegConFechaFin: Date;
  nLegConSueldo: number;
  cLegConArchivo: any;
  cFile: any;
  bLegConEstado: boolean | null;
  nLegConDatCodigo: number;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  vArea: Interface;
  vCargo: Interface;
  vDatosGenerales: LegDatosGenerales;
}
