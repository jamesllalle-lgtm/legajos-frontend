import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReporteCapacitaciones } from 'src/app/models/legajo/reporte-capacitaciones';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ExportExcelService } from 'src/app/services/exportarexcel.service';
import { ListService } from 'src/app/services/list.service';
import { NewService } from 'src/app/services/new.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-rep-capacitaciones',
  templateUrl: './rep-capacitaciones.component.html',
  styleUrls: ['./rep-capacitaciones.component.sass']
})
export class RepCapacitacionesComponent implements OnInit {
  @ViewChild('drawer') sideNav: any;
  modulo: string = 'LEGAJOS';
  title: string = 'Reporte de Capacitaciones';
  route: string = 'repcapacitaciones'
  pageEvent: PageEvent = new PageEvent;
  dataglobal: ReporteCapacitaciones[] = [];
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
      this.listadocapacitaciones()
      // this.listar_legajos();
    }

    this.nvoservc.exportar = () =>{
      // this.acciones(3, this.clmdserv.objusuario)
      this.exportExcel()
    }


  }

  exportExcel(){
    if(this.lstserv.listCapacitaciones.length>0){
      this.empPerformance = [];
      this.lstserv.listCapacitaciones.forEach((item) => {
        this.empPerformance.push({'COLABORADOR':(item.cPerApellido.toUpperCase() + ', ' + item.cPerNombre.toUpperCase()), "TIPO DOC":item.cPerTipoDoc,"NRO DOC":item.cPerNroDoc, "CARGO":item.cCargo.toUpperCase(), "AREA":item.cArea.toUpperCase(),"TIPO":(item.nTipo==2?'ACADÉMICO':'ADMINISTRATIVO')
        , "TEMA":item.cCapTema.toUpperCase(), "FECHA INICIO": this.configserv.datepipe.transform(item.dCapFechaInicio, "dd-MM-yyyy"), "FECHA FIN": this.configserv.datepipe.transform(item.dCapFechaFin, "dd-MM-yyyy"), "HORAS": item.nCapHoras , "COMPETENCIAS A MEJORAR": item.cCompetencias});
      });
      
      this.dataForExcel = [];

      this.empPerformance.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })
      let d = new Date();
      let date = d.getDate().toString().padStart(2,"0") + '-' + (d.getMonth() + 1).toString().padStart(2,"0") + '-' + d.getFullYear();
      let reportData = {
        title: 'Colaboradores - Capacitaciones',
        data: this.dataForExcel,
        headers: Object.keys(this.empPerformance[0]),
        description: "Listado de capacitaciones"
      }

      this.ete.exportExcelCapacitaciones(reportData);
    }else{
      this.valserv.mensaje_info("No hay registro de capacitaciones.");
    }
  }

  listadocapacitaciones(){
    // this.listar_tareaspermiso()
    this.spinner.show()
    this.lstserv.listado('lst_capacitaciones', '/' + this.configserv.nTipoColaborador + '/' + this.configserv.nCapacitacion).then((data)=>{
      this.lstserv.listCapacitaciones = data;
      this.pageService.dataglobal = this.lstserv.listCapacitaciones
      this.pageService.collectionSize = this.lstserv.listCapacitaciones.length
      this. pageService.dataSource = this.lstserv.listCapacitaciones
      this.pageEvent.length = this.lstserv.listCapacitaciones.length
      this.pageService.actualizaTabla2(this.lstserv.listCapacitaciones, this.pageEvent);

      this.spinner.hide()
    })


  }

}
