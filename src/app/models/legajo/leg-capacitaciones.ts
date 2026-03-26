import { Constante } from "../general/constante";
import { Interface } from "../general/interface";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegCapacitaciones {
  nLegCapCodigo: number;
  nLegCapTipo: number;
  nLegCapTipoEsp: number;
  cLegCapNombre: string;
  nLegCapHoras: number;
  dLegCapFechaInicio: Date;
  dLegCapFechaFin: Date;
  cFile: any;
  cLegCapArchivo: any;
  cLegCapInstitucion: string;
  cLegCapPais: String;
  cLegCapOtraInst: String;
  nLegCapDatCodigo: number;
  cLegCapValida: boolean | null;
  cLegCapEstado: boolean | null;
  nValorTipo: number;
  nValorTipoEsp: number;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vTipo: Constante;
  nLegCapDatCodigoNavigation: LegDatosGenerales;
  vInstitucion: Persona;
  vTipoEsp: Constante;
}
