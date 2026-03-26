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
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-proyeccionsocial',
  templateUrl: './proyeccionsocial.component.html',
  styleUrls: ['./proyeccionsocial.component.sass'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ProyeccionsocialComponent implements OnInit {
  public regProyecSoc: LegProyeccionSocial
  public lstInstitucion: Persona[] = []
  filterInst: any
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFechaInicio: any;
  dateFechaFin: any;
  fileData: any;
  previewUrl: any = "./.assets/images/certdefault.jpg"
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Persona[]>;
  constructor(
    public dialogRef: MatDialogRef<ProyeccionsocialComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Grados y títulos', id: 0, formacion: LegProyeccionSocial},
  ) {
    this.today = new Date();
    this.dateFechaInicio = new FormControl(new Date(''));
    this.dateFechaFin = new FormControl(new Date(''));
    this.regProyecSoc = this.clmdserv.empty_proyeccionsoc()
    this.FormGroup = this._formBuilder.group({
      proyectoControl: ['', Validators.required],
      tipopartControl: ['', Validators.required],
      paisControl: ['', Validators.required],
      otraControl: ( ['']),
    })
  }


  ngOnInit(): void {
    this.listar_tipoproy()
    let paisuniv:number =  0;
    let vpais:Interface = this.clmdserv.empty_interface()
    if(this.data.id > 0 && this.data.formacion.nLegProyCodigo > 0){
      this.regProyecSoc = this.data.formacion
      vpais = this.lstserv.lubigeo.filter(x=>x.cIntJerarquia.trim() == this.data.formacion.cLegProyPais)[0]
      paisuniv = vpais.nIntCodigo

      this.universidadOnChange(vpais)
      this.FormGroup.setValue({
        paisControl: paisuniv,
        tipopartControl: this.data.formacion.vTipo.nConValor,
        proyectoControl: this.data.formacion.cLegProyDescripcion,
        otraControl: this.data.formacion.cLegProyOtraInst
      })
      if(this.regProyecSoc.cLegProyOtraInst.trim() != ""){
        this.regProyecSoc.cLegProyInstitucionNavigation = this.clmdserv.empty_persona()
        this.regProyecSoc.cLegProyInstitucion = this.clmdserv.codigonoinst
      }
      this.regProyecSoc.cFile = this.data.formacion.cLegProyArchivo
      this.erradjunto = this.data.formacion.cLegProyArchivo != null && this.data.formacion.cLegProyArchivo != '' ? true : false
      this.myControl.setValue(this.data.formacion.cLegProyInstitucionNavigation.cPerNombre)
      this.dateFechaInicio = new FormControl(new Date(this.data.formacion.dLegProyFechaInicio))
      this.dateFechaFin = new FormControl(new Date(this.data.formacion.dLegProyFechaFin))
    }else{this.universidadOnChange(null)}
  }


  listar_tipoproy(){
    this.lstserv.listado('constante', '/'+ this.configserv.nConTipoProySoc).then((data)=>{
       let ltipo: Constante[] = data;
       this.lstserv.lTipoParProy = ltipo.filter(x=>x.nConValor != 0)
    })

  }

  fileProgress(fileInput: any): void {
    if(fileInput!= null){
      this.regProyecSoc.cLegProyArchivo = <File>fileInput.target.files[0];
      this.preview()
    }else{
      this.regProyecSoc.cLegProyArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regProyecSoc.cLegProyArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regProyecSoc.cLegProyArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regProyecSoc.cLegProyArchivo);
    reader.onload = (_event) => {
      this.regProyecSoc.cFile = reader.result;
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
        case 1: this.regProyecSoc.cLegProyInstitucion =  ''; break;
      }

    }
  }

  universidadOnChange($obj: any){
    this.myControl.setValue('')
    if($obj == null){
      this.lstInstitucion = []
    }else{
      if($obj.cIntJerarquia.trim() != 'PER'){
        this.regProyecSoc.cLegProyPais = $obj.cIntJerarquia.trim()
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo.trim() == $obj.cIntJerarquia.trim());
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      }else{
        this.regProyecSoc.cLegProyPais = "PER"
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
            this.regProyecSoc.cLegProyInstitucion = ""; this.regProyecSoc.cLegProyInstitucionNavigation = this.clmdserv.empty_persona();
            break;
        case 2:  this.regProyecSoc.nLegProyTipo = 0; this.regProyecSoc.nValorTipo = 0; this.regProyecSoc.vTipo = this.clmdserv.empty_constante(); break;
       }
    }else{
      switch(tipo){
        case 1:
          if($obj.cPerCodigo != this.clmdserv.codigonoinst){
            this.regProyecSoc.cLegProyInstitucion = $obj.cPerCodigo; this.regProyecSoc.cLegProyInstitucionNavigation = $obj;
          }else{
            this.regProyecSoc.cLegProyInstitucion = this.clmdserv.codigonoinst; this.regProyecSoc.cLegProyInstitucionNavigation = this.clmdserv.empty_persona();
          }break;
        case 2:  this.regProyecSoc.nLegProyTipo = $obj.nConCodigo; this.regProyecSoc.nValorTipo = $obj.nConValor; this.regProyecSoc.vTipo = $obj; break;
      }
    }

  }



  guardar($e: any){
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }else if(this.regProyecSoc.cLegProyInstitucion.trim() == '' ){
      this.valserv.mensaje_info("Seleccione institución.");
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
      formData.append('nLegProyCodigo', this.regProyecSoc.nLegProyCodigo.toString() ?? '0')
      formData.append('cLegProyInstitucion', this.regProyecSoc.cLegProyInstitucion == this.clmdserv.codigonoinst ? "" : this.regProyecSoc.cLegProyInstitucion.toString() ?? '')
      formData.append('cLegProyPais', this.regProyecSoc.cLegProyPais.toString() ?? '')
      formData.append('cLegProyOtraInst',  this.regProyecSoc.cLegProyInstitucion != this.clmdserv.codigonoinst ? "" : this.FormGroup.get('otraControl')?.value ?? '' )
      formData.append('cLegProyDescripcion', this.FormGroup.get('proyectoControl')?.value ?? '')
      formData.append('nLegProyTipo', this.regProyecSoc.nLegProyTipo.toString() ?? '0')
      formData.append('nValorTipo', this.regProyecSoc.nValorTipo.toString() ?? '0')
      fecha = this.configserv.datepipe.transform(this.dateFechaInicio.value, "yyyy-MM-dd")
      formData.append('dLegProyFechaInicio', fecha)
      fecha = this.configserv.datepipe.transform(this.dateFechaFin.value, "yyyy-MM-dd")
      formData.append('dLegProyFechaFin', fecha)
      if(this.regProyecSoc.cLegProyArchivo != this.regProyecSoc.cFile){
        formData.append('cFile',  this.regProyecSoc.cLegProyArchivo )
      }
      formData.append('cLegProyArchivo',  '' )
      formData.append('cLegProyValida','false' )
      formData.append('cLegProyEstado',  'true' )
      if(this.regProyecSoc.nLegProyCodigo == 0){
        if(this.regProyecSoc.cFile == null){
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'proyeccionsocial/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_proyeccionsocial(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'proyeccionsocial/put/' + this.regProyecSoc.nLegProyCodigo, formData).then((data)=>{
          this.lstserv.listar_proyeccionsocial(this.data.id)
        })
      }
    }else{
      if(this.regProyecSoc.cFile == null){
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regProyecSoc.dLegProyFechaInicio = this.dateFechaInicio.value
      this.regProyecSoc.dLegProyFechaFin = this.dateFechaFin.value
      this.regProyecSoc.cLegProyDescripcion = this.FormGroup.get('proyectoControl')?.value
      this.lstserv.lProyeccionSoc.push(this.regProyecSoc)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
