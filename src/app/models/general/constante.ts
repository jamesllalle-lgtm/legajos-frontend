import { LegCapacitaciones } from "../legajo/leg-capacitaciones";
import { LegInvestigador } from "../legajo/leg-investigador";
import { LegCategoriaDocente } from "../legajo/leg-categoria-docente";
import { LegDatosGenerales } from "../legajo/leg-datos-generales";
import { LegDocenciaUniv } from "../legajo/leg-docencia-univ";
import { LegIdiomaOfimatica } from "../legajo/leg-idioma-ofimatica";
import { LegParticipacionCongSem } from "../legajo/leg-participacion-cong-sem";
import { LegProduccionCiencia } from "../legajo/leg-produccion-ciencia";
import { LegProfesNoDocente } from "../legajo/leg-profes-no-docente";
import { LegProyeccionSocial } from "../legajo/leg-proyeccion-social";
import { LegReconocimiento } from "../legajo/leg-reconocimiento";
import { LegRegimenDedicacion } from "../legajo/leg-regimen-dedicacion";
import { LegTesisAseJur } from "../legajo/leg-tesis-ase-jur";
import { LegAdminitrativaCarga } from "../legajo/leg-adminitrativa-carga";


export interface Constante {
  nConCodigo: number;
  nConValor: number;
  cConDescripcion: string;
  LegAdminitrativaCargaCargo: LegAdminitrativaCarga[];
  legCapacitacionesTipoEsp: LegCapacitaciones[];
  legCapacitacionesTipo: LegCapacitaciones[];
  legCategoriaDocenteCategoria: LegCategoriaDocente[];
  legDatosGeneralesTipoDomicilio: LegDatosGenerales[];
  legDatosGeneralesSexo: LegDatosGenerales[];
  legDatosGeneralesCondicionColeg: LegDatosGenerales[];
  legDocenciaUnivRegimen: LegDocenciaUniv[];
  legDocenciaUnivCategoria: LegDocenciaUniv[];
  legIdiomaOfimaticaNivel: LegIdiomaOfimatica[];
  legIdiomaOfimaticaCodigoDesc: LegIdiomaOfimatica[];
  legInvestigadorCentroRegistro: LegInvestigador[];
  legParticipacionCongSemRol: LegParticipacionCongSem[];
  legParticipacionCongSemAmbito: LegParticipacionCongSem[];
  legProduccionCienciaTipo: LegProduccionCiencia[];
  legProfesNoDocenteCargo: LegProfesNoDocente[];
  legProyeccionSocialTipo: LegProyeccionSocial[];
  legReconocimientoDocumento: LegReconocimiento[];
  legRegimenDedicacionTipo: LegRegimenDedicacion[];
  legTesisAseJurTipo: LegTesisAseJur[];
  legTesisAseJurNivel: LegTesisAseJur[];
}

