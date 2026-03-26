import { Constante } from "../general/constante";
import { PerUsuario } from "../general/per-usuario";
import { Persona } from "../general/persona";
import { LegDatosGenerales } from "./leg-datos-generales";

export interface LegDocenciaUniv {
  nLegDocCodigo: number;
  cLegDocUniversidad: string;
  cLegDocOtraInst: string;
  cLegDocPais: string;
  nLegDocRegimen: number;
  nValorRegimen: number;
  nLegDocCategoria: number;
  nValorCategoria: number;
  
  // 🔹 ESTA ES LA PROPIEDAD QUE FALTA AGREGAR
  cLegDocCargo: string; 

  dLegDocFechaInicio: Date;
  dLegDocFechaFin: Date;
  cLegDocArchivo: any;
  cFile: any;
  nLegDocDatCodigo: number;
  cLegDocValida: boolean;
  cLegDocEstado: boolean;
  cUsuRegistro: string;
  
  // Objetos de navegación para mostrar descripciones en la tabla
  vCategoria: Constante; 
  vRegimen: Constante;
  cLegDocUniversidadNavigation: Persona;
}
