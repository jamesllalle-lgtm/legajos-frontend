import { Constante } from "../general/constante";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";


export interface LegRegimenDedicacion {
  nLegRegCodigo: number;
  cLegCatInstitucion: string;
  cLegRegPais: String;
  cLegRegOtraInst: String;
  nLegRegDedicacion: number;
  nValorDedicacion: number;
  dLegRegFechaInicio: Date;
  dLegRegFechaFin: Date;
  cFile: any;
  cLegRegArchivo: any;
  nLegRegDatCodigo: number;
  cLegRegValida: boolean | null;
  cLegRegEstado: boolean;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cLegCatInstitucionNavigation: Persona;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vDedicacion: Constante;
  nLegRegDatCodigoNavigation: LegDatosGenerales;
}
