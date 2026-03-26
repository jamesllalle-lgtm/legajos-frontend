import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Interface } from 'node:readline';
import { Observable } from 'rxjs';
import { LegEvaluacionDesemp } from 'src/app/models/legajo/leg-eval-desempeño';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ControlesService } from 'src/app/services/controles.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-evaluaciondesemp',
  templateUrl: './evaluaciondesemp.component.html',
  styleUrls: ['./evaluaciondesemp.component.sass']
})
export class EvaluaciondesempComponent implements OnInit {

  public LegEvaluacionDesemp: LegEvaluacionDesemp
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFechaInicio: any;
  dateFechaFin: any;
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Interface[]>;
  constructor(
    public dialogRef: MatDialogRef<EvaluaciondesempComponent>,
    public configserv: ConfiguracionService,
    public ctrlserv: ControlesService,
    public clmdserv: CleanmodelService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Registro de evaluación de desempeño', id:number,  obj: LegEvaluacionDesemp, admin:boolean},
  ) {
    this.LegEvaluacionDesemp = this.clmdserv.empty_evaluaciondesemp()
    this.today = new Date();
    this.dateFechaInicio = new FormControl(new Date(''));
    this.dateFechaFin = new FormControl(new Date(''));
    this.FormGroup = this._formBuilder.group({
      cargoControl: ['', Validators.required],
      areaControl: ['', Validators.required],
      nivelControl:['', Validators.required],
      puntajeControl: ['', Validators.required],
      semestreControl: [''],
      anioControl: ['']
    })

    this.configserv.listar_cargouss()
    this.configserv.listar_areauss()
    this.configserv.listar_anios()
    this.configserv.listar_niveleval(this.data.admin)
    this.configserv.listar_semestre()


  }

  ngOnInit(): void {
    if(this.data.id > 0 && this.data.obj.nLegEvalCodigo > 0){
      this.LegEvaluacionDesemp = this.data.obj
      this.customerOnChange(this.data.obj.vCargo, 1)
      this.customerOnChange(this.data.obj.vArea, 2)
      this.customerOnChange(this.data.obj.vNivel, 3)
      this.FormGroup.setValue({
        cargoControl: this.data.obj.nLegValCargo,
        areaControl: this.data.obj.nLegValArea,
        nivelControl: this.data.obj.nLegValNivel,
        puntajeControl: this.data.obj.nLegEvalPuntaje.toFixed(2),
        semestreControl: parseInt(this.data.obj.cLegEvalSemestre),
        anioControl: parseInt(this.data.obj.cLegEvalAnio)
      })
      this.LegEvaluacionDesemp.cFile = this.data.obj.cLegEvalArchivo
      this.erradjunto = this.data.obj.cLegEvalArchivo != null && this.data.obj.cLegEvalArchivo != '' ? true : false
    }
  }





  customerOnChange($obj:any, tipo: number){
    // console.log($obj)
    if($obj == null){
      switch(tipo){
        case 1:  this.LegEvaluacionDesemp.nLegEvalCargo = 0; this.LegEvaluacionDesemp.nLegValCargo = 0; this.LegEvaluacionDesemp.vCargo = this.clmdserv.empty_interface(); break;
        case 2:  this.LegEvaluacionDesemp.nLegEvalArea = 0; this.LegEvaluacionDesemp.nLegValArea = 0; this.LegEvaluacionDesemp.vArea = this.clmdserv.empty_interface(); break;
        case 3:  this.LegEvaluacionDesemp.nLegEvalNivel = 0; this.LegEvaluacionDesemp.nLegValNivel = 0; this.LegEvaluacionDesemp.vNivel = this.clmdserv.empty_constante(); break;
        case 4:  this.LegEvaluacionDesemp.cLegEvalAnio = '0'; break;
        case 5:  this.LegEvaluacionDesemp.cLegEvalSemestre = '0'; break;
      }
    }else{
      switch(tipo){
        case 1:  this.LegEvaluacionDesemp.nLegEvalCargo = $obj.nIntClase; this.LegEvaluacionDesemp.nLegValCargo = $obj.nIntCodigo; this.LegEvaluacionDesemp.vCargo = $obj; break;
        case 2:  this.LegEvaluacionDesemp.nLegEvalArea = $obj.nIntClase; this.LegEvaluacionDesemp.nLegValArea = $obj.nIntCodigo; this.LegEvaluacionDesemp.vArea = $obj; break;
        case 3:  this.LegEvaluacionDesemp.nLegEvalNivel = $obj.nConCodigo; this.LegEvaluacionDesemp.nLegValNivel = $obj.nConValor; this.LegEvaluacionDesemp.vNivel = $obj; break;
        case 4:  this.LegEvaluacionDesemp.cLegEvalAnio = $obj.nConValor;break;
        case 5:  this.LegEvaluacionDesemp.cLegEvalSemestre = $obj.nConValor;break;
      }
    }

  }

  fileProgress(fileInput: any): void {
    if(fileInput!= null){
      this.LegEvaluacionDesemp.cLegEvalArchivo = <File>fileInput.target.files[0];
      this.preview()
    }else{
      this.LegEvaluacionDesemp.cLegEvalArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.LegEvaluacionDesemp.cLegEvalArchivo.type;
    if (mimeType.match(/pdf\/*/) == null) {
      this.LegEvaluacionDesemp.cLegEvalArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte evaluación de desempeño en PDF.");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.LegEvaluacionDesemp.cLegEvalArchivo);
    reader.onload = (_event) => {
      this.LegEvaluacionDesemp.cFile = reader.result;
    }
  }

  guardar($e: any){
    // console.log(this.LegEvaluacionDesemp)
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }
    if(this.data.id > 0){
      var formData = new FormData();
      let fecha: any
      formData.append('nLegEvalCodigo', this.LegEvaluacionDesemp.nLegEvalCodigo.toString() ?? '0')
      formData.append('nLegEvalPuntaje', this.FormGroup.get('puntajeControl')?.value ?? '0.0')
      formData.append('cLegEvalSemestre', this.FormGroup.get('semestreControl')?.value ?? '')
      formData.append('cLegEvalAnio', this.FormGroup.get('anioControl')?.value ?? '')
      formData.append('nLegEvalCargo', this.LegEvaluacionDesemp.nLegEvalCargo.toString() ?? '0')
      formData.append('nLegValCargo', this.LegEvaluacionDesemp.nLegValCargo.toString() ?? '0')
      formData.append('nLegEvalArea', this.LegEvaluacionDesemp.nLegEvalArea.toString() ?? '0')
      formData.append('nLegValArea', this.LegEvaluacionDesemp.nLegValArea.toString() ?? '0')
      formData.append('nLegEvalNivel', this.LegEvaluacionDesemp.nLegEvalNivel.toString() ?? '0')
      formData.append('nLegValNivel', this.LegEvaluacionDesemp.nLegValNivel.toString() ?? '0')

      if(this.LegEvaluacionDesemp.cLegEvalArchivo != this.LegEvaluacionDesemp.cFile){
        formData.append('cFile',  this.LegEvaluacionDesemp.cLegEvalArchivo )
      }
      formData.append('cLegEvalArchivo',  '' )
      formData.append('bLegEvalEstado',  'true' )
      if(this.LegEvaluacionDesemp.nLegEvalCodigo == 0){
        if(this.LegEvaluacionDesemp.cFile == null){
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'evaluaciondesemp/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_evaluaciondesemp(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'evaluaciondesemp/put/' + this.LegEvaluacionDesemp.nLegEvalCodigo, formData).then((data)=>{
          this.lstserv.listar_evaluaciondesemp(this.data.id)
        })
      }
    }else{
      if(this.LegEvaluacionDesemp.cFile == null){
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }

      this.lstserv.lEvaluacionDesemp.push(this.LegEvaluacionDesemp)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
