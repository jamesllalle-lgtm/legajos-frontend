
import { Interface } from "../general/interface";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegSeleccion {
  nLegSelCodigo: number;
  nLegSelCargo: number;
  nLegValCargo: number;
  nLegSelArea: number;
  nLegValArea: number;
  dLegSelFecha: Date;
  cLegSelEvaluacionCv: any;
  cFileEvaluacionCv: any;
  cLegSelClaseModelo: any;
  cFileClaseModelo: any;
  cLegSelEvaluacionPsico: any;
  cFileEvaluacionPsico: any;
  cLegSelEntrevistaPers: any;
  cFileEntrevistaPers: any;
  bLegSelEstado: boolean | null;
  nLegSelDatCodigo: number;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  vArea: Interface;
  vCargo: Interface;
  vDatosGenerales: LegDatosGenerales;
}
