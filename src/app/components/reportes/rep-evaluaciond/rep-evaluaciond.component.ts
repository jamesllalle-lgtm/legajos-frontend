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
  selector: 'app-rep-evaluaciond',
  templateUrl: './rep-evaluaciond.component.html',
  styleUrls: ['./rep-evaluaciond.component.sass']
})
export class RepEvaluaciondComponent implements OnInit {
  @ViewChild('drawer') sideNav: any;
  modulo: string = 'LEGAJOS';
  title: string = 'Reporte Consolidado';
  route: string = 'repevaluaciond'
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
      this.listado_evaluaciondocentescargalectiva()
    }

    this.lstserv.calcularNotas = () => {
      this.calculo_notas()
    }

    this.nvoservc.exportar = () => {
      // this.acciones(3, this.clmdserv.objusuario)
      // console.log("Exportando evaluaciones");
      this.exportExcel_Consolidado()
    }
  }



  exportExcel_Consolidado() {
    if (this.lstserv.listEvaDocentesCargaLectivaCount.length > 0) {
      this.empPerformance = [];
      this.lstserv.listEvaDocentesCargaLectivaCount.forEach((item) => {
        this.empPerformance.push({
          'COLABORADOR': (item.cPerApellido.toUpperCase() + ', ' + item.cPerNombre.toUpperCase())
          , "NRO DOC": item.cPerNroDoc
          , "CARGO": item.cCargo.toUpperCase()
          , "AREA": item.cArea.toUpperCase()
          , "EVALUACION DE DESEMPEÑO DOCENTE": item.nLegRenRatEDD
          , "CAPACITACION DOCENTE": item.nLegRenRatCD
          , "PRODUCCION CIENTIFICA, LECTIVA Y DE INVESTIGACION": item.nLegRenRatPC
          , "PROMEDIO": item.nLegRenRatPromedio
          , "*Condición final \n (RENUEVA/RATIFICA/SÍ/NO)": item.cLegRenRatCondicion
        });
      });

      this.dataForExcel = [];

      this.empPerformance.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })
      let d = new Date();
      let date = d.getDate().toString().padStart(2, "0") + '-' + (d.getMonth() + 1).toString().padStart(2, "0") + '-' + d.getFullYear();
      let reportData = {
        title: 'Resultado de Evaluacion Docente 2021-II',
        data: this.dataForExcel,
        headers: Object.keys(this.empPerformance[0]),
        description: "Consolidado de Evaluaciones"
      }

      this.ete.exportExcelConsolidado(reportData);
    } else {
      this.valserv.mensaje_info("No hay registro de evaluaciones.");
    }
  }


  listado_evaluaciondocentescargalectiva() {
    this.spinner.show()
    this.lstserv.list_evaluaciondocentescargalectiva(this.configserv.cFiltroPeriodo).then((data) => {
      this.lstserv.listEvaDocentesCargaLectivaCount = data;

      this.pageService.dataglobal = this.lstserv.listEvaDocentesCargaLectivaCount
      this.pageService.collectionSize = this.lstserv.listEvaDocentesCargaLectivaCount.length
      this.pageService.dataSource = this.lstserv.listEvaDocentesCargaLectivaCount
      this.pageEvent.length = this.lstserv.listEvaDocentesCargaLectivaCount.length
      this.pageService.actualizaTabla2(this.lstserv.listEvaDocentesCargaLectivaCount, this.pageEvent);
      this.spinner.hide()
    })
  }


  calculo_notas() {

    var index = 0;

    this.subscribe = this.contador.subscribe(() => {


      this.spinner.show();

      if (this.lstserv.listEvaDocentesCargaLectivaCount[index].nLegDatCodigo > 0) {
        this.lstserv.consolidado_evaluacion(index, this.lstserv.listEvaDocentesCargaLectivaCount[index].nLegDatCodigo, this.lstserv.listEvaDocentesCargaLectivaCount[index].nLegRenRatEDD).then((data) => {

          var formData = new FormData();
          let fecha: any
          formData.append('nLegDatCodigo', this.lstserv.listEvaDocentesCargaLectivaCount[index].nLegDatCodigo.toString() ?? '0')

          formData.append('cPerCodigo', this.lstserv.listEvaDocentesCargaLectivaCount[index].cPerCodigo)
          formData.append('cPerApellido', this.lstserv.listEvaDocentesCargaLectivaCount[index].cPerApellido)
          formData.append('cPerNombre', this.lstserv.listEvaDocentesCargaLectivaCount[index].cPerNombre)
          formData.append('cCargo', this.lstserv.listEvaDocentesCargaLectivaCount[index].cCargo)
          formData.append('cArea', this.lstserv.listEvaDocentesCargaLectivaCount[index].cArea)
          formData.append('cPerNroDoc', this.lstserv.listEvaDocentesCargaLectivaCount[index].cPerNroDoc)

          formData.append('nLegRenRatEDD', this.lstserv.listEvaDocentesCargaLectivaCount[index].nLegRenRatEDD.toString())
          formData.append('nLegRenRatCD', this.lstserv.listEvaDocentesCargaLectivaCount[index].nLegRenRatCD.toString())
          formData.append('nLegRenRatPC', this.lstserv.listEvaDocentesCargaLectivaCount[index].nLegRenRatPC.toString())
          formData.append('nLegRenRatPromedio', this.lstserv.listEvaDocentesCargaLectivaCount[index].nLegRenRatPromedio.toString())
          formData.append('cLegRenRatCondicion', this.lstserv.listEvaDocentesCargaLectivaCount[index].cLegRenRatCondicion)
          formData.append('cLegRenRatRenRat', this.lstserv.listEvaDocentesCargaLectivaCount[index].cLegRenRatRenRat.toString())

          this.regserv.registroFile('Registro de Notas Renovacion/Ratificacion', 'legajo', formData).then((data) => {
            this.spinner.hide()

          })
        });
      }


      index++;


      if (index > this.lstserv.listEvaDocentesCargaLectivaCount.length) {
        this.pageService.dataglobal = this.lstserv.listEvaDocentesCargaLectivaCount
        this.pageService.collectionSize = this.lstserv.listEvaDocentesCargaLectivaCount.length
        this.pageService.dataSource = this.lstserv.listEvaDocentesCargaLectivaCount
        this.pageEvent.length = this.lstserv.listEvaDocentesCargaLectivaCount.length
        this.pageService.actualizaTabla2(this.lstserv.listEvaDocentesCargaLectivaCount, this.pageEvent);

        Swal.fire({
          title: "Resultados de Evaluacion",
          text: '¿Finalizó, promedios obtenidos!',
          icon: 'success',
          showCancelButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setTimeout(() => this.subscribe.unsubscribe(), 4000);
      }

    });

  }

}
