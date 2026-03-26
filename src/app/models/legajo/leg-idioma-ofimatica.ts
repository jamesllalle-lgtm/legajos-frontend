import { Constante } from "../general/constante";
import { PerUsuario } from "../general/per-usuario";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegIdiomaOfimatica {
  nLegIdOfCodigo: number;
  nLegIdOfCodigoDesc: number;
  nValorDesc: number;
  cLegIdOfTipo: boolean;
  nLegIdOfNivel: number;
  nValorNivel: number;
  dLegIdOfFecha: Date;
  cFile: any;
  cLegIdOfArchivo: any;
  nLegIdOfDatCodigo: number;
  cLegIdOfValida: boolean | null;
  cLegIdOfEstado: boolean | null;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vCodigoDesc: Constante;
  nLegIdOfDatCodigoNavigation: LegDatosGenerales;
  vNivel: Constante;
}
