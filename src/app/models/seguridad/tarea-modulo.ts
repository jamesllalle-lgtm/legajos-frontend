import { ModulosTD } from "./modulos-td";
import { PermisosTarea } from "./permisos-tarea";

export interface TareaModulo {
  nTarModCodigo: number;
  nModCodigo: number | null;
  cTarModDescripcion: string;
  bTarModEstado: boolean | null;
  cUsuRegistro: string;
  dFechaRegistro: string;
  cUsuModifica: string;
  dFechaModifica: string | null;
  vModulo: ModulosTD;
  vPermisosTareas: PermisosTarea[];
}
