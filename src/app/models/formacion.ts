import { CarreraProfesional } from "./carreraprofesional";
import { GradoAcademico } from "./gradoacademico";
import { Institucion } from "./institucion";

export interface Formacion {
  nForId: number;
  dForFechaObtencion: Date;
  nForInstitucionId: number;
  institucion: Institucion;
  nForCarreraProfesionalId: number;
  carreraProfesional: CarreraProfesional;
  nForGradoAcademicoId: number;
  gradoAcademico: GradoAcademico;
  fForDiploma: any;
  cForDiplomaUrl: any;
}
