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
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { Constante } from 'src/app/models/general/constante';
import { LegTesisAseJur } from 'src/app/models/legajo/leg-tesis-ase-jur';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-asesorjuradotesis',
  templateUrl: './asesorjuradotesis.component.html',
  styleUrls: ['./asesorjuradotesis.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class AsesorjuradotesisComponent implements OnInit {
  public regTesis: LegTesisAseJur
  public lstInstitucion: Persona[] = []
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFecha: any;
  fileData: any;
  previewUrl: any = "./.assets/images/certdefault.jpg"
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Persona[]>;

  public fecha_minima: any;

  // Agrega esta propiedad para controlar la visibilidad condicional
  showNivelField = false;

  constructor(
    public dialogRef: MatDialogRef<AsesorjuradotesisComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    private _formBuilder: FormBuilder,
    public valserv: ValidateService,
    @Inject(MAT_DIALOG_DATA) public data: { title: ' Actividades de Servicio (Dentro y fuera de la insitución)', id: 0, formacion: LegTesisAseJur, Leg_cPerCodigo: string },
    private spinner: NgxSpinnerService,
  ) {
    this.today = new Date();
    this.dateFecha = new FormControl(new Date(''));
    this.regTesis = {
      ...this.clmdserv.empty_tesisasesjur(),
      vPais: this.clmdserv.empty_interface(),
      vTipo: this.clmdserv.empty_interface(),
      vNivel: this.clmdserv.empty_constante(),
      cLegTesInstitucionNavigation: this.clmdserv.empty_persona()
    };
    this.FormGroup = this._formBuilder.group({
      tipoControl: ['', Validators.required],
      paisControl: ['', Validators.required],
      nivelControl: [''],
      nroResolucionControl: ['', Validators.required],
      otraControl: ['']
    });
  }



  ngOnInit(): void {
    this.fecha_minima = new Date(new Date().getFullYear() - 5, new Date().getMonth(), new Date().getDate());

    this.listar_tipotesis();
    
    this.listar_archivos();
    
    // Suscríbete a los cambios del control de tipo
    this.FormGroup.get('tipoControl')?.valueChanges.subscribe(value => {
      this.handleTipoChange(value);
    });

    this.listar_niveltesis();
    
    // Manejar datos de edición con verificaciones de nulidad
    if (this.data.id > 0 && this.data.formacion?.nLegTesCodigo > 0) {
      this.regTesis = this.data.formacion; // Crear una copia
      
      // Inicializar el formulario
      this.FormGroup.setValue({
        tipoControl: this.data.formacion.vTipo.nIntCodigo,
        paisControl: this.data.formacion.vPais.nIntCodigo,
        nivelControl: this.data.formacion.vNivel.nConValor,
        nroResolucionControl: this.data.formacion.cLegTesNroResolucion || '',
        otraControl: this.data.formacion.cLegTesOtraInst  || ''
      });
      
      // Manejar fecha
      const fechaValue = this.data.formacion.dLegTesFecha
        ? new Date(this.data.formacion.dLegTesFecha)
        : new Date();
      this.dateFecha = new FormControl(fechaValue);
      
      // Manejar archivo adjunto
      this.regTesis.cFile = this.data.formacion.cLegTesArchivo;
      this.erradjunto = !!this.data.formacion.cLegTesArchivo;
      
      this.myControl.setValue(this.data.formacion.cLegTesInstitucionNavigation.cPerNombre)
    }
    else {
      // Nuevo registro
      this.universidadOnChange(null);
      this.myControl.setValue(null);
    }
  }

  // Método para manejar cambios de tipo
  private handleTipoChange(tipoValue: any): void {
    const isTesisType = tipoValue === 9; // nIntCodigo para "ASESORÍA DE TESIS"
    
    this.showNivelField = isTesisType;
    
    const nivelControl = this.FormGroup.get('nivelControl');
    if (isTesisType) {
      // Agrega validador cuando es tipo tesis
      nivelControl?.setValidators(Validators.required);
    }
    else {
      // Limpia validador y valor cuando no es tipo tesis
      nivelControl?.clearValidators();
      nivelControl?.reset();
      // Resetea propiedades del modelo
      this.regTesis.nLegTesNivel = 0;
      this.regTesis.nValorNivel = 0;
      this.regTesis.vNivel = this.clmdserv.empty_constante();
    }
    nivelControl?.updateValueAndValidity();
  }

  listar_tipotesis() {
    this.lstserv.listado('interface', '/' + this.configserv.nConTipoTesis).then((data) => {
      let ltipo: Interface[] = data;
      this.lstserv.lTipoTesis = ltipo.filter(x => x.nIntCodigo != 0)
    })
  }

  universidadOnChange($obj: any){
    this.myControl.setValue('')
    if($obj == null){
      this.lstInstitucion = []
    }else{
      this.regTesis.vPais = $obj
      this.regTesis.nClasePais = $obj.nIntClase
      this.regTesis.nLegTesPais = $obj.nIntCodigo
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

  cargardata(){
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.c),
        map(cPerNombre => cPerNombre ? this._filter(cPerNombre) : this.lstInstitucion.slice(0, 100))
      );
  }

  displayFn(inst: Persona | null): string {
    return inst && inst.cPerNombre ? inst.cPerNombre : '';
  }


  private _filter(name: string): Persona[] {
    const filterValue = (name || '').toLowerCase();
    return this.lstInstitucion.filter(option => (option.cPerNombre || '').toLowerCase().includes(filterValue)).slice(0, 100);
  }


  handleModelChange(e:any, tipo: number){
    if(e == '') {
      switch(tipo){
        case 1: this.regTesis.cLegTesInstitucion =  ''; break;
      }
    }
  }


  listar_niveltesis() {
    this.lstserv.listado('constante', '/' + this.configserv.nConNivelTesis).then((data) => {
      let lnivel: Constante[] = data;
      this.lstserv.lNivelTesis = lnivel.filter(x => x.nConValor != 0)
    })
  }

  listar_archivos() {
    this.lstserv.listado('legarchivos_lst', '/' + this.data.Leg_cPerCodigo).then((data) => {
      this.lstserv.lArchivos = data;
    })
  }

  fileProgress(fileInput: any): void {
    if (fileInput != null) {
      this.regTesis.cLegTesArchivo = <File>fileInput.target.files[0];
      this.preview()
    } else {
      this.regTesis.cLegTesArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regTesis.cLegTesArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regTesis.cLegTesArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regTesis.cLegTesArchivo);
    reader.onload = (_event) => {
      this.regTesis.cFile = reader.result;
    }
  }


  customerOnChange($obj:any, tipo: number){
    // console.log($obj)
    if($obj == null){
      switch(tipo){
        case 1: 
          this.regTesis.nLegTesTipo =  0; 
          this.regTesis.nValorTipo = 0;  
          this.regTesis.vTipo = this.clmdserv.empty_interface();
          break;
        case 2:
          this.regTesis.cLegTesInstitucion = ""; 
          this.regTesis.cLegTesInstitucionNavigation = this.clmdserv.empty_persona();
          break;
        case 3: 
          this.regTesis.nLegTesNivel =  0; 
          this.regTesis.nValorNivel = 0;  
          this.regTesis.vNivel = this.clmdserv.empty_constante();
          break;
      }
    }
    else{
      switch(tipo){
        case 1: 
          this.regTesis.nLegTesTipo =  $obj.nIntCodigo; 
          this.regTesis.nValorTipo = $obj.nIntClase;  this.regTesis.vTipo = $obj; 
          break;
        case 2:
          if($obj.cPerCodigo != this.clmdserv.codigonoinst){
            this.regTesis.cLegTesInstitucion = $obj.cPerCodigo; 
            this.regTesis.cLegTesInstitucionNavigation = $obj;
          }
          else{
            this.regTesis.cLegTesInstitucion = this.clmdserv.codigonoinst; this.regTesis.cLegTesInstitucionNavigation = this.clmdserv.empty_persona();
          }
          break;
        case 3: 
          this.regTesis.nLegTesNivel =  $obj.nConCodigo; 
          this.regTesis.nValorNivel = $obj.nConValor ;  
          this.regTesis.vNivel = $obj; 
          break;
      }
    }
  }

guardar($e: any) {
  let flag = 0;
  for (let i = 0; i < this.lstserv.lArchivos.length; i++) {
    if (this.lstserv.lArchivos[i].cLegArcNombre == this.regTesis.cLegTesArchivo.name) {
      flag++;
    }
  }
  
  if (this.FormGroup.status.valueOf() == "INVALID") {
    this.valserv.mensaje_info("Complete los campos solicitados.");
    return;
  }
  else if (this.dateFecha.status.valueOf() == 'INVALID') {
    this.valserv.mensaje_info("Ingrese fecha válida.");
    return;
  }
  else if (flag > 0) {
    this.valserv.mensaje_info("Existe un archivo con el mismo nombre. Carge otro archivo por favor.");
    return;
  }
  
  // Validaciones específicas para el tipo de actividad
  if (this.showNivelField && !this.FormGroup.get('nivelControl')?.value) {
    this.valserv.mensaje_info("Seleccione un nivel para la asesoría de tesis.");
    return;
  }
  
  // Validar país seleccionado
  if (!this.regTesis.vPais?.nIntCodigo) {
    this.valserv.mensaje_info("Seleccione un país.");
    return;
  }
  
  // Validar institución seleccionada
  const institCodigo = this.regTesis.cLegTesInstitucion?.toString().trim() || '';
  if (!institCodigo || institCodigo === '0' || institCodigo === '') {
    this.valserv.mensaje_info("Seleccione una institución.");
    return;
  }
  
  // Validar "Otra institución"
  if (institCodigo === this.clmdserv.codigonoinst) {
    const otraInst = this.FormGroup.get('otraControl')?.value?.trim() || '';
    if (!otraInst) {
      this.valserv.mensaje_info("Ingrese el nombre de la institución.");
      return;
    }
    this.regTesis.cLegTesOtraInst = otraInst;
  }

    if (this.data.id > 0) {
      var formData = new FormData();
      let fecha: any
      formData.append('nLegTesCodigo', this.regTesis.nLegTesCodigo.toString() ?? '0')
      formData.append('nLegTesTipo', this.regTesis.nLegTesTipo.toString() ?? '0')
      formData.append('nValorTipo', this.regTesis.nValorTipo.toString() ?? '0')
      
      console.log("nLegTesNivel", this.regTesis.nLegTesNivel)
      
      formData.append('nLegTesNivel', this.regTesis.nLegTesNivel.toString() ?? '0')
      formData.append('nValorNivel', this.regTesis.nValorNivel.toString() ?? '0')
      formData.append('cLegTesNroResolucion', this.FormGroup.get('nroResolucionControl')?.value ?? '')
      fecha = this.configserv.datepipe.transform(this.dateFecha.value, "yyyy-MM-dd")
      formData.append('dLegTesFecha', fecha)

      // Nuevos campos - EBS 01/2025
      formData.append('nLegTesPais', this.regTesis.nLegTesPais.toString() ?? '0');
      formData.append('nClasePais', this.regTesis.nClasePais.toString() ?? '0');
      formData.append('cLegTesInstitucion', this.regTesis.cLegTesInstitucion ?? '');
      if (this.regTesis.cLegTesInstitucion === this.clmdserv.codigonoinst) {
        formData.append('cLegTesOtraInst', this.FormGroup.get('otraControl')?.value ?? '');
      } else {
        formData.append('cLegTesOtraInst', '');
      }

      if (this.regTesis.cLegTesArchivo != this.regTesis.cFile) {
        formData.append('cFile', this.regTesis.cLegTesArchivo)
      }
      formData.append('cLegTesArchivo', '')
      formData.append('cLegTesValida', 'false')
      formData.append('cLegTesEstado', 'true')
      if (this.regTesis.nLegTesCodigo == 0) {
        this.regserv.registroFile('Registro de Legajos', 'tesisasejur/' + this.data.id, formData).then((data) => {
          if (data) {
            var formData_archivos = new FormData();
            formData_archivos.append('cPerCodigo', this.data.Leg_cPerCodigo)
            formData_archivos.append('cLegArcNombre', this.regTesis.cLegTesArchivo.name)
            formData_archivos.append('nLegArcTipo', '4')

            this.regserv.registroFile('Registro de LegArchivos', 'legarchivos/', formData_archivos).then((data) => {
            })
          }
          this.lstserv.listar_tesisasejur(this.data.id)
        })
      }
      else {
        if (this.regTesis.cFile == null) {
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.actualizarFile('Registro de Legajos', 'tesisasejur/put/' + this.regTesis.nLegTesCodigo, formData).then((data) => {
          if (data) {
            var formData_archivos = new FormData();
            formData_archivos.append('cPerCodigo', this.data.Leg_cPerCodigo)
            formData_archivos.append('cLegArcNombre', this.regTesis.cLegTesArchivo.name)
            formData_archivos.append('nLegArcTipo', '4')

            this.regserv.registroFile('Registro de LegArchivos', 'legarchivos/', formData_archivos).then
              ((data) => {
              })
          }
          this.lstserv.listar_tesisasejur(this.data.id)
        })
      }
    }
    else {
      if (this.regTesis.cFile == null) {
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regTesis.dLegTesFecha = this.dateFecha.value
      this.regTesis.cLegTesNroResolucion = this.FormGroup.get('nroResolucionControl')?.value
      this.lstserv.lTesisAsesJur.push(this.regTesis)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
