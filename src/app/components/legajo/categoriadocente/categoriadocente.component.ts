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
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-categoriadocente',
  templateUrl: './categoriadocente.component.html',
  styleUrls: ['./categoriadocente.component.sass'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class CategoriadocenteComponent implements OnInit {

  public regCategoria: LegCategoriaDocente
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
    public dialogRef: MatDialogRef<CategoriadocenteComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Grados y títulos', id: 0, formacion: LegCategoriaDocente},
    private spinner: NgxSpinnerService,
  ) {
    this.today = new Date();
    this.dateFecIni = new FormControl(new Date(''));
    this.dateFecFin = new FormControl(new Date(''));
    this.regCategoria = this.clmdserv.empty_categoriadoc()
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
    if(this.data.id > 0 && this.data.formacion.nLegCatCodigo > 0){
      this.regCategoria = this.data.formacion
      vpais = this.lstserv.lubigeo.filter(x=>x.cIntJerarquia.trim() == this.data.formacion.cLegCatPais)[0]
       paisuniv = vpais.nIntCodigo
      this.universidadOnChange(vpais)
      this.FormGroup.setValue({
        universidadControl: paisuniv,
        categoriaControl: this.data.formacion.vCategoria.nConValor,
        otraControl: this.data.formacion.cLegCatOtraInst
      })
      if(this.regCategoria.cLegCatOtraInst.trim() != ""){
        this.regCategoria.cLegCatInstitucionNavigation = this.clmdserv.empty_persona()
        this.regCategoria.cLegCatInstitucion = this.clmdserv.codigonoinst
      }
      this.regCategoria.cFile = this.data.formacion.cLegCatArchivo
      this.erradjunto = this.data.formacion.cLegCatArchivo != null && this.data.formacion.cLegCatArchivo != '' ? true : false
      this.myControl.setValue(this.data.formacion.cLegCatInstitucionNavigation.cPerNombre)
      this.dateFecIni = new FormControl(new Date(this.data.formacion.dLegCatFechaInicio))
      this.dateFecFin = new FormControl(new Date(this.data.formacion.dLegCatFechaFin))
    }else{this.universidadOnChange(null)}
  }

  listar_institucion($ubig: String){
    this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo == $ubig);
    this.cargardata();
  }

  listar_categoriadoc(){
    this.lstserv.listado('constante', '/'+ this.configserv.nConCategoriaDoc).then((data)=>{
       let lcategdoc: Constante[] = data;
       this.lstserv.lCategoriaDoc = lcategdoc.filter(x=>x.nConValor != 0)
    })
  }

  fileProgress(fileInput: any): void {
    if(fileInput!= null){
      this.regCategoria.cLegCatArchivo = <File>fileInput.target.files[0];
      this.preview()
    }else{
      this.regCategoria.cLegCatArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regCategoria.cLegCatArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regCategoria.cLegCatArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regCategoria.cLegCatArchivo);
    reader.onload = (_event) => {
      this.regCategoria.cFile = reader.result;
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
        case 1: this.regCategoria.cLegCatInstitucion =  ''; break;
      }

    }
  }

  universidadOnChange($obj: any){
    this.myControl.setValue('')
    if($obj == null){
      this.lstInstitucion = []
    }else{
      if($obj.cIntJerarquia.trim() != 'PER'){
        this.regCategoria.cLegCatPais = $obj.cIntJerarquia.trim()
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo.trim() == $obj.cIntJerarquia.trim());
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      }else{
        this.regCategoria.cLegCatPais = "PER"
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
              this.regCategoria.cLegCatInstitucion = ""; this.regCategoria.cLegCatInstitucionNavigation = this.clmdserv.empty_persona();
             break;
        case 2: this.regCategoria.nLegCatCategoria =  0; this.regCategoria.nValorCategoria = 0;  this.regCategoria.vCategoria = this.clmdserv.empty_constante(); break;
      }
    }else{
      switch(tipo){
        case 1:
            if($obj.cPerCodigo != this.clmdserv.codigonoinst){
              this.regCategoria.cLegCatInstitucion = $obj.cPerCodigo; this.regCategoria.cLegCatInstitucionNavigation = $obj;
            }else{
              this.regCategoria.cLegCatInstitucion = this.clmdserv.codigonoinst; this.regCategoria.cLegCatInstitucionNavigation = this.clmdserv.empty_persona();
            } break;
        case 2: this.regCategoria.nLegCatCategoria =  $obj.nConCodigo; this.regCategoria.nValorCategoria = $obj.nConValor;  this.regCategoria.vCategoria = $obj; break;
      }
    }

  }



  guardar($e: any){
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }else if(this.regCategoria.cLegCatInstitucion.trim() == '' ){
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
      formData.append('nLegCatCodigo', this.regCategoria.nLegCatCodigo.toString() ?? '0')
      formData.append('cLegCatInstitucion', this.regCategoria.cLegCatInstitucion == this.clmdserv.codigonoinst ? "" : this.regCategoria.cLegCatInstitucion.toString() ?? '')
      formData.append('cLegCatPais', this.regCategoria.cLegCatPais.toString() ?? '')
      formData.append('cLegCatOtraInst',  this.regCategoria.cLegCatInstitucion != this.clmdserv.codigonoinst ? "" : this.FormGroup.get('otraControl')?.value ?? '' )
      formData.append('nLegCatCategoria', this.regCategoria.nLegCatCategoria.toString() ?? '0')
      formData.append('nValorCategoria', this.regCategoria.nValorCategoria.toString() ?? '0')
      fecha = this.configserv.datepipe.transform(this.dateFecIni.value, "yyyy-MM-dd")
      formData.append('dLegCatFechaInicio', fecha)
      fecha = this.configserv.datepipe.transform(this.dateFecFin.value, "yyyy-MM-dd")
      formData.append('dLegCatFechaFin', fecha)
      if(this.regCategoria.cLegCatArchivo != this.regCategoria.cFile){
        formData.append('cFile',  this.regCategoria.cLegCatArchivo )
      }
      formData.append('cLegGraArchivo',  '' )
      formData.append('cLegCatValida','false' )
      formData.append('cLegCatEstado',  'true' )
      if(this.regCategoria.nLegCatCodigo == 0){
        if(this.regCategoria.cFile == null){
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'categoriadocente/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_categoriadocente(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'categoriadocente/put/' + this.regCategoria.nLegCatCodigo, formData).then((data)=>{
          this.lstserv.listar_categoriadocente(this.data.id)
        })
      }
    }else{
      if(this.regCategoria.cFile == null){
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regCategoria.dLegCatFechaInicio = this.dateFecIni.value
      this.regCategoria.dLegCatFechaFin = this.dateFecFin.value
      this.lstserv.lCategoriaDocente.push(this.regCategoria)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
