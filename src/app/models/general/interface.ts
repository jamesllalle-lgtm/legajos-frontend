import { LegDatosGenerales } from "../legajo/leg-datos-generales";
import { LegGradoTitulo } from "../legajo/leg-grado-titulo";


export interface Interface {
  nIntCodigo: number;
  nIntClase: number;
  cIntJerarquia: string;
  cIntNombre: string;
  cIntDescripcion: string;
  nIntTipo: number;
  legDatosGeneralesPais: LegDatosGenerales[];
  legDatosGeneralesTipoDoc: LegDatosGenerales[];
  legDatosGeneralesUbigeo: LegDatosGenerales[];
  LegDatosGeneralesNacimiento: LegDatosGenerales[];
  legDatosGeneralesGradoAcad: LegDatosGenerales[];
  legGradoTituloUbigeo: LegGradoTitulo[];
  legGradoTituloPais: LegGradoTitulo[];
  legGradoTituloGradoAcad: LegGradoTitulo[];
  nConCodigo: number;
  nConValor: string;
  cConDescripcion: string;
}
