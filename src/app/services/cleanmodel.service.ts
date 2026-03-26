import { ThrowStmt } from '@angular/compiler'
import { Injectable } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Constante } from '../models/general/constante'
import { Interface } from '../models/general/interface'
import { PerUsuario } from '../models/general/per-usuario'
import { Persona } from '../models/general/persona'
import { UnidadOrganizacional } from '../models/general/unidad-organizacional'
import { LegDatosGenerales } from '../models/legajo/leg-datos-generales'
import { DatosUsuario } from '../models/usuario'

@Injectable({
  providedIn: 'root',
})
export class CleanmodelService {
  codigonoinst = 'PER100'
  nombrenoinst = 'OTRA INSTITUCIÓN'
  fechadef = '1900-01-01'
  fechahoradefault = '0001-01-01T00:00:00'
  fechaformdefault = new Date(this.fechahoradefault)
  
  empty_constante(): Constante {
    return {
      nConCodigo: 0,
      nConValor: 0,
      cConDescripcion: '',
      LegAdminitrativaCargaCargo: [],
      legCapacitacionesTipoEsp: [],
      legCapacitacionesTipo: [],
      legCategoriaDocenteCategoria: [],
      legDatosGeneralesTipoDomicilio: [],
      legDatosGeneralesSexo: [],
      legDatosGeneralesCondicionColeg: [],
      legDocenciaUnivRegimen: [],
      legDocenciaUnivCategoria: [],
      legIdiomaOfimaticaNivel: [],
      legIdiomaOfimaticaCodigoDesc: [],
      legInvestigadorCentroRegistro: [],
      legParticipacionCongSemRol: [],
      legParticipacionCongSemAmbito: [],
      legProduccionCienciaTipo: [],
      legProfesNoDocenteCargo: [],
      legProyeccionSocialTipo: [],
      legReconocimientoDocumento: [],
      legRegimenDedicacionTipo: [],
      legTesisAseJurTipo: [],
      legTesisAseJurNivel: [],
    }
  }

  empty_interface(): Interface {
    return {
      nIntCodigo: 0,
      nIntClase: 0,
      cIntJerarquia: '',
      cIntNombre: '',
      cIntDescripcion: '',
      nIntTipo: 0,
      legDatosGeneralesPais: [],
      legDatosGeneralesTipoDoc: [],
      legDatosGeneralesUbigeo: [],
      LegDatosGeneralesNacimiento: [],
      legDatosGeneralesGradoAcad: [],
      legGradoTituloUbigeo: [],
      legGradoTituloPais: [],
      legGradoTituloGradoAcad: [],
      nConCodigo: 0,
      nConValor: '',
      cConDescripcion: '',
    }
  }

  empty_unidadorganizacional(): UnidadOrganizacional {
    return {
      nUniOrgCodigo: 0,
      cUniOrgCodigo: '',
      cUniOrgAbrev: '',
      cUniOrgNombre: '',
      cPerJuridad: '',
      nIntTipo: 0,
      cPerApellido: '',
      cPerNombre: '',
      cUniOrgRelacion: '',
      legGradoTituloCarrera: [],
    }
  }

  empty_persona(): Persona {
    return {
      cPerCodigo: this.codigonoinst,
      cPerApellido: '',
      cPerApellPat: '',
      cPerNombre: this.nombrenoinst,
      dPerNacimiento: new Date(''),
      nPerTipo: 0,
      nPerEstado: 0,
      cUbigeoCodigo: '',
      cperestadobiblio: '',
      nUbiGeoCodigo: 0,
      // perUsuario: this.empty_perusuario(),
      // legAdminitrativaCargaUnivers: [],
      // legCategoriaDocenteUnivers: [],
      // legDatosGeneralesColegProf: [],
      // legDocenciaUnivUnivers: [],
      // legGradoTituloUnivers: [],
      // legParticipacionCongSemUnivers: [],
      // legProfesNoDocenteUnivers: [],
      // legProyeccionSocialUnivers: [],
      // legReconocimientoUnivers: [],
      // legRegimenDedicacionUnivers: [],
    }
  }

  empty_perusuario(): PerUsuario {
    return {
      cPerCodigo: '',
      cPerUsuCodigo: '',
      cPerUsuClave: '',
      cPerUsuEstado: 0,
      cPerJuridica: '',
      cPudFecha: new Date(''),
      nPerRelacion: [],
      cPerCodigoNavigation: this.empty_persona(),

      // legAdminitrativaCargaCUsuModificaNavigations: [],
      // legAdminitrativaCargaCUsuRegistroNavigations: [],
      // legCapacitacionesCUsuModificaNavigations: [],
      // legCapacitacionesCUsuRegistroNavigations: [],
      // legCategoriaDocenteCUsuModificaNavigations: [],
      // legCategoriaDocenteCUsuRegistroNavigations: [],
      // legDatosGeneralesCUsuModificaNavigations: [],
      // legDatosGeneralesCUsuRegistroNavigations: [],
      // legDocenciaUnivCUsuModificaNavigations: [],
      // legDocenciaUnivCUsuRegistroNavigations: [],
      // legGradoTituloCUsuModificaNavigations: [],
      // legGradoTituloCUsuRegistroNavigations: [],
      // legIdiomaOfimaticaCUsuModificaNavigations: [],
      // legIdiomaOfimaticaCUsuRegistroNavigations: [],
      // legInvestigadorCUsuModificaNavigations: [],
      // legInvestigadorCUsuRegistroNavigations: [],
      // legParticipacionCongSemCUsuModificaNavigations: [],
      // legParticipacionCongSemCUsuRegistroNavigations: [],
      // legProduccionCienciaCUsuModificaNavigations: [],
      // legProduccionCienciaCUsuRegistroNavigations: [],
      // legProfesNoDocenteCUsuModificaNavigations: [],
      // legProfesNoDocenteCUsuRegistroNavigations: [],
      // legProyeccionSocialCUsuModificaNavigations: [],
      // legProyeccionSocialCUsuRegistroNavigations: [],
      // legReconocimientoCUsuModificaNavigations: [],
      // legReconocimientoCUsuRegistroNavigations: [],
      // legRegimenDedicacionCUsuModificaNavigations: [],
      // legRegimenDedicacionCUsuRegistroNavigations: [],
      // legTesisAseJurCUsuModificaNavigations: [],
      // legTesisAseJurCUsuRegistroNavigations: [],
    }
  }

  empty_datosgenerales(): LegDatosGenerales {
    return {
      nLegDatCodigo: 0,
      nLegDatTipoDoc: 0,
      nClaseTipoDoc: 0,
      cLegDatNroDoc: '',
      cLegDatApellidoPaterno: '',
      cLegDatApellidoMaterno: '',
      cLegDatNombres: '',
      dLegDatFechaNacimiento: new Date(''),
      nLegDatSexo: 0,
      nClaseSexo: 0,
      nLegDatEstadoCivil: 0,
      nClaseEstadoCivil: 0,
      cFile: null,
      cLegDatFoto: null,
      cFileFirma: null,
      cLegDatFirma: null,
      cFileSunedu: null,
      cLegDatSunedu: null,
      cFilePolicial: null,
      cFileConadis: null,
      cLegDatPolicial: null,
      cFileJudicial: null,
      cLegDatJudicial: null,
      cFileBuenaSalud: null,
      cLegDatEmail: '',
      cLegDatTelefono: '',
      cLegDatMovil: '',
      nLegDatGradoAcad: 0,
      nClaseGradoAcad: 0,
      nLegDatPais: 0,
      nClasePais: 0,
      cLegDatAcerca: '',
      cPerCodigo: '',
      nLegDatTipoDomicilio: 0,
      nValorTipoDomicilio: 0,
      nLegDatZona: 0,
      nValorZona: 0,
      cLegDatCalleDomicilio: '',
      cLegDatNroDomicilio: '',
      cLegDatMzaDomicilio: '',
      cLegDatLtDomicilio: '',
      cLegDatDptoDomicilio: '',
      cLegDatReferencia: '',
      nLetDatUbigeo: 0,
      nClaseUbigeo: 0,
      nLetDatNacimiento: 0,
      nClaseNacimiento: 0,
      cLegDatColegioProf: '',
      cLegDatNroColegiatura: '',
      nLegDatCondicionColeg: 0,
      nValorCondicionColeg: 0,
      dLegDatosFechaEmisionColeg: new Date(''),
      dLegDatosFechaExpiraColeg: new Date(''),
      cLegDatEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),

      // Campos para Régimen Pensionario
      nLegDatRegPenAfiliado: 0,
      nValorAfiliado: 0,
      nLegDatRegPenEntidad: 0,
      nValorEntidad: 0,
      dLegDatRegPenFechaCese: new Date(''),
      // Campos para cuenta de haberes
      nLegDatCtaHabHaberes: 0,
      nValorHaberes: 0,
      nLegDatCtaHabBanco: 0,
      nValorBanco: 0,
      cLegDatCtaHabNumCta: "",
      cLegDatCtaHabNumCtaCci: "",
      nLegDatCtaHabBancoAperturar: 0,
      nValorBancoAperturar: 0,

      cLegDatMencionEnMayGradAcad: "",
      cLegDatInstitucionMayGradAcad: "",
      cLegDatInstitucionMayGradAcadNavigation: this.empty_persona(),
      nLegDatAceptaTerminos: false,

      cLegDatColegioProfNavigation: this.empty_persona(),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vCondicionColeg: this.empty_constante(),
      vPais: this.empty_interface(),
      vSexo: this.empty_constante(),
      vEstadoCivil: this.empty_constante(),
      vTipoDoc: this.empty_interface(),
      vTipoDomicilio: this.empty_constante(),
      vZona: this.empty_constante(),
      vUbigeo: this.empty_interface(),
      vNacimiento: this.empty_interface(),
      vGradoAcad: this.empty_interface(),

      vAfiliado: this.empty_constante(),
      vEntidad: this.empty_constante(),
      vHaberes: this.empty_constante(),
      vBanco: this.empty_constante(),
      vBancoAperturar: this.empty_constante(),

      legAdminitrativaCarga: [],
      legCapacitaciones: [],
      legCategoriaDocente: [],
      legDocenciaUniv: [],
      legGradoTitulo: [],
      legIdiomaOfimatica: [],
      legInvestigador: [],
      legParticipacionCongSem: [],
      legProduccionCiencia: [],
      legProfesNoDocente: [],
      legProyeccionSocial: [],
      legReconocimiento: [],
      legRegimenDedicacion: [],
      legTesisAseJur: [],
      legCapacitacionInternas: [],
      legContratos: [],
      legResoluciones: [],
      legEvaluacionDesemp: [],
      legSeleccion: [],
      legOrdinarizacion: [],
      legDeclaracionJurada: [],
      legDocumentacionInterna: [],

      legLicenciaProfesional: [],
      legMembresia: [],

      cLegDatBuenaSalud: null,
      declaracionjuradaflag: true,
      nLegIdiomaNativo: 0,
      nLegDatDiscapacidad: 0,
      nLegDatTipoDiscapacidad: 0,
      cLegDatOtraDiscapcidad: '',
      cLegDatArchivoConadis: '',
    }
  }

  empty_gradotitulo() {
    return {
      nLegGraCodigo: 0,
      nLegGraGradoAcad: 0,
      nClaseGradoAcad: 0,
      cLegGraInstitucion: '',
      cLegGraOtraInst: '',
      cLegGraCarreraProf: '',
      nLegGraPais: 0,
      nClasePais: 0,
      nLegGraUbigeo: 0,
      nClaseUbigeo: 0,
      dLegGraFecha: new Date(''),
      cFile: null,
      cLegGraArchivo: null,
      nLegGraDatCodigo: 0,
      cLegGraValida: false,
      cLegGraEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cLegGraInstitucionNavigation: this.empty_persona(),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vGradoAcad: this.empty_interface(),
      vUbigeo: this.empty_interface(),
      nLegGraDatCodigoNavigation: this.empty_datosgenerales(),
      vPais: this.empty_interface(),
    }
  }

  // EBS - 01/2026 -------------------->
  empty_licenciaprofesional() {
    return {
      nLegLicCodigo: 0,
      nLegLicPais: 0,
      nClasePais: 0,
      cLegLicInstitucion: '',
      cLegLicOtraInst: '',
      cLegLicNroRegistro: '',
      nLegLicCondicion: 0,
      nClaseCondicion: 0,
      dLegLicFechaEmision: new Date(''),
      dLegLicFechaExpiracion: new Date(''),
      nLegLicDatCodigo: 0,
      cLegLicValida: false,
      cLegLicEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cLegLicInstitucionNavigation: this.empty_persona(),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vCondicion: this.empty_interface(),
      nLegLicDatCodigoNavigation: this.empty_datosgenerales(),
      vPais: this.empty_interface(),
    }
  }

  empty_membresia() {
    return {
      nLegMemCodigo: 0,
      nLegMemPais: 0,
      nClasePais: 0,
      cLegMemInstitucion: '',
      cLegMemOtraInst: '',
      cLegMemNroRegistro: '',
      dLegMemFechaEmision: new Date(''),
      dLegMemFechaExpiracion: new Date(''),
      nLegMemDatCodigo: 0,
      cLegMemValida: false,
      cLegMemEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cLegMemInstitucionNavigation: this.empty_persona(),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      nLegMemDatCodigoNavigation: this.empty_datosgenerales(),
      vPais: this.empty_interface(),
    }
  }
  // EBS - 01/2026 <--------------------

  empty_docenciauniv() {
    return {
      nLegDocCodigo: 0,
      cLegDocUniversidad: '',
      cLegDocOtraInst: '',
      cLegDocPais: '',
      nLegDocRegimen: 0,
      nValorRegimen: 0,
      nLegDocCategoria: 0,
      nValorCategoria: 0,
      dLegDocFechaInicio: new Date(''),
      dLegDocFechaFin: new Date(''),
      cFile: null,
      cLegDocArchivo: null,
      nLegDocDatCodigo: 0,
      cLegDocValida: false,
      cLegDocEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cLegDocUniversidadNavigation: this.empty_persona(),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vCategoria: this.empty_constante(),
      nLegDocDatCodigoNavigation: this.empty_datosgenerales(),
      vRegimen: this.empty_constante(),
      cLegDocCargo: '',
    }
  }

  empty_cargaadministrativa() {
    return {
      nLegAdmCodigo: 0,
      nLegAdmCargo: 0,
      nClaseCargo: 0,
      cLegAdmInstitucion: '',
      cLegAdmOtraInst: '',
      cLegAdmPais: '',
      cLegAdmDocumento: '',
      dLegAdmFechaInicio: new Date(''),
      dLegAdmFechaFin: new Date(''),
      cFile: null,
      cLegAdmArchivo: null,
      nLegAdmDatCodigo: 0,
      cLegAdmValida: false,
      cLegAdmEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cLegAdmInstitucionNavigation: this.empty_persona(),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vCargo: this.empty_constante(),
      nLegAdmDatCodigoNavigation: this.empty_datosgenerales(),
    }
  }

  empty_capacitaciones() {
    return {
      nLegCapCodigo: 0,
      nLegCapTipo: 0,
      nLegCapTipoEsp: 0,
      cLegCapNombre: '',
      nLegCapHoras: 0,
      dLegCapFechaInicio: new Date(''),
      dLegCapFechaFin: new Date(''),
      cFile: null,
      cLegCapArchivo: null,
      cLegCapInstitucion: '',
      cLegCapOtraInst: '',
      cLegCapPais: '',
      nLegCapDatCodigo: 0,
      cLegCapValida: false,
      cLegCapEstado: true,
      nValorTipo: 0,
      nValorTipoEsp: 0,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vTipo: this.empty_constante(),
      nLegCapDatCodigoNavigation: this.empty_datosgenerales(),
      vTipoEsp: this.empty_constante(),
      vInstitucion: this.empty_persona(),
    }
  }

  empty_categoriadoc() {
    return {
      nLegCatCodigo: 0,
      cLegCatInstitucion: '',
      cLegCatOtraInst: '',
      cLegCatPais: '',
      nLegCatCategoria: 0,
      nValorCategoria: 0,
      dLegCatFechaInicio: new Date(''),
      dLegCatFechaFin: new Date(''),
      cFile: null,
      cLegCatArchivo: null,
      nLegCatDatCodigo: 0,
      cLegCatValida: false,
      cLegCatEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cLegCatInstitucionNavigation: this.empty_persona(),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vCategoria: this.empty_constante(),
      nLegCatDatCodigoNavigation: this.empty_datosgenerales(),
    }
  }

  empty_idiomaofimatica() {
    return {
      nLegIdOfCodigo: 0,
      nLegIdOfCodigoDesc: 0,
      nValorDesc: 0,
      cLegIdOfTipo: true,
      nLegIdOfNivel: 0,
      nValorNivel: 0,
      dLegIdOfFecha: new Date(''),
      cFile: null,
      cLegIdOfArchivo: null,
      nLegIdOfDatCodigo: 0,
      cLegIdOfValida: false,
      cLegIdOfEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vCodigoDesc: this.empty_constante(),
      nLegIdOfDatCodigoNavigation: this.empty_datosgenerales(),
      vNivel: this.empty_constante(),
    }
  }

  empty_investigador() {
    return {
      nLegInvCodigo: 0,
      nLegInvCentroRegistro: 0,
      nValorCentroRegistro: 0,
      //Variables limpias para el Nivel de Renacyt - EBS 12/2025
      nLegInvNivelRenacyt: 0,
      nValorNivelRenacyt: 0,
      //Variables limpias para el Nivel de Renacyt - EBS 12/2025
      cLegInvNroRegistro: '',
      dLegInvFechaInicio: new Date(''),
      dLegInvFechaFin: new Date(''),
      cFile: null,
      cLegInvArchivo: null,
      nLegInvDatCodigo: 0,
      cLegInvValida: false,
      cLegInvEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vCentroRegistro: this.empty_interface(),
      vNivelRenacyt: this.empty_interface(), // Interface Nivel de Renacyt limpia
      nLegInvDatCodigoNavigation: this.empty_datosgenerales(),
    }
  }
  empty_participacion() {
    return {
      nLegParCodigo: 0,
      cLegParInstitucion: '',
      cLegParOtraInst: '',
      cLegParPais: '',
      nLegParRol: 0,
      nValorRol: 0,
      nLegParAmbito: 0,
      nValorAmbito: 0,
      cLegParNombre: '',
      dLegParFecha: new Date(''),

      dLegParFechaFin: new Date(''), // Nuevo
      nLegParHoras: 0, // Nuevo
      cLegParArchivoOrig: null, // Nuevo

      cFile: null,
      cLegParArchivo: null,
      nLegParDatCodigo: 0,
      cLegParValida: false,
      cLegParEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cLegParInstitucionNavigation: this.empty_persona(),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vAmbito: this.empty_interface(),
      nLegParDatCodigoNavigation: this.empty_datosgenerales(),
      vRol: this.empty_interface(),
    }
  }

  empty_produccionciencia() {
    return {
      nLegProdCodigo: 0,
      nLegProdTipo: 0,
      nValorTipo: 0,
      cLegProdTitulo: '',
      dLegProdFecha: new Date(''),
      cLegProdNroResolucion: '',
      cFile: null,
      cLegProdArchivo: null,
      nLegProdDatCodigo: 0,
      cLegProdValida: false,
      cLegProdEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vTipo: this.empty_interface(),
      nLegProdDatCodigoNavigation: this.empty_datosgenerales(),
      nLegProdPais: 0,
      nLegProdParticipacion: 0,
      vPais: this.empty_interface()
    }
  }

empty_profesnodocente() {
  return {
    nLegProCodigo: 0,
    cLegProInstitucion: '',
    cLegProOtraInst: '',
    cLegProPais: '',
    nLegProCargo: 0,
    nValorCargo: 0,
    cLegProCargoProf: '',

    // 🔹 AGREGA ESTA LÍNEA PARA EVITAR ERRORES EN EL FORMULARIO NUEVO:
    cLegDescCargo: '', 

    dLegProFechaInicio: new Date(''),
    dLegProFechaFin: new Date(''),
    cFile: null,
    cLegProArchivo: null,
    nLegProDatCodigo: 0,
    cLegProValida: false,
    cLegProEstado: true,
    cUsuRegistro: '',
    dFechaRegistro: new Date(''),
    cUsuModifica: '',
    dFechaModifica: new Date(''),
    cLegProInstitucionNavigation: this.empty_persona(),
    cUsuModificaNavigation: this.empty_perusuario(),
    cUsuRegistroNavigation: this.empty_perusuario(),
    vCargo: this.empty_constante(),
    nLegProDatCodigoNavigation: this.empty_datosgenerales(),
  }
}

  empty_proyeccionsoc() {
    return {
      nLegProyCodigo: 0,
      cLegProyInstitucion: '',
      cLegProyOtraInst: '',
      cLegProyPais: '',
      nLegProyTipo: 0,
      nValorTipo: 0,
      cLegProyDescripcion: '',
      dLegProyFechaInicio: new Date(''),
      dLegProyFechaFin: new Date(''),
      cFile: null,
      cLegProyArchivo: null,
      nLegProyDatCodigo: 0,
      cLegProyValida: false,
      cLegProyEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cLegProyInstitucionNavigation: this.empty_persona(),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vTipo: this.empty_constante(),
      nLegProyDatCodigoNavigation: this.empty_datosgenerales(),
    }
  }

  empty_regimendedic() {
    return {
      nLegRegCodigo: 0,
      cLegCatInstitucion: '',
      cLegRegOtraInst: '',
      cLegRegPais: '',
      nLegRegDedicacion: 0,
      nValorDedicacion: 0,
      dLegRegFechaInicio: new Date(''),
      dLegRegFechaFin: new Date(''),
      cFile: null,
      cLegRegArchivo: null,
      nLegRegDatCodigo: 0,
      cLegRegValida: false,
      cLegRegEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cLegCatInstitucionNavigation: this.empty_persona(),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vDedicacion: this.empty_constante(),
      nLegRegDatCodigoNavigation: this.empty_datosgenerales(),
    }
  }

  empty_reconocimiento() {
    return {
      nLegRecCodigo: 0,
      nLegRecDocumento: 0,
      nValorDocumento: 0,
      nLegRecTipo: 0,
      nValorTipo: 0,
      cLegRecInstitucion: '',
      cLegRecOtraInst: '',
      cLegRecPais: '',
      dLegRecFecha: new Date(''),
      cFile: null,
      cLegRecArchivo: null,
      nLegRecDatCodigo: 0,
      cLegRecValida: false,
      cLegRecEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cLegRecInstitucionNavigation: this.empty_persona(),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vDocumento: this.empty_constante(),
      vTipo: this.empty_constante(),
      nLegRecDatCodigoNavigation: this.empty_datosgenerales(),
    }
  }

  empty_tesisasesjur() {
    return {
      nLegTesCodigo: 0,
      nLegTesTipo: 0,
      nValorTipo: 0,
      nLegTesNivel: 0,
      nValorNivel: 0,
      dLegTesFecha: new Date(''),
      cLegTesNroResolucion: '',
      cFile: null,
      cLegTesArchivo: null,
      nLegTesDatCodigo: 0,
      cLegTesValida: false,
      cLegTesEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      cUsuModificaNavigation: this.empty_perusuario(),
      cUsuRegistroNavigation: this.empty_perusuario(),
      vNivel: this.empty_constante(),
      nLegTesDatCodigoNavigation: this.empty_datosgenerales(),
      vTipo: this.empty_interface(),

      // Nuevos campos para obtener el Pais, Insitucion (lugar) de la actividad - EBS 01/2026
      nLegTesPais: 0,
      nClasePais: 0,
      cLegTesInstitucion: '',
      cLegTesOtraInst: '',
      cLegTesInstitucionNavigation: this.empty_persona(),
      vPais: this.empty_interface(),
    }
  }

  empty_capacitacionesuss() {
    return {
      nCapCodigo: 0,
      cCapTema: '',
      dCapFechaInicio: new Date(''),
      dCapFechaFin: new Date(''),
      nCapHoras: 0,
      bCapEstado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      legCapacitacionInternas: [],
    }
  }

  empty_capacitacioninterna() {
    return {
      nLegCicodigo: 0,
      cLegCicompetenciaMejora: '',
      nCapCodigo: 0,
      nLegDatCodigo: 0,
      cFile: null,
      cLegCiarchivo: null,
      bLegCiestado: true,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      vCapacitacionUSS: this.empty_capacitacionesuss(),
      vDatosGenerales: this.empty_datosgenerales(),
    }
  }

  empty_contratos() {
    return {
      nLegConCodigo: 0,
      nLegConCargo: 0,
      nLegValCargo: 0,
      nLegConArea: 0,
      nLegValArea: 0,
      dLegConFechaInicio: new Date(''),
      dLegConFechaFin: new Date(''),
      nLegConSueldo: 0.0,
      cLegConArchivo: null,
      cFile: null,
      bLegConEstado: true,
      nLegConDatCodigo: 0,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      vArea: this.empty_interface(),
      vCargo: this.empty_interface(),
      vDatosGenerales: this.empty_datosgenerales(),
    }
  }

  empty_resoluciones() {
    return {
      nLegResCodigo: 0,
      nLegResTipo: 0,
      nLegValTipo: 0,
      dLegResFecha: new Date(''),
      cLegResResuelve: '',
      cLegResNroResolucion: '',
      cLegResArchivo: null,
      cFile: null,
      bLegResEstado: true,
      nLegResDatCodigo: 0,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      vResolucion: this.empty_constante(),
      vDatosGenerales: this.empty_datosgenerales(),
    }
  }

  empty_evaluaciondesemp() {
    return {
      nLegEvalCodigo: 0,
      nLegEvalCargo: 0,
      nLegValCargo: 0,
      nLegEvalArea: 0,
      nLegValArea: 0,
      cLegEvalSemestre: '',
      cLegEvalAnio: '',
      nLegEvalPuntaje: 0,
      nLegEvalNivel: 0,
      nLegValNivel: 0,
      cLegEvalArchivo: null,
      cFile: null,
      bLegEvalEstado: true,
      nLegEvalDatCodigo: 0,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      vArea: this.empty_interface(),
      vCargo: this.empty_interface(),
      vNivel: this.empty_constante(),
      vDatosGenerales: this.empty_datosgenerales(),
    }
  }

  empty_seleccion() {
    return {
      nLegSelCodigo: 0,
      nLegSelCargo: 0,
      nLegValCargo: 0,
      nLegSelArea: 0,
      nLegValArea: 0,
      dLegSelFecha: new Date(''),
      cLegSelEvaluacionCv: null,
      cFileEvaluacionCv: null,
      cLegSelClaseModelo: null,
      cFileClaseModelo: null,
      cLegSelEvaluacionPsico: null,
      cFileEvaluacionPsico: null,
      cLegSelEntrevistaPers: null,
      cFileEntrevistaPers: null,
      bLegSelEstado: true,
      nLegSelDatCodigo: 0,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      vArea: this.empty_interface(),
      vCargo: this.empty_interface(),
      vDatosGenerales: this.empty_datosgenerales(),
    }
  }

  empty_ordinarizacion() {
    return {
      nLegOrdCodigo: 0,
      nLegOrdCargo: 0,
      nLegValCargo: 0,
      nLegOrdArea: 0,
      nLegOrdValArea: 0,
      dLegOrdFecha: new Date(''),
      cLegOrdFichaInscripcion: null,
      cFileFichaInscripcion: null,
      cLegOrdEvaluacionCv: null,
      cFileEvaluacionCv: null,
      cLegOrdClaseModelo: null,
      cFileClaseModelo: null,
      cLegOrdEvaluacionPsico: null,
      cFileEvaluacionPsico: null,
      cLegOrdEntrevistaPers: null,
      cFileEntrevistaPers: null,
      bLegOrdEstado: true,
      nLegOrdDatCodigo: 0,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      vArea: this.empty_interface(),
      vCargo: this.empty_interface(),
      vDatosGenerales: this.empty_datosgenerales(),
    }
  }

  empty_declaracionjurada() {
    return {
      nLegDjcodigo: 0,
      dLegDjfecha: new Date(''),
      cLegDjanexo2: null,
      cFileDjanexo2: null,
      cLegDjanexo6: null,
      cFileDjanexo6: null,
      cLegDjanexo7: null,
      cFileDjanexo7: null,

      bLegDjestado: true,
      nLegDjdatCodigo: 0,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      vDatosGenerales: this.empty_datosgenerales(),

      cLegDjanexo1: null,
      cFileDjanexo1: null,
      cLegDjanexo2_2: null,
      cFileDjanexo2_2: null,
      cLegDjanexo3: null,
      cFileDjanexo3: null,
      cLegDjanexo4: null,
      cFileDjanexo4: null,
      cLegDjanexo5: null,
      cFileDjanexo5: null,
      cLegDjanexo6_2: null,
      cFileDjanexo6_2: null,

      cLegDjDNI: null,
      cFileDjDNI: null,
      cLegDjDNI_DH: null,
      cFileDjDNI_DH: null,
      cLegDjFotoCarnet: null,
      cFileDjFotoCarnet: null,
      cLegDjNumCta: null,
      cFileDjNumCta: null,
      cLegDjNumCtaCci: null,
      cFileDjNumCtaCci: null,
      cLegDjConsJubilacion: null,
      cFileDjConsJubilacion: null,

      cLegDjConsAfiliacionOnpAfp: null,
      cFileDjConsAfiliacionOnpAfp: null
    }
  }

  empty_documentacioninterna() {
    return {
      nLegDicodigo: 0,
      cLegDiarchivo: null,
      cFile: null,
      nLegDitipoDoc: 0,
      nLegValTipoDoc: 0,
      cLegDicodigo: '',
      cLegDidescripcion: '',
      bLegDiestado: true,
      nLegDidatCodigo: 0,
      cUsuRegistro: '',
      dFechaRegistro: new Date(''),
      cUsuModifica: '',
      dFechaModifica: new Date(''),
      vTipo: this.empty_constante(),
      vDatosGenerales: this.empty_datosgenerales(),
    }
  }

  empty_datosusuario() {
    return {
      cPerCodigo: '',
      cPerApellido: '',
      cPerNombre: '',
      cPerUsuCodigo: '',
      cPerEmail: '',
      cPerTipoDoc: '',
      cPerNroDoc: '',
      nTipo: 0,
      cTipoDesc: '',
      cCargo: '',
      idArea: 0,
      cArea: '',
      nRol: 1,
      cToken: '',
      bLegajo: false,
      declaracionjuradaflag: false,
    }
  }

  empty_eva_capacitaciones() {
    return {
      nLegDatCodigo: 0,
      ponente_inter: 0,
      ponente_nacional: 0,
      organizador_inter: 0,
      organizador_nacional: 0,
      asistente_inter: 0,
      asistente_nacional: 0,
      capa_1: 0,
      capa_2: 0,
      capa_3: 0,
      capa_4: 0,
      puntaje: 0,
    }
  }

  empty_eva_investigaciones() {
    return {
      nLegDatCodigo: 0,
      invs_a: 0,
      invs_b: 0,
      invs_c: 0,
      invs_d: 0,

      ases_a: 0,
      ases_b: 0,

      prod_a: 0,
      prod_b: 0,
      prod_c: 0,
      prod_d: 0,
      prod_e: 0,
    }
  }

  empty_eva_renovacion_ratificacion() {
    return {
      nRenRatCodigo: 0,
      nLegDatCodigo: 0,
      cPerCodigo: '',
      cPerApellido: '',
      cPerNombre: '',
      cCargo: '',
      cArea: '',
      cPerNroDoc: '',

      nLegRenRatEDD: 0,
      nLegRenRatCD: 0,
      nLegRenRatPC: 0,
      nLegRenRatPromedio: 0,

      cLegRenRatCondicion: '',
      cLegRenRatRenRat: '',
    }
  }

  empty_reporte_legajos() {
    return {
      nLegDatCodigo: 0,
      cPerCodigo: '',
      cPerApellido: '',
      cPerNombre: '',
      cCargo: '',
      cArea: '',
      nTipo: 0,
      cTipoDesc: '',
      nRol: 0,
      cPerUsuCodigo: '',
      cPerEmail: '',
      cPerNroDoc: '',
      cPerTipoDoc: '',
      esDocente: 0,
      secc01: 0,
      secc02: 0,
      secc03: 0,
      secc04: 0,
      secc05: 0,
      secc06: 0,
      secc07: 0,
      secc08: 0,
      secc09: 0,
      secc10: 0,
      secc11: 0,
      secc12: 0,
      secc13: 0,
      secc14: 0,
      secc15: 0,
      secc16: 0,
    }
  }

  empty_GrupoInvestigacion() {
    return {
      nLegLidGrupInvSem: 0,
      nTipoLegLidGrupInvSemCodigo: 0,
      nInvCodigo: 0,
      cPerCodigo: 0,
      nLegLidGrupInvSemTitulo: '',
      nLegLidGrupInvSemArchivo: null,
      nLegLidGrupInvSemEstado: true,
      cFile: '',
      cArchivo: '',
      // nLegProdCodigo: 0,
      // nLegProdTipo: 0,
      // nValorTipo: 0,
      // cLegProdTitulo: '',
      // dLegProdFecha: new Date(''),
      // cLegProdNroResolucion: '',
      // cFile: null,
      // cLegProdArchivo: null,
      // nLegProdDatCodigo: 0,
      // cLegProdValida: false,
      // cLegProdEstado: true,
      // cUsuRegistro: '',
      // dFechaRegistro: new Date(''),
      // cUsuModifica: '',
      // dFechaModifica: new Date(''),
      // cUsuModificaNavigation: this.empty_perusuario(),
      // cUsuRegistroNavigation: this.empty_perusuario(),
      // vTipo: this.empty_interface(),
      // nLegProdDatCodigoNavigation: this.empty_datosgenerales(),
    }
  }

  public objusuario: DatosUsuario
  constructor() {
    this.objusuario = this.empty_datosusuario()
  }
}
