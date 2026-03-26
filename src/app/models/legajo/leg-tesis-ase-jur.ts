import { Constante } from "../general/constante";
import { Interface } from "../general/interface";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegTesisAseJur {
  nLegTesCodigo: number;
  nLegTesTipo: number;
  nValorTipo: number;
  nLegTesNivel: number;
  nValorNivel: number;
  dLegTesFecha: Date;
  cLegTesNroResolucion: string;
  cFile: any;
  cLegTesArchivo: any;
  nLegTesDatCodigo: number;
  cLegTesValida: boolean | null;
  cLegTesEstado: boolean | null;
  cUsuRegistro: string;
  dFechaRegistro: Date;
  cUsuModifica: string;
  dFechaModifica: Date | null;
  cUsuModificaNavigation: PerUsuario;
  cUsuRegistroNavigation: PerUsuario;
  vNivel: Constante;
  nLegTesDatCodigoNavigation: LegDatosGenerales;
  vTipo: Interface;

  // Nuevos campos para obtener el Pais, Insitucion (lugar) de la actividad - EBS 01/2026
  nLegTesPais: number;
  nClasePais: number;
  cLegTesInstitucion: string;
  cLegTesOtraInst: string;
  vPais: Interface;
  cLegTesInstitucionNavigation: Persona;
}
