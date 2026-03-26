import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Console } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteLegajos } from 'src/app/models/legajo/reporte-legajos';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ExportExcelService } from 'src/app/services/exportarexcel.service';
import { ListService } from 'src/app/services/list.service';
import { NewService } from 'src/app/services/new.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { ValidateService } from 'src/app/services/validate.service';

import axios from "axios";
import { SesionService } from 'src/app/services/sesion.service';


import { interval, timer } from 'rxjs';
import Swal from 'sweetalert2';

import { Leg_Eva_RenovacionRatificacion } from 'src/app/models/legajo/leg_eva_renovacion_ratificacion';

import { LegCapacitaciones } from 'src/app/models/legajo/leg-capacitaciones';
import { LegParticipacionCongSem } from 'src/app/models/legajo/leg-participacion-cong-sem';

import { LegDatosGenerales } from 'src/app/models/legajo/leg-datos-generales';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';

import { RegisterService } from 'src/app/services/register.service';

import { environment } from 'src/environments/environment';
import { Leg_Eva_Capacitaciones } from 'src/app/models/legajo/leg_eva_capacitaciones';
import { from } from 'rxjs';
import { clearInterval } from 'timers';


@Component({
  selector: 'app-rep-rankinguni',
  templateUrl: './rep-rankinguni.component.html',
  styleUrls: ['./rep-rankinguni.component.sass']
})
export class RepRankinguniComponent implements OnInit {
  @ViewChild('drawer') sideNav: any;
  modulo: string = 'LEGAJOS';
  title: string = 'Reporte Universidades por Grado Academico de Docentes con Carga Lectiva';
  route: string = 'rankinguni'
  pageEvent: PageEvent = new PageEvent;
  dataglobal: ReporteLegajos[] = [];
  panelOpenState = false;

  isButtonVisible: Boolean = false;


  previewUrl: any = environment.PHOTODEFAULT
  previewCertUrl: any = environment.CERTDEFAULT
  previewFirmaUrl: any = environment.FIRMADEFAULT

  public list_EvaResultadoCurso: Leg_Eva_RenovacionRatificacion[] = []
  public list_ReporteLegajos: ReporteLegajos[] = []


  public regLegDatosGenerales: LegDatosGenerales
  public reg_Eva_Capacitaciones: Leg_Eva_Capacitaciones

  public regLegCapacitaciones: LegCapacitaciones[] = []
  public regLegParticipacionCongSem: LegParticipacionCongSem[] = []

  public contador: any = interval(2000);
  public subscribe: any = null;


  constructor(
    public sidenavservc: SidenavService,
    public lstserv: ListService,
    public pageService: PaginationService,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public nvoservc: NewService,
    private spinner: NgxSpinnerService,
    public segserv: SeguridadService,
    private router: Router,
    public ete: ExportExcelService,
    public valserv: ValidateService,

    public clmdserv: CleanmodelService,
    public sserv: SesionService,



  ) {
    this.regLegDatosGenerales = clmdserv.empty_datosgenerales()
    this.reg_Eva_Capacitaciones = clmdserv.empty_eva_capacitaciones()


    if (this.segserv.conexionactiva()) {
      this.segserv.obtenerdatosusuario()

      this.pageService.dataSource = [];
      this.pageEvent.length = 0
      this.pageEvent.pageIndex = 0
      this.pageEvent.pageSize = 20



    } else {
      this.router.navigate(['/login']);
    }
  }



  ngOnInit(): void {

  }

  ngOnDestroy(): void {

    if (this.subscribe != null) {
      this.subscribe.unsubscribe();
    }
  }

  dataForExcel: any[] = [];
  empPerformance: any[] = []
  ngAfterViewInit(): any {
    this.sidenavservc.abrirmenu(this.sideNav);

    this.lstserv.listar = () => {
      this.configserv.cFiltroColaborador = ""
      this.listado_docentescargalectiva()
    }

    this.nvoservc.exportar = () => {
      // this.acciones(3, this.clmdserv.objusuario)
      // console.log("Exportando Universidades por Grado Academico");
      this.exportExcel_Universidades()
    }
  }



  exportExcel_Universidades() {
    if (this.lstserv.listDocentesCargaLectivaCount.length > 0) {
      this.empPerformance = [];
      this.lstserv.listDocentesCargaLectivaCount.forEach((item) => {
        this.empPerformance.push({
          'CODIGO': (item.cPerCodigo.toUpperCase())
          , 'COLABORADOR': (item.cPerApellido.toUpperCase() + ' ' + item.cPerNombre.toUpperCase())
          , "GRADO ACADEMICO": item.cIntDescripcion.toUpperCase()
          , "INSTITUCION": item.cInstitucion.toUpperCase()
        });
      });

      this.dataForExcel = [];

      this.empPerformance.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })
      let d = new Date();
      let date = d.getDate().toString().padStart(2, "0") + '-' + (d.getMonth() + 1).toString().padStart(2, "0") + '-' + d.getFullYear();
      let reportData = {
        title: 'Resultado de Universidades por Grado Academico',
        data: this.dataForExcel,
        headers: Object.keys(this.empPerformance[0]),
        description: "Consolidado de Evaluaciones"
      }

      this.ete.exportExcelUniversidades(reportData);
    } else {
      this.valserv.mensaje_info("No hay registro de Universidades por Grado Academico.");
    }
  }


  listado_docentescargalectiva() {
    this.spinner.show()
    this.lstserv.list_docentescargalectiva().then((data) => {
      this.lstserv.listDocentesCargaLectivaCount = data;

      this.pageService.dataglobal = this.lstserv.listDocentesCargaLectivaCount
      this.pageService.collectionSize = this.lstserv.listDocentesCargaLectivaCount.length
      this.pageService.dataSource = this.lstserv.listDocentesCargaLectivaCount
      this.pageEvent.length = this.lstserv.listDocentesCargaLectivaCount.length
      this.pageService.actualizaTabla2(this.lstserv.listDocentesCargaLectivaCount, this.pageEvent);
      this.spinner.hide()
    })
  }

}
