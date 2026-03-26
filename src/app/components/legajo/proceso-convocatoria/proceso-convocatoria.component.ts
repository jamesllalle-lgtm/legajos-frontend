import { SelectionModel } from '@angular/cdk/collections'
import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { NgxSpinnerService } from 'ngx-spinner'
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from 'src/app/helpers/format-datepicker'
import { RegistroConvocatoria } from 'src/app/models/RegistroConvocatoria'
import { ConfiguracionService } from 'src/app/services/configuracion.service'
import { ControlesService } from 'src/app/services/controles.service'
import { ListService } from 'src/app/services/list.service'
import { PaginationService } from 'src/app/services/pagination.service'
import { SeguridadService } from 'src/app/services/seguridad.service'

@Component({
  selector: 'app-proceso-convocatoria',
  templateUrl: './proceso-convocatoria.component.html',
  styleUrls: ['./proceso-convocatoria.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class ProcesoConvocatoriaComponent implements OnInit {
  @ViewChild('drawer') sideNav: any
  pageEvent: PageEvent = new PageEvent()
  title: string = 'Proceso de convocatoria'
  route: string = 'legajo'
  modulo: string = 'LEGAJOS'
  selection = new SelectionModel<RegistroConvocatoria>(true, [])
  resultsLength = 0
  convocatoriaId: number = 0
  displayedColumns: string[] = [
    // 'select',
    'dni',
    'apepat',
    'apemat',
    'nombres',
    'celular',
    'correo',
    'cPunClaModelo',
    'cPunCurriculo',
    'cPunEntPersonal',
    'observaciones',
  ]
  dataSource = new MatTableDataSource<RegistroConvocatoria>(
    this.lstserv.lstProceso,
  )
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: 'Proceso de convocatoria' },
    public ctrlserv: ControlesService,
    public lstserv: ListService,
    private spinner: NgxSpinnerService,
    public pageService: PaginationService,
    public segserv: SeguridadService,
    public configservc: ConfiguracionService,
    public listserv: ListService,
  ) {
    this.pageService.dataSource = []
    this.pageEvent.length = 0
    this.pageEvent.pageIndex = 0
    this.pageEvent.pageSize = 5
  }

  ngOnInit(): void {
    this.listar_periodos()
    // this.obtenerListadoRegistroConvocatoria()
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator
  }
  async obtenerListadoRegistroConvocatoria() {
    this.spinner.show()
    let data = await this.lstserv.listaRegistroConvocatoria(this.convocatoriaId)
    if (data) {
      this.pageService.dataglobal = data
      this.pageService.collectionSize = data.length
      this.pageService.dataSource = data
      this.pageEvent.length = data.length
      this.pageService.actualizaTabla2(data, this.pageEvent)

      // this.dataSource = this.lstserv.lstProceso //this.lstserv.lstProceso
    }
    this.spinner.hide()
  }

  resetPaging(): void {
    // this.paginator.pageIndex = 0
  }
  seleccionar(index: number, e: any) {
    this.pageService.dataSource[index].select = e.target.checked
  }

  registrar() {
    console.log(this.pageService.dataSource.filter((v) => v.select == true))
  }

  listar_periodos() {
    this.segserv.obtenerdatosusuario()
    this.lstserv
      .listado('lst_prdacademico', '/' + this.segserv.usuarioreg.cPerCodigo)
      .then((data) => {
        this.lstserv.lPeriodo = data
      })
  }
  customerOnChange(item: any) {
    this.listserv.cargaConvocatoria(item.nPrdCodigo)
    // console.log(item)
  }
  customerOnChangeConvocatoria(item: any) {
    this.convocatoriaId = item.nConCodigo
    // console.log(item)
  }
}
