import { Constante } from "../general/constante";
import { Interface } from "../general/interface";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegAdminitrativaCarga {

  nLegAdmCodigo: number;
  nLegAdmCargo: number;
  nClaseCargo: number;
  cLegAdmInstitucion: string;
  cLegAdmPais: String;
  cLegAdmOtraInst: String;
  cLegAdmDocumento: String;
  dLegAdmFechaInicio: Date;
  dLegAdmFechaFin: Date;
  cFile: any;
  cLegAdmArchivo: any;
  nLegAdmDatCodigo: number;
  cLegAdmValida: boolean | null;
  cLegAdmEstado: boolean | null;
  cUsuRegistro: string;
  dFechaRegistro: Date | null;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cLegAdmInstitucionNavigation: Persona;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vCargo: Constante;
  nLegAdmDatCodigoNavigation: LegDatosGenerales;
}
