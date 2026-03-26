import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { Interface } from 'src/app/models/general/interface';
import { LegOrdinarizacion } from 'src/app/models/legajo/leg-ordinarizacion';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ControlesService } from 'src/app/services/controles.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { ValidateService } from 'src/app/services/validate.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ordinarizacion',
  templateUrl: './ordinarizacion.component.html',
  styleUrls: ['./ordinarizacion.component.sass']
})
export class OrdinarizacionComponent implements OnInit {

  public LegOrdinarizacion: LegOrdinarizacion
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFecha: any;
  public errevaluacioncv: boolean = false
  public errclasemodelo: boolean = false
  public errevaluacionpsico: boolean = false
  public errentrevistapers: boolean = false
  public errfichainscripcion: boolean = false
  evaluacioncvControl: FormControl;
  clasemodeloControl: FormControl;
  entrevistapersControl: FormControl;
  evaluacionpsicoControl: FormControl;
  fichainscripcionControl: FormControl;
  public photo: any
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Interface[]>;
  constructor(
    public dialogRef: MatDialogRef<OrdinarizacionComponent>,
    public configserv: ConfiguracionService,
    public ctrlserv: ControlesService,
    public clmdserv: CleanmodelService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Registro de selección', id:number,  obj: LegOrdinarizacion},
  ) {
    this.LegOrdinarizacion = this.clmdserv.empty_ordinarizacion()
    this.today = new Date();
    this.dateFecha = new FormControl(new Date(''));
    this.FormGroup = this._formBuilder.group({
      cargoControl: ['', Validators.required],
      areaControl: ['', Validators.required]
    })
    this.evaluacioncvControl = new FormControl(this.photo)
    this.clasemodeloControl = new FormControl(this.photo)
    this.entrevistapersControl = new FormControl(this.photo)
    this.evaluacionpsicoControl = new FormControl(this.photo)
    this.fichainscripcionControl = new FormControl(this.photo)
    this.configserv.listar_cargouss()
    this.configserv.listar_areauss()


  }

  ngOnInit(): void {
    if(this.data.id > 0 && this.data.obj.nLegOrdCodigo > 0){
      this.LegOrdinarizacion = this.data.obj
      this.customerOnChange(this.data.obj.vCargo, 1)
      this.customerOnChange(this.data.obj.vArea, 2)
      this.FormGroup.setValue({
        cargoControl: this.data.obj.nLegValCargo,
        areaControl: this.data.obj.nLegOrdValArea,
      })
      this.dateFecha = new FormControl(new Date(this.data.obj.dLegOrdFecha))
      this.data.obj.cLegOrdFichaInscripcion = this.data.obj.cLegOrdFichaInscripcion ?? environment.CERTDEFAULT
      this.data.obj.cLegOrdEvaluacionCv = this.data.obj.cLegOrdEvaluacionCv ?? environment.CERTDEFAULT
      this.data.obj.cLegOrdClaseModelo = this.data.obj.cLegOrdClaseModelo ?? environment.CERTDEFAULT
      this.data.obj.cLegOrdEvaluacionPsico = this.data.obj.cLegOrdEvaluacionPsico ?? environment.CERTDEFAULT
      this.data.obj.cLegOrdEntrevistaPers = this.data.obj.cLegOrdEntrevistaPers ?? environment.CERTDEFAULT
      this.LegOrdinarizacion.cFileFichaInscripcion = this.data.obj.cLegOrdFichaInscripcion
      this.LegOrdinarizacion.cFileEvaluacionCv = this.data.obj.cLegOrdEvaluacionCv
      this.LegOrdinarizacion.cFileClaseModelo = this.data.obj.cLegOrdClaseModelo
      this.LegOrdinarizacion.cFileEvaluacionPsico = this.data.obj.cLegOrdEvaluacionPsico
      this.LegOrdinarizacion.cFileEntrevistaPers = this.data.obj.cLegOrdEntrevistaPers
      this.errfichainscripcion = true
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
        case 1:  this.LegOrdinarizacion.nLegOrdCargo = 0; this.LegOrdinarizacion.nLegValCargo = 0; this.LegOrdinarizacion.vCargo = this.clmdserv.empty_interface(); break;
        case 2:  this.LegOrdinarizacion.nLegOrdArea = 0; this.LegOrdinarizacion.nLegOrdValArea = 0; this.LegOrdinarizacion.vArea = this.clmdserv.empty_interface(); break;

      }
    }else{
      switch(tipo){
        case 1:  this.LegOrdinarizacion.nLegOrdCargo = $obj.nIntClase; this.LegOrdinarizacion.nLegValCargo = $obj.nIntCodigo; this.LegOrdinarizacion.vCargo = $obj; break;
        case 2:  this.LegOrdinarizacion.nLegOrdArea = $obj.nIntClase; this.LegOrdinarizacion.nLegOrdValArea = $obj.nIntCodigo; this.LegOrdinarizacion.vArea = $obj; break;

      }
    }

  }

  filePDF(fileInput: any, btipo:number = 0): void {
    this.spinner.show()
    let archadj = fileInput != null ? <File>fileInput.target.files[0] : <File>{}
    const mimeType = fileInput != null ? archadj.type : '';
    if (mimeType.match(/pdf\/*/) == null || mimeType == '') {
      switch(btipo){
        case 0:
                this.LegOrdinarizacion.cLegOrdFichaInscripcion = null;
                this.errfichainscripcion= false;
                break;
        case 1:
                this.LegOrdinarizacion.cLegOrdEvaluacionCv = null;
                this.errevaluacioncv= false;
                break;
        case 2:
                this.LegOrdinarizacion.cLegOrdClaseModelo = null;
                this.errclasemodelo = false;
                break;
        case 3:
                this.LegOrdinarizacion.cLegOrdEvaluacionPsico = null;
                this.errevaluacionpsico = false;
                break;
        case 4:
                this.LegOrdinarizacion.cLegOrdEntrevistaPers = null;
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
        case 0:
                this.LegOrdinarizacion.cLegOrdFichaInscripcion = archadj;
                this.errfichainscripcion = true;
                break;
        case 1:
                this.LegOrdinarizacion.cLegOrdEvaluacionCv = archadj;
                this.errevaluacioncv = true;
                break;
        case 2:
                this.LegOrdinarizacion.cLegOrdClaseModelo = archadj;
                this.errclasemodelo = true;
                break;
        case 3:
                this.LegOrdinarizacion.cLegOrdEvaluacionPsico = archadj;
                this.errevaluacionpsico = true;
                break;
        case 4:
                this.LegOrdinarizacion.cLegOrdEntrevistaPers = archadj;
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
  //     this.LegOrdinarizacion.cLegEvalArchivo = <File>fileInput.target.files[0];
  //     this.preview()
  //   }else{
  //     this.LegOrdinarizacion.cLegEvalArchivo = null
  //     this.erradjunto = false
  //   }

  // }
  // preview(): void {
  //   // Show preview
  //   const mimeType = this.LegOrdinarizacion.cLegEvalArchivo.type;
  //   if (mimeType.match(/pdf\/*/) == null) {
  //     this.LegOrdinarizacion.cLegEvalArchivo = null;
  //     this.erradjunto = false
  //     this.valserv.mensaje_info("Formato no válido. Adjunte evaluación de desempeño en PDF.");
  //     return;
  //   }
  //   this.erradjunto = true
  //   const reader = new FileReader();
  //   reader.readAsDataURL(this.LegOrdinarizacion.cLegEvalArchivo);
  //   reader.onload = (_event) => {
  //     this.LegOrdinarizacion.cFile = reader.result;
  //   }
  // }

  guardar($e: any){
    // console.log(this.LegOrdinarizacion)
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
      formData.append('nLegOrdCodigo', this.LegOrdinarizacion.nLegOrdCodigo.toString() ?? '0')
      formData.append('nLegOrdCargo', this.LegOrdinarizacion.nLegOrdCargo.toString() ?? '0')
      formData.append('nLegValCargo', this.LegOrdinarizacion.nLegValCargo.toString() ?? '0')
      formData.append('nLegOrdArea', this.LegOrdinarizacion.nLegOrdArea.toString() ?? '0')
      formData.append('nLegOrdValArea', this.LegOrdinarizacion.nLegOrdValArea.toString() ?? '0')

      fecha = this.configserv.datepipe.transform(this.dateFecha.value, "yyyy-MM-dd")
      formData.append('dLegOrdFecha', fecha)
      if(this.LegOrdinarizacion.cLegOrdFichaInscripcion != this.LegOrdinarizacion.cFileFichaInscripcion){
        formData.append('cFileFichaInscripcion',  this.LegOrdinarizacion.cLegOrdFichaInscripcion )
      }
      if(this.LegOrdinarizacion.cLegOrdEvaluacionCv != this.LegOrdinarizacion.cFileEvaluacionCv){
        formData.append('cFileEvaluacionCv',  this.LegOrdinarizacion.cLegOrdEvaluacionCv )
      }

      if(this.LegOrdinarizacion.cLegOrdClaseModelo != this.LegOrdinarizacion.cFileClaseModelo){
        formData.append('cFileClaseModelo',  this.LegOrdinarizacion.cLegOrdClaseModelo )
      }

      if(this.LegOrdinarizacion.cLegOrdEntrevistaPers != this.LegOrdinarizacion.cFileEntrevistaPers){
        formData.append('cFileEntrevistaPers',  this.LegOrdinarizacion.cLegOrdEntrevistaPers )
      }

      if(this.LegOrdinarizacion.cLegOrdEvaluacionPsico != this.LegOrdinarizacion.cFileEvaluacionPsico){
        formData.append('cFileEvaluacionPsico',  this.LegOrdinarizacion.cLegOrdEvaluacionPsico )
      }
      formData.append('cLegOrdFichaInscripcion',  '' )
      formData.append('cLegOrdEvaluacionCv',  '' )
      formData.append('cLegOrdClaseModelo',  '' )
      formData.append('cLegOrdEntrevistaPers',  '' )
      formData.append('cLegOrdEvaluacionPsico',  '' )
      formData.append('cLegOrdArchivo',  '' )
      formData.append('bLegOrdEstado',  'true' )
      if(this.LegOrdinarizacion.nLegOrdCodigo == 0){
        if(this.LegOrdinarizacion.cLegOrdFichaInscripcion == null){
          this.valserv.mensaje_info("Adjunte archivo de Ficha Inscripción.")
          return;
        }
        if(this.LegOrdinarizacion.cLegOrdEvaluacionCv == null){
          this.valserv.mensaje_info("Adjunte archivo de Evaluación CV.")
          return;
        }
        if(this.LegOrdinarizacion.cLegOrdClaseModelo == null){
          this.valserv.mensaje_info("Adjunte archivo de Clase Modelo.")
          return;
        }
        if(this.LegOrdinarizacion.cLegOrdEvaluacionPsico == null){
          this.valserv.mensaje_info("Adjunte archivo de Evaluación Psicológica.")
          return;
        }
        if(this.LegOrdinarizacion.cLegOrdEntrevistaPers == null){
          this.valserv.mensaje_info("Adjunte archivo de Entrevista Personal.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'ordinarizacion/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_Ordinarizacion(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'ordinarizacion/put/' + this.LegOrdinarizacion.nLegOrdCodigo, formData).then((data)=>{
          this.lstserv.listar_Ordinarizacion(this.data.id)
        })
      }
    }else{
      if(this.LegOrdinarizacion.cLegOrdFichaInscripcion == null){
        this.valserv.mensaje_info("Adjunte archivo de Ficha Inscripción.")
        return;
      }
      if(this.LegOrdinarizacion.cLegOrdEvaluacionCv == null){
        this.valserv.mensaje_info("Adjunte archivo de Evaluación CV.")
        return;
      }
      if(this.LegOrdinarizacion.cLegOrdClaseModelo == null){
        this.valserv.mensaje_info("Adjunte archivo de Clase Modelo.")
        return;
      }
      if(this.LegOrdinarizacion.cLegOrdEvaluacionPsico == null){
        this.valserv.mensaje_info("Adjunte archivo de Evaluación Psicológica.")
        return;
      }
      if(this.LegOrdinarizacion.cLegOrdEntrevistaPers == null){
        this.valserv.mensaje_info("Adjunte archivo de Entrevista Personal.")
        return;
      }

      this.lstserv.lOrdinarizacion.push(this.LegOrdinarizacion)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
