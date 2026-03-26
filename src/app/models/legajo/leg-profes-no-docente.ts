import { Constante } from "../general/constante";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";


export interface LegProfesNoDocente {
  nLegProCodigo: number;
  cLegProInstitucion: string;
  cLegProPais: string; // 🔹 Sugerencia: usar string en minúscula
  cLegProOtraInst: string; // 🔹 Sugerencia: usar string en minúscula
  nLegProCargo: number;
  nValorCargo: number;
  cLegProCargoProf: string;

  // 🔹 AGREGA ESTA LÍNEA AQUÍ:
  cLegDescCargo: string; 

  dLegProFechaInicio: Date;
  dLegProFechaFin: Date;
  cFile: any;
  cLegProArchivo: any;
  nLegProDatCodigo: number;
  cLegProValida: boolean | null;
  cLegProEstado: boolean;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cLegProInstitucionNavigation: Persona;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vCargo: Constante;
  nLegProDatCodigoNavigation: LegDatosGenerales;
}
