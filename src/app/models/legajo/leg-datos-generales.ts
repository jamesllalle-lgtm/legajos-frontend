import { Constante } from '../general/constante'
import { Interface } from '../general/interface'
import { PerUsuario } from '../general/per-usuario'
import { Persona } from '../general/persona'
import { LegAdminitrativaCarga } from './leg-adminitrativa-carga'
import { LegCapacitacionInterna } from './leg-capacitacion-interna'
import { LegCapacitaciones } from './leg-capacitaciones'
import { LegCategoriaDocente } from './leg-categoria-docente'
import { LegContrato } from './leg-contrato'
import { LegDeclaracionJurada } from './leg-declaracion-jurada'
import { LegDocumentacionInterna } from './leg-documentacion-interna'
import { LegDocenciaUniv } from './leg-docencia-univ'
import { LegEvaluacionDesemp } from './leg-eval-desempeño'
import { LegGradoTitulo } from './leg-grado-titulo'
import { LegIdiomaOfimatica } from './leg-idioma-ofimatica'
import { LegInvestigador } from './leg-investigador'
import { LegOrdinarizacion } from './leg-ordinarizacion'
import { LegParticipacionCongSem } from './leg-participacion-cong-sem'
import { LegProduccionCiencia } from './leg-produccion-ciencia'
import { LegProfesNoDocente } from './leg-profes-no-docente'
import { LegProyeccionSocial } from './leg-proyeccion-social'
import { LegReconocimiento } from './leg-reconocimiento'
import { LegRegimenDedicacion } from './leg-regimen-dedicacion'
import { LegResolucion } from './leg-resolucion'
import { LegSeleccion } from './leg-seleccion'
import { LegTesisAseJur } from './leg-tesis-ase-jur'

// EBS 01/2026 ------------------->
// Importa el modelo para Licencia Profesional
import { LegLicenciaProfesional } from './leg-licencia-profesional'
// Importa el modelo para Membresias
import { LegMembresia } from './leg-membresia'
// EBS 01/2026 <-------------------

export interface LegDatosGenerales {
  // #region Datos Personales
  nLegDatCodigo: number
  cPerCodigo: string
  nLegDatTipoDoc: number
  nClaseTipoDoc: number
  cLegDatNroDoc: string
  cLegDatApellidoPaterno: string
  cLegDatApellidoMaterno: string
  cLegDatNombres: string
  dLegDatFechaNacimiento: Date
  nLegDatSexo: number
  nClaseSexo: number
  nLegDatEstadoCivil: number
  nClaseEstadoCivil: number
  // #endregion

  // #region Archivos y Firmas
  cFile: any
  cLegDatFoto: any

  cFileFirma: any
  cLegDatFirma: any

  cFileSunedu: any
  cLegDatSunedu: any

  cFileBuenaSalud: any
  cLegDatBuenaSalud: any

  cFilePolicial: any
  cFileConadis: any
  cLegDatPolicial: any

  cFileJudicial: any
  cLegDatJudicial: any
  // #endregion

  // #region Declaración Jurada
  declaracionjuradaflag: boolean
  // #endregion

  // #region Contacto
  cLegDatEmail: string
  cLegDatTelefono: string
  cLegDatMovil: string
  // #endregion

  // #region Educación / Datos Académicos
  nLegDatGradoAcad: number
  nClaseGradoAcad: number
  nLegDatPais: number
  nClasePais: number
  cLegDatAcerca: string

  // #endregion

  // #region Domicilio
  nLegDatTipoDomicilio: number
  nValorTipoDomicilio: number
  nLegDatZona: number
  nValorZona: number
  cLegDatCalleDomicilio: string
  cLegDatNroDomicilio: string
  cLegDatMzaDomicilio: string
  cLegDatLtDomicilio: string
  cLegDatDptoDomicilio: string
  cLegDatReferencia: string
  nLetDatUbigeo: number
  nClaseUbigeo: number
  nLetDatNacimiento: number
  nClaseNacimiento: number
  // #endregion

  // #region Colegio Profesional
  cLegDatColegioProf: string
  cLegDatNroColegiatura: string
  nLegDatCondicionColeg: number
  nValorCondicionColeg: number
  dLegDatosFechaEmisionColeg: Date
  dLegDatosFechaExpiraColeg: Date
  // #endregion

  // #region Discapacidad
  nLegDatDiscapacidad: number
  nLegDatTipoDiscapacidad: number
  cLegDatOtraDiscapcidad: string
  // #endregion

  // #region Régimen Pensionario (EdgarBS 2025)
  nLegDatRegPenAfiliado: number
  nValorAfiliado: number
  nLegDatRegPenEntidad: number
  nValorEntidad: number
  dLegDatRegPenFechaCese: Date
  // #endregion

  // #region Cuenta de Haberes (EdgarBS 2025)
  nLegDatCtaHabHaberes: number
  nValorHaberes: number
  nLegDatCtaHabBanco: number
  nValorBanco: number
  cLegDatCtaHabNumCta: string
  cLegDatCtaHabNumCtaCci: string
  nLegDatCtaHabBancoAperturar: number
  nValorBancoAperturar: number
  // #endregion

  cLegDatMencionEnMayGradAcad: string 
  cLegDatInstitucionMayGradAcad: string
  cLegDatInstitucionMayGradAcadNavigation: Persona;
  nLegDatAceptaTerminos: boolean

  // #region Auditoría
  cLegDatEstado: boolean
  cUsuRegistro: string
  dFechaRegistro: Date
  cUsuModifica: string
  dFechaModifica: Date
  // #endregion

  // #region Relaciones (NotMapped / navegación)
  cLegDatColegioProfNavigation: Persona
  cUsuModificaNavigation: PerUsuario
  cUsuRegistroNavigation: PerUsuario
  vCondicionColeg: Constante
  vPais: Interface
  vSexo: Constante
  vEstadoCivil: Constante
  vTipoDoc: Interface
  vTipoDomicilio: Constante
  vZona: Constante
  vUbigeo: Interface
  vNacimiento: Interface
  vGradoAcad: Interface

  vAfiliado: Constante
  vEntidad: Constante
  vHaberes: Constante
  vBanco: Constante
  vBancoAperturar: Constante
  // #endregion

  // #region Colecciones
  legAdminitrativaCarga: LegAdminitrativaCarga[]
  legCapacitacionInternas: LegCapacitacionInterna[]
  legContratos: LegContrato[]
  legCapacitaciones: LegCapacitaciones[]
  legCategoriaDocente: LegCategoriaDocente[]
  legDocenciaUniv: LegDocenciaUniv[]
  legGradoTitulo: LegGradoTitulo[]
  legIdiomaOfimatica: LegIdiomaOfimatica[]
  legInvestigador: LegInvestigador[]
  legParticipacionCongSem: LegParticipacionCongSem[]
  legProduccionCiencia: LegProduccionCiencia[]
  legProfesNoDocente: LegProfesNoDocente[]
  legProyeccionSocial: LegProyeccionSocial[]
  legReconocimiento: LegReconocimiento[]
  legRegimenDedicacion: LegRegimenDedicacion[]
  legTesisAseJur: LegTesisAseJur[]
  legResoluciones: LegResolucion[]
  legEvaluacionDesemp: LegEvaluacionDesemp[]
  legSeleccion: LegSeleccion[]
  legOrdinarizacion: LegOrdinarizacion[]
  legDeclaracionJurada: LegDeclaracionJurada[]
  legDocumentacionInterna: LegDocumentacionInterna[]

  // EBS 01/2026 ------------>
  // variable que almacena Licencia Profesional
  legLicenciaProfesional: LegLicenciaProfesional[]
  // variable que almacena Membresia
  legMembresia: LegMembresia[]
  // EBS 01/2026 ------------>

  // #endregion

  // #region Extras / Últimos (siguiendo .NET)
  nLegIdiomaNativo: number
  cLegDatArchivoConadis: any
  // #endregion
}
