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

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rep-legajos',
  templateUrl: './rep-legajos.component.html',
  styleUrls: ['./rep-legajos.component.sass']
})
export class RepLegajosComponent implements OnInit {
  @ViewChild('drawer') sideNav: any;
  modulo: string = 'LEGAJOS';
  title: string = 'Reporte de Legajos';
  route: string = 'replegajos'
  pageEvent: PageEvent = new PageEvent;
  dataglobal: ReporteLegajos[] = [];
  panelOpenState = false;

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
  ) {
    if(this.segserv.conexionactiva()){
      // this.spinner.show()
      this.segserv.obtenerdatosusuario()
      // this.listar_tareaspermiso()

      this.pageService.dataSource = [];
      this.pageEvent.length = 0
      this.pageEvent.pageIndex = 0
      this.pageEvent.pageSize = 5
      // if(this.segserv.usuarioreg.nRol==1){
      //   this.ctrlserv._banregister = false
      // }else{
      //   this.ctrlserv._banregister = true
      // }
    }else{
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
  }
  dataForExcel:any[] = [];
  empPerformance:any[] = []
  ngAfterViewInit(): any {
    this.sidenavservc.abrirmenu(this.sideNav);

    this.lstserv.listar = ()=>{
      // console.log('listar')
      // this.listar_tareaspermiso()
      this.configserv.cFiltroColaborador = ""
      this.listado_replegajos()
      // this.listar_legajos();
    }

    this.nvoservc.exportar = () =>{
      // this.acciones(3, this.clmdserv.objusuario)
      this.exportExcel()
    }

    
  }

  exportCV(cPerCodigo : string, nTipo : string ){
    window.open(
      environment.URLAPI + 'legajo_pdf/' + btoa(cPerCodigo) + '/' + btoa(nTipo)
      ,
      "_blank"
   );
    
  }

  exportExcel(){
    if(this.lstserv.listLegajosCount.length>0){
      this.empPerformance = [];
      this.lstserv.listLegajosCount.forEach((item) => {
        this.empPerformance.push({
          'COLABORADOR':(item.cPerApellido.toUpperCase() + ', ' + item.cPerNombre.toUpperCase())
        , "TIPO DOC":item.cPerTipoDoc
        , "NRO DOC":item.cPerNroDoc
        , "CARGO":item.cCargo.toUpperCase()
        , "AREA":item.cArea.toUpperCase()
        , "TIPO":(item.nTipo==2?'ACADÉMICO':'ADMINISTRATIVO')
        , "SECC_01":item.secc01
        , "SECC_02":item.secc02
        , "SECC_03":item.secc03
        , "SECC_04":item.secc04
        , "SECC_05":item.secc05
        , "SECC_06":item.secc06
        , "SECC_07":item.secc07
        , "SECC_08":item.secc08
        , "SECC_09":item.secc09
        , "SECC_10":item.secc10
        , "SECC_11":item.secc11
        , "SECC_12":item.secc12
        , "SECC_13":item.secc13
        , "SECC_14":item.secc14
        , "SECC_15":item.secc15
        , "SECC_16":item.secc16
        , "ESTADO": (item.secc01 > 0) &&  ( item.secc02 > 0 ) && (item.secc03 > 0 ) && (item.secc04 > 0) && (item.secc05 > 0 ) && (item.secc06 > 0) && (item.secc07 > 0 ) && (item.secc08 > 0 ) && (item.secc09 > 0 ) && (item.secc10 > 0 ) && (item.secc11 > 0 ) && (item.secc12 > 0 ) && (item.secc13 > 0 ) && (item.secc14 > 0 ) && (item.secc15 > 0 ) && (item.secc16 > 0 ) ? 'COMPLETO' : 'INCOMPLETO' 
        , "CV": environment.URLAPI + 'legajo_pdf/' + btoa(item.cPerCodigo) + '/' + btoa(item.nTipo.toString())
        }) ;
      });

      this.dataForExcel = [];
      
      this.empPerformance.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })
      let d = new Date();
      let date = d.getDate().toString().padStart(2,"0") + '-' + (d.getMonth() + 1).toString().padStart(2,"0") + '-' + d.getFullYear();
      let reportData = {
        title: 'Colaboradores - Secciones Legajos',
        data: this.dataForExcel,
        headers: Object.keys(this.empPerformance[0]),
        description: "Listado de legajos"
      }

      this.ete.exportExcelLegajosCount(reportData);
    }else{
      this.valserv.mensaje_info("No hay registro de legajos.");
    }
  }

  listado_replegajos(){
    // this.listar_tareaspermiso()
    this.spinner.show()
    this.lstserv.listado('lst_legajos', '/' + this.configserv.nTipoColaborador ).then((data)=>{
      this.lstserv.listLegajosCount = data;
      this.pageService.dataglobal = this.lstserv.listLegajosCount
      this.pageService.collectionSize = this.lstserv.listLegajosCount.length
      this.pageService.dataSource = this.lstserv.listLegajosCount
      this.pageEvent.length = this.lstserv.listLegajosCount.length
      this.pageService.actualizaTabla2(this.lstserv.listLegajosCount, this.pageEvent);

      this.spinner.hide()
    })
  }

}
