import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { Interface } from 'src/app/models/general/interface';
import { LegSeleccion } from 'src/app/models/legajo/leg-seleccion';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ControlesService } from 'src/app/services/controles.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { ValidateService } from 'src/app/services/validate.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.sass']
})
export class SeleccionComponent implements OnInit {

  public LegSeleccion: LegSeleccion
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFecha: any;
  public errevaluacioncv: boolean = false
  public errclasemodelo: boolean = false
  public errevaluacionpsico: boolean = false
  public errentrevistapers: boolean = false
  evaluacioncvControl: FormControl;
  clasemodeloControl: FormControl;
  entrevistapersControl: FormControl;
  evaluacionpsicoControl: FormControl;
  public photo: any
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Interface[]>;
  constructor(
    public dialogRef: MatDialogRef<SeleccionComponent>,
    public configserv: ConfiguracionService,
    public ctrlserv: ControlesService,
    public clmdserv: CleanmodelService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Registro de selección', id:number,  obj: LegSeleccion},
  ) {
    this.LegSeleccion = this.clmdserv.empty_seleccion()
    this.today = new Date();
    this.dateFecha = new FormControl(new Date(''));
    this.FormGroup = this._formBuilder.group({
      cargoControl: ['', Validators.required],
      areaControl: ['', Validators.required],
    })
    this.evaluacioncvControl = new FormControl(this.photo)
    this.clasemodeloControl = new FormControl(this.photo)
    this.entrevistapersControl = new FormControl(this.photo)
    this.evaluacionpsicoControl = new FormControl(this.photo)
    this.configserv.listar_cargouss()
    this.configserv.listar_areauss()


  }

  ngOnInit(): void {
    if(this.data.id > 0 && this.data.obj.nLegSelCodigo > 0){
      this.LegSeleccion = this.data.obj
      this.customerOnChange(this.data.obj.vCargo, 1)
      this.customerOnChange(this.data.obj.vArea, 2)
      this.FormGroup.setValue({
        cargoControl: this.data.obj.nLegValCargo,
        areaControl: this.data.obj.nLegValArea,
      })
      this.dateFecha = new FormControl(new Date(this.data.obj.dLegSelFecha))
      this.data.obj.cLegSelEvaluacionCv = this.data.obj.cLegSelEvaluacionCv ?? environment.CERTDEFAULT
      this.data.obj.cLegSelClaseModelo = this.data.obj.cLegSelClaseModelo ?? environment.CERTDEFAULT
      this.data.obj.cLegSelEvaluacionPsico = this.data.obj.cLegSelEvaluacionPsico ?? environment.CERTDEFAULT
      this.data.obj.cLegSelEntrevistaPers = this.data.obj.cLegSelEntrevistaPers ?? environment.CERTDEFAULT
      this.LegSeleccion.cFileEvaluacionCv = this.data.obj.cLegSelEvaluacionCv
      this.LegSeleccion.cFileClaseModelo = this.data.obj.cLegSelClaseModelo
      this.LegSeleccion.cFileEvaluacionPsico = this.data.obj.cLegSelEvaluacionPsico
      this.LegSeleccion.cFileEntrevistaPers = this.data.obj.cLegSelEntrevistaPers
      this.errevaluacioncv = true
      this.errclasemodelo = true
      this.errevaluacionpsico = true
      this.errentrevistapers = true
    }
  }





  customerOnChange($obj:any, tipo: number){
    // console.log($obj)
    if($obj == null){
      switch(tipo){
        case 1:  this.LegSeleccion.nLegSelCargo = 0; this.LegSeleccion.nLegValCargo = 0; this.LegSeleccion.vCargo = this.clmdserv.empty_interface(); break;
        case 2:  this.LegSeleccion.nLegSelArea = 0; this.LegSeleccion.nLegValArea = 0; this.LegSeleccion.vArea = this.clmdserv.empty_interface(); break;

      }
    }else{
      switch(tipo){
        case 1:  this.LegSeleccion.nLegSelCargo = $obj.nIntClase; this.LegSeleccion.nLegValCargo = $obj.nIntCodigo; this.LegSeleccion.vCargo = $obj; break;
        case 2:  this.LegSeleccion.nLegSelArea = $obj.nIntClase; this.LegSeleccion.nLegValArea = $obj.nIntCodigo; this.LegSeleccion.vArea = $obj; break;

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
                this.LegSeleccion.cLegSelEvaluacionCv = null;
                this.errevaluacioncv= false;
                break;
        case 2:
                this.LegSeleccion.cLegSelClaseModelo = null;
                this.errclasemodelo = false;
                break;
        case 3:
                this.LegSeleccion.cLegSelEvaluacionPsico = null;
                this.errevaluacionpsico = false;
                break;
        case 4:
                this.LegSeleccion.cLegSelEntrevistaPers = null;
                this.errentrevistapers = false;
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
                this.LegSeleccion.cLegSelEvaluacionCv = archadj;
                this.errevaluacioncv = true;
                break;
        case 2:
                this.LegSeleccion.cLegSelClaseModelo = archadj;
                this.errclasemodelo = true;
                break;
        case 3:
                this.LegSeleccion.cLegSelEvaluacionPsico = archadj;
                this.errevaluacionpsico = true;
                break;
        case 4:
                this.LegSeleccion.cLegSelEntrevistaPers = archadj;
                this.errentrevistapers = true;
                  break;

      }
      this.spinner.hide()
    }

    // if(btipo){
    //   this.fileData = <File>fileInput.target.files[0];
    // }else{
    //   this.fileDataCert = <File>fileInput.target.files[0];
    // }

  }
  // fileProgress(fileInput: any): void {
  //   if(fileInput!= null){
  //     this.LegSeleccion.cLegEvalArchivo = <File>fileInput.target.files[0];
  //     this.preview()
  //   }else{
  //     this.LegSeleccion.cLegEvalArchivo = null
  //     this.erradjunto = false
  //   }

  // }
  // preview(): void {
  //   // Show preview
  //   const mimeType = this.LegSeleccion.cLegEvalArchivo.type;
  //   if (mimeType.match(/pdf\/*/) == null) {
  //     this.LegSeleccion.cLegEvalArchivo = null;
  //     this.erradjunto = false
  //     this.valserv.mensaje_info("Formato no válido. Adjunte evaluación de desempeño en PDF.");
  //     return;
  //   }
  //   this.erradjunto = true
  //   const reader = new FileReader();
  //   reader.readAsDataURL(this.LegSeleccion.cLegEvalArchivo);
  //   reader.onload = (_event) => {
  //     this.LegSeleccion.cFile = reader.result;
  //   }
  // }

  guardar($e: any){
    // console.log(this.LegSeleccion)
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
      formData.append('nLegSelCodigo', this.LegSeleccion.nLegSelCodigo.toString() ?? '0')
      formData.append('nLegSelCargo', this.LegSeleccion.nLegSelCargo.toString() ?? '0')
      formData.append('nLegValCargo', this.LegSeleccion.nLegValCargo.toString() ?? '0')
      formData.append('nLegSelArea', this.LegSeleccion.nLegSelArea.toString() ?? '0')
      formData.append('nLegValArea', this.LegSeleccion.nLegValArea.toString() ?? '0')
      fecha = this.configserv.datepipe.transform(this.dateFecha.value, "yyyy-MM-dd")
      formData.append('dLegSelFecha', fecha)
      if(this.LegSeleccion.cLegSelEvaluacionCv != this.LegSeleccion.cFileEvaluacionCv){
        formData.append('cFileEvaluacionCv',  this.LegSeleccion.cLegSelEvaluacionCv )
      }

      if(this.LegSeleccion.cLegSelClaseModelo != this.LegSeleccion.cFileClaseModelo){
        formData.append('cFileClaseModelo',  this.LegSeleccion.cLegSelClaseModelo )
      }

      if(this.LegSeleccion.cLegSelEntrevistaPers != this.LegSeleccion.cFileEntrevistaPers){
        formData.append('cFileEntrevistaPers',  this.LegSeleccion.cLegSelEntrevistaPers )
      }

      if(this.LegSeleccion.cLegSelEvaluacionPsico != this.LegSeleccion.cFileEvaluacionPsico){
        formData.append('cFileEvaluacionPsico',  this.LegSeleccion.cLegSelEvaluacionPsico )
      }

      formData.append('cLegSelEvaluacionCv',  '' )
      formData.append('cLegSelClaseModelo',  '' )
      formData.append('cLegSelEntrevistaPers',  '' )
      formData.append('cLegSelEvaluacionPsico',  '' )
      formData.append('bLegSelEstado',  'true' )
      if(this.LegSeleccion.nLegSelCodigo == 0){
        if(this.LegSeleccion.cLegSelEvaluacionCv == null){
          this.valserv.mensaje_info("Adjunte archivo de Evaluación CV.")
          return;
        }
        if(this.LegSeleccion.cLegSelClaseModelo == null){
          this.valserv.mensaje_info("Adjunte archivo de Clase Modelo.")
          return;
        }
        if(this.LegSeleccion.cLegSelEvaluacionPsico == null){
          this.valserv.mensaje_info("Adjunte archivo de Evaluación Psicológica.")
          return;
        }
        if(this.LegSeleccion.cLegSelEntrevistaPers == null){
          this.valserv.mensaje_info("Adjunte archivo de Entrevista Personal.")
          return;
        }

        this.regserv.registroFile('Registro de Legajos', 'seleccion/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_evaluaciondesemp(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'seleccion/put/' + this.LegSeleccion.nLegSelCodigo, formData).then((data)=>{
          this.lstserv.listar_evaluaciondesemp(this.data.id)
        })
      }
    }else{
      if(this.LegSeleccion.cLegSelEvaluacionCv == null){
        this.valserv.mensaje_info("Adjunte archivo de Evaluación CV.")
        return;
      }
      if(this.LegSeleccion.cLegSelClaseModelo == null){
        this.valserv.mensaje_info("Adjunte archivo de Clase Modelo.")
        return;
      }
      if(this.LegSeleccion.cLegSelEvaluacionPsico == null){
        this.valserv.mensaje_info("Adjunte archivo de Evaluación Psicológica.")
        return;
      }
      if(this.LegSeleccion.cLegSelEntrevistaPers == null){
        this.valserv.mensaje_info("Adjunte archivo de Entrevista Personal.")
        return;
      }
      this.lstserv.lSeleccion.push(this.LegSeleccion)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
