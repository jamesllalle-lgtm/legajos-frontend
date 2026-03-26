import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { NewService } from 'src/app/services/new.service'
import Swal from 'sweetalert2'
import { environment } from './../../../environments/environment'
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core'
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from 'src/app/helpers/format-datepicker'
import { ConfiguracionService } from 'src/app/services/configuracion.service'
import { ListService } from 'src/app/services/list.service'
import { RegisterService } from 'src/app/services/register.service'
import { SeguridadService } from 'src/app/services/seguridad.service'
import { DatosUsuario } from 'src/app/models/usuario'
import { ControlesService } from 'src/app/services/controles.service'
import { NavigationEnd, Router } from '@angular/router'
import { PaginationService } from 'src/app/services/pagination.service'
import { PageEvent } from '@angular/material/paginator'
import { NewmodalService } from 'src/app/services/newmodal.service'
import { CleanmodelService } from 'src/app/services/cleanmodel.service'
import { ReporteCapacitaciones } from 'src/app/models/legajo/reporte-capacitaciones'
import { ReporteLegajos } from 'src/app/models/legajo/reporte-legajos'

import { Leg_Eva_RenovacionRatificacion } from 'src/app/models/legajo/leg_eva_renovacion_ratificacion'
import { ReporteCapacInvest } from 'src/app/models/legajo/reporte-capac-invest'
import axios from 'axios'
import { SesionService } from 'src/app/services/sesion.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { HttpClient } from '@angular/common/http'
import { HeaderautorizaService } from 'src/app/services/headerautoriza.service'
import { LegDatosGenerales } from 'src/app/models/legajo/leg-datos-generales'
import { MatDialog } from '@angular/material/dialog'
import { ModalExpartarLegajoComponent } from 'src/app/components/legajo/modal-expartar-legajo/modal-expartar-legajo.component'
import { ExportExcelService } from 'src/app/services/exportarexcel.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class ButtonComponent implements OnInit, OnDestroy {
  navigationSubscription
  @Output() openNvo = new EventEmitter()
  @Output() openList = new EventEmitter()
  @Output() openListSC = new EventEmitter()
  @Input() banctrl: any = [false, false, false, false, false, false]
  banfecha: boolean = this.banctrl[0]

  bancaja: boolean = this.banctrl[1]
  banexportar: boolean = this.banctrl[2]
  bannuevo: boolean = this.banctrl[5]
  banrangfecha: boolean = this.banctrl[3]
  bangrupo: boolean = this.banctrl[4]
  campaignOne: FormGroup = new FormGroup({})
  today: Date | undefined
  datepast: Date | undefined
  classanc: String = 'col-lg-5'
  date: any
  cajamd: string = '3'
  grupocj: string = '0'
  dataForExcel: any[] = []
  empPerformance: any[] = []
  pageEvent: PageEvent = new PageEvent()
  @Input() opcion: number = 0
  @Input() modulo: string = ''
  public iralistado: any
  // public gruporecaudacion_lst: gruporecaudacion[] = []
  // public grecaud_aux: gruporecaudacion[] = []
  public idcaja: string = ''
  panelOpenState = false
  constructor(
    private location: Location,
    public ete: ExportExcelService,
    public sserv: SesionService,
    public nvoservc: NewService,
    public configservc: ConfiguracionService,
    public listserv: ListService,
    public mdlserv: NewmodalService,
    public regserv: RegisterService,
    public ctrlserv: ControlesService,
    public segserv: SeguridadService,
    public clmdserv: CleanmodelService,
    private router: Router,
    public pageService: PaginationService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    public hautserv: HeaderautorizaService,
    public dialog: MatDialog,
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites()
      }
    })
  }

  initialiseInvites() {
    // Set default values and re-fetch any data you need.
    if (this.modulo == 'TESORERIA') {
      this.date = new FormControl(new Date())
      this.today = new Date()
      this.datepast = new Date()
      this.datepast.setDate(this.datepast.getDate() - 7)
      this.campaignOne = new FormGroup({
        start: new FormControl(this.datepast),
        end: new FormControl(this.today),
      })
      this.listserv.fechamax = this.today
      this.listserv.fechamin = this.datepast
    }
    if (this.modulo == 'CONFIGURACION') {
      this.configservc.idcateg = ''
      this.bangrupo = true
      this.bancaja = false
      this.configservc.stcat = true
    }
  }

  ngOnInit(): void {
    /* PERMISOS*/
    // let acciones = JSON.
    // parse(
    //   localStorage.getItem('acciones') || 'Default Value',
    // )
    // this.iralistado = acciones.filter((v: any) => v.id == 1).length > 0 ? true : false
    

    /* PERMISOS*/
    let acciones = JSON.parse(localStorage.getItem('acciones') || '[]');
    this.iralistado = acciones.filter((v: any) => v.id == 1).length > 0;

    //console.log("permisos:"+this.iralistado)

    /* ACCIONES */
    this.initialiseInvites()
    if (this.ctrlserv.isSmallScreen) {
      this.ctrlserv.vsald = false
    }
    this.banfecha = this.banctrl[0]
    this.bancaja = this.banctrl[1]
    this.banexportar = this.banctrl[2]
    this.banrangfecha = this.banctrl[3]
    this.bangrupo = this.banctrl[4]
    this.bannuevo = this.banctrl[5]
    switch (this.modulo) {
      case 'TESORERIA':
        if (
          !this.banfecha &&
          !this.bancaja &&
          !this.banrangfecha &&
          !this.bangrupo
        ) {
          this.classanc = 'col-12'
        } else {
          this.classanc = 'col-lg-5'
        }
        break
      case 'CONFIGURACION':
        if (!this.bancaja && !this.bangrupo) {
          this.classanc = 'col-12'
        } else {
          this.classanc = 'col-lg-5'
        }
        break
      default:
        this.classanc = 'col-12'
        break
    }

    if (this.opcion == 1001) {
      this.listar_capacitacionesuss()
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe()
    }
  }

  comboOnChange(nTipo: number) {
    this.configservc.nLegajoDatos = 0
    this.configservc.nTipoColaborador = nTipo
    this.listserv.listColaboradores = []
    this.listserv.listar(null)
  }

  comboOnChangePer(cPrdNombre: string) {
    this.configservc.nLegajoDatos = 0
    this.configservc.cPrdNombre = cPrdNombre
    this.listserv.listColaboradores = []
    this.listserv.listar(null)
  }

  comboOnChangeLeg(nTipo: number) {
    let dataglobal: DatosUsuario[] = []
    if (nTipo == 0) {
      dataglobal = this.listserv.listColaboradores
    }
    if (nTipo == 1) {
      dataglobal = this.listserv.listColaboradores.filter(
        (datousu: DatosUsuario) => datousu.bLegajo == true,
      )
    }
    if (nTipo == 2) {
      dataglobal = this.listserv.listColaboradores.filter(
        (datousu: DatosUsuario) => datousu.bLegajo == false,
      )
    }
    this.pageService.dataglobal = dataglobal
    this.pageService.collectionSize = dataglobal.length
    this.pageService.dataSource = dataglobal
    this.pageEvent.pageIndex = 0
    this.pageEvent.pageSize = 5
    this.pageEvent.length = dataglobal.length
    this.pageService.actualizaTabla2(dataglobal, this.pageEvent)
  }

  cleanrepcapac() {
    this.listserv.listCapacitaciones = []
    this.pageService.dataglobal = []
    this.pageService.dataSource = []
  }

  cleanrepleg() {
    this.listserv.listLegajosCount = []
    this.pageService.dataglobal = []
    this.pageService.dataSource = []
  }

  listEvent(e: any) {
    this.listserv.listar(this.openList.emit(e))
  }

  exportLegajos(): void {
    const dialogRef = this.dialog.open(ModalExpartarLegajoComponent, {
      width: '40%',
    })
    dialogRef.afterClosed().subscribe((res) => {
      console.log('res')
      console.log(res)
    })
  }
  // exportLegajos(e: any) {
  //   console.log(e);

  //   // this.listserv.exportLegajos(this.openList.emit(e))
  //   this.spinner.show()
  //   this.listserv.listado('legajos_exp_zip/', `0/${this.configservc.cPrdNombre}`).then((data) => {
  //     console.log("Export legajos :: " + data);

  //     Swal.fire("Exportació de Legajos", `Puede descargar los documentos en este link : <a href="http://localhost/legajo_export/${data}" target="_blank">Descargar</a>`, "info")
  //     this.spinner.hide()
  //   });
  // }

  async exportLegajosExcel() {
    this.spinner.show()
    await axios
      .get(
        environment.URLAPI + `excel_usuarios/0/${this.configservc.cPrdNombre}`,
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
      .then(async (response) => {
        this.empPerformance = []

        response.data.odata.forEach((element: any) => {
          this.empPerformance.push({
            Colaborador: `${element.cPerApellido} ${element.cPerNombre}`,
            'Tipo Doc': element.cPerTipoDoc,
            'Nro Doc': element.cPerNroDoc,
            Tipo: element.cTipoDesc,
            Cargo: element.cCargo,
            Email: element.cPerEmail,
            LEGAJO: element.bLegajo = true ? 'SI' : 'NO',
            'Carga Administrativa': element.legAdminitrativaCarga,
            'Por Validar': element.legAdminitrativaCargaNoValida,
            'Docencia Universitaria': element.legDocenciaUniv,
            'Por Validar DU': element.legDocenciaUnivNoValida,
            Capacitaciones: element.legCapacitaciones,
            'Por Validar CAP': element.legCapacitacionesNoValida,
            'Categoria docente': element.legCategoriaDocente,
            'Por Validar ': element.legCategoriaDocenteNoValida,
            'Grado y Titulos': element.legGradoTitulo,
            'Por Validar GT': element.legGradoTituloNoValida,
            Ofimática: element.legIdiomaOfimatica,
            'Por Validar OF': element.legIdiomaOfimaticaNoValida,
            Investigador: element.legInvestigador,
            'Por Validar INV': element.legInvestigadorNoValida,
            Participaciones: element.legParticipacionCongSem,
            'Por Validar PAR': element.legParticipacionCongSemNoValida,
            'Experiencia no docente': element.legProfesNoDocente,
            'Por Validar END': element.legProfesNoDocenteNoValida,
            'Proyección social': element.legProyeccionSocial,
            'Por Validar PS': element.legProyeccionSocialNoValida,
            Reconocimiento: element.legReconocimiento,
            'Por Validar REC': element.legReconocimientoNoValida,
            Regimen: element.legRegimenDedicacion,
            'Por Validar REG': element.legRegimenDedicacionNoValida,
            'Carga Tesis': element.legTesisAseJur,
            'Por Validar CT': element.legTesisAseJurNoValida,
          })
        })
        this.dataForExcel = []

        this.empPerformance.forEach((row: any) => {
          this.dataForExcel.push(Object.values(row))
        })
        let d = new Date()
        let date =
          d.getDate().toString().padStart(2, '0') +
          '-' +
          (d.getMonth() + 1).toString().padStart(2, '0') +
          '-' +
          d.getFullYear()
        if (response.data.cstate) {
          let reportData = {
            title: 'Reporte consolidado de legajos:',
            data: this.dataForExcel,
            header: Object.keys(this.empPerformance[0]),
            description: 'Reporte consolidado LEGAJOS ',
          }

          this.ete.exportExcelConsolidadoConDatosValidadosOPorValidar(
            reportData,
          )
          Swal.fire(
            'Exportació de Legajos',
            'Excel generado Correctamente.',
            'info',
          )
        }
      })
    this.spinner.hide()
  }

  calcularNotasEvent(e: any) {
    this.listserv.calcularNotas(this.openList.emit(e))
  }

  cancelEvent(e: any) {
    this.listserv.cancelar(this.openList.emit(e))
  }

  saveEvent(e: any) {
    this.nvoservc.registro(this.openNvo.emit(e))
  }

  exportEvent(e: any) {
    console.log('exportEvent llamado', e);
    this.nvoservc.exportar(this.openNvo.emit(e))
  }

  newEvent(e: any) {
    this.nvoservc.nuevo(this.openNvo.emit(e))
    // this.ctrlserv._banregister = true
  }
  volver() {
    this.location.back()
  }
  
  search_colaborador($txt: string) {
    $txt = $txt.toLocaleLowerCase()
    let dataglobal: DatosUsuario[] = this.listserv.listColaboradores.filter(
      (datousu: DatosUsuario) =>
        datousu.cPerApellido.toLocaleLowerCase().indexOf($txt) !== -1 ||
        datousu.cPerNombre.toLocaleLowerCase().indexOf($txt) !== -1,
    )
    this.pageService.collectionSize = this.pageService.dataSource.length
    this.pageService.dataSource = dataglobal
    this.pageService.collectionSize = this.pageService.dataSource.length
    this.pageEvent.pageIndex = 0
    this.pageEvent.pageSize = 10
    this.pageEvent.length = dataglobal.length
    this.pageService.actualizaTabla2(dataglobal, this.pageEvent)
  }

  search_colaboradorcap($txt: string) {
    $txt = $txt.toLocaleLowerCase()
    let dataglobal: ReporteCapacitaciones[] = this.listserv.listCapacitaciones.filter(
      (datousu: ReporteCapacitaciones) =>
        datousu.cPerApellido.toLocaleLowerCase().indexOf($txt) !== -1 ||
        datousu.cPerNombre.toLocaleLowerCase().indexOf($txt) !== -1,
    )
    this.pageService.collectionSize = this.pageService.dataSource.length
    this.pageService.dataSource = dataglobal
    this.pageService.collectionSize = this.pageService.dataSource.length
    this.pageEvent.pageIndex = 0
    this.pageEvent.pageSize = 10
    this.pageEvent.length = dataglobal.length
    this.pageService.actualizaTabla2(dataglobal, this.pageEvent)
  }

  search_legajos($txt: string) {
    $txt = $txt.toLocaleLowerCase()
    let dataglobal: ReporteLegajos[] = this.listserv.listLegajosCount.filter(
      (datousu: ReporteLegajos) =>
        datousu.cPerApellido.toLocaleLowerCase().indexOf($txt) !== -1 ||
        datousu.cPerNombre.toLocaleLowerCase().indexOf($txt) !== -1,
    )
    this.pageService.collectionSize = this.pageService.dataSource.length
    this.pageService.dataSource = dataglobal
    this.pageService.collectionSize = this.pageService.dataSource.length
    this.pageEvent.pageIndex = 0
    this.pageEvent.pageSize = 10
    this.pageEvent.length = dataglobal.length
    this.pageService.actualizaTabla2(dataglobal, this.pageEvent)
  }

  search_consolidado($txt: string) {
    $txt = $txt.toLocaleLowerCase()
    let dataglobal: Leg_Eva_RenovacionRatificacion[] = this.listserv.listEvaDocentesCargaLectivaCount.filter(
      (datousu: Leg_Eva_RenovacionRatificacion) =>
        datousu.cPerApellido.toLocaleLowerCase().indexOf($txt) !== -1 ||
        datousu.cPerNombre.toLocaleLowerCase().indexOf($txt) !== -1,
    )
    this.pageService.collectionSize = this.pageService.dataSource.length
    this.pageService.dataSource = dataglobal
    this.pageService.collectionSize = this.pageService.dataSource.length
    this.pageEvent.pageIndex = 0
    this.pageEvent.pageSize = 20
    this.pageEvent.length = dataglobal.length
    this.pageService.actualizaTabla2(dataglobal, this.pageEvent)
  }

  search_capinvlegajos($txt: string) {
    $txt = $txt.toLocaleLowerCase()
    let dataglobal: ReporteCapacInvest[] = this.listserv.listCapacInvestCount.filter(
      (datousu: ReporteCapacInvest) =>
        datousu.cPerApellido.toLocaleLowerCase().indexOf($txt) !== -1 ||
        datousu.cPerNombre.toLocaleLowerCase().indexOf($txt) !== -1,
    )
    this.pageService.collectionSize = this.pageService.dataSource.length
    this.pageService.dataSource = dataglobal
    this.pageService.collectionSize = this.pageService.dataSource.length
    this.pageEvent.pageIndex = 0
    this.pageEvent.pageSize = 20
    this.pageEvent.length = dataglobal.length
    this.pageService.actualizaTabla2(dataglobal, this.pageEvent)
  }

  nvacapacitacion() {
    this.mdlserv.nuevoModalCapacitacionUSS(
      'Registro capacitación USS',
      this.clmdserv.empty_capacitacionesuss(),
    )
  }

  listar_capacitacionesuss() {
    this.listserv.listado('capacitacionesuss', '').then((data) => {
      this.listserv.lCapacitacionesUSS = data
    })
  }
}
