import { Constante } from "../general/constante";
import { PermisosModulo } from "./permisos-modulo";
import { TareaModulo } from "./tarea-modulo";

export interface ModulosTD {
  nModCodigo: number;
  nConValor: number | null;
  nConCodigo: number | null;
  cModDescripcion: string;
  cModRuta: string;
  bModEstado: boolean;
  cUsuRegistro: string;
  dFechaRegistro: string;
  cUsuModifica: string;
  dFechaModifica: string | null;
  vModulo: Constante;
  vPermisosModulos: PermisosModulo[];
  vTareaModulos: TareaModulo[];
}
