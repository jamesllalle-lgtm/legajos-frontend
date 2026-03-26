import { CarreraProfesional } from "./carreraprofesional";
import { Formacion } from "./formacion";
import { GradoAcademico } from "./gradoacademico";
import { Ubigeo } from "./ubigeo";

export interface Curriculo {
  nCurId: number;
  cCurDni: String;
  cCurApellidPaterno: String;
  cCurApellidMaterno: String;
  cCurNombres: String;
  dCurFechaNacimiento: Date;
  cCurEmail: String;
  cCurMovil: String;
  cCurTelefono: String;
  cCurFoto: any;
  cCurAcerca: String;
  nCarId: number;
  nGacId: number;
  cUbiId: String;
  nEstado: Boolean;
  lFormacion: Formacion[];
  gradoAcademico: GradoAcademico;
  ubigeo: Ubigeo;
  carreraProfesional: CarreraProfesional;
}
