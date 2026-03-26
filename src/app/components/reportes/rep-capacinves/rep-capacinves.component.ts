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


import {interval , timer} from 'rxjs';
import Swal from 'sweetalert2';

import { Leg_Eva_RenovacionRatificacion } from 'src/app/models/legajo/leg_eva_renovacion_ratificacion';

import { LegCapacitaciones } from 'src/app/models/legajo/leg-capacitaciones';
import { LegParticipacionCongSem } from 'src/app/models/legajo/leg-participacion-cong-sem';

import { LegDatosGenerales } from 'src/app/models/legajo/leg-datos-generales';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';


import { environment } from 'src/environments/environment';
import { Leg_Eva_Capacitaciones } from 'src/app/models/legajo/leg_eva_capacitaciones';
import { from } from 'rxjs';
import { clearInterval } from 'timers';


@Component({
  selector: 'app-rep-capacinves',
  templateUrl: './rep-capacinves.component.html',
  styleUrls: ['./rep-capacinves.component.sass']
})
export class RepCapacinvesComponent implements OnInit {
  @ViewChild('drawer') sideNav: any;
  modulo: string = 'LEGAJOS';
  title: string = 'Reporte Docentes con Capacitaciones e Investigaciones';
  route: string = 'repcapacinves'
  pageEvent: PageEvent = new PageEvent;
  dataglobal: ReporteLegajos[] = [];
  panelOpenState = false;

  isButtonVisible:Boolean = false;


  previewUrl: any = environment.PHOTODEFAULT
  previewCertUrl: any = environment.CERTDEFAULT
  previewFirmaUrl: any = environment.FIRMADEFAULT



  constructor(
    public sidenavservc: SidenavService,
    public lstserv: ListService,
    public pageService: PaginationService,
    public configserv: ConfiguracionService,
    public nvoservc: NewService,
    private spinner: NgxSpinnerService,
    public segserv: SeguridadService,
    private router: Router,
    public ete: ExportExcelService,
    public valserv: ValidateService,

    public clmdserv: CleanmodelService,
    public sserv: SesionService,
  ) {
    

    if(this.segserv.conexionactiva()){
      this.segserv.obtenerdatosusuario()

      this.pageService.dataSource = [];
      this.pageEvent.length = 0
      this.pageEvent.pageIndex = 0
      this.pageEvent.pageSize = 20
      
      

    }else{
      this.router.navigate(['/login']);
    }
  }



  ngOnInit(): void {

  }

  ngOnDestroy(): void{

  }

  dataForExcel:any[] = [];
  empPerformance:any[] = []
  ngAfterViewInit(): any {
    this.sidenavservc.abrirmenu(this.sideNav);

    this.lstserv.listar = ()=>{
      this.configserv.cFiltroColaborador = ""
      this.listado_capinvlegajos()
    }


    this.nvoservc.exportar = () =>{
      // this.acciones(3, this.clmdserv.objusuario)
      // console.log("Exportando evaluaciones");
      this.exportExcel()
    }
  }



  exportExcel(){
    if(this.lstserv.listCapacInvestCount.length>0){

      this.empPerformance = [];

      this.lstserv.listCapacInvestCount.forEach((item) => {
        this.empPerformance.push({
          'COLABORADOR':(item.cPerApellido.toUpperCase() + ', ' + item.cPerNombre.toUpperCase())
        , "CARGO":item.cCargo.toUpperCase()
        , "AREA":item.cArea.toUpperCase()
        , "EMAIL":item.cPerEmail
        , "TELEFONO":item.cPerTelefono
        , "PARTIC. EN CONG. Y SEMIN.":item.legParticipacionCongSem
        , "FEC.REG. PCS.":item.dFechaRegistroCongSem == '1900-01-01T00:00:00' ? '' : item.dFechaRegistroCongSem.substr(0,10) 
        , "FEC.ACT. PCS.": item.dFechaModificaCongSem == '1900-01-01T00:00:00' ? '' : item.dFechaModificaCongSem.substr(0,10)

        , "CAPACITACIONES":item.legCapacitaciones
        , "FEC.REG. CAP.":item.dFechaRegistroCap == '1900-01-01T00:00:00' ? '' : item.dFechaRegistroCap.substr(0,10)
        , "FEC.ACT. CAP.": item.dFechaModificaCap == '1900-01-01T00:00:00' ? '' : item.dFechaModificaCap.substr(0,10)

        , "INVESTIGADOR":item.legInvestigador
        , "FEC.REG. INV.":item.dFechaRegistroInv == '1900-01-01T00:00:00' ? '' : item.dFechaRegistroInv.substr(0,10)
        , "FEC.ACT. INV.":item.dFechaModificaInv == '1900-01-01T00:00:00' ? '' : item.dFechaModificaInv.substr(0,10)

        , "ASESORIA Y JURADO DE TESIS":item.legTesisAseJur
        , "FEC.REG. AJT.":item.dFechaRegistroTes == '1900-01-01T00:00:00' ? '' : item.dFechaRegistroTes.substr(0,10)
        , "FEC.ACT. AJT.":item.dFechaModificaTes == '1900-01-01T00:00:00' ? '' : item.dFechaModificaTes.substr(0,10)

        , "PRODUCCION CIENTIFICA":item.legProduccionCiencia
        , "FEC.REG. PC.":item.dFechaRegistroProd == '1900-01-01T00:00:00' ? '' : item.dFechaRegistroProd.substr(0,10)
        , "FEC.ACT. PC.":item.dFechaModificaProd == '1900-01-01T00:00:00' ? '' : item.dFechaModificaProd.substr(0,10)
        }) ;
      });

      this.dataForExcel = [];

      this.empPerformance.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })
      let d = new Date();
      let date = d.getDate().toString().padStart(2,"0") + '-' + (d.getMonth() + 1).toString().padStart(2,"0") + '-' + d.getFullYear();
      let reportData = {
        title: 'Reporte de Docentes con Capacitaciones e Investigaciones',
        data: this.dataForExcel,
        headers: Object.keys(this.empPerformance[0]),
        description: "Historial de Registros"
      }

      this.ete.exportExcelCapacInvest(reportData);
    }
    else{
      this.valserv.mensaje_info("No hay registro de capacitaciones e investigaciones.");  
    }
  }


  listado_capinvlegajos(){
    this.spinner.show()
    this.lstserv.listado('lst_capinvlegajos', '/' + this.configserv.nTipoColaborador ).then((data)=>{
      this.lstserv.listCapacInvestCount = data;
      this.pageService.dataglobal = this.lstserv.listCapacInvestCount
      this.pageService.collectionSize = this.lstserv.listCapacInvestCount.length
      this.pageService.dataSource = this.lstserv.listCapacInvestCount
      this.pageEvent.length = this.lstserv.listCapacInvestCount.length
      this.pageService.actualizaTabla2(this.lstserv.listCapacInvestCount, this.pageEvent);

      this.spinner.hide()
    })
  }

}
