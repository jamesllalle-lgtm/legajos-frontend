import { Interface } from "../general/interface";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegOrdinarizacion {
  nLegOrdCodigo: number;
  nLegOrdCargo: number;
  nLegValCargo: number;
  nLegOrdArea: number;
  nLegOrdValArea: number;
  dLegOrdFecha: Date;
  cLegOrdFichaInscripcion: any;
  cFileFichaInscripcion: any;
  cLegOrdEvaluacionCv: any;
  cFileEvaluacionCv: any;
  cLegOrdClaseModelo: any;
  cFileClaseModelo: any;
  cLegOrdEvaluacionPsico: any;
  cFileEvaluacionPsico: any;
  cLegOrdEntrevistaPers: any;
  cFileEntrevistaPers: any;
  bLegOrdEstado: boolean | null;
  nLegOrdDatCodigo: number;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  vArea: Interface;
  vCargo: Interface;
  vDatosGenerales: LegDatosGenerales;
}
