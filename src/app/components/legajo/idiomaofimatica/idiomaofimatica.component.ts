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
import { LegIdiomaOfimatica } from 'src/app/models/legajo/leg-idioma-ofimatica';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-idiomaofimatica',
  templateUrl: './idiomaofimatica.component.html',
  styleUrls: ['./idiomaofimatica.component.sass'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class IdiomaofimaticaComponent implements OnInit {
  public tipoidof: string = ""
  public regIdiomaOfim: LegIdiomaOfimatica
  public listOfim: Constante[] = []
  public lstInstitucion: Persona[] = []
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFecCert: any;
  fileData: any;
  previewUrl: any = "./.assets/images/certdefault.jpg"
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Persona[]>;
  constructor(
    public dialogRef: MatDialogRef<IdiomaofimaticaComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Grados y títulos', id: 0, tipo: false, formacion: LegIdiomaOfimatica},
  ) {
    this.today = new Date();
    this.dateFecCert = new FormControl(new Date(''));
    this.regIdiomaOfim = this.clmdserv.empty_idiomaofimatica()
    this.FormGroup = this._formBuilder.group({
      idiomaofimControl: ['', Validators.required],
      nivelControl: ['', Validators.required],
      tipoControl: ['', ''],
    })
    this.listar_idiomaofimatica()
    this.listar_tipoofimatica()
    this.listar_nivel()
  }

  ngOnInit(): void {

    this.tipoidof =  (this.data.tipo ? "Informática" : "Idioma")
    if(this.data.id > 0  && this.data.formacion.nLegIdOfCodigo > 0){
      this.regIdiomaOfim = this.data.formacion
      let ofim: number = 0
      let tipo: number = 0

      if(this.data.tipo && this.data.formacion.vCodigoDesc.nConCodigo == 1110){
        tipo = this.data.formacion.vCodigoDesc.nConValor
        ofim = parseInt( tipo.toString().substr(0,4))
        this.listOfim = this.lstserv.ltipoofimatica.filter(x => x.nConValor.toString().substr(0,4) == ofim.toString())
      }
      this.FormGroup.setValue({
        idiomaofimControl: this.data.tipo && this.data.formacion.vCodigoDesc.nConCodigo == 1110 ? ofim : this.data.formacion.vCodigoDesc.nConValor,
        nivelControl: this.data.formacion.vNivel.nConValor,
        tipoControl: tipo,
      })
      this.regIdiomaOfim.cFile = this.data.formacion.cLegIdOfArchivo
      this.erradjunto = this.data.formacion.cLegIdOfArchivo != null && this.data.formacion.cLegIdOfArchivo != '' ? true : false
      this.dateFecCert = new FormControl(new Date(this.data.formacion.dLegIdOfFecha))
    }
  }


  listar_idiomaofimatica(){
    this.lstserv.listado('constante', '/'+ (this.data.tipo ? this.configserv.nConOfimatica : this.configserv.nConIdioma)).then((data)=>{
       let lregded: Constante[] = data;
       this.lstserv.lIdiof = lregded.filter(x=>x.nConValor != 2000 && x.nConValor !=1000)
    })
  }

  listar_tipoofimatica(){
    this.lstserv.listado('constante', '/'+ this.configserv.nConTipoOfimatica).then((data)=>{
       let lregded: Constante[] = data;
       this.lstserv.ltipoofimatica = lregded.filter(x=>x.nConValor != 2000)
    })
  }

  listar_nivel(){
    this.lstserv.listado('constante', '/'+ this.configserv.nConNivelKills).then((data)=>{
       let lcategdoc: Constante[] = data;
       this.lstserv.lnivel = lcategdoc.filter(x=>x.nConValor != 0)
    })
  }

  fileProgress(fileInput: any): void {
    if(fileInput!= null){
      this.regIdiomaOfim.cLegIdOfArchivo = <File>fileInput.target.files[0];
      this.preview()
    }else{
      this.regIdiomaOfim.cLegIdOfArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regIdiomaOfim.cLegIdOfArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regIdiomaOfim.cLegIdOfArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regIdiomaOfim.cLegIdOfArchivo);
    reader.onload = (_event) => {
      this.regIdiomaOfim.cFile = reader.result;
    }
  }


  customerOnChange($obj:any, tipo: number){
    if($obj == null){
      switch(tipo){
        case 1:
                this.regIdiomaOfim.nLegIdOfCodigoDesc =  0; this.regIdiomaOfim.nValorDesc = 0;  this.regIdiomaOfim.vCodigoDesc = this.clmdserv.empty_constante();
                if(this.data.tipo)this.lstserv.ltipoofimatica = [];
                break;
        case 2: this.regIdiomaOfim.nLegIdOfNivel =  0; this.regIdiomaOfim.nValorNivel = 0;  this.regIdiomaOfim.vNivel = this.clmdserv.empty_constante(); break;
        case 3: this.regIdiomaOfim.nLegIdOfCodigoDesc =  0; this.regIdiomaOfim.nValorDesc = 0;  this.regIdiomaOfim.vCodigoDesc = this.clmdserv.empty_constante();
      }
    }else{
      switch(tipo){
        case 1: this.regIdiomaOfim.nLegIdOfCodigoDesc =  $obj.nConCodigo; this.regIdiomaOfim.nValorDesc = $obj.nConValor;  this.regIdiomaOfim.vCodigoDesc = $obj;
        if(this.data.tipo){
          this.listOfim = this.lstserv.ltipoofimatica.filter(x => x.nConValor.toString().substr(0,4) == $obj.nConValor.toString())
        }
        break;
        case 2: this.regIdiomaOfim.nLegIdOfNivel =  $obj.nConCodigo; this.regIdiomaOfim.nValorNivel = $obj.nConValor;  this.regIdiomaOfim.vNivel = $obj; break;
        case 3: this.regIdiomaOfim.nLegIdOfCodigoDesc =  $obj.nConCodigo; this.regIdiomaOfim.nValorDesc = $obj.nConValor;  this.regIdiomaOfim.vCodigoDesc = $obj;
      }
    }

  }



  guardar($e: any){
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }else if(this.dateFecCert.status.valueOf() == 'INVALID' ){
      this.valserv.mensaje_info("Ingrese fecha de certificación válida.");
      return;
    }
    if(this.data.id > 0){
      var formData = new FormData();
      let fecha: any
      formData.append('nLegIdOfCodigo', this.regIdiomaOfim.nLegIdOfCodigo.toString() ?? '0')
      formData.append('nLegIdOfCodigoDesc', this.regIdiomaOfim.nLegIdOfCodigoDesc.toString() ?? '')
      formData.append('nValorDesc', this.regIdiomaOfim.nValorDesc.toString() ?? '0')
      formData.append('nLegIdOfNivel', this.regIdiomaOfim.nLegIdOfNivel.toString() ?? '0')
      formData.append('nValorNivel', this.regIdiomaOfim.nValorNivel.toString() ?? '0')
      formData.append('cLegIdOfTipo', this.data.tipo.toString() ?? '')
      fecha = this.configserv.datepipe.transform(this.dateFecCert.value, "yyyy-MM-dd")
      formData.append('dLegIdOfFecha', fecha)
      if(this.regIdiomaOfim.cLegIdOfArchivo != this.regIdiomaOfim.cFile){
        formData.append('cFile',  this.regIdiomaOfim.cLegIdOfArchivo )
      }
      formData.append('cLegIdOfArchivo',  '' )
      formData.append('cLegIdOfValida','false' )
      formData.append('cLegIdOfEstado',  'true' )
      if(this.regIdiomaOfim.nLegIdOfCodigo == 0){
        if(this.regIdiomaOfim.cFile == null){
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'idiomaofimatica/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_domidiomaofimatica(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'idiomaofimatica/put/' + this.regIdiomaOfim.nLegIdOfCodigo, formData).then((data)=>{
          this.lstserv.listar_domidiomaofimatica(this.data.id)
        })
      }
    }else{
      if(this.regIdiomaOfim.cFile == null){
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regIdiomaOfim.cLegIdOfTipo = this.data.tipo
      this.regIdiomaOfim.dLegIdOfFecha = this.dateFecCert.value
      this.lstserv.lidiomasofimatica.push(this.regIdiomaOfim)
    }
    this.lstserv.lofimatica = this.lstserv.lidiomasofimatica.filter(x => x.cLegIdOfTipo == true)
    this.lstserv.lidioma = this.lstserv.lidiomasofimatica.filter(x => x.cLegIdOfTipo == false)
    this.configserv.onNoClickDialog(this.dialogRef);
  }
}
