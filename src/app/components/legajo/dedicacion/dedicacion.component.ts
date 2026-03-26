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
import { LegCategoriaDocente } from 'src/app/models/legajo/leg-categoria-docente';
import { LegRegimenDedicacion } from 'src/app/models/legajo/leg-regimen-dedicacion';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-dedicacion',
  templateUrl: './dedicacion.component.html',
  styleUrls: ['./dedicacion.component.sass'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class DedicacionComponent implements OnInit {
  public regDedicacion: LegRegimenDedicacion
  public lstInstitucion: Persona[] = []
  filterInst: any
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFecIni: any;
  dateFecFin: any;
  fileData: any;
  previewUrl: any = "./.assets/images/certdefault.jpg"
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Persona[]>;
  constructor(
    public dialogRef: MatDialogRef<DedicacionComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Grados y títulos', id: 0, formacion: LegRegimenDedicacion},
  ) {
    this.today = new Date();
    this.dateFecIni = new FormControl(new Date(''));
    this.dateFecFin = new FormControl(new Date(''));
    this.regDedicacion = this.clmdserv.empty_regimendedic()
    this.FormGroup = this._formBuilder.group({
      universidadControl: ['', Validators.required],
      categoriaControl: ['', Validators.required],
      otraControl: ( ['']),
    })
  }


  ngOnInit(): void {
    this.listar_categoriadoc()
    let paisuniv:number =  0;
    let vpais:Interface = this.clmdserv.empty_interface()
    if(this.data.id > 0 && this.data.formacion.nLegRegCodigo > 0){
      this.regDedicacion = this.data.formacion
      vpais = this.lstserv.lubigeo.filter(x=>x.cIntJerarquia.trim() == this.data.formacion.cLegRegPais)[0]
      paisuniv = vpais.nIntCodigo

      this.universidadOnChange(vpais)
      this.FormGroup.setValue({
        universidadControl: paisuniv,
        categoriaControl: this.data.formacion.vDedicacion.nConValor,
        otraControl: this.data.formacion.cLegRegOtraInst
      })
      if(this.regDedicacion.cLegRegOtraInst.trim() != ""){
        this.regDedicacion.cLegCatInstitucionNavigation = this.clmdserv.empty_persona()
        this.regDedicacion.cLegCatInstitucion = this.clmdserv.codigonoinst
      }
      this.regDedicacion.cFile = this.data.formacion.cLegRegArchivo
      this.erradjunto = this.data.formacion.cLegRegArchivo != null && this.data.formacion.cLegRegArchivo != '' ? true : false
      this.myControl.setValue(this.data.formacion.cLegCatInstitucionNavigation.cPerNombre)
      this.dateFecIni = new FormControl(new Date(this.data.formacion.dLegRegFechaInicio))
      this.dateFecFin = new FormControl(new Date(this.data.formacion.dLegRegFechaFin))
    }else{this.universidadOnChange(null)}
  }

  listar_institucion($ubig: String){
    this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo == $ubig);
    this.cargardata();
  }

  listar_categoriadoc(){
    this.lstserv.listado('constante', '/'+ this.configserv.nConDedicacion).then((data)=>{
       let lcategdoc: Constante[] = data;
       this.lstserv.lCategoriaDoc = lcategdoc.filter(x=>x.nConValor != 0)
    })
  }

  fileProgress(fileInput: any): void {
    if(fileInput!= null){
      this.regDedicacion.cLegRegArchivo = <File>fileInput.target.files[0];
      this.preview()
    }else{
      this.regDedicacion.cLegRegArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regDedicacion.cLegRegArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regDedicacion.cLegRegArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regDedicacion.cLegRegArchivo);
    reader.onload = (_event) => {
      this.regDedicacion.cFile = reader.result;
    }
  }

  cargardata(){
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.c),
        map(cPerNombre => cPerNombre ? this._filter(cPerNombre) :this.lstInstitucion.slice(0, 100))
      );
  }


  displayFn(inst: Persona): string {
    return inst && inst.cPerNombre ? inst.cPerNombre : '';
  }

  private _filter(name: string): Persona[] {
    const filterValue = name.toLowerCase();
    return this.lstInstitucion.filter(option => option.cPerNombre.toLowerCase().includes(filterValue)).slice(0, 100);
  }



  handleModelChange(e:any, tipo: number){
    if(e == '') {
      switch(tipo){
        case 1: this.regDedicacion.cLegCatInstitucion =  ''; break;
      }

    }
  }

  universidadOnChange($obj: any){
    this.myControl.setValue('')
    if($obj == null){
      this.lstInstitucion = []
    }else{
      if($obj.cIntJerarquia.trim() != 'PER'){
        this.regDedicacion.cLegRegPais = $obj.cIntJerarquia.trim()
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo.trim() == $obj.cIntJerarquia.trim());
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      }else{
        this.regDedicacion.cLegRegPais = "PER"
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo.length>3);
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      }
      this.lstInstitucion.push(this.clmdserv.empty_persona())
      this.cargardata();
    }
  }

  customerOnChange($obj:any, tipo: number){
    if($obj == null){
      switch(tipo){
        case 1:
            this.regDedicacion.cLegCatInstitucion = ""; this.regDedicacion.cLegCatInstitucionNavigation = this.clmdserv.empty_persona();
            break;
        case 2: this.regDedicacion.nLegRegDedicacion =  0; this.regDedicacion.nValorDedicacion = 0;  this.regDedicacion.vDedicacion = this.clmdserv.empty_constante(); break;
      }
    }else{
      switch(tipo){
        case 1:
            if($obj.cPerCodigo != this.clmdserv.codigonoinst){
              this.regDedicacion.cLegCatInstitucion = $obj.cPerCodigo; this.regDedicacion.cLegCatInstitucionNavigation = $obj;
            }else{
              this.regDedicacion.cLegCatInstitucion = this.clmdserv.codigonoinst; this.regDedicacion.cLegCatInstitucionNavigation = this.clmdserv.empty_persona();
            } break;
        case 2: this.regDedicacion.nLegRegDedicacion =  $obj.nConCodigo; this.regDedicacion.nValorDedicacion = $obj.nConValor;  this.regDedicacion.vDedicacion = $obj; break;
      }
    }

  }



  guardar($e: any){
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }else if(this.regDedicacion.cLegCatInstitucion.trim() == '' ){
      this.valserv.mensaje_info("Seleccione institución.");
      return;
    }else if(this.dateFecIni.status.valueOf() == 'INVALID' ){
      this.valserv.mensaje_info("Ingrese fecha de inicio válida.");
      return;
    }
    else if(this.dateFecFin.status.valueOf() == 'INVALID' ){
      this.valserv.mensaje_info("Ingrese fecha de fin válida.");
      return;
    }else if(this.dateFecIni.value > this.dateFecFin.value){
      this.valserv.mensaje_info("La fecha inicio no puede ser posterior a la fecha fin.");
      return;
    }
    if(this.data.id > 0){
      var formData = new FormData();
            let fecha: any
      formData.append('nLegRegCodigo', this.regDedicacion.nLegRegCodigo.toString() ?? '0')
      formData.append('cLegCatInstitucion', this.regDedicacion.cLegCatInstitucion == this.clmdserv.codigonoinst ? "" : this.regDedicacion.cLegCatInstitucion.toString() ?? '')
      formData.append('cLegRegPais', this.regDedicacion.cLegRegPais.toString() ?? '')
      formData.append('cLegRegOtraInst',  this.regDedicacion.cLegCatInstitucion != this.clmdserv.codigonoinst ? "" : this.FormGroup.get('otraControl')?.value ?? '' )
      formData.append('nLegRegDedicacion', this.regDedicacion.nLegRegDedicacion.toString() ?? '0')
      formData.append('nValorDedicacion', this.regDedicacion.nValorDedicacion.toString() ?? '0')
      fecha = this.configserv.datepipe.transform(this.dateFecIni.value, "yyyy-MM-dd")
      formData.append('dLegRegFechaInicio', fecha)
      fecha = this.configserv.datepipe.transform(this.dateFecFin.value, "yyyy-MM-dd")
      formData.append('dLegRegFechaFin', fecha)
      if(this.regDedicacion.cLegRegArchivo != this.regDedicacion.cFile){
        formData.append('cFile',  this.regDedicacion.cLegRegArchivo )
      }
      formData.append('cLegRegArchivo',  '' )
      formData.append('cLegRegValida','false' )
      formData.append('cLegRegEstado',  'true' )
      if(this.regDedicacion.nLegRegCodigo == 0){
        if(this.regDedicacion.cFile == null){
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'regimendedicacion/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_regimendedicacion(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'regimendedicacion/put/' + this.regDedicacion.nLegRegCodigo, formData).then((data)=>{
          this.lstserv.listar_regimendedicacion(this.data.id)
        })
      }
    }else{
      if(this.regDedicacion.cFile == null){
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regDedicacion.dLegRegFechaInicio = this.dateFecIni.value
      this.regDedicacion.dLegRegFechaFin = this.dateFecFin.value
      this.lstserv.lRegimenDedic.push(this.regDedicacion)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }


}
