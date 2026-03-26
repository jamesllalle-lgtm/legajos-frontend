import { EventEmitter, Injectable, Output } from '@angular/core'
import axios from 'axios'
import { environment } from './../../environments/environment'
import { HeaderautorizaService } from './headerautoriza.service'
import { PaginationService } from './pagination.service'
import { PageEvent } from '@angular/material/paginator'
import { SeguridadService } from './seguridad.service'
import { SesionService } from './sesion.service'
import { Formacion } from '../models/formacion'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { LegGradoTitulo } from '../models/legajo/leg-grado-titulo'
import { LegLicenciaProfesional } from '../models/legajo/leg-licencia-profesional'
import { Interface } from '../models/general/interface'
import { Constante } from '../models/general/constante'
import { Persona } from '../models/general/persona'
import { LegDocenciaUniv } from '../models/legajo/leg-docencia-univ'
import { LegCategoriaDocente } from '../models/legajo/leg-categoria-docente'
import { LegAdminitrativaCarga } from '../models/legajo/leg-adminitrativa-carga'
import { LegCapacitaciones } from '../models/legajo/leg-capacitaciones'
import { LegIdiomaOfimatica } from '../models/legajo/leg-idioma-ofimatica'
import { LegInvestigador } from '../models/legajo/leg-investigador'
import { LegParticipacionCongSem } from '../models/legajo/leg-participacion-cong-sem'
import { LegProduccionCiencia } from '../models/legajo/leg-produccion-ciencia'
import { LegProfesNoDocente } from '../models/legajo/leg-profes-no-docente'
import { LegProyeccionSocial } from '../models/legajo/leg-proyeccion-social'
import { LegReconocimiento } from '../models/legajo/leg-reconocimiento'
import { LegRegimenDedicacion } from '../models/legajo/leg-regimen-dedicacion'
import { LegTesisAseJur } from '../models/legajo/leg-tesis-ase-jur'
import { LegDatosGenerales } from '../models/legajo/leg-datos-generales'
import { NgxSpinnerService } from 'ngx-spinner'
import { DatosUsuario } from '../models/usuario'
import { TareaModulo } from '../models/seguridad/tarea-modulo'
import { CapacitacionesUss } from '../models/general/capacitaciones-uss'
import { LegCapacitacionInterna } from '../models/legajo/leg-capacitacion-interna'
import { MensajeLegajo } from '../models/general/mensaje-legajo'
import { CleanmodelService } from './cleanmodel.service'
import { ReporteCapacitaciones } from '../models/legajo/reporte-capacitaciones'
import { ConfiguracionService } from './configuracion.service'
import { LegContrato } from '../models/legajo/leg-contrato'
import { LegResolucion } from '../models/legajo/leg-resolucion'
import { LegEvaluacionDesemp } from '../models/legajo/leg-eval-desempeño'
import { LegSeleccion } from '../models/legajo/leg-seleccion'
import { LegOrdinarizacion } from '../models/legajo/leg-ordinarizacion'
import { LegDeclaracionJurada } from '../models/legajo/leg-declaracion-jurada'
import { LegDocumentacionInterna } from '../models/legajo/leg-documentacion-interna'
import { ReporteLegajos } from '../models/legajo/reporte-legajos'
import { ControlesService } from './controles.service'

import { Leg_Eva_Docentes_Carga_Lectiva_Notas } from 'src/app/models/legajo/leg_eva_docentes_carga_lectiva_notas'
import { Leg_Docentes_Carga_Lectiva } from 'src/app/models/legajo/leg_docentes_carga_lectiva'
import { Leg_Eva_RenovacionRatificacion } from 'src/app/models/legajo/leg_eva_renovacion_ratificacion'
import { Leg_Eva_Capacitaciones } from 'src/app/models/legajo/leg_eva_capacitaciones'
import { Leg_Eva_Investigaciones } from 'src/app/models/legajo/leg_eva_investigaciones'
import { ReporteCapacInvest } from '../models/legajo/reporte-capac-invest'

import { Periodo } from '../models/general/periodo'

import * as moment from 'moment'
import { LegArchivos } from '../models/legajo/leg-archivos'
import { escuelas } from '../models/escuelas'
import { async } from '@angular/core/testing'
import { RegistroConvocatoria } from '../models/RegistroConvocatoria'
import { Convocatoria } from '../models/Convocatoria'
import { Leg_Grup_Inv_Sem } from '../models/legajo/leg_grup_inv_sem'
import { LegMembresia } from '../models/legajo/leg-membresia'

@Injectable({
  providedIn: 'root',
})
export class ListService {
  pageEvent: PageEvent = new PageEvent()
  public _banvalidar: boolean = false
  public filterpais: any
  public filtercargo: any
  public filterarea: any
  public fechamax!: Date
  public fechamin!: Date
  public errorStateMatcher: String = ''
  public listColaboradores: DatosUsuario[] = []
  public listCapacitaciones: ReporteCapacitaciones[] = []
  public listLegajosCount: ReporteLegajos[] = []
  public escuelas: escuelas[] = []
  public listEvaDocentesCargaLectivaCount: Leg_Eva_RenovacionRatificacion[] = []
  public listDocentesCargaLectivaCount: Leg_Docentes_Carga_Lectiva[] = []
  public listCapacInvestCount: ReporteCapacInvest[] = []
  public lstProceso: RegistroConvocatoria[] = []
  public lstConvocaria: Convocatoria[] = []
  public lstFormacion: Formacion[] = []
  public lLegGradoTitulo: LegGradoTitulo[] = []

  // EBS - 01/2026 ---------------->
  public lLegLicenciaProfesional: LegLicenciaProfesional[] = []
  public lLegMembresia: LegMembresia[] = []
  // EBS - 01/2026 <----------------

  public lLegDocenciaUniv: LegDocenciaUniv[] = []
  public lCategoriaDocente: LegCategoriaDocente[] = []
  public lAdminitrativaCarga: LegAdminitrativaCarga[] = []
  public lcapacitaciones: LegCapacitaciones[] = []
  public lidiomasofimatica: LegIdiomaOfimatica[] = []
  public lidioma: LegIdiomaOfimatica[] = []
  public lofimatica: LegIdiomaOfimatica[] = []
  public linvestigador: LegInvestigador[] = []
  public lParticipacion: LegParticipacionCongSem[] = []
  public lProduccionCiencia: LegProduccionCiencia[] = []
  public lGrupoInvestigacion: Leg_Grup_Inv_Sem[] = []
  public lProfesNoDocente: LegProfesNoDocente[] = []
  public lProyeccionSoc: LegProyeccionSocial[] = []
  public lReconocimiento: LegReconocimiento[] = []
  public lRegimenDedic: LegRegimenDedicacion[] = []
  public lTesisAsesJur: LegTesisAseJur[] = []
  public lLegajos: LegDatosGenerales[] = []
  public lCapacitacionInterna: LegCapacitacionInterna[] = []
  public lContrato: LegContrato[] = []
  public lResolucion: LegResolucion[] = []
  public lEvaluacionDesemp: LegEvaluacionDesemp[] = []
  public lSeleccion: LegSeleccion[] = []
  public lOrdinarizacion: LegOrdinarizacion[] = []
  public LegDeclaracionJurada: LegDeclaracionJurada
  public lDocumentacionInterna: LegDocumentacionInterna[] = []

  public lGradoAcademico: Interface[] = []
  public lCondicionLic: Interface[] = []
  public lTipoDocIdentidad: Interface[] = []
  public lubigeo: Interface[] = []
  public ldepartamento: Interface[] = []
  public lprovincia: Interface[] = []
  public ldistrito: Interface[] = []
  public ldepartamentoNac: Interface[] = []
  public lprovinciaNac: Interface[] = []
  public ldistritoNac: Interface[] = []
  public lpaisNac: Interface[] = []
  public lnacionalidad: Interface[] = []
  public lCondicionColeg: Constante[] = []
  public lUniversidad: Persona[] = []
  public lColegio: Persona[] = []
  public lRegimenDed: Constante[] = []
  public lCategoriaDoc: Constante[] = []
  public lTipoDomicilio: Constante[] = []
  public lZona: Constante[] = []
  public lCentroRegistro: Interface[] = []
  public lNivelRenacyt: Interface[] = [] // EBS - 2025
  public lTipoTesis: Interface[] = []
  public lNivelTesis: Constante[] = []
  public lTipoProd: Interface[] = []
  public lSexo: Constante[] = []
  public lEstadoCivil: Constante[] = []
  public lIdiof: Constante[] = []
  public ltipoofimatica: Constante[] = []
  public lnivel: Constante[] = []
  public lTipoGrupoInvestigador: Interface[] = []
  public lLineas: Interface[] = []
  public lIdioma: Interface[] = []



  public lAfiliado: Constante[] = []
  public lEntidad: Constante[] = []
  public lHaberes: Constante[] = []
  public lBanco: Constante[] = []
  public lBancoAperturar: Constante[] = []
  

  lRolPart: Interface[] = []
  lAmbitoPart: Interface[] = []

  lArchivos: LegArchivos[] = []

  lCargoAdm: Constante[] = []
  lDocumentoRec: Constante[] = []
  lTipoRec: Constante[] = []
  lTipoParProy: Constante[] = []
  lTipoCap: Constante[] = []
  lEspecialidadCap: Constante[] = []
  lTResolucion: Constante[] = []
  lTipoResolucion: Constante[] = []
  lfTipoResolucion: Constante[] = []
  lNivelEval: Constante[] = []
  lfNivelEval: Constante[] = []
  lSemestre: Constante[] = []
  lAnio: Constante[] = []
  lTipoDocInt: Constante[] = []

  lPeriodo: Periodo[] = []
  lTipoUsuario: Periodo[] = []

  public lmsjLegajo: MensajeLegajo[] = []

  lCapacitacionesUSS: CapacitacionesUss[] = []

  lCargoCont: Interface[] = []
  lAreaCont: Interface[] = []

  public lTareasPermiso: TareaModulo[] = []

  constructor(
    private http: HttpClient,
    public hautserv: HeaderautorizaService,
    public pageService: PaginationService,
    public sserv: SesionService,
    public clmdserv: CleanmodelService,
    private spinner: NgxSpinnerService,
  ) {
    this.LegDeclaracionJurada = this.clmdserv.empty_declaracionjurada()
  }

  public listar(listar: any) {
    return listar
  }

  public exportLegajos(exportar: any) {
    return exportar
  }

  public calcularNotas(calcularNotas: any) {
    return calcularNotas
  }

  public cancelar(cancelar: any) {
    return cancelar
  }

  public getAll($route: String): Observable<any> {
    return this.http.get<any>('/api/' + $route)
  }

  public listado = async ($route: string, $request: any) => {
    let $data: any = []
    await axios
      .get(environment.URLAPI + $route + $request, {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then((response) => {
        if (response.data.cstate) {
          $data = response.data.odata
        }
      })
      .catch((error) => {
        console.log(error)
      })
    return $data
  }

  public list_evaluaciondocentescargalectiva = async (cPrdNombre: string) => {
    let $data: any = []
    let $lista: Leg_Eva_RenovacionRatificacion[] = []
    let $lista_carga_lect_notas: Leg_Eva_Docentes_Carga_Lectiva_Notas[] = []

    await axios
      .get(environment.URLAPI + 'evadocentescargalectiva/' + cPrdNombre, {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then((response) => {
        if (response.data.cstate) {
          $data = response.data.odata
          $lista_carga_lect_notas = $data

          for (let i = 0; i < $lista_carga_lect_notas.length; i++) {
            let obj: Leg_Eva_RenovacionRatificacion
            obj = {
              nRenRatCodigo: 0,
              nLegDatCodigo: $lista_carga_lect_notas[i].nLegDatCodigo,
              cPerCodigo: $lista_carga_lect_notas[i].cPerCodigo,
              cPerApellido: $lista_carga_lect_notas[i].cPerApellido,
              cPerNombre: $lista_carga_lect_notas[i].cPerNombre,
              cPerNroDoc: $lista_carga_lect_notas[i].cPerNroDoc,
              cCargo: $lista_carga_lect_notas[i].cArea,
              cArea: $lista_carga_lect_notas[i].cCargo,
              nLegRenRatEDD: $lista_carga_lect_notas[i].promedioEDD,
              nLegRenRatCD: 0,
              nLegRenRatPC: 0,
              nLegRenRatPromedio:
                Math.round($lista_carga_lect_notas[i].promedioEDD * 0.9 * 100) /
                100,
              cLegRenRatCondicion:
                Math.round($lista_carga_lect_notas[i].promedioEDD * 0.9 * 100) /
                  100 >
                14
                  ? 'SI'
                  : 'NO',
              cLegRenRatRenRat: '',
            }
            $lista[i] = obj
          }
        }
      })
      .catch((error) => {
        console.log(error)
      })
    return $lista
  }

  public consolidado_evaluacion = async (
    $index_leg: number,
    $nLegDatCodigo: number,
    $EDD: number,
  ) => {
    // console.log('ID LEGAJO :: ' + $nLegDatCodigo)

    var $regLegParticipacionCongSem: LegParticipacionCongSem[] = []
    var $regLegCapacitaciones: LegCapacitaciones[] = []
    var $regLegInvestigador: LegInvestigador[] = []
    var $regLegTesisAseJur: LegTesisAseJur[] = []
    var $regLegProduccionCiencia: LegProduccionCiencia[] = []

    var $reg_Eva_Capacitaciones: Leg_Eva_Capacitaciones
    var $reg_Eva_Investigaciones: Leg_Eva_Investigaciones

    $reg_Eva_Capacitaciones = this.clmdserv.empty_eva_capacitaciones()
    $reg_Eva_Investigaciones = this.clmdserv.empty_eva_investigaciones()

    var $puntaje_EDD = $EDD
    var $puntaje_CD = 0
    var $puntaje_PC = 0
    var $puntaje_PROMEDIO = 0

    // puntajes para Capacitacion Docente
    var $puntaje_CD_1 = 0
    var $puntaje_CD_2 = 0
    // puntajes para Produccion Cientifica
    var $puntaje_PC_1 = 0
    var $puntaje_PC_2 = 0
    var $puntaje_PC_3 = 0

    await axios
      .get(environment.URLAPI + 'participacion_lst/' + $nLegDatCodigo, {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then(async (response) => {
        if (response.data.cstate) {
          //console.log("Listando Participaciones..")
          $regLegParticipacionCongSem = response.data.odata

          //console.log("Nº PARTICIPACIONES "+$regLegParticipacionCongSem.length);

          if ($regLegParticipacionCongSem.length > 0) {
            $regLegParticipacionCongSem.forEach((item) => {
              let anios = this.getAnios(item.dLegParFecha)
              if (anios >= 5) {
                //console.log("ID PARTICIPACION : " + item.nLegParCodigo);
                //console.log("ROL : "+ item.nValorRol);
                //console.log("AMBITO : "+ item.nValorAmbito);

                // 30001 = INTERNACIONAL

                // 4001 = EXPOSITOR
                // 4002 = ORGANIZADOR
                // 4003 = PANELISTA
                // 4004 = ASISTENTE
                // 4005 = DELEGADO

                //SI ES PONENTE
                if (item.nValorRol == 40001 || item.nValorRol == 40006) {
                  if (
                    item.nValorAmbito == 30001 ||
                    item.nValorAmbito == 30100
                  ) {
                    $reg_Eva_Capacitaciones.ponente_inter = 4
                  } else {
                    $reg_Eva_Capacitaciones.ponente_nacional = 3
                  }
                }
                //SI ES ORGANIZADOR
                if (item.nValorRol == 40002 || item.nValorRol == 40007) {
                  if (
                    item.nValorAmbito == 30001 ||
                    item.nValorAmbito == 30100
                  ) {
                    $reg_Eva_Capacitaciones.organizador_inter = 2
                  } else {
                    $reg_Eva_Capacitaciones.organizador_nacional = 1
                  }
                }
                //SI ES ASISTENTE
                if (item.nValorRol == 40004 || item.nValorRol == 40008) {
                  if (
                    item.nValorAmbito == 30001 ||
                    item.nValorAmbito == 30100
                  ) {
                    $reg_Eva_Capacitaciones.asistente_inter = 2
                  } else {
                    $reg_Eva_Capacitaciones.asistente_nacional = 1
                  }
                }
              }
            })

            $puntaje_CD_1 =
              $reg_Eva_Capacitaciones.ponente_inter +
              $reg_Eva_Capacitaciones.ponente_nacional +
              $reg_Eva_Capacitaciones.organizador_inter +
              $reg_Eva_Capacitaciones.organizador_nacional +
              $reg_Eva_Capacitaciones.asistente_inter +
              $reg_Eva_Capacitaciones.asistente_nacional
          }
          //console.log("PUNTAJE 1 PARTICIPACION :: "+  $puntaje_CD_1);
        }
      })
      .catch((error) => {
        console.log(error)
      })

    await axios
      .get(environment.URLAPI + 'capacitacion_lst/' + $nLegDatCodigo, {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then(async (response) => {
        if (response.data.cstate) {
          // console.log("Listando Capacitaciones..")

          $regLegCapacitaciones = response.data.odata

          // console.log("Nº CAPACITACIONES "+$regLegCapacitaciones.length);

          if ($regLegCapacitaciones.length > 0) {
            await $regLegCapacitaciones.forEach((item) => {
              let anios = this.getAnios(item.dLegCapFechaFin)
              if (anios >= 5) {
                //console.log("ID CAPACITACION : " + item.nLegCapDatCodigo);
                //console.log("ROL : "+ item.nLegCapTipo);
                //console.log("HORAS LECTIVAS : "+ item.nLegCapHoras);

                //4000 = Diplomados u otros similares

                if (item.nLegCapTipo == 4000) {
                  $reg_Eva_Capacitaciones.capa_1 = 5
                } else {
                  $reg_Eva_Capacitaciones.capa_1 = 0
                }
                if (item.nLegCapHoras > 120) {
                  $reg_Eva_Capacitaciones.capa_2 = 4
                } else {
                  $reg_Eva_Capacitaciones.capa_2 = 0
                }
                if (item.nLegCapHoras >= 40 && item.nLegCapHoras <= 119) {
                  $reg_Eva_Capacitaciones.capa_3 = 3
                } else {
                  $reg_Eva_Capacitaciones.capa_3 = 0
                }
                if (item.nLegCapHoras <= 40) {
                  $reg_Eva_Capacitaciones.capa_4 = 2
                } else {
                  $reg_Eva_Capacitaciones.capa_4 = 0
                }
              }
            })

            let $suma = 0
            let $mayor = -1000
            $suma =
              $reg_Eva_Capacitaciones.capa_1 +
              $reg_Eva_Capacitaciones.capa_2 +
              $reg_Eva_Capacitaciones.capa_3 +
              $reg_Eva_Capacitaciones.capa_4

            if ($suma > 5) {
              if ($reg_Eva_Capacitaciones.capa_1 > $mayor) {
                $mayor = $reg_Eva_Capacitaciones.capa_1
                if ($reg_Eva_Capacitaciones.capa_2 > $mayor) {
                  $mayor = $reg_Eva_Capacitaciones.capa_2
                  if ($reg_Eva_Capacitaciones.capa_3 > $mayor) {
                    $mayor = $reg_Eva_Capacitaciones.capa_3
                    if ($reg_Eva_Capacitaciones.capa_4 > $mayor) {
                      $mayor = $reg_Eva_Capacitaciones.capa_4
                    }
                  }
                }
              }
              $puntaje_CD_2 = $mayor
            } else {
              $puntaje_CD_2 = $suma
            }
          }

          //console.log("PUNTAJE 2 CAPACITACION :: "+  $puntaje_CD_2);
        }
      })
      .catch((error) => {
        console.log(error)
      })

    // *********************************************************

    await axios
      .get(environment.URLAPI + 'investigador_lst/' + $nLegDatCodigo, {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then(async (response) => {
        if (response.data.cstate) {
          console.log('Listando Doc de Investigador...')

          $regLegInvestigador = response.data.odata

          console.log('Nº INVESTIGACIONES ' + $regLegInvestigador.length)

          if ($regLegInvestigador.length > 0) {
            await $regLegInvestigador.forEach((item) => {
              let anios = this.getAnios(item.dLegInvFechaFin)
              if (anios >= 5) {
                console.log('ID REGISTRO INV : ' + item.nValorCentroRegistro)
                //console.log("ROL : "+ item.nLegCapTipo);
                //console.log("HORAS LECTIVAS : "+ item.nLegCapHoras);

                // 11 = Nivel Carlos Monge Medrano
                if (
                  item.nValorCentroRegistro == 11 ||
                  (item.nValorCentroRegistro > 0 &&
                    item.nValorCentroRegistro < 5)
                ) {
                  $reg_Eva_Investigaciones.invs_a = 5
                }
                // 12 = Nivel María Rostworowski
                if (
                  item.nValorCentroRegistro == 12 ||
                  (item.nValorCentroRegistro > 4 &&
                    item.nValorCentroRegistro < 8)
                ) {
                  $reg_Eva_Investigaciones.invs_b = 6
                }
                // 13 = CTI Vitae CRI (Conducta responsable en investigación)
                if (
                  item.nValorCentroRegistro == 13 ||
                  (item.nValorCentroRegistro > 7 &&
                    item.nValorCentroRegistro < 10)
                ) {
                  $reg_Eva_Investigaciones.invs_c = 5
                }
                // 14 = CTI Vitae y ORCID
                if (
                  item.nValorCentroRegistro == 14 ||
                  item.nValorCentroRegistro == 10
                ) {
                  $reg_Eva_Investigaciones.invs_d = 4
                }
              }
            })

            let $suma = 0
            let $mayor = -1000
            $suma =
              $reg_Eva_Investigaciones.invs_a +
              $reg_Eva_Investigaciones.invs_b +
              $reg_Eva_Investigaciones.invs_c +
              $reg_Eva_Investigaciones.invs_d

            if ($suma > 7) {
              if ($reg_Eva_Investigaciones.invs_a > $mayor) {
                $mayor = $reg_Eva_Investigaciones.invs_a
                if ($reg_Eva_Investigaciones.invs_b > $mayor) {
                  $mayor = $reg_Eva_Investigaciones.invs_b
                  if ($reg_Eva_Investigaciones.invs_c > $mayor) {
                    $mayor = $reg_Eva_Investigaciones.invs_c
                    if ($reg_Eva_Investigaciones.invs_d > $mayor) {
                      $mayor = $reg_Eva_Investigaciones.invs_d
                    }
                  }
                }
              }
              $puntaje_PC_1 = $mayor
            } else {
              $puntaje_PC_1 = $suma
            }
          }
          //console.log("PUNTAJE 2 CAPACITACION :: "+  $puntaje_CD_2);
        }
      })
      .catch((error) => {
        console.log(error)
      })

    await axios
      .get(environment.URLAPI + 'tesisasejur_lst/' + $nLegDatCodigo, {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then(async (response) => {
        if (response.data.cstate) {
          console.log('Listando Asesoria y Jurado de Tesis...')

          $regLegTesisAseJur = response.data.odata

          console.log('Nº ASESORIA_JURADO_TESIS ' + $regLegTesisAseJur.length)

          if ($regLegTesisAseJur.length > 0) {
            let $suma_asesoria = 0
            let $suma_jurado = 0

            await $regLegTesisAseJur.forEach((item) => {
              let anios = this.getAnios(item.dLegTesFecha)
              if (anios >= 5) {
                console.log('ID TIPO ASESORIA/JURADO : ' + item.nValorTipo)
                //
                if (
                  item.nValorTipo == 7 ||
                  (item.nValorTipo > 0 && item.nValorTipo < 4)
                ) {
                  $suma_asesoria = $suma_asesoria + 0.5
                }
                if (
                  item.nValorTipo == 8 ||
                  (item.nValorTipo > 3 && item.nValorTipo < 7)
                ) {
                  $suma_jurado = $suma_jurado + 0.5
                }
              }
            })

            $reg_Eva_Investigaciones.ases_a = $suma_asesoria
            $reg_Eva_Investigaciones.ases_b = $suma_jurado

            let $suma = 0
            let $mayor = -1000
            $suma =
              $reg_Eva_Investigaciones.ases_a + $reg_Eva_Investigaciones.ases_b

            if ($suma > 5) {
              if ($reg_Eva_Investigaciones.ases_a > $mayor) {
                $mayor = $reg_Eva_Investigaciones.ases_a
                if ($reg_Eva_Investigaciones.ases_b > $mayor) {
                  $mayor = $reg_Eva_Investigaciones.ases_b
                }
              }
              $puntaje_PC_2 = $mayor
            } else {
              $puntaje_PC_2 = $suma
            }
          }
          console.log(
            'PUNTAJE 2 ASESORIA Y JURADO DE TESIS :: ' + $puntaje_PC_2,
          )
        }
      })
      .catch((error) => {
        console.log(error)
      })

    await axios
      .get(environment.URLAPI + 'produccionciencia_lst/' + $nLegDatCodigo, {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then(async (response) => {
        if (response.data.cstate) {
          console.log('Listando Produccion Cientifica, Lect y de Inv...')

          $regLegProduccionCiencia = response.data.odata

          console.log(
            'Nº PRODUCCION CIENTIFICA , LECT Y DE INV ' +
              $regLegProduccionCiencia.length,
          )

          if ($regLegProduccionCiencia.length > 0) {
            let $suma_a = 0
            let $suma_b = 0
            let $suma_c = 0
            let $suma_d = 0
            let $suma_e = 0

            await $regLegProduccionCiencia.forEach((item) => {
              let anios = this.getAnios(item.dLegProdFecha)
              if (anios >= 5) {
                console.log('ID REGISTRO PROD : ' + item.nValorTipo)
                //console.log("ROL : "+ item.nLegCapTipo);
                //console.log("HORAS LECTIVAS : "+ item.nLegCapHoras);

                if (item.nValorTipo == 100) {
                  $suma_a = $suma_a + 1
                }
                if (item.nValorTipo == 101) {
                  $suma_b = $suma_b + 1
                }
                if (item.nValorTipo == 102) {
                  $suma_c = $suma_c + 1
                }
                if (
                  item.nValorTipo == 103 ||
                  item.nValorTipo == 4 ||
                  item.nValorTipo == 5
                ) {
                  $suma_d = $suma_d + 0.5
                }
                if (
                  item.nValorTipo == 104 ||
                  item.nValorTipo == 2 ||
                  item.nValorTipo == 6
                ) {
                  $suma_e = $suma_e + 0.5
                }
              }
            })

            if ($suma_a <= 2) {
              $reg_Eva_Investigaciones.prod_a = $suma_a
            } else {
              $reg_Eva_Investigaciones.prod_a = 2
            }
            if ($suma_b <= 2) {
              $reg_Eva_Investigaciones.prod_b = $suma_b
            } else {
              $reg_Eva_Investigaciones.prod_b = 2
            }
            if ($suma_c <= 2) {
              $reg_Eva_Investigaciones.prod_c = $suma_c
            } else {
              $reg_Eva_Investigaciones.prod_c = 2
            }
            if ($suma_d <= 1) {
              $reg_Eva_Investigaciones.prod_d = $suma_d
            } else {
              $reg_Eva_Investigaciones.prod_d = 1
            }
            if ($suma_e <= 1) {
              $reg_Eva_Investigaciones.prod_e = $suma_e
            } else {
              $reg_Eva_Investigaciones.prod_e = 1
            }

            let $suma = 0
            let $mayor = -1000
            $suma =
              $reg_Eva_Investigaciones.prod_a +
              $reg_Eva_Investigaciones.prod_b +
              $reg_Eva_Investigaciones.prod_c +
              $reg_Eva_Investigaciones.prod_d +
              $reg_Eva_Investigaciones.prod_e

            if ($suma > 8) {
              if ($reg_Eva_Investigaciones.prod_a > $mayor) {
                $mayor = $reg_Eva_Investigaciones.prod_a
                if ($reg_Eva_Investigaciones.prod_b > $mayor) {
                  $mayor = $reg_Eva_Investigaciones.prod_b
                  if ($reg_Eva_Investigaciones.prod_c > $mayor) {
                    $mayor = $reg_Eva_Investigaciones.prod_c
                    if ($reg_Eva_Investigaciones.prod_d > $mayor) {
                      $mayor = $reg_Eva_Investigaciones.prod_d
                      if ($reg_Eva_Investigaciones.prod_e > $mayor) {
                        $mayor = $reg_Eva_Investigaciones.prod_e
                      }
                    }
                  }
                }
              }
              $puntaje_PC_3 = $mayor
            } else {
              $puntaje_PC_3 = $suma
            }
          }
          console.log(
            'PUNTAJE 3 ASESORIA Y JURADO DE TESIS :: ' + $puntaje_PC_3,
          )
        }
      })
      .catch((error) => {
        console.log(error)
      })

    //console.log("PUNTAJE EDD ::: "+$puntaje_EDD);
    $puntaje_CD = ($puntaje_CD_1 + $puntaje_CD_2) * 1.11
    //console.log("PUNTAJE CD ::: "+$puntaje_CD);

    $puntaje_PC = $puntaje_PC_1 + $puntaje_PC_2 + $puntaje_PC_3
    console.log('PUNTAJE PC::: ' + $puntaje_PC)

    $puntaje_PROMEDIO =
      $puntaje_EDD * 0.9 + $puntaje_CD * 0.05 + $puntaje_PC * 0.05
    //console.log("PUNTAJE FINAL PROMEDIO ::: "+$puntaje_PROMEDIO);

    this.listEvaDocentesCargaLectivaCount[$index_leg].nLegRenRatCD =
      Math.round($puntaje_CD * 100) / 100
    this.listEvaDocentesCargaLectivaCount[$index_leg].nLegRenRatPC =
      Math.round($puntaje_PC * 100) / 100
    this.listEvaDocentesCargaLectivaCount[$index_leg].nLegRenRatPromedio =
      Math.round($puntaje_PROMEDIO * 100) / 100
  }

  public list_docentescargalectiva = async () => {
    let $data: any = []
    let $lista: Leg_Docentes_Carga_Lectiva[] = []
    let $lista_carga_lect: Leg_Docentes_Carga_Lectiva[] = []

    await axios
      .get(environment.URLAPI + 'docentescargalectiva/', {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then((response) => {
        if (response.data.cstate) {
          console.log('Listando de Docentes Carga Lectiva.')
          $data = response.data.odata
          $lista_carga_lect = $data
          console.log($lista_carga_lect)

          for (let i = 0; i < $lista_carga_lect.length; i++) {
            let obj: Leg_Docentes_Carga_Lectiva

            let nLegDatCodigo = $lista_carga_lect[i].nLegDatCodigo
            let nLegGraDatCodigo = $lista_carga_lect[i].nLegGraDatCodigo
            let cIntDescripcion = $lista_carga_lect[i].cIntDescripcion
            let cLegGraInstitucion = $lista_carga_lect[i].cLegGraInstitucion // codigo de persona|institucion
            let cInstitucion = $lista_carga_lect[i].cInstitucion
            let cLegGraOtraInst = $lista_carga_lect[i].cLegGraOtraInst

            if (nLegDatCodigo == 0) {
              nLegGraDatCodigo = 0
              cIntDescripcion = 'SIN LEGAJO'
              cLegGraInstitucion = 'SIN LEGAJO'
              cInstitucion = 'SIN LEGAJO'
              cLegGraOtraInst = 'SIN LEGAJO'
            } else {
              if (nLegGraDatCodigo == 0 || cIntDescripcion == '') {
                cIntDescripcion = 'NO TIENE GRADO ACADEMICO'
                cLegGraInstitucion = 'NO TIENE GRADO ACADEMICO'
                cInstitucion = 'NO TIENE GRADO ACADEMICO'
                cLegGraOtraInst = 'NO TIENE GRADO ACADEMICO'
              }
              if (cLegGraInstitucion == '') {
                cInstitucion = cLegGraOtraInst
              }
            }

            obj = {
              nLegDatCodigo: nLegDatCodigo,
              cPerCodigo: $lista_carga_lect[i].cPerCodigo,
              cPerNombre: $lista_carga_lect[i].cPerNombre,
              cPerApellido: $lista_carga_lect[i].cPerApellido,
              nLegGraDatCodigo: nLegGraDatCodigo,
              cIntDescripcion: cIntDescripcion,
              cLegGraInstitucion: cLegGraInstitucion,
              cInstitucion: cInstitucion,
              cLegGraOtraInst: cLegGraOtraInst,
            }
            $lista[i] = obj
          }
        }
      })
      .catch((error) => {
        console.log(error)
      })
    return $lista
  }

  getAnios(fecha_registrada: Date) {
    let anio_actual = moment(new Date()).format('YYYY')
    let mes_actual = moment(new Date()).format('MM')
    let dia_actual = moment(new Date()).format('DD')

    let anio_ = fecha_registrada.toString().substr(0, 4)
    let mes_ = fecha_registrada.toString().substr(5, 2)
    let dia_ = fecha_registrada.toString().substr(8, 2)

    let anios = Number(anio_actual) - Number(anio_)
    let diferenciaMeses = Number(mes_actual) - Number(mes_)
    if (
      diferenciaMeses < 0 ||
      (diferenciaMeses === 0 && Number(dia_actual) < Number(dia_))
    ) {
      anios--
    }
    return anios
  }

  public fileprev = async ($route: string, $request: any) => {
    let $data: any
    await axios
      .get(environment.URLAPI + $route + $request)
      .then((data) => {
        $data = data
      })
      .catch((error) => {
        console.log(error)
      })
    return $data
  }

  listar_gradotitulo(ncodigo: number) {
    this.spinner.show()
    this.listado('gradotitulo_lst', '/' + ncodigo).then((data) => {
      this.lLegGradoTitulo = data
      if (this._banvalidar) {
        this.lLegGradoTitulo = this.lLegGradoTitulo.filter(
          (x) => x.cLegGraValida == false,
        )
      }
      this.lLegGradoTitulo.forEach((item) => {
        if (item.cLegGraInstitucion.trim() == '') {
          item.cLegGraInstitucionNavigation = this.clmdserv.empty_persona()
          item.cLegGraInstitucion = this.clmdserv.codigonoinst
        }
        item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? ''
        item.vGradoAcad.cIntDescripcion = item.vGradoAcad.cIntDescripcion ?? ''
        item.cLegGraInstitucionNavigation.cPerNombre =
          item.cLegGraInstitucionNavigation.cPerNombre ??
          this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegGraArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegGraArchivo ??
          environment.CERTDEFAULT
      })
      this.spinner.hide()
    })
  }

  // EBS - 01-2026 ------------------------>
  listar_licenciaprofesional(ncodigo: number) {
    this.spinner.show()
    this.listado('licenciaprofesional_lst', '/' + ncodigo).then((data) => {
      this.lLegLicenciaProfesional = data
      if (this._banvalidar) {
        this.lLegLicenciaProfesional = this.lLegLicenciaProfesional.filter(
          (x) => x.cLegLicValida == false,
        )
      }
      this.lLegLicenciaProfesional.forEach((item) => {
        if (item.cLegLicInstitucion.trim() == '') {
          item.cLegLicInstitucionNavigation = this.clmdserv.empty_persona()
          item.cLegLicInstitucion = this.clmdserv.codigonoinst
        }
        item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? ''
        item.vCondicion.cIntDescripcion = item.vCondicion.cIntDescripcion ?? ''
        item.cLegLicInstitucionNavigation.cPerNombre =
          item.cLegLicInstitucionNavigation.cPerNombre ??
          this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
      })
      this.spinner.hide()
    })
  }

  listar_membresia(ncodigo: number) {
    this.spinner.show()
    this.listado('membresia_lst', '/' + ncodigo).then((data) => {
      this.lLegMembresia = data
      if (this._banvalidar) {
        this.lLegMembresia = this.lLegMembresia.filter(
          (x) => x.cLegMemValida == false,
        )
      }
      this.lLegMembresia.forEach((item) => {
        if (item.cLegMemInstitucion.trim() == '') {
          item.cLegMemInstitucionNavigation = this.clmdserv.empty_persona()
          item.cLegMemInstitucion = this.clmdserv.codigonoinst
        }
        item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? ''
        item.cLegMemInstitucionNavigation.cPerNombre =
          item.cLegMemInstitucionNavigation.cPerNombre ??
          this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
      })
      this.spinner.hide()
    })
  }
  // EBS - 01-2026 <------------------------

  listar_experienciadocencia(ncodigo: number) {
    this.listado('docenciauniv_lst', '/' + ncodigo).then((data) => {
      this.lLegDocenciaUniv = data
      if (this._banvalidar) {
        this.lLegDocenciaUniv = this.lLegDocenciaUniv.filter(
          (x) => x.cLegDocValida == false,
        )
      }
      this.lLegDocenciaUniv.forEach((item) => {
        if (item.cLegDocUniversidad.trim() == '') {
          item.cLegDocUniversidad = this.clmdserv.codigonoinst
          item.cLegDocUniversidadNavigation = this.clmdserv.empty_persona()
        }
        item.vCategoria.cConDescripcion = item.vCategoria.cConDescripcion ?? ''
        item.vRegimen.cConDescripcion = item.vRegimen.cConDescripcion ?? ''
        item.cLegDocUniversidadNavigation.cPerNombre =
          item.cLegDocUniversidadNavigation.cPerNombre ??
          this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegDocArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegDocArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_categoriadocente(ncodigo: number) {
    this.listado('categoriadocente_lst', '/' + ncodigo).then((data) => {
      this.lCategoriaDocente = data
      if (this._banvalidar) {
        this.lCategoriaDocente = this.lCategoriaDocente.filter(
          (x) => x.cLegCatValida == false,
        )
      }
      this.lCategoriaDocente.forEach((item) => {
        if (item.cLegCatInstitucion.trim() == '') {
          item.cLegCatInstitucion = this.clmdserv.codigonoinst
          item.cLegCatInstitucionNavigation = this.clmdserv.empty_persona()
        }
        item.vCategoria.cConDescripcion = item.vCategoria.cConDescripcion ?? ''
        item.cLegCatInstitucionNavigation.cPerNombre =
          item.cLegCatInstitucionNavigation.cPerNombre ??
          this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegCatArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegCatArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_experiencianodocente(ncodigo: number) {
    this.listado('experiencianodoc_lst', '/' + ncodigo).then((data) => {
      this.lProfesNoDocente = data
      if (this._banvalidar) {
        this.lProfesNoDocente = this.lProfesNoDocente.filter(
          (x) => x.cLegProValida == false,
        )
      }
      this.lProfesNoDocente.forEach((item) => {
        if (item.cLegProInstitucion.trim() == '') {
          item.cLegProInstitucion = this.clmdserv.codigonoinst
          item.cLegProInstitucionNavigation = this.clmdserv.empty_persona()
        }
        item.vCargo.cConDescripcion = item.vCargo.cConDescripcion ?? ''
        item.cLegProInstitucionNavigation.cPerNombre =
          item.cLegProInstitucionNavigation.cPerNombre ??
          this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegProArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegProArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_regimendedicacion(ncodigo: number) {
    this.listado('regimendedicacion_lst', '/' + ncodigo).then((data) => {
      this.lRegimenDedic = data
      if (this._banvalidar) {
        this.lRegimenDedic = this.lRegimenDedic.filter(
          (x) => x.cLegRegValida == false,
        )
      }
      this.lRegimenDedic.forEach((item) => {
        if (item.cLegCatInstitucion.trim() == '') {
          item.cLegCatInstitucion = this.clmdserv.codigonoinst
          item.cLegCatInstitucionNavigation = this.clmdserv.empty_persona()
        }
        item.vDedicacion.cConDescripcion =
          item.vDedicacion.cConDescripcion ?? ''
        item.cLegCatInstitucionNavigation.cPerNombre =
          item.cLegCatInstitucionNavigation.cPerNombre ??
          this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegRegArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegRegArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_domidiomaofimatica(ncodigo: number) {
    this.listado('idiomaofimatica_lst', '/' + ncodigo).then((data) => {
      this.lidiomasofimatica = data
      if (this._banvalidar) {
        this.lidiomasofimatica = this.lidiomasofimatica.filter(
          (x) => x.cLegIdOfValida == false,
        )
      }
      this.lidiomasofimatica.forEach((item) => {
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegIdOfArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegIdOfArchivo ??
          environment.CERTDEFAULT
        item.vCodigoDesc.cConDescripcion =
          item.vCodigoDesc.cConDescripcion ?? ''
        item.vNivel.cConDescripcion = item.vNivel.cConDescripcion ?? ''
      })
      this.lofimatica = this.lidiomasofimatica.filter(
        (x) => x.cLegIdOfTipo == true,
      )
      this.lidioma = this.lidiomasofimatica.filter(
        (x) => x.cLegIdOfTipo == false,
      )
    })
  }

  listar_docenteinvestigador(ncodigo: number) {
    this.listado('investigador_lst', '/' + ncodigo).then((data) => {
      this.linvestigador = data
      if (this._banvalidar) {
        this.linvestigador = this.linvestigador.filter(
          (x) => x.cLegInvValida == false,
        )
      }
      this.linvestigador.forEach((item) => {
        item.vCentroRegistro.cIntDescripcion =
          item.vCentroRegistro.cIntDescripcion ?? ''
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegInvArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegInvArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_tesisasejur(ncodigo: number) {
    this.listado('tesisasejur_lst', '/' + ncodigo).then((data) => {
      this.lTesisAsesJur = data
      if (this._banvalidar) {
        this.lTesisAsesJur = this.lTesisAsesJur.filter(
          (x) => x.cLegTesValida == false,
        )
      }
      this.lTesisAsesJur.forEach((item) => {
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegTesArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegTesArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_produccionciencia(ncodigo: number) {
    this.listado('produccionciencia_lst', '/' + ncodigo).then((data) => {
      this.lProduccionCiencia = data
      if (this._banvalidar) {
        this.lProduccionCiencia = this.lProduccionCiencia.filter(
          (x) => x.cLegProdValida == false,
        )
      }
      this.lProduccionCiencia.forEach((item) => {
        item.vTipo.cIntDescripcion = item.vTipo.cIntDescripcion ?? ''
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegProdArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegProdArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_participacion(ncodigo: number) {
    this.listado('participacion_lst', '/' + ncodigo).then((data) => {
      this.lParticipacion = data
      if (this._banvalidar) {
        this.lParticipacion = this.lParticipacion.filter(
          (x) => x.cLegParValida == false,
        )
      }
      this.lParticipacion.forEach((item) => {
        if (item.cLegParInstitucion.trim() == '') {
          item.cLegParInstitucion = this.clmdserv.codigonoinst
          item.cLegParInstitucionNavigation = this.clmdserv.empty_persona()
        }
        item.vAmbito.cIntDescripcion = item.vAmbito.cIntDescripcion ?? ''
        item.vRol.cIntDescripcion = item.vRol.cIntDescripcion ?? ''
        item.cLegParInstitucionNavigation.cPerNombre =
          item.cLegParInstitucionNavigation.cPerNombre ??
          this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegParArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegParArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_cargaadmin(ncodigo: number) {
    this.listado('cargaadmin_lst', '/' + ncodigo).then((data) => {
      this.lAdminitrativaCarga = data
      if (this._banvalidar) {
        this.lAdminitrativaCarga = this.lAdminitrativaCarga.filter(
          (x) => x.cLegAdmValida == false,
        )
      }
      this.lAdminitrativaCarga.forEach((item) => {
        if (item.cLegAdmInstitucion.trim() == '') {
          item.cLegAdmInstitucion = this.clmdserv.codigonoinst
          item.cLegAdmInstitucionNavigation = this.clmdserv.empty_persona()
        }
        item.vCargo.cConDescripcion = item.vCargo.cConDescripcion ?? ''
        item.cLegAdmInstitucionNavigation.cPerNombre =
          item.cLegAdmInstitucionNavigation.cPerNombre ??
          this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegAdmArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegAdmArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_reconocimiento(ncodigo: number) {
    this.listado('reconocimiento_lst', '/' + ncodigo).then((data) => {
      this.lReconocimiento = data
      if (this._banvalidar) {
        this.lReconocimiento = this.lReconocimiento.filter(
          (x) => x.cLegRecValida == false,
        )
      }
      this.lReconocimiento.forEach((item) => {
        if (item.cLegRecInstitucion.trim() == '') {
          item.cLegRecInstitucion = this.clmdserv.codigonoinst
          item.cLegRecInstitucionNavigation = this.clmdserv.empty_persona()
        }
        item.vDocumento.cConDescripcion = item.vDocumento.cConDescripcion ?? ''
        item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
        item.cLegRecInstitucionNavigation.cPerNombre =
          item.cLegRecInstitucionNavigation.cPerNombre ??
          this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegRecArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegRecArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_capacitacion(ncodigo: number) {
    this.listado('capacitacion_lst', '/' + ncodigo).then((data) => {
      this.lcapacitaciones = data
      if (this._banvalidar) {
        this.lcapacitaciones = this.lcapacitaciones.filter(
          (x) => x.cLegCapValida == false,
        )
      }
      this.lcapacitaciones.forEach((item) => {
        if (item.cLegCapInstitucion.trim() == '') {
          item.cLegCapInstitucion = this.clmdserv.codigonoinst
          item.vInstitucion = this.clmdserv.empty_persona()
        }
        item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
        item.vTipoEsp.cConDescripcion = item.vTipoEsp.cConDescripcion ?? ''
        item.vInstitucion.cPerNombre =
          item.vInstitucion.cPerNombre ?? this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegCapArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegCapArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_proyeccionsocial(ncodigo: number) {
    this.listado('proyeccionsocial_lst', '/' + ncodigo).then((data) => {
      this.lProyeccionSoc = data
      if (this._banvalidar) {
        this.lProyeccionSoc = this.lProyeccionSoc.filter(
          (x) => x.cLegProyValida == false,
        )
      }
      this.lProyeccionSoc.forEach((item) => {
        if (item.cLegProyInstitucion.trim() == '') {
          item.cLegProyInstitucion = this.clmdserv.codigonoinst
          item.cLegProyInstitucionNavigation = this.clmdserv.empty_persona()
        }
        item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
        item.cLegProyInstitucionNavigation.cPerNombre =
          item.cLegProyInstitucionNavigation.cPerNombre ??
          this.clmdserv.nombrenoinst
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegProyArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegProyArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_capacitacioninterna(ncodigo: number) {
    this.listado('capacitacioninterna_lst', '/' + ncodigo).then((data) => {
      this.lCapacitacionInterna = data
      this.lCapacitacionInterna.forEach((item) => {
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegCiarchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegCiarchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_contrato(ncodigo: number) {
    this.listado('contrato_lst', '/' + ncodigo).then((data) => {
      this.lContrato = data
      this.lContrato.forEach((item) => {
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegConArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegConArchivo ??
          environment.CERTDEFAULT
        item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
        item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
      })
    })
  }

  listar_resoluciones(ncodigo: number) {
    this.listado('resolucion_lst', '/' + ncodigo).then((data) => {
      this.lResolucion = data
      this.lResolucion.forEach((item) => {
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegResArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegResArchivo ??
          environment.CERTDEFAULT
        item.vResolucion.cConDescripcion =
          item.vResolucion.cConDescripcion ?? ''
      })
    })
  }

  listar_evaluaciondesemp(ncodigo: number) {
    this.listado('evaluaciondesemp_lst', '/' + ncodigo).then((data) => {
      this.lEvaluacionDesemp = data
      this.lEvaluacionDesemp.forEach((item) => {
        item.cUsuRegistro = item.cUsuRegistro.substr(
          item.cUsuRegistro.length - 3,
          3,
        )
        item.cLegEvalArchivo =
          (item.cUsuRegistro == 'pdf'
            ? environment.APIFILEPDF
            : environment.APIFILE) + item.cLegEvalArchivo ??
          environment.CERTDEFAULT
        item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
        item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
      })
    })
  }

  listar_Seleccion(ncodigo: number) {
    this.listado('seleccion_lst', '/' + ncodigo).then((data) => {
      this.lSeleccion = data
      this.lSeleccion.forEach((item) => {
        item.cLegSelEvaluacionCv =
          environment.APIFILEPDF + item.cLegSelEvaluacionCv ??
          environment.CERTDEFAULT
        item.cLegSelClaseModelo =
          environment.APIFILEPDF + item.cLegSelClaseModelo ??
          environment.CERTDEFAULT
        item.cLegSelEvaluacionPsico =
          environment.APIFILEPDF + item.cLegSelEvaluacionPsico ??
          environment.CERTDEFAULT
        item.cLegSelEntrevistaPers =
          environment.APIFILEPDF + item.cLegSelEntrevistaPers ??
          environment.CERTDEFAULT
        item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
        item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
      })
    })
  }

  listar_Ordinarizacion(ncodigo: number) {
    this.listado('ordinarizacion_lst', '/' + ncodigo).then((data) => {
      this.lOrdinarizacion = data
      this.lOrdinarizacion.forEach((item) => {
        item.cLegOrdFichaInscripcion =
          environment.APIFILEPDF + item.cLegOrdFichaInscripcion ??
          environment.CERTDEFAULT
        item.cLegOrdEvaluacionCv =
          environment.APIFILEPDF + item.cLegOrdEvaluacionCv ??
          environment.CERTDEFAULT
        item.cLegOrdClaseModelo =
          environment.APIFILEPDF + item.cLegOrdClaseModelo ??
          environment.CERTDEFAULT
        item.cLegOrdEvaluacionPsico =
          environment.APIFILEPDF + item.cLegOrdEvaluacionPsico ??
          environment.CERTDEFAULT
        item.cLegOrdEntrevistaPers =
          environment.APIFILEPDF + item.cLegOrdEntrevistaPers ??
          environment.CERTDEFAULT
        item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
        item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
      })
    })
  }

  listar_DocumentacionInterna(ncodigo: number) {
    this.listado('documentacioninterna_lst', '/' + ncodigo).then((data) => {
      this.lDocumentacionInterna = data
      this.lDocumentacionInterna.forEach((item) => {
        item.cLegDiarchivo =
          environment.APIFILEPDF + item.cLegDiarchivo ?? environment.CERTDEFAULT
        item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
      })
    })
  }

  listar_grupo_investigacion(cPerCodigo: String) {
    this.listado(
      'leg_grup_inv_sem/list_leg_grup_inv?cPcPerCodigo=' + cPerCodigo,
      '',
    ).then((data) => {
      this.lGrupoInvestigacion = data
      this.lGrupoInvestigacion.forEach((item) => {
        item.extension = item.cArchivo.substr(item.cArchivo.length - 3, 3)
        item.nLegLidGrupInvSemArchivo =
          environment.APIFILEPDF + item.nLegLidGrupInvSemArchivo ??
          environment.CERTDEFAULT
      })
    })
  }

  listar_colaboradores(ntipo: number) {
    this.listado(
      'listausuarios',
      '/' + ntipo + '/' + '0',
    ).then((data) => {
      this.listColaboradores = data
    })
  }
  cargar_carreras() {
    this.listado('cargar_escuelas', '').then((data) => {
      this.escuelas = data
    })
  }

  return_permiso($opcion: number) {
    return this.lTareasPermiso.filter((x) => x.nTarModCodigo == $opcion).length
  }

  // validar_codigo_personas(ncodigo: String) {
  public validar_codigo_personas = async (ncodigo: string) => {
    let validacion = true
    await axios
      .get(environment.URLAPI + 'validarcPerCodigo/' + ncodigo, {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then((response) => {
        if (response.data.cstate) {
          if (!response.data.odata) {
            validacion = false
          }
        }
      })
    return validacion
  }
  public verififcarValidacionDocumento = async (ncodigo: string) => {
    let datos = null
    await axios
      .get(
        environment.URLAPI +
          'legajoaux/exportar_verificarvalidaciones/' +
          ncodigo,
        {
          headers: {
            Authorization:
              'Bearer ' +
              this.sserv
                .gettoken(sessionStorage.getItem('token') ?? '')
                .toString(),
          },
        },
      )
      .then((response) => {
        console.log(response.data)

        datos = response.data
      })
    return datos
  }

  public cargaConvocatoria = async (pPrdCodigo: number) => {
    let datos = null
    await axios
      .get(environment.URLAPI + `convocatoria/${pPrdCodigo}/`, {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then((response) => {
        this.lstConvocaria = response.data.odata
      })
    return this.lstConvocaria
  }
  public listaRegistroConvocatoria = async (pConvocatoria: number) => {
    let datos = null
    await axios
      .get(
        environment.URLAPI +
          'RegistroConvocatoria/listarRegistroConvocatoria/' +
          pConvocatoria,
        {
          headers: {
            Authorization:
              'Bearer ' +
              this.sserv
                .gettoken(sessionStorage.getItem('token') ?? '')
                .toString(),
          },
        },
      )
      .then((response) => {
        this.lstProceso = response.data.odata
      })
    return this.lstProceso
  }
}
