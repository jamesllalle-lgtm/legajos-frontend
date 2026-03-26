import { Constante } from "../general/constante";
import { Interface } from "../general/interface";
import { PerUsuario } from "../general/per-usuario";
import { LegDatosGenerales } from "./leg-datos-generales";


export interface LegInvestigador {
  nLegInvCodigo: number;
  nLegInvCentroRegistro: number;
  nValorCentroRegistro: number;
  // Variables para el Nivel de Renacyt - EBS 12/2025
  nLegInvNivelRenacyt: number;
  nValorNivelRenacyt: number;
  // Variables para el Nivel de Renacyt - EBS 12/2025
  cLegInvNroRegistro: string;
  dLegInvFechaInicio: Date;
  dLegInvFechaFin: Date;
  cFile: any;
  cLegInvArchivo: any;
  nLegInvDatCodigo: number;
  cLegInvValida: boolean | null;
  cLegInvEstado: boolean | null;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vCentroRegistro: Interface;
  vNivelRenacyt: Interface; // Listado de Niveles de Renacyt
  nLegInvDatCodigoNavigation: LegDatosGenerales;
}
