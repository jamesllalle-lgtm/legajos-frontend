import * as internal from "stream";
import { Interface } from "../general/interface";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";


export interface LegParticipacionCongSem {
  nLegParCodigo: number;
  cLegParInstitucion: string;
  cLegParPais: String;
  cLegParOtraInst: String;
  nLegParRol: number;
  nValorRol: number;
  nLegParAmbito: number;
  nValorAmbito: number;
  cLegParNombre: string;
  dLegParFecha: Date;
  dLegParFechaFin: Date; //Nuevo campo
  nLegParHoras: number; //Nuevo campo
  cLegParArchivoOrig: any; //Nuevo campo

  cFile: any;
  cLegParArchivo: any;
  nLegParDatCodigo: number;
  cLegParValida: boolean | null;
  cLegParEstado: boolean | null;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cLegParInstitucionNavigation: Persona;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vAmbito: Interface;
  nLegParDatCodigoNavigation: LegDatosGenerales;
  vRol: Interface;

}
