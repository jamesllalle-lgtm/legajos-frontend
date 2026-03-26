import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { LegResolucion } from 'src/app/models/legajo/leg-resolucion';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ControlesService } from 'src/app/services/controles.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-resolucion',
  templateUrl: './resolucion.component.html',
  styleUrls: ['./resolucion.component.sass']
})
export class ResolucionComponent implements OnInit {

  public regLegResolucion: LegResolucion
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFecha: any;
  erradjunto: boolean = false
  myControl = new FormControl();
  constructor(
    public dialogRef: MatDialogRef<ResolucionComponent>,
    public configserv: ConfiguracionService,
    public ctrlserv: ControlesService,
    public clmdserv: CleanmodelService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Registro de resolución', id:number,  obj: LegResolucion},
  ) {
    this.regLegResolucion = this.clmdserv.empty_resoluciones()
    this.today = new Date();
    this.dateFecha = new FormControl(new Date(''));
    this.FormGroup = this._formBuilder.group({
      resolucionControl: [''],
      tipoControl: ['', Validators.required],
      nroResolucionControl: ['', Validators.required],
      resuelveControl: ['', Validators.required]
    })

    this.configserv.listar_resoluciontipo()
  }

  ngOnInit(): void {
    if(this.data.id > 0 && this.data.obj.nLegResCodigo > 0){
      this.regLegResolucion = this.data.obj
      this.customerOnChange(this.data.obj.vResolucion, 1)
      this.FormGroup.setValue({
        resolucionControl: parseInt( this.data.obj.nLegValTipo.toString().substr(0,4)),
        tipoControl: this.data.obj.nLegValTipo,
        nroResolucionControl: this.data.obj.cLegResNroResolucion,
        resuelveControl: this.data.obj.cLegResResuelve,
      })
      this.dateFecha = new FormControl(new Date(this.data.obj.dLegResFecha))
      this.regLegResolucion.cFile = this.data.obj.cLegResArchivo
      this.erradjunto = this.data.obj.cLegResArchivo != null && this.data.obj.cLegResArchivo != '' ? true : false
    }
  }





  customerOnChange($obj:any, tipo: number){
    if($obj == null){
      switch(tipo){
        case 1:  this.regLegResolucion.nLegResTipo = 0; this.regLegResolucion.nLegValTipo = 0; this.regLegResolucion.vResolucion = this.clmdserv.empty_constante(); break;
        case 2:  this.regLegResolucion.nLegResTipo = 0; this.regLegResolucion.nLegValTipo = 0; this.regLegResolucion.vResolucion = this.clmdserv.empty_constante(); break;
      }
    }else{
      switch(tipo){
        case 1:
            let ofim = parseInt( $obj.nConValor.toString().substr(0,4))
            this.lstserv.lfTipoResolucion = this.lstserv.lTipoResolucion.filter(x => x.nConValor.toString().substr(0,4) == ofim.toString())
            break;
        case 2:
          this.regLegResolucion.nLegResTipo = $obj.nConCodigo; this.regLegResolucion.nLegValTipo = $obj.nConValor; this.regLegResolucion.vResolucion = $obj;
          break;
      }
    }

  }

  fileProgress(fileInput: any): void {
    if(fileInput!= null){
      this.regLegResolucion.cLegResArchivo = <File>fileInput.target.files[0];
      this.preview()
    }else{
      this.regLegResolucion.cLegResArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regLegResolucion.cLegResArchivo.type;
    if (mimeType.match(/pdf\/*/) == null) {
      this.regLegResolucion.cLegResArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte resución en PDF.");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regLegResolucion.cLegResArchivo);
    reader.onload = (_event) => {
      this.regLegResolucion.cFile = reader.result;
    }
  }

  guardar($e: any){
    // console.log(this.regLegResolucion)
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }else if(this.dateFecha.status.valueOf() == 'INVALID' ){
      this.valserv.mensaje_info("Ingrese fecha de inicio válida.");
      return;
    }

    if(this.data.id > 0){
      var formData = new FormData();
      let fecha: any
      formData.append('nLegResCodigo', this.regLegResolucion.nLegResCodigo.toString() ?? '0')
      formData.append('cLegResNroResolucion', this.FormGroup.get('nroResolucionControl')?.value ?? '')
      formData.append('cLegResResuelve', this.FormGroup.get('resuelveControl')?.value ?? '')
      formData.append('nLegResTipo', this.regLegResolucion.nLegResTipo.toString() ?? '0')
      formData.append('nLegValTipo', this.regLegResolucion.nLegValTipo.toString() ?? '0')
      fecha = this.configserv.datepipe.transform(this.dateFecha.value, "yyyy-MM-dd")
      formData.append('dLegResFecha', fecha)
      if(this.regLegResolucion.cLegResArchivo != this.regLegResolucion.cFile){
        formData.append('cFile',  this.regLegResolucion.cLegResArchivo )
      }
      formData.append('cLegResArchivo',  '' )
      formData.append('bLegResEstado',  'true' )
      if(this.regLegResolucion.nLegResCodigo == 0){
        if(this.regLegResolucion.cFile == null){
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'resolucion/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_resoluciones(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'resolucion/put/' + this.regLegResolucion.nLegResCodigo, formData).then((data)=>{
          this.lstserv.listar_resoluciones(this.data.id)
        })
      }
    }else{
      if(this.regLegResolucion.cFile == null){
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regLegResolucion.dLegResFecha = this.dateFecha.value
      this.lstserv.lResolucion.push(this.regLegResolucion)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
