import { Interface } from "../general/interface";
import { PerUsuario } from "../general/per-usuario";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegProduccionCiencia {
  nLegProdCodigo: number;
  nLegProdTipo: number;
  nValorTipo: number;
  cLegProdTitulo: string;
  dLegProdFecha: Date;
  cLegProdNroResolucion: string;
  cFile: any;
  cLegProdArchivo: any;
  nLegProdDatCodigo: number;
  cLegProdValida: boolean | null;
  cLegProdEstado: boolean | null;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vTipo: Interface;
  nLegProdDatCodigoNavigation: LegDatosGenerales;
  nLegProdPais: number;
  vPais: Interface;
  nLegProdParticipacion: number;
}
