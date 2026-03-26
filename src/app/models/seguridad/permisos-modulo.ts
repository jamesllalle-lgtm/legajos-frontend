import { Persona } from "../general/persona";
import { ModulosTD } from "./modulos-td";
import { PermisosTarea } from "./permisos-tarea";

export interface PermisosModulo {
  nPrmModCodigo: number;
  nModCodigo: number | null;
  cPerCodigo: string;
  bPrmModAdministrador: boolean | null;
  bPrmModAlcance: boolean | null;
  bPrmModEstado: boolean;
  cUsuRegistro: string;
  dFechaRegistro: string;
  cUsuModifica: string;
  dFechaModifica: string | null;
  vPersona: Persona;
  vModulos: ModulosTD;
  vPermisosTareas: PermisosTarea[];
}
