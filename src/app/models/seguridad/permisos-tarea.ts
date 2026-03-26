import { PermisosModulo } from "./permisos-modulo";
import { TareaModulo } from "./tarea-modulo";

export interface PermisosTarea {
  nPrmTarCodigo: number;
  nPrmModCodigo: number | null;
  nTarModCodigo: number | null;
  bPrmEstado: boolean | null;
  cUsuRegistro: string;
  dFechaRegistro: string;
  cUsuModifica: string;
  dFechaModifica: string | null;
  vTareaModulo: TareaModulo;
  vPermisosModulo: PermisosModulo;
}
