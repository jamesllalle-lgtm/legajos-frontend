import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatosUsuario } from 'src/app/models/usuario';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ListService } from 'src/app/services/list.service';
import { PaginationService } from 'src/app/services/pagination.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-modal-expartar-legajo',
  templateUrl: './modal-expartar-legajo.component.html',
  styleUrls: ['./modal-expartar-legajo.component.sass']
})
export class ModalExpartarLegajoComponent implements OnInit {
  pageEvent: PageEvent = new PageEvent;
  generando: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ModalExpartarLegajoComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
    public configservc: ConfiguracionService,
    public listserv: ListService,
    public pageService: PaginationService,
    private spinner: NgxSpinnerService,


  ) { }

  ngOnInit(): void {
    this.message = 'EXPORTAR LEGAJO MASIVO'
    this.listserv.cargar_carreras();
  }

  onClickCerrar(): void {
    this.dialogRef.close()
  }

  comboOnChangeLeg(nTipo: number) {
    let dataglobal: DatosUsuario[] = []
    if (nTipo == 0) {
      dataglobal = this.listserv.listColaboradores
    }
    if (nTipo == 1) {
      dataglobal = this.listserv.listColaboradores.filter(
        (datousu: DatosUsuario) =>
          datousu.bLegajo == true
      );
    }
    if (nTipo == 2) {
      dataglobal = this.listserv.listColaboradores.filter(
        (datousu: DatosUsuario) =>
          datousu.bLegajo == false
      );
    }
    this.pageService.dataglobal = dataglobal
    this.pageService.collectionSize = dataglobal.length
    this.pageService.dataSource = dataglobal
    this.pageEvent.pageIndex = 0
    this.pageEvent.pageSize = 5
    this.pageEvent.length = dataglobal.length
    this.pageService.actualizaTabla2(dataglobal, this.pageEvent);
  }

  comboOnChangePer(cPrdNombre: string) {
    this.configservc.nLegajoDatos = 0
    this.configservc.cPrdNombre = cPrdNombre;
    console.log("primero periodo:" + cPrdNombre)
  }
  comboOnChangeEscuela(nUniOrgCodigo: number) {
    this.configservc.nUniOrgCodigo = nUniOrgCodigo
    console.log("Unidad Organizacional:" + nUniOrgCodigo)

  }

  exportLegajos() {
    console.log(this.configservc.cPrdNombre);
    // console.log(this.configservc.nUniOrgCodigo);


    this.spinner.show()
    this.dialogRef.close()
    // this.listserv.exportLegajos(this.openList.emit(e))

    this.listserv.listado('legajos_exp_zip/', `0/${this.configservc.cPrdNombre}/${this.configservc.nUniOrgCodigo}`).then((data) => {
      console.log("Export legajos :: " + data);


      Swal.fire("Exportació de Legajos", `Puede descargar los documentos en este link : <a href="https://campus.uss.edu.pe/Legajo_Export/${data}" target="_blank">Descargar</a>`, "info")
      this.spinner.hide()
    });


  }

}
