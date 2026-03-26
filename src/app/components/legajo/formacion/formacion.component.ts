import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/helpers/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Persona } from 'src/app/models/general/persona';
import { Interface } from 'src/app/models/general/interface';
import { LegGradoTitulo } from 'src/app/models/legajo/leg-grado-titulo';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-formacion',
  templateUrl: './formacion.component.html',
  styleUrls: ['./formacion.component.sass'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class FormacionComponent implements OnInit {
  public regGradoTitulo: LegGradoTitulo
  public lstInstitucion: Persona[] = []
  public lstGradoAcademico: Interface[] = []
  public lstCarreraProfesional: Persona[] = []
  public lstanioini: number[] = []
  public lstaniofin: number[] = []
  today: Date | undefined;
  dateFechObt: any;
  fileData: any;
  previewUrl: any = "./.assets/images/certdefault.jpg"
  erradjunto: boolean = false
  public FormGroup: FormGroup;
  myControl = new FormControl();
  myControlProf = new FormControl();
  filteredOptions!: Observable<Persona[]>;
  filteredOptionsProf!: Observable<Persona[]>;
  filterInst: any

  constructor(
    public dialogRef: MatDialogRef<FormacionComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Grados y títulos', id: 0, formacion: LegGradoTitulo},

  ) {
    this.dateFechObt = new FormControl(new Date(''));
    this.today = new Date();
    this.regGradoTitulo = this.clmdserv.empty_gradotitulo()
    this.FormGroup = this._formBuilder.group({
      paisControl: ['', Validators.required],
      gradoControl: ['', Validators.required],
      carreraControl: ['', Validators.required],
      otraControl: ( ['']),
    })
  }

  ngOnInit() {
    this.dateFechObt = new FormControl(new Date(''));
    this.listar_gradoacademico()

    if(this.data.id > 0  && this.data.formacion.nLegGraCodigo > 0){
      this.regGradoTitulo = this.data.formacion
      this.FormGroup.setValue({
        paisControl: this.data.formacion.vPais.nIntCodigo,
        gradoControl: this.data.formacion.vGradoAcad.nIntCodigo,
        carreraControl: this.data.formacion.cLegGraCarreraProf,
        otraControl: this.data.formacion.cLegGraOtraInst
      })
      this.regGradoTitulo.cFile = this.data.formacion.cLegGraArchivo
      this.erradjunto = this.data.formacion.cLegGraArchivo != null && this.data.formacion.cLegGraArchivo != '' ? true : false
      this.universidadOnChange(this.data.formacion.vPais)
      this.myControl.setValue(this.data.formacion.cLegGraInstitucionNavigation.cPerNombre)
      this.dateFechObt = new FormControl(new Date(this.data.formacion.dLegGraFecha))
    }
    else{this.universidadOnChange(null)}
  }

  universidadOnChange($obj: any){
    this.myControl.setValue('')
    if($obj == null){
      this.lstInstitucion = []
    }else{
      this.regGradoTitulo.vPais = $obj
      this.regGradoTitulo.nClasePais = $obj.nIntClase
      this.regGradoTitulo.nLegGraPais = $obj.nIntCodigo
      if($obj.cIntJerarquia.trim() != 'PER'){
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo.trim() == $obj.cIntJerarquia.trim());
        // this.cargardata();
      }else{
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo.length>3);

        // this.cargardata();
      }
      this.lstInstitucion.push(this.clmdserv.empty_persona())
      this.cargardata();
    }
  }

  guardarformacion($e: any){
    // console.log(this.regGradoTitulo.cLegGraInstitucion)
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }else if(this.regGradoTitulo.cLegGraInstitucion.trim() == '' ){
      this.valserv.mensaje_info("Seleccione institución.");
      return;
    }else if(this.dateFechObt.status.valueOf() == 'INVALID' ){
      this.valserv.mensaje_info("Ingrese una fecha válida.");
      return;
    }
    if(this.data.id > 0){
            var formData = new FormData();
            let fechaobt: any = this.configserv.datepipe.transform(this.dateFechObt.value, "yyyy-MM-dd")
            formData.append('nLegGraCodigo', this.regGradoTitulo.nLegGraCodigo.toString() ?? '0')
            formData.append('nLegGraGradoAcad', this.regGradoTitulo.nLegGraGradoAcad.toString() ?? '0')
            formData.append('nClaseGradoAcad', this.regGradoTitulo.nClaseGradoAcad.toString() ?? '0')
            formData.append('cLegGraCarreraProf',this.FormGroup.get('carreraControl')?.value ?? '')
            formData.append('cLegGraInstitucion', this.regGradoTitulo.cLegGraInstitucion == this.clmdserv.codigonoinst ? "" : this.regGradoTitulo.cLegGraInstitucion.toString() ?? '')
            formData.append('cLegGraOtraInst',  this.regGradoTitulo.cLegGraInstitucion != this.clmdserv.codigonoinst ? "" : this.FormGroup.get('otraControl')?.value ?? '' )
            formData.append('nLegGraPais', this.regGradoTitulo.nLegGraPais.toString() ?? '0')
            formData.append('nClasePais', this.regGradoTitulo.nClasePais.toString() ?? '0')
            formData.append('dLegGraFecha', fechaobt)
            if(this.regGradoTitulo.cLegGraArchivo != this.regGradoTitulo.cFile){
            formData.append('cFile',  this.regGradoTitulo.cLegGraArchivo )
            }
            formData.append('cLegGraValida',  'false' )
            formData.append('cLegGraEstado',  'true' )
      if(this.regGradoTitulo.nLegGraCodigo == 0){
        if(this.regGradoTitulo.cFile == null){
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.");
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'gradotitulo/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_gradotitulo(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'gradotitulo/put/' + this.regGradoTitulo.nLegGraCodigo, formData).then((data)=>{
          this.lstserv.listar_gradotitulo(this.data.id)
        })
      }
    }else{
      if(this.regGradoTitulo.cFile == null){
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.");
        return;
      }
      this.regGradoTitulo.cLegGraCarreraProf = this.FormGroup.get('carreraControl')?.value
      this.regGradoTitulo.dLegGraFecha = this.dateFechObt.value
      this.lstserv.lLegGradoTitulo.push(this.regGradoTitulo)
    }
     this.configserv.onNoClickDialog(this.dialogRef);
  }

  listar_institucion($ubig: String){
      this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo == $ubig);
      this.cargardata();
  }





  listar_gradoacademico(){
      this.lstGradoAcademico = this.lstserv.lGradoAcademico;
  }

  fileProgress(fileInput: any): void {
    if(fileInput!= null){
      this.regGradoTitulo.cLegGraArchivo = <File>fileInput.target.files[0];
      this.preview()
    }else{
      this.regGradoTitulo.cLegGraArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regGradoTitulo.cLegGraArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regGradoTitulo.cLegGraArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regGradoTitulo.cLegGraArchivo);
    reader.onload = (_event) => {
      this.regGradoTitulo.cFile = reader.result;
    }
  }

  cargardata(){
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.c),
        map(cPerNombre => cPerNombre ? this._filter(cPerNombre) : this.lstInstitucion.slice(0, 100))
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
        case 1: this.regGradoTitulo.cLegGraInstitucion =  ''; break;
      }
    }
  }

  customerOnChange($obj:any, tipo: number){
    // console.log($obj)
    if($obj == null){
      switch(tipo){
        case 1:
          this.regGradoTitulo.cLegGraInstitucion = ""; 
          this.regGradoTitulo.cLegGraInstitucionNavigation = this.clmdserv.empty_persona();
          break;
        case 2: 
          this.regGradoTitulo.nLegGraGradoAcad =  0; 
          this.regGradoTitulo.nClaseGradoAcad = 0;  
          this.regGradoTitulo.vGradoAcad = this.clmdserv.empty_interface(); break;
      }
    }
    else{
      switch(tipo){
        case 1:
          if($obj.cPerCodigo != this.clmdserv.codigonoinst){
            this.regGradoTitulo.cLegGraInstitucion = $obj.cPerCodigo; 
            this.regGradoTitulo.cLegGraInstitucionNavigation = $obj;
          }
          else{
            this.regGradoTitulo.cLegGraInstitucion = this.clmdserv.codigonoinst; this.regGradoTitulo.cLegGraInstitucionNavigation = this.clmdserv.empty_persona();
          }
          break;
        case 2: 
          this.regGradoTitulo.nLegGraGradoAcad =  $obj.nIntCodigo; 
          this.regGradoTitulo.nClaseGradoAcad = $obj.nIntClase;  this.regGradoTitulo.vGradoAcad = $obj; 
          break;
      }
    }
  }

}
