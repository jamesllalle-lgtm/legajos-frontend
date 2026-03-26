import { LegGradoTitulo } from "../legajo/leg-grado-titulo";


export interface UnidadOrganizacional {
  nUniOrgCodigo: number;
  cUniOrgCodigo: string;
  cUniOrgAbrev: string;
  cUniOrgNombre: string;
  cPerJuridad: string;
  nIntTipo: number;
  cPerApellido: string;
  cPerNombre: string;
  cUniOrgRelacion: string;
  legGradoTituloCarrera: LegGradoTitulo[];
}
