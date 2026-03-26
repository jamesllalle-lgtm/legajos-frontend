import { ThrowStmt } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CapacitacionesUss } from 'src/app/models/general/capacitaciones-uss';
import { Interface } from 'src/app/models/general/interface';
import { LegCapacitacionInterna } from 'src/app/models/legajo/leg-capacitacion-interna';
import { LegContrato } from 'src/app/models/legajo/leg-contrato';
import { LegDatosGenerales } from 'src/app/models/legajo/leg-datos-generales';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ControlesService } from 'src/app/services/controles.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { ValidateService } from 'src/app/services/validate.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.sass']
})
export class ContratoComponent implements OnInit {

  public regLegContrato: LegContrato
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFechaInicio: any;
  dateFechaFin: any;
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Interface[]>;
  constructor(
    public dialogRef: MatDialogRef<ContratoComponent>,
    public configserv: ConfiguracionService,
    public ctrlserv: ControlesService,
    public clmdserv: CleanmodelService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Registro de contrato', id:number,  obj: LegContrato},
  ) {
    this.regLegContrato = this.clmdserv.empty_contratos()
    this.today = new Date();
    this.dateFechaInicio = new FormControl(new Date(''));
    this.dateFechaFin = new FormControl(new Date(''));
    this.FormGroup = this._formBuilder.group({
      cargoControl: ['', Validators.required],
      areaControl: ['', Validators.required],
      sueldoControl: ['', Validators.required]
    })

    this.configserv.listar_cargouss()
    this.configserv.listar_areauss()
  }

  ngOnInit(): void {
    if(this.data.id > 0 && this.data.obj.nLegConCodigo > 0){
      this.regLegContrato = this.data.obj
      this.customerOnChange(this.data.obj.vCargo, 1)
      this.customerOnChange(this.data.obj.vArea, 2)
      this.FormGroup.setValue({
        cargoControl: this.data.obj.nLegValCargo,
        areaControl: this.data.obj.nLegValArea,
        sueldoControl: this.data.obj.nLegConSueldo.toFixed(2),
      })
      this.dateFechaInicio = new FormControl(new Date(this.data.obj.dLegConFechaInicio))
      this.dateFechaFin= new FormControl(new Date(this.data.obj.dLegConFechaFin))
      this.regLegContrato.cFile = this.data.obj.cLegConArchivo
      this.erradjunto = this.data.obj.cLegConArchivo != null && this.data.obj.cLegConArchivo != '' ? true : false
    }
  }





  customerOnChange($obj:any, tipo: number){
    if($obj == null){
      switch(tipo){
        case 1:  this.regLegContrato.nLegConCargo = 0; this.regLegContrato.nLegValCargo = 0; this.regLegContrato.vCargo = this.clmdserv.empty_interface(); break;
        case 2:  this.regLegContrato.nLegConArea = 0; this.regLegContrato.nLegValArea = 0; this.regLegContrato.vArea = this.clmdserv.empty_interface(); break;
      }
    }else{
      switch(tipo){
        case 1:  this.regLegContrato.nLegConCargo = $obj.nIntClase; this.regLegContrato.nLegValCargo = $obj.nIntCodigo; this.regLegContrato.vCargo = $obj; break;
        case 2:  this.regLegContrato.nLegConArea = $obj.nIntClase; this.regLegContrato.nLegValArea = $obj.nIntCodigo; this.regLegContrato.vArea = $obj; break;
      }
    }

  }

  fileProgress(fileInput: any): void {
    if(fileInput!= null){
      this.regLegContrato.cLegConArchivo = <File>fileInput.target.files[0];
      this.preview()
    }else{
      this.regLegContrato.cLegConArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regLegContrato.cLegConArchivo.type;
    if (mimeType.match(/pdf\/*/) == null) {
      this.regLegContrato.cLegConArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte contrato en PDF.");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regLegContrato.cLegConArchivo);
    reader.onload = (_event) => {
      this.regLegContrato.cFile = reader.result;
    }
  }

  guardar($e: any){
    // console.log(this.regLegContrato)
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }else if(this.dateFechaInicio.status.valueOf() == 'INVALID' ){
      this.valserv.mensaje_info("Ingrese fecha de inicio válida.");
      return;
    }
    else if(this.dateFechaFin.status.valueOf() == 'INVALID' ){
      this.valserv.mensaje_info("Ingrese fecha de fin válida.");
      return;
    }else if(this.dateFechaInicio.value > this.dateFechaFin.value){
      this.valserv.mensaje_info("La fecha inicio no puede ser posterior a la fecha fin.");
      return;
    }
    if(this.data.id > 0){
      var formData = new FormData();
      let fecha: any
      formData.append('nLegConCodigo', this.regLegContrato.nLegConCodigo.toString() ?? '0')
      formData.append('nLegConSueldo', this.FormGroup.get('sueldoControl')?.value ?? '0.0')
      formData.append('nLegConCargo', this.regLegContrato.nLegConCargo.toString() ?? '0')
      formData.append('nLegValCargo', this.regLegContrato.nLegValCargo.toString() ?? '0')
      formData.append('nLegConArea', this.regLegContrato.nLegConArea.toString() ?? '0')
      formData.append('nLegValArea', this.regLegContrato.nLegValArea.toString() ?? '0')
      fecha = this.configserv.datepipe.transform(this.dateFechaInicio.value, "yyyy-MM-dd")
      formData.append('dLegConFechaInicio', fecha)
      fecha = this.configserv.datepipe.transform(this.dateFechaFin.value, "yyyy-MM-dd")
      formData.append('dLegConFechaFin', fecha)
      if(this.regLegContrato.cLegConArchivo != this.regLegContrato.cFile){
        formData.append('cFile',  this.regLegContrato.cLegConArchivo )
      }
      formData.append('cLegConArchivo',  '' )
      formData.append('bLegConEstado',  'true' )
      // console.log("contarto" + this.regLegContrato.nLegConCodigo)
      if(this.regLegContrato.nLegConCodigo == 0){
        if(this.regLegContrato.cFile == null){
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'contrato/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_contrato(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'contrato/put/' + this.regLegContrato.nLegConCodigo, formData).then((data)=>{
          this.lstserv.listar_contrato(this.data.id)
        })
      }
    }else{
      if(this.regLegContrato.cFile == null){
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regLegContrato.dLegConFechaInicio = this.dateFechaInicio.value
      this.regLegContrato.dLegConFechaFin = this.dateFechaFin.value
      this.lstserv.lContrato.push(this.regLegContrato)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
