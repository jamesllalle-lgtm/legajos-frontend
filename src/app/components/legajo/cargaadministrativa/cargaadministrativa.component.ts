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
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cargaadministrativa',
  templateUrl: './cargaadministrativa.component.html',
  styleUrls: ['./cargaadministrativa.component.sass'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class CargaadministrativaComponent implements OnInit {
  public regCargaAdm: LegAdminitrativaCarga
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
    public dialogRef: MatDialogRef<CargaadministrativaComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Grados y títulos', id: 0, formacion: LegAdminitrativaCarga},
    private spinner: NgxSpinnerService,
  ) {
    this.today = new Date();
    this.dateFechaInicio = new FormControl(new Date(''));
    this.dateFechaFin = new FormControl(new Date(''));
    this.regCargaAdm = this.clmdserv.empty_cargaadministrativa()
    this.FormGroup = this._formBuilder.group({
      paisControl: ['', Validators.required],
      cargoControl: ['', Validators.required],
      documentoControl: ['', Validators.required],
      otraControl: ( ['']),
    })
  }


  ngOnInit(): void {
    this.listar_cargoadm()
    let paisuniv:number =  0;
    let vpais:Interface = this.clmdserv.empty_interface()
    if(this.data.id > 0 && this.data.formacion.nLegAdmCodigo > 0){
      this.regCargaAdm = this.data.formacion
      vpais = this.lstserv.lubigeo.filter(x=>x.cIntJerarquia.trim() == this.data.formacion.cLegAdmPais)[0]
      paisuniv = vpais.nIntCodigo

      this.universidadOnChange(vpais)
      this.FormGroup.setValue({
        paisControl: paisuniv,
        cargoControl: this.data.formacion.vCargo.nConValor,
        documentoControl: this.data.formacion.cLegAdmDocumento ?? '',
        otraControl: this.data.formacion.cLegAdmOtraInst
      })
      if(this.regCargaAdm.cLegAdmOtraInst.trim() != ""){
        this.regCargaAdm.cLegAdmInstitucionNavigation = this.clmdserv.empty_persona()
        this.regCargaAdm.cLegAdmInstitucion = this.clmdserv.codigonoinst
      }
      this.regCargaAdm.cFile = this.data.formacion.cLegAdmArchivo
      this.erradjunto = this.data.formacion.cLegAdmArchivo != null && this.data.formacion.cLegAdmArchivo != '' ? true : false
      this.myControl.setValue(this.data.formacion.cLegAdmInstitucionNavigation.cPerNombre)
      this.dateFechaInicio = new FormControl(new Date(this.data.formacion.dLegAdmFechaInicio))
      this.dateFechaFin = new FormControl(new Date(this.data.formacion.dLegAdmFechaFin))
    }else{this.universidadOnChange(null)}
  }


  listar_cargoadm(){
    this.lstserv.listado('constante', '/'+ this.configserv.nConCargaAdm).then((data)=>{
       let ltipo: Constante[] = data;
       this.lstserv.lCargoAdm = ltipo.filter(x=>x.nConValor != 0)
    })

  }

  fileProgress(fileInput: any): void {
    if(fileInput!= null){
      this.regCargaAdm.cLegAdmArchivo = <File>fileInput.target.files[0];
      this.preview()
    }else{
      this.regCargaAdm.cLegAdmArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regCargaAdm.cLegAdmArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regCargaAdm.cLegAdmArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regCargaAdm.cLegAdmArchivo);
    reader.onload = (_event) => {
      this.regCargaAdm.cFile = reader.result;
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
        case 1: this.regCargaAdm.cLegAdmInstitucion =  ''; break;
      }

    }
  }

  universidadOnChange($obj: any){
    this.myControl.setValue('')
    if($obj == null){
      this.lstInstitucion = []
    }else{
      if($obj.cIntJerarquia.trim() != 'PER'){
        this.regCargaAdm.cLegAdmPais = $obj.cIntJerarquia.trim()
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo.trim() == $obj.cIntJerarquia.trim());
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      }else{
        this.regCargaAdm.cLegAdmPais = "PER"
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo.length>3);
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      }
      this.lstInstitucion.push(this.clmdserv.empty_persona())
      this.cargardata();

    }
  }
  customerOnChange($obj:any, tipo: number){
    // console.log($obj)
    if($obj == null){
      switch(tipo){
        case 1:
          this.regCargaAdm.cLegAdmInstitucion = ""; this.regCargaAdm.cLegAdmInstitucionNavigation = this.clmdserv.empty_persona();

        break;
        case 2:  this.regCargaAdm.nLegAdmCargo = 0; this.regCargaAdm.nClaseCargo = 0; this.regCargaAdm.vCargo = this.clmdserv.empty_constante(); break;
      }
    }else{
      switch(tipo){
        case 1:
        if($obj.cPerCodigo != this.clmdserv.codigonoinst){
          this.regCargaAdm.cLegAdmInstitucion = $obj.cPerCodigo; this.regCargaAdm.cLegAdmInstitucionNavigation = $obj;
        }else{
          this.regCargaAdm.cLegAdmInstitucion = this.clmdserv.codigonoinst; this.regCargaAdm.cLegAdmInstitucionNavigation = this.clmdserv.empty_persona();
        }
        break;
        case 2:  this.regCargaAdm.nLegAdmCargo = $obj.nConCodigo; this.regCargaAdm.nClaseCargo = $obj.nConValor; this.regCargaAdm.vCargo = $obj; break;
      }
    }

  }



  guardar($e: any){
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }else if(this.regCargaAdm.cLegAdmInstitucion.trim() == '' ){
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
      formData.append('nLegAdmCodigo', this.regCargaAdm.nLegAdmCodigo.toString() ?? '0')
      formData.append('cLegAdmInstitucion', this.regCargaAdm.cLegAdmInstitucion == this.clmdserv.codigonoinst ? "" : this.regCargaAdm.cLegAdmInstitucion.toString() ?? '')
      formData.append('cLegAdmPais', this.regCargaAdm.cLegAdmPais.toString() ?? '')
      formData.append('cLegAdmOtraInst',  this.regCargaAdm.cLegAdmInstitucion != this.clmdserv.codigonoinst ? "" : this.FormGroup.get('otraControl')?.value ?? '' )
      formData.append('cLegAdmDocumento', this.FormGroup.get('documentoControl')?.value ?? '')
      formData.append('nLegAdmCargo', this.regCargaAdm.nLegAdmCargo.toString() ?? '0')
      formData.append('nClaseCargo', this.regCargaAdm.nClaseCargo.toString() ?? '0')
      fecha = this.configserv.datepipe.transform(this.dateFechaInicio.value, "yyyy-MM-dd")
      formData.append('dLegAdmFechaInicio', fecha)
      fecha = this.configserv.datepipe.transform(this.dateFechaFin.value, "yyyy-MM-dd")
      formData.append('dLegAdmFechaFin', fecha)
      if(this.regCargaAdm.cLegAdmArchivo != this.regCargaAdm.cFile){
        formData.append('cFile',  this.regCargaAdm.cLegAdmArchivo )
      }
      formData.append('cLegAdmArchivo',  '' )
      formData.append('cLegAdmValida','false' )
      formData.append('cLegAdmEstado',  'true' )
      if(this.regCargaAdm.nLegAdmCodigo == 0){
        if(this.regCargaAdm.cFile == null){
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'cargaadmin/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_cargaadmin(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'cargaadmin/put/' + this.regCargaAdm.nLegAdmCodigo, formData).then((data)=>{
          this.lstserv.listar_cargaadmin(this.data.id)
        })
      }
    }else{
      if(this.regCargaAdm.cFile == null){
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regCargaAdm.dLegAdmFechaInicio = this.dateFechaInicio.value
      this.regCargaAdm.dLegAdmFechaFin = this.dateFechaFin.value
      this.regCargaAdm.cLegAdmDocumento = this.FormGroup.get('documentoControl')?.value
      this.lstserv.lAdminitrativaCarga.push(this.regCargaAdm)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
