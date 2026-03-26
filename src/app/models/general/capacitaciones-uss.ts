import { LegCapacitacionInterna } from "../legajo/leg-capacitacion-interna";

export interface CapacitacionesUss {
  nCapCodigo: number;
  cCapTema: string;
  dCapFechaInicio: Date;
  dCapFechaFin: Date;
  nCapHoras: number;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date;
  legCapacitacionInternas: LegCapacitacionInterna[];
}
