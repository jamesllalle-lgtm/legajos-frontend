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
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-docenteinvestigador',
  templateUrl: './docenteinvestigador.component.html',
  styleUrls: ['./docenteinvestigador.component.sass'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class DocenteinvestigadorComponent implements OnInit {
  public regInvestigador: LegInvestigador
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
  
  public fecha_minima : any;

  constructor(
    public dialogRef: MatDialogRef<DocenteinvestigadorComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Grados y títulos', id: 0, formacion: LegInvestigador, Leg_cPerCodigo:string},
  ) {
    this.today = new Date();
    this.dateFecIni = new FormControl(new Date(''));
    this.dateFecFin = new FormControl(new Date(''));
    this.regInvestigador = this.clmdserv.empty_investigador()
    this.FormGroup = this._formBuilder.group({
      centroControl: ['', Validators.required],
      nivelRenacytControl: ['', Validators.required],
      nroRegistroControl: ['', Validators.required]
    })
  }


  ngOnInit(): void {
    this.fecha_minima = new Date(new Date().getFullYear()- 5, new Date().getMonth(), new Date().getDate());
    
    // Primero cargar los datos necesarios
    Promise.all([
      this.listar_centro(),
      this.listar_nivelesRenacyt(),
      this.listar_archivos()
    ]).then(() => {
      // Después de que todas las listas se hayan cargado
      if(this.data.id > 0 && this.data.formacion.nLegInvCodigo > 0){
        this.regInvestigador = this.data.formacion;
        
        // Asegurarse de que vNivelRenacyt existe antes de acceder a sus propiedades
        const nivelCodigo = this.data.formacion.vNivelRenacyt ? this.data.formacion.vNivelRenacyt.nIntCodigo : 0;
        const centroCodigo = this.data.formacion.vCentroRegistro ? this.data.formacion.vCentroRegistro.nIntCodigo : 0;
        
        this.FormGroup.setValue({
          centroControl: centroCodigo,
          nivelRenacytControl: nivelCodigo,
          nroRegistroControl: this.data.formacion.cLegInvNroRegistro || ''
        });
        
        // Actualizar también las propiedades internas
        if (this.data.formacion.vNivelRenacyt) {
          this.regInvestigador.nLegInvNivelRenacyt = this.data.formacion.vNivelRenacyt.nIntClase;
          this.regInvestigador.nValorNivelRenacyt = this.data.formacion.vNivelRenacyt.nIntCodigo;
        }
        
        if (this.data.formacion.vCentroRegistro) {
          this.regInvestigador.nLegInvCentroRegistro = this.data.formacion.vCentroRegistro.nIntClase;
          this.regInvestigador.nValorCentroRegistro = this.data.formacion.vCentroRegistro.nIntCodigo;
        }
        
        this.regInvestigador.cFile = this.data.formacion.cLegInvArchivo;
        this.erradjunto = !!this.data.formacion.cLegInvArchivo;
        this.dateFecIni = new FormControl(new Date(this.data.formacion.dLegInvFechaInicio));
        this.dateFecFin = new FormControl(new Date(this.data.formacion.dLegInvFechaFin));
      }
    });
  }

  listar_centro(){
    this.lstserv.listado('interface', '/'+ this.configserv.nConGrupoNivelInv).then((data)=>{
       let lcentro: Interface[] = data;
       this.lstserv.lCentroRegistro = lcentro.filter(x=>x.nIntCodigo != 0)
       
    })
  }

  listar_nivelesRenacyt(){
    this.lstserv.listado('interface', '/'+ this.configserv.nIntNivelRenacyt).then((data)=>{
       let lnivelesRenacyt: Interface[] = data;
       this.lstserv.lNivelRenacyt = lnivelesRenacyt.filter(x=>x.nIntCodigo != 0)
       
    })
  }

  listar_archivos(){
    this.lstserv.listado('legarchivos_lst', '/'+ this.data.Leg_cPerCodigo).then((data)=>{
      this.lstserv.lArchivos = data;
    })
  }

  fileProgress(fileInput: any): void {
    if(fileInput!= null){
      this.regInvestigador.cLegInvArchivo = <File>fileInput.target.files[0];
      this.preview()
    }else{
      this.regInvestigador.cLegInvArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regInvestigador.cLegInvArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regInvestigador.cLegInvArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regInvestigador.cLegInvArchivo);
    reader.onload = (_event) => {
      this.regInvestigador.cFile = reader.result;
    }
  }


  customerOnChange($obj:any, tipo: number){
    if($obj == null){
      switch(tipo){
        case 1:  
          this.regInvestigador.nLegInvCentroRegistro = 0; 
          this.regInvestigador.nValorCentroRegistro = 0; 
          this.regInvestigador.vCentroRegistro = this.clmdserv.empty_interface(); 
        break;
        case 2:  
          this.regInvestigador.nLegInvNivelRenacyt = 0; 
          this.regInvestigador.nValorNivelRenacyt = 0; 
          this.regInvestigador.vNivelRenacyt = this.clmdserv.empty_interface(); 
        break;
       }
    }
    else{
      switch(tipo){
        case 1:  
          this.regInvestigador.nLegInvCentroRegistro = $obj.nIntClase; 
          this.regInvestigador.nValorCentroRegistro = $obj.nIntCodigo; 
          this.regInvestigador.vCentroRegistro = $obj; 
        break;
        case 2:  
          this.regInvestigador.nLegInvNivelRenacyt = $obj.nIntClase; 
          this.regInvestigador.nValorNivelRenacyt = $obj.nIntCodigo; 
          this.regInvestigador.vNivelRenacyt = $obj; 
        break;
       }
    }
  }



  guardar($e: any){
    let flag=0;

    for(let i=0; i<this.lstserv.lArchivos.length ;i++){
      if(this.lstserv.lArchivos[i].cLegArcNombre == this.regInvestigador.cLegInvArchivo.name){
        flag++;
      }
    }

    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
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
    else if(flag>0){
      this.valserv.mensaje_info("Existe un archivo con el mismo nombre. Carge otro archivo por favor.");
      return;
    }
    if(this.data.id > 0){
      var formData = new FormData();
      let fecha: any
      formData.append('nLegInvCodigo', this.regInvestigador.nLegInvCodigo.toString() ?? '0')
      formData.append('nLegInvCentroRegistro', this.regInvestigador.nLegInvCentroRegistro.toString() ?? '')
      formData.append('nValorCentroRegistro', this.regInvestigador.nValorCentroRegistro.toString() ?? '0')

      formData.append('nLegInvNivelRenacyt', this.regInvestigador.nLegInvNivelRenacyt.toString() ?? '')
      formData.append('nValorNivelRenacyt', this.regInvestigador.nValorNivelRenacyt.toString() ?? '0')

      formData.append('cLegInvNroRegistro', this.FormGroup.get('nroRegistroControl')?.value ?? '')
      fecha = this.configserv.datepipe.transform(this.dateFecIni.value, "yyyy-MM-dd")
      formData.append('dLegInvFechaInicio', fecha)
      fecha = this.configserv.datepipe.transform(this.dateFecFin.value, "yyyy-MM-dd")
      formData.append('dLegInvFechaFin', fecha)
      if(this.regInvestigador.cLegInvArchivo != this.regInvestigador.cFile){
        formData.append('cFile',  this.regInvestigador.cLegInvArchivo )
      }
      formData.append('cLegInvArchivo',  '' )
      formData.append('cLegInvValida','false' )
      formData.append('cLegInvEstado',  'true' )
      if(this.regInvestigador.nLegInvCodigo == 0){
        if(this.regInvestigador.cFile == null){
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'investigador/' + this.data.id,  formData).then((data)=>{
          if(data){
            var formData_archivos = new FormData();
            formData_archivos.append('cPerCodigo',  this.data.Leg_cPerCodigo )
            formData_archivos.append('cLegArcNombre',  this.regInvestigador.cLegInvArchivo.name )
            formData_archivos.append('nLegArcTipo',  '3' )
            
            this.regserv.registroFile('Registro de LegArchivos', 'legarchivos/',  formData_archivos).then((data)=>{
            })
          }
          this.lstserv.listar_docenteinvestigador(this.data.id)
        })
      }
      else{
        this.regserv.actualizarFile('Registro de Legajos', 'investigador/put/' + this.regInvestigador.nLegInvCodigo, formData).then((data)=>{
          if(data){
            var formData_archivos = new FormData();
            formData_archivos.append('cPerCodigo',  this.data.Leg_cPerCodigo )
            formData_archivos.append('cLegArcNombre',  this.regInvestigador.cLegInvArchivo.name )
            formData_archivos.append('nLegArcTipo',  '3' )

            this.regserv.registroFile('Registro de LegArchivos', 'legarchivos/' ,  formData_archivos).then
            ((data)=>{
            })
          }
          this.lstserv.listar_docenteinvestigador(this.data.id)
        })
      }
    }
    else{
      if(this.regInvestigador.cFile == null){
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regInvestigador.dLegInvFechaInicio = this.dateFecIni.value
      this.regInvestigador.dLegInvFechaFin = this.dateFecFin.value
      this.regInvestigador.cLegInvNroRegistro = this.FormGroup.get('nroRegistroControl')?.value
      this.lstserv.linvestigador.push(this.regInvestigador)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
