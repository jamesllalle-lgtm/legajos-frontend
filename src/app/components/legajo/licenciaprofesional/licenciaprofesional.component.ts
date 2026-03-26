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
import { LegLicenciaProfesional } from 'src/app/models/legajo/leg-licencia-profesional';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-licenciaprofesional',
  templateUrl: './licenciaprofesional.component.html',
  styleUrls: ['./licenciaprofesional.component.sass'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class LicenciaProfesionalComponent implements OnInit {
  public regLicenciaProfesional: LegLicenciaProfesional
  public lstInstitucion: Persona[] = []
  public lstCondicion: Interface[] = []
  public lstanioini: number[] = []
  public lstaniofin: number[] = []
  today: Date | undefined;
  dateFechObt: any;
  dateFechObt2: any;
  public FormGroup: FormGroup;
  myControl = new FormControl();
  myControlProf = new FormControl();
  filteredOptions!: Observable<Persona[]>;
  filteredOptionsProf!: Observable<Persona[]>;
  filterInst: any

  constructor(
    public dialogRef: MatDialogRef<LicenciaProfesionalComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Licencia Profesional', id: 0, formacion: LegLicenciaProfesional},

  ) {
    this.dateFechObt = new FormControl(new Date(''));
    this.dateFechObt2 = new FormControl(new Date(''));
    this.today = new Date();
    this.regLicenciaProfesional = this.clmdserv.empty_licenciaprofesional()
    this.FormGroup = this._formBuilder.group({
      paisControl: ['', Validators.required],
      condicionControl: ['', Validators.required],
      nroRegistroControl: ['', Validators.required],
      otraControl: ( ['']),
    })
  }

  ngOnInit() {
    this.dateFechObt = new FormControl(new Date(''));
    this.dateFechObt2 = new FormControl(new Date(''));
    this.listar_condicionLic();

    // ✅ VALIDACIÓN SEGURA: Verificar que licencia exista ANTES de acceder a sus propiedades
    if (this.data?.id > 0 && this.data?.formacion && this.data.formacion.nLegLicCodigo > 0) {
      this.regLicenciaProfesional = this.data.formacion;
      
      // ✅ SEGURO: Encadenamiento opcional y valores por defecto para propiedades anidadas
      this.FormGroup.setValue({
        paisControl: this.data.formacion.vPais?.nIntCodigo ?? '',
        condicionControl: this.data.formacion.vCondicion?.nIntCodigo ?? '',
        nroRegistroControl: this.data.formacion.cLegLicNroRegistro ?? '', // ¡CORREGIDO AQUÍ!
        otraControl: this.data.formacion.cLegLicOtraInst ?? ''
      });

      this.universidadOnChange(this.data.formacion.vPais ?? null);
      
      // ✅ SEGURO: Manejo de propiedad navigation que podría ser null
      const institucionNombre = this.data.formacion.cLegLicInstitucionNavigation?.cPerNombre ?? '';
      this.myControl.setValue(institucionNombre);
      
      // ✅ SEGURO: Validar fechas antes de convertir
      const fechaEmision = this.data.formacion.dLegLicFechaEmision 
        ? new Date(this.data.formacion.dLegLicFechaEmision) 
        : new Date('');
      const fechaExpiracion = this.data.formacion.dLegLicFechaExpiracion 
        ? new Date(this.data.formacion.dLegLicFechaExpiracion) 
        : new Date('');
      
      this.dateFechObt = new FormControl(fechaEmision);
      this.dateFechObt2 = new FormControl(fechaExpiracion);
    } else {
      this.universidadOnChange(null);
    }
  }

  universidadOnChange($obj: any){
    this.myControl.setValue('')
    if($obj == null){
      this.lstInstitucion = []
    }else{
      this.regLicenciaProfesional.vPais = $obj
      this.regLicenciaProfesional.nClasePais = $obj.nIntClase
      this.regLicenciaProfesional.nLegLicPais = $obj.nIntCodigo
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

  guardarLicencia($e: any){
    // console.log(this.regLicenciaProfesional.cLegLicInstitucion)
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }
    else if(this.regLicenciaProfesional.cLegLicInstitucion.trim() == '' ){
      this.valserv.mensaje_info("Seleccione institución.");
      return;
    }
    else if(this.dateFechObt.status.valueOf() == 'INVALID' ){
      this.valserv.mensaje_info("Ingrese una fecha de emision válida.");
      return;
    }
    else if(this.dateFechObt2.status.valueOf() == 'INVALID' ){
      this.valserv.mensaje_info("Ingrese una fecha de expiración válida.");
      return;
    }
    if(this.data.id > 0){
            var formData = new FormData();
            let fechaobt: any = this.configserv.datepipe.transform(this.dateFechObt.value, "yyyy-MM-dd")
            let fechaobt2: any = this.configserv.datepipe.transform(this.dateFechObt2.value, "yyyy-MM-dd")

            formData.append('nLegLicCodigo', this.regLicenciaProfesional.nLegLicCodigo.toString() ?? '0')
            formData.append('nLegLicCondicion', this.regLicenciaProfesional.nLegLicCondicion.toString() ?? '0')
            formData.append('nClaseCondicion', this.regLicenciaProfesional.nClaseCondicion.toString() ?? '0')
            formData.append('cLegLicNroRegistro',this.FormGroup.get('nroRegistroControl')?.value ?? '')
            formData.append('cLegLicInstitucion', this.regLicenciaProfesional.cLegLicInstitucion == this.clmdserv.codigonoinst ? "" : this.regLicenciaProfesional.cLegLicInstitucion.toString() ?? '')
            formData.append('cLegLicOtraInst',  this.regLicenciaProfesional.cLegLicInstitucion != this.clmdserv.codigonoinst ? "" : this.FormGroup.get('otraControl')?.value ?? '' )
            formData.append('nLegLicPais', this.regLicenciaProfesional.nLegLicPais.toString() ?? '0')
            formData.append('nClasePais', this.regLicenciaProfesional.nClasePais.toString() ?? '0')
            formData.append('dLegLicFechaEmision', fechaobt)
            formData.append('dLegLicFechaExpiracion', fechaobt2)
            formData.append('cLegLicValida',  'false' )
            formData.append('cLegLicEstado',  'true' )
      if(this.regLicenciaProfesional.nLegLicCodigo == 0){
        this.regserv.registroFile('Registro de Legajos', 'licenciaprofesional/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_licenciaprofesional(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'licenciaprofesional/put/' + this.regLicenciaProfesional.nLegLicCodigo, formData).then((data)=>{
          this.lstserv.listar_licenciaprofesional(this.data.id)
        })
      }
    }
    else{
      this.regLicenciaProfesional.cLegLicNroRegistro = this.FormGroup.get('nroRegistroControl')?.value
      this.regLicenciaProfesional.dLegLicFechaEmision = this.dateFechObt.value
      this.regLicenciaProfesional.dLegLicFechaExpiracion = this.dateFechObt2.value
      this.lstserv.lLegLicenciaProfesional.push(this.regLicenciaProfesional)
    }
     this.configserv.onNoClickDialog(this.dialogRef);
  }

  listar_condicionLic() {
    this.lstserv
      .listado('interface', '/' + this.configserv.nIntCondicionLic)
      .then((data) => {
        let lista: Interface[] = data
        this.lstserv.lCondicionLic = lista.filter((x) => x.nIntCodigo != 0)
      })
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
        case 1: this.regLicenciaProfesional.cLegLicInstitucion =  ''; break;
      }
    }
  }

  customerOnChange($obj:any, tipo: number){
    // console.log($obj)
    if($obj == null){
      switch(tipo){
        case 1:
          this.regLicenciaProfesional.cLegLicInstitucion = ""; 
          this.regLicenciaProfesional.cLegLicInstitucionNavigation = this.clmdserv.empty_persona();
          break;
        case 2: 
          this.regLicenciaProfesional.nLegLicCondicion =  0; 
          this.regLicenciaProfesional.nClaseCondicion = 0;  
          this.regLicenciaProfesional.vCondicion = this.clmdserv.empty_interface(); break;
      }
    }
    else{
      switch(tipo){
        case 1:
          if($obj.cPerCodigo != this.clmdserv.codigonoinst){
            this.regLicenciaProfesional.cLegLicInstitucion = $obj.cPerCodigo; 
            this.regLicenciaProfesional.cLegLicInstitucionNavigation = $obj;
          }
          else{
            this.regLicenciaProfesional.cLegLicInstitucion = this.clmdserv.codigonoinst; this.regLicenciaProfesional.cLegLicInstitucionNavigation = this.clmdserv.empty_persona();
          }
          break;
        case 2: 
          this.regLicenciaProfesional.nLegLicCondicion =  $obj.nIntCodigo; 
          this.regLicenciaProfesional.nClaseCondicion = $obj.nIntClase;  this.regLicenciaProfesional.vCondicion = $obj; 
          break;
      }
    }
  }

}
