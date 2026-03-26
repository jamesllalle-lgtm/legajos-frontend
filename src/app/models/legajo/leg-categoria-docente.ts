import { Constante } from "../general/constante";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegCategoriaDocente {
  nLegCatCodigo: number;
  cLegCatInstitucion: string;
  cLegCatPais: String;
  cLegCatOtraInst: String;
  nLegCatCategoria: number;
  nValorCategoria: number;
  dLegCatFechaInicio: Date;
  dLegCatFechaFin: Date;
  cFile: any;
  cLegCatArchivo: any;
  nLegCatDatCodigo: number;
  cLegCatValida: boolean | null;
  cLegCatEstado: boolean | null;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cLegCatInstitucionNavigation: Persona;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vCategoria: Constante;
  nLegCatDatCodigoNavigation: LegDatosGenerales;
}
