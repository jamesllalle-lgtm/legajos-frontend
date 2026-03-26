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
import { LegReconocimiento } from 'src/app/models/legajo/leg-reconocimiento';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reconocimientos',
  templateUrl: './reconocimientos.component.html',
  styleUrls: ['./reconocimientos.component.sass'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ReconocimientosComponent implements OnInit {
  public regReconocimiento: LegReconocimiento
  public lstInstitucion: Persona[] = []
  filterInst: any
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFecha: any;
  fileData: any;
  previewUrl: any = "./.assets/images/certdefault.jpg"
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Persona[]>;
  constructor(
    public dialogRef: MatDialogRef<ReconocimientosComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Honores y Reconocimientos', id: 0, formacion: LegReconocimiento},
  ) {
    this.today = new Date();
    this.dateFecha= new FormControl(new Date(''));
    this.regReconocimiento = this.clmdserv.empty_reconocimiento()
    this.FormGroup = this._formBuilder.group({
      paisControl: ['', Validators.required],
      documentoControl: ['', Validators.required],
      tipoControl: ['', Validators.required],
      otraControl: ( ['']),
    })
  }


  ngOnInit(): void {
    this.listar_documentorec()
    this.listar_tiporec()
    let paisuniv:number =  0;
    let vpais:Interface = this.clmdserv.empty_interface()
    if(this.data.id > 0 && this.data.formacion.nLegRecCodigo > 0){
      this.regReconocimiento = this.data.formacion
      vpais = this.lstserv.lubigeo.filter(x=>x.cIntJerarquia.trim() == this.data.formacion.cLegRecPais)[0]
      paisuniv = vpais.nIntCodigo

      this.universidadOnChange(vpais)
      this.FormGroup.setValue({
        paisControl: paisuniv,
        tipoControl: this.data.formacion.vTipo.nConValor,
        documentoControl: this.data.formacion.vDocumento.nConValor,
        otraControl: this.data.formacion.cLegRecOtraInst
      })
      if(this.regReconocimiento.cLegRecOtraInst.trim() != ""){
        this.regReconocimiento.cLegRecInstitucionNavigation = this.clmdserv.empty_persona()
        this.regReconocimiento.cLegRecInstitucion = this.clmdserv.codigonoinst
      }
      this.regReconocimiento.cFile = this.data.formacion.cLegRecArchivo
      this.erradjunto = this.data.formacion.cLegRecArchivo != null && this.data.formacion.cLegRecArchivo != '' ? true : false
      this.myControl.setValue(this.data.formacion.cLegRecInstitucionNavigation.cPerNombre)
      this.dateFecha = new FormControl(new Date(this.data.formacion.dLegRecFecha))
    }else{this.universidadOnChange(null)}
  }


  listar_documentorec(){
    this.lstserv.listado('constante', '/'+ this.configserv.nConDocumentoRec).then((data)=>{
       let ltipo: Constante[] = data;
       this.lstserv.lDocumentoRec = ltipo.filter(x=>x.nConValor != 0)
    })

  }

  listar_tiporec(){
    this.lstserv.listado('constante', '/'+ this.configserv.nConTipoRec).then((data)=>{
       let ltipo: Constante[] = data;
       this.lstserv.lTipoRec = ltipo.filter(x=>x.nConValor != 0)
    })

  }

  fileProgress(fileInput: any): void {
    if(fileInput!= null){
      this.regReconocimiento.cLegRecArchivo = <File>fileInput.target.files[0];
      this.preview()
    }else{
      this.regReconocimiento.cLegRecArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regReconocimiento.cLegRecArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regReconocimiento.cLegRecArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regReconocimiento.cLegRecArchivo);
    reader.onload = (_event) => {
      this.regReconocimiento.cFile = reader.result;
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
        case 1: this.regReconocimiento.cLegRecInstitucion =  ''; break;
      }

    }
  }

  universidadOnChange($obj: any){
    this.myControl.setValue('')
    if($obj == null){
      this.lstInstitucion = []
    }else{
      if($obj.cIntJerarquia.trim() != 'PER'){
        this.regReconocimiento.cLegRecPais = $obj.cIntJerarquia.trim()
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x=>x.cUbigeoCodigo.trim() == $obj.cIntJerarquia.trim());
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      }else{
        this.regReconocimiento.cLegRecPais = "PER"
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
          this.regReconocimiento.cLegRecInstitucion = ""; this.regReconocimiento.cLegRecInstitucionNavigation = this.clmdserv.empty_persona();
          break;
        case 2:  this.regReconocimiento.nLegRecDocumento = 0; this.regReconocimiento.nValorDocumento = 0; this.regReconocimiento.vDocumento = this.clmdserv.empty_constante(); break;
        case 3:  this.regReconocimiento.nLegRecTipo = 0; this.regReconocimiento.nValorTipo = 0; this.regReconocimiento.vTipo = this.clmdserv.empty_constante(); break;
      }
    }else{
      switch(tipo){
        case 1:
        if($obj.cPerCodigo != this.clmdserv.codigonoinst){
          this.regReconocimiento.cLegRecInstitucion = $obj.cPerCodigo; this.regReconocimiento.cLegRecInstitucionNavigation = $obj;
        }else{
          this.regReconocimiento.cLegRecInstitucion = this.clmdserv.codigonoinst; this.regReconocimiento.cLegRecInstitucionNavigation = this.clmdserv.empty_persona();
        }
        break;
        case 2:  this.regReconocimiento.nLegRecDocumento = $obj.nConCodigo; this.regReconocimiento.nValorDocumento = $obj.nConValor; this.regReconocimiento.vDocumento = $obj; break;
        case 3:  this.regReconocimiento.nLegRecTipo = $obj.nConCodigo; this.regReconocimiento.nValorTipo = $obj.nConValor; this.regReconocimiento.vTipo = $obj; break;
      }
    }
  }



  guardar($e: any){
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }else if(this.regReconocimiento.cLegRecInstitucion.trim() == '' ){
      this.valserv.mensaje_info("Seleccione institución.");
      return;
    }else if(this.dateFecha.status.valueOf() == 'INVALID' ){
      this.valserv.mensaje_info("Ingrese fecha válida.");
      return;
    }
    if(this.data.id > 0){
      var formData = new FormData();
      let fecha: any
      formData.append('nLegRecCodigo', this.regReconocimiento.nLegRecCodigo.toString() ?? '0')
      formData.append('cLegRecInstitucion', this.regReconocimiento.cLegRecInstitucion == this.clmdserv.codigonoinst ? "" : this.regReconocimiento.cLegRecInstitucion.toString() ?? '')
      formData.append('cLegRecPais', this.regReconocimiento.cLegRecPais.toString() ?? '')
      formData.append('cLegRecOtraInst',  this.regReconocimiento.cLegRecInstitucion != this.clmdserv.codigonoinst ? "" : this.FormGroup.get('otraControl')?.value ?? '' )
      formData.append('nLegRecDocumento', this.regReconocimiento.nLegRecDocumento.toString() ?? '0')
      formData.append('nValorDocumento', this.regReconocimiento.nValorDocumento.toString() ?? '0')
      formData.append('nLegRecTipo', this.regReconocimiento.nLegRecTipo.toString() ?? '0')
      formData.append('nValorTipo', this.regReconocimiento.nValorTipo.toString() ?? '0')
      fecha = this.configserv.datepipe.transform(this.dateFecha.value, "yyyy-MM-dd")
      formData.append('dLegRecFecha', fecha)
      if(this.regReconocimiento.cLegRecArchivo != this.regReconocimiento.cFile){
        formData.append('cFile',  this.regReconocimiento.cLegRecArchivo )
      }
      formData.append('cLegRecArchivo',  '' )
      formData.append('cLegRecValida','false' )
      formData.append('cLegRecEstado',  'true' )
      if(this.regReconocimiento.nLegRecCodigo == 0){
        if(this.regReconocimiento.cFile == null){
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'reconocimiento/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_reconocimiento(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'reconocimiento/put/' + this.regReconocimiento.nLegRecCodigo, formData).then((data)=>{
          this.lstserv.listar_reconocimiento(this.data.id)
        })
      }
    }else{
      if(this.regReconocimiento.cFile == null){
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regReconocimiento.dLegRecFecha = this.dateFecha.value
      this.lstserv.lReconocimiento.push(this.regReconocimiento)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
