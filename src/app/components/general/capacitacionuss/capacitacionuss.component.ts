import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Formacion } from 'src/app/models/formacion';
import { GradoAcademico } from 'src/app/models/gradoacademico';
import { CarreraProfesional } from 'src/app/models/carreraprofesional';
import { Institucion } from 'src/app/models/institucion';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/helpers/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Persona } from 'src/app/models/general/persona';
import { Interface } from 'src/app/models/general/interface';
import { LegGradoTitulo } from 'src/app/models/legajo/leg-grado-titulo';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { LegDocenciaUniv } from 'src/app/models/legajo/leg-docencia-univ';
import { Constante } from 'src/app/models/general/constante';
import { LegInvestigador } from 'src/app/models/legajo/leg-investigador';
import { LegTesisAseJur } from 'src/app/models/legajo/leg-tesis-ase-jur';
import { LegProduccionCiencia } from 'src/app/models/legajo/leg-produccion-ciencia';
import { LegParticipacionCongSem } from 'src/app/models/legajo/leg-participacion-cong-sem';
import { LegAdminitrativaCarga } from 'src/app/models/legajo/leg-adminitrativa-carga';
import { LegProyeccionSocial } from 'src/app/models/legajo/leg-proyeccion-social';
import { LegCapacitaciones } from 'src/app/models/legajo/leg-capacitaciones';
import { environment } from 'src/environments/environment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { CapacitacionesUss } from 'src/app/models/general/capacitaciones-uss';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-capacitacionuss',
  templateUrl: './capacitacionuss.component.html',
  styleUrls: ['./capacitacionuss.component.sass'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class CapacitacionussComponent implements OnInit {
  public regCapacitacionUSS: CapacitacionesUss
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFechaInicio: any;
  dateFechaFin: any;
  constructor(
    public dialogRef: MatDialogRef<CapacitacionussComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Registro capacitación USS',  obj: CapacitacionesUss}) {
      this.today = new Date();
      this.dateFechaInicio = new FormControl(new Date(''));
      this.dateFechaFin = new FormControl(new Date(''));
      this.FormGroup = this._formBuilder.group({
        horasControl: ['', Validators.required],
        nombreCapacitacionControl: ['', Validators.required]
      })
      this.regCapacitacionUSS = this.clmdserv.empty_capacitacionesuss()
    }

  ngOnInit(): void {


  }

  guardar($e: any){
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

    var formData = new FormData();
    let fecha: any
    formData.append('nCapCodigo', this.regCapacitacionUSS.nCapCodigo.toString() ?? '0')
    formData.append('cCapTema', this.FormGroup.get('nombreCapacitacionControl')?.value ?? '0')
    formData.append('nCapHoras', this.FormGroup.get('horasControl')?.value ?? '0')
    fecha = this.configserv.datepipe.transform(this.dateFechaInicio.value, "yyyy-MM-dd")
    formData.append('dCapFechaInicio', fecha)
    fecha = this.configserv.datepipe.transform(this.dateFechaFin.value, "yyyy-MM-dd")
    formData.append('dCapFechaFin', fecha)
    this.regserv.registroFile('Registro de Legajos', 'capacitacionesuss' ,  formData).then((data)=>{
      this.configserv.onNoClickDialog(this.dialogRef);
    })

  }

}
