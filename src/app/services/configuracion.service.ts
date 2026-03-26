import { DatePipe } from '@angular/common'
import { Injectable } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { environment } from 'src/environments/environment'
import { isTemplateExpression } from 'typescript'
import { Constante } from '../models/general/constante'
import { Interface } from '../models/general/interface'
import { ListService } from './list.service'
import { PaginationService } from './pagination.service'
@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  public apiFile: String = environment.APIFILE
  public iconcat: string = 'arrow-circle-right'
  public textcat: string = 'Ir a subcategorías'
  public stcat: boolean = false
  public btncat: string = 'dark'
  public idcateg: string = ''
  public idsuperiorsub: string = ''
  public tipocat: string = 'categorías'
  public maxlength: number = 50
  public maxlengthcom: number = 200
  public bdocente: boolean = true
  public tcolaborador: number = 0
  public datepipe: DatePipe = new DatePipe('en-US')
  public nTipoColaborador: number = 0
  public cPrdNombre: string = '' // periodo (202102)
  public nCapacitacion: number = 0
  public nLegajoDatos: number = 0
  public cFiltroColaborador: string = ''
  public cConDescripcion: string = ''
  public cFiltroPeriodo: string = ''
  public nUniOrgCodigo: number = 0
  // ********************PARAMETROS COMBOS********************
  public nConCondicion: number = 1
  public nConDedicacion: number = 2
  public nConIdioma: number = 3
  public nConOfimatica: number = 4
  public nConNivelKills: number = 5
  public nConTipoTesis: number = 6
  public nConNivelTesis: number = 7
  public nConAmbitoCong: number = 8
  public nConRolCong: number = 9
  public nConDocumentoRec: number = 10
  public nConTipoRec: number = 11
  public nConTipoCapacitacion: number = 12
  public nConGrupoNivelInv: number = 13
  public nConTipoPublicaInv: number = 14
  public nConTipoProySoc: number = 15
  public nConCargaAdm: number = 16
  public nConCategoriaDoc: number = 17
  public nConTipoEspeCap: number = 18
  public nConTipoDomicilio: number = 19
  public nConSexo: number = 20
  public nConTipoDuracion: number = 21
  public nConEstadoCivil: number = 22
  public nConTipoZona: number = 23
  public nConTipoOfimatica: number = 24
  public nConTipoResolucion: number = 25
  public nConSemestre: number = 26
  public nConNivelEval: number = 27
  public nConTipoDocInt: number = 28
  public tipoGrupoInvestigador: number = 29


  public nConAfiliado: number = 30
  public nConEntidad: number = 31
  public nConHaberes: number = 32
  public nConBanco: number = 33
  public nConBancoAperturar: number = 34

  
  public nIntGradoAcad: number = 1
  public nIntTipoDocIdent: number = 2
  public nIntUbigeo: number = 3
  public nIntCargoUSS: number = 4
  public nIntAreaUSS: number = 5
  public nIntNacionalidad: number = 7
  public nPerUniversidad: number = 1
  public nPerColegio: number = 2
  public nIntIdiomaNativo: number = 8

  // Variable con el valor de parametro para obtener el listado de Niveles de Renacyt  EBS - 12/2025 
  public nIntNivelRenacyt: number = 15

  // Variable con el valor de parametro para obtener el listado de Condiciones de Licencias Profesionales  EBS - 01/2026 
  public nIntCondicionLic: number = 16


  // ********************PARAMETROS COMBOS********************

  // ********************PARAMETROS TAREAS LEGAJO ********************
  public nTareaEditarCV: number = 1
  public nTareaTarjeta: number = 2
  public nTareaExportarCV: number = 3
  public nTareaContrato: number = 4
  public nTareaCapInt: number = 5
  public nTareaResolucion: number = 6
  public nTareaEvaluacionDesemp: number = 7
  public nTareaSeleccion: number = 8
  public nTareaOrdinarizacion: number = 9
  public nTareaDocumentacionInterna: number = 10
  public nTareaExportarLegajo: number = 11
  public nTareaValidar: number = 12
  // ********************PARAMETROS TAREAS LEGAJO ********************
  constructor(
    private pageserv: PaginationService,
    private listserv: ListService,
  ) {}

  onNoClickDialog($dialogRef: any): void {
    $dialogRef.close()
  }

  listar_cargouss() {
    this.listserv.listado('interface', '/' + this.nIntCargoUSS).then((data) => {
      let ldata: Interface[] = data
      this.listserv.lCargoCont = ldata.filter((x) => x.nIntCodigo != 0)
      this.listserv.filtercargo = this.listserv.lCargoCont.slice()
    })
  }

  listar_areauss() {
    this.listserv.listado('interface', '/' + this.nIntAreaUSS).then((data) => {
      let ldata: Interface[] = data
      this.listserv.lAreaCont = ldata.filter((x) => x.nIntCodigo != 0)
      this.listserv.filterarea = this.listserv.lAreaCont.slice()
    })
  }

  listar_resoluciontipo() {
    this.listserv
      .listado('constante', '/' + this.nConTipoResolucion)
      .then((data) => {
        let ldata: Constante[] = data
        this.listserv.lTipoResolucion = ldata.filter((x) => x.nConValor != 0)
        this.listserv.lTResolucion = this.listserv.lTipoResolucion.filter(
          (x) => x.nConValor < 8010,
        )
      })
  }

  listar_semestre() {
    this.listserv.listado('constante', '/' + this.nConSemestre).then((data) => {
      let ldata: Constante[] = data
      this.listserv.lSemestre = ldata.filter((x) => x.nConValor != 0)
    })
    // console.log(this.listserv.lSemestre)
  }

  listar_tipodocinterna() {
    this.listserv
      .listado('constante', '/' + this.nConTipoDocInt)
      .then((data) => {
        let ldata: Constante[] = data
        this.listserv.lTipoDocInt = ldata.filter((x) => x.nConValor != 0)
      })
  }

  listar_anios() {
    let anioact = new Date().getFullYear()
    // console.log(anioact)
    for (let i = parseInt(anioact.toString()); i >= 2008; i--) {
      this.listserv.lAnio.push({
        nConCodigo: i,
        nConValor: i,
        cConDescripcion: i.toString(),
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
      })
    }
    // console.log(this.listserv.lAnio)
  }

  listar_niveleval($admin: boolean) {
    this.listserv
      .listado('constante', '/' + this.nConNivelEval)
      .then((data) => {
        let ldata: Constante[] = data
        if ($admin) {
          this.listserv.lNivelEval = ldata.filter(
            (x) => x.nConValor.toString().substr(0, 2) == '10',
          )
        } else {
          this.listserv.lNivelEval = ldata.filter(
            (x) => x.nConValor.toString().substr(0, 2) == '20',
          )
        }
        // console.log(this.listserv.lNivelEval)
        //  this.listserv.lNivelEval = ldata.filter(x=>x.nConValor != 0)
      })
  }
}
