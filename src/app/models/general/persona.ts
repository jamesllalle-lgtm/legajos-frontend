import { LegAdminitrativaCarga } from "../legajo/leg-adminitrativa-carga";
import { LegCapacitaciones } from "../legajo/leg-capacitaciones";
import { LegCategoriaDocente } from "../legajo/leg-categoria-docente";
import { LegDatosGenerales } from "../legajo/leg-datos-generales";
import { LegDocenciaUniv } from "../legajo/leg-docencia-univ";
import { LegGradoTitulo } from "../legajo/leg-grado-titulo";
import { LegParticipacionCongSem } from "../legajo/leg-participacion-cong-sem";
import { LegProfesNoDocente } from "../legajo/leg-profes-no-docente";
import { LegProyeccionSocial } from "../legajo/leg-proyeccion-social";
import { LegReconocimiento } from "../legajo/leg-reconocimiento";
import { LegRegimenDedicacion } from "../legajo/leg-regimen-dedicacion";
import { PerUsuario } from "./per-usuario";


export interface Persona {
  cPerCodigo: string;
  cPerApellido: string;
  cPerApellPat: string;
  cPerNombre: string;
  dPerNacimiento: Date;
  nPerTipo: number;
  nPerEstado: number;
  cUbigeoCodigo: string;
  cperestadobiblio: string;
  nUbiGeoCodigo: number;
  // perUsuario: PerUsuario;
  // legAdminitrativaCargaUnivers: LegAdminitrativaCarga[];
  // legCategoriaDocenteUnivers: LegCategoriaDocente[];
  // legDatosGeneralesColegProf: LegDatosGenerales[];
  // legDocenciaUnivUnivers: LegDocenciaUniv[];
  // legGradoTituloUnivers: LegGradoTitulo[];
  // legParticipacionCongSemUnivers: LegParticipacionCongSem[];
  // legProfesNoDocenteUnivers: LegProfesNoDocente[];
  // legProyeccionSocialUnivers: LegProyeccionSocial[];
  // legReconocimientoUnivers: LegReconocimiento[];
  // legRegimenDedicacionUnivers: LegRegimenDedicacion[];
  // LegCapacitacionesUnivers: LegCapacitaciones[]
}
