import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { Interface } from 'src/app/models/general/interface';
import { LegDocumentacionInterna } from 'src/app/models/legajo/leg-documentacion-interna';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ControlesService } from 'src/app/services/controles.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { ValidateService } from 'src/app/services/validate.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documentacioninterna',
  templateUrl: './documentacioninterna.component.html',
  styleUrls: ['./documentacioninterna.component.sass']
})
export class DocumentacioninternaComponent implements OnInit {

public LegDocumentacionInterna: LegDocumentacionInterna
today: Date | undefined;
public FormGroup: FormGroup;
dateFecha: any;
archivopdf: FormControl;
public photo: any
erradjunto: boolean = false
myControl = new FormControl();
filteredOptions!: Observable<Interface[]>;
constructor(
  public dialogRef: MatDialogRef<DocumentacioninternaComponent>,
  public configserv: ConfiguracionService,
  public ctrlserv: ControlesService,
  public clmdserv: CleanmodelService,
  public regserv: RegisterService,
  public lstserv: ListService,
  public valserv: ValidateService,
  private _formBuilder: FormBuilder,
  private spinner: NgxSpinnerService,
  @Inject(MAT_DIALOG_DATA) public data: {title: 'Registro de selección', id:number,  obj: LegDocumentacionInterna},
) {
  this.LegDocumentacionInterna = this.clmdserv.empty_documentacioninterna()
  this.today = new Date();
  this.dateFecha = new FormControl(new Date(''));
  this.FormGroup = this._formBuilder.group({
    tipodocControl: ['', Validators.required],
    codigoControl: ['',''],
    descripcionControl: ['',''],
  })
  this.archivopdf = new FormControl(this.photo)
  this.configserv.listar_tipodocinterna()


}

ngOnInit(): void {
  if(this.data.id > 0 && this.data.obj.nLegDicodigo > 0){
    this.LegDocumentacionInterna = this.data.obj
    this.customerOnChange(this.data.obj.vTipo, 1)
    this.FormGroup.setValue({
      tipodocControl: this.data.obj.nLegValTipoDoc,
      codigoControl: this.data.obj.cLegDicodigo ?? '',
      descripcionControl: this.data.obj.cLegDidescripcion ?? '',
    })
    this.data.obj.cLegDiarchivo = this.data.obj.cLegDiarchivo ?? environment.CERTDEFAULT
    this.LegDocumentacionInterna.cFile = this.data.obj.cLegDiarchivo
    this.erradjunto = true
  }
}





customerOnChange($obj:any, tipo: number){
  // console.log($obj)
  if($obj == null){
    switch(tipo){
      case 1:  this.LegDocumentacionInterna.nLegDitipoDoc = 0; this.LegDocumentacionInterna.nLegValTipoDoc = 0; this.LegDocumentacionInterna.vTipo = this.clmdserv.empty_constante(); break;

    }
  }else{
    switch(tipo){
      case 1:  this.LegDocumentacionInterna.nLegDitipoDoc = $obj.nConCodigo; this.LegDocumentacionInterna.nLegValTipoDoc = $obj.nConValor; this.LegDocumentacionInterna.cLegDiarchivo = $obj; break;


    }
  }

}

filePDF(fileInput: any, btipo:number = 0): void {
  this.spinner.show()
  let archadj = fileInput != null ? <File>fileInput.target.files[0] : <File>{}
  const mimeType = fileInput != null ? archadj.type : '';
  if (mimeType.match(/pdf\/*/) == null || mimeType == '') {
    switch(btipo){
      case 1:
              this.LegDocumentacionInterna.cLegDiarchivo = null;
              this.erradjunto= false;
              break;


    }
    if(mimeType.match(/pdf\/*/) == null && fileInput != null){
    this.valserv.mensaje_info("Formato no válida. Adjunte un archivo PDF.");
    }
    this.spinner.hide()
    return;
  }else{
    switch(btipo){
      case 1:
              this.LegDocumentacionInterna.cLegDiarchivo = archadj;
              this.erradjunto = true;
              break;

    }
    this.spinner.hide()
  }



}

guardar($e: any){
  // console.log(this.LegDocumentacionInterna)
  if(this.FormGroup.status.valueOf() == "INVALID"){
    this.valserv.mensaje_info("Complete los campos solicitados.");
    return;
  }
  if(this.LegDocumentacionInterna.nLegValTipoDoc == 1002 || this.LegDocumentacionInterna.nLegValTipoDoc == 1003){
    if(this.FormGroup.get('codigoControl')?.value == null || this.FormGroup.get('codigoControl')?.value == ''){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }
    if(this.FormGroup.get('descripcionControl')?.value == null || this.FormGroup.get('descripcionControl')?.value == ''){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }
  }
  if(this.data.id > 0){
    var formData = new FormData();
    let fecha: any
    formData.append('nLegDicodigo', this.LegDocumentacionInterna.nLegDicodigo.toString() ?? '0')
    formData.append('nLegDitipoDoc', this.LegDocumentacionInterna.nLegDitipoDoc.toString() ?? '0')
    formData.append('nLegValTipoDoc', this.LegDocumentacionInterna.nLegValTipoDoc.toString() ?? '0')
    formData.append('cLegDicodigo',  this.FormGroup.get('codigoControl')?.value ?? '' )
    formData.append('cLegDidescripcion',  this.FormGroup.get('descripcionControl')?.value ?? '' )
    if(this.LegDocumentacionInterna.cLegDiarchivo != this.LegDocumentacionInterna.cFile){
      formData.append('cFile',  this.LegDocumentacionInterna.cLegDiarchivo )
    }


    formData.append('cLegDiarchivo',  '' )
    formData.append('bLegDiestado',  'true' )
    if(this.LegDocumentacionInterna.nLegDicodigo == 0){
      if(this.LegDocumentacionInterna.cLegDiarchivo == null){
        this.valserv.mensaje_info("Adjunte archivo.")
        return;
      }


      this.regserv.registroFile('Registro de Legajos', 'documentacioninterna/' + this.data.id,  formData).then((data)=>{
        this.lstserv.listar_DocumentacionInterna(this.data.id)
      })
    }else{
      this.regserv.actualizarFile('Registro de Legajos', 'documentacioninterna/put/' + this.LegDocumentacionInterna.nLegDicodigo, formData).then((data)=>{
        this.lstserv.listar_DocumentacionInterna(this.data.id)
      })
    }
  }else{
    if(this.LegDocumentacionInterna.cLegDiarchivo == null){
      this.valserv.mensaje_info("Adjunte archivo.")
      return;
    }
    this.lstserv.lDocumentacionInterna.push(this.LegDocumentacionInterna)
  }
  this.configserv.onNoClickDialog(this.dialogRef);
}

}
