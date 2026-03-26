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
import { LegMembresia } from 'src/app/models/legajo/leg-membresia';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-membresia',
  templateUrl: './membresia.component.html',
  styleUrls: ['./membresia.component.sass'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class MembresiaComponent implements OnInit {
  public regMembresia: LegMembresia
  public lstInstitucion: Persona[] = []
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
    public dialogRef: MatDialogRef<MembresiaComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Membresia', id: 0, formacion: LegMembresia},

  ) {
    this.dateFechObt = new FormControl(new Date(''));
    this.dateFechObt2 = new FormControl(new Date(''));
    this.today = new Date();
    this.regMembresia = this.clmdserv.empty_membresia()
    this.FormGroup = this._formBuilder.group({
      paisControl: ['', Validators.required],
      nroRegistroControl: ['', Validators.required],
      otraControl: ( ['']),
    })
  }

  ngOnInit() {
    this.dateFechObt = new FormControl(new Date(''));
    this.dateFechObt2 = new FormControl(new Date(''));

    // ✅ VALIDACIÓN SEGURA: Verificar que membresia exista ANTES de acceder a sus propiedades
    if (this.data?.id > 0 && this.data?.formacion && this.data.formacion.nLegMemCodigo > 0) {
      this.regMembresia = this.data.formacion;
      
      // ✅ SEGURO: Encadenamiento opcional y valores por defecto para propiedades anidadas
      this.FormGroup.setValue({
        paisControl: this.data.formacion.vPais?.nIntCodigo ?? '',
        nroRegistroControl: this.data.formacion.cLegMemNroRegistro ?? '', // ¡CORREGIDO AQUÍ!
        otraControl: this.data.formacion.cLegMemOtraInst ?? ''
      });

      this.universidadOnChange(this.data.formacion.vPais ?? null);
      
      // ✅ SEGURO: Manejo de propiedad navigation que podría ser null
      const institucionNombre = this.data.formacion.cLegMemInstitucionNavigation?.cPerNombre ?? '';
      this.myControl.setValue(institucionNombre);
      
      // ✅ SEGURO: Validar fechas antes de convertir
      const fechaEmision = this.data.formacion.dLegMemFechaEmision 
        ? new Date(this.data.formacion.dLegMemFechaEmision) 
        : new Date('');
      const fechaExpiracion = this.data.formacion.dLegMemFechaExpiracion 
        ? new Date(this.data.formacion.dLegMemFechaExpiracion) 
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
      this.regMembresia.vPais = $obj
      this.regMembresia.nClasePais = $obj.nIntClase
      this.regMembresia.nLegMemPais = $obj.nIntCodigo
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

  guardarMembresia($e: any){
    // console.log(this.regMembresia.cLegMemInstitucion)
    if(this.FormGroup.status.valueOf() == "INVALID"){
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }
    else if(this.regMembresia.cLegMemInstitucion.trim() == '' ){
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

            formData.append('nLegMemCodigo', this.regMembresia.nLegMemCodigo.toString() ?? '0')
            formData.append('cLegMemNroRegistro',this.FormGroup.get('nroRegistroControl')?.value ?? '')
            formData.append('cLegMemInstitucion', this.regMembresia.cLegMemInstitucion == this.clmdserv.codigonoinst ? "" : this.regMembresia.cLegMemInstitucion.toString() ?? '')
            formData.append('cLegMemOtraInst',  this.regMembresia.cLegMemInstitucion != this.clmdserv.codigonoinst ? "" : this.FormGroup.get('otraControl')?.value ?? '' )
            formData.append('nLegMemPais', this.regMembresia.nLegMemPais.toString() ?? '0')
            formData.append('nClasePais', this.regMembresia.nClasePais.toString() ?? '0')
            formData.append('dLegMemFechaEmision', fechaobt)
            formData.append('dLegMemFechaExpiracion', fechaobt2)
            formData.append('cLegMemValida',  'false' )
            formData.append('cLegMemEstado',  'true' )
      if(this.regMembresia.nLegMemCodigo == 0){
        this.regserv.registroFile('Registro de Legajos', 'membresia/' + this.data.id,  formData).then((data)=>{
          this.lstserv.listar_membresia(this.data.id)
        })
      }else{
        this.regserv.actualizarFile('Registro de Legajos', 'membresia/put/' + this.regMembresia.nLegMemCodigo, formData).then((data)=>{
          this.lstserv.listar_membresia(this.data.id)
        })
      }
    }
    else{
      this.regMembresia.cLegMemNroRegistro = this.FormGroup.get('nroRegistroControl')?.value
      this.regMembresia.dLegMemFechaEmision = this.dateFechObt.value
      this.regMembresia.dLegMemFechaExpiracion = this.dateFechObt2.value
      this.lstserv.lLegMembresia.push(this.regMembresia)
    }
     this.configserv.onNoClickDialog(this.dialogRef);
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
        case 1: this.regMembresia.cLegMemInstitucion =  ''; break;
      }
    }
  }

  customerOnChange($obj:any, tipo: number){
    // console.log($obj)
    if($obj == null){
      switch(tipo){
        case 1:
          this.regMembresia.cLegMemInstitucion = ""; 
          this.regMembresia.cLegMemInstitucionNavigation = this.clmdserv.empty_persona();
          break;
      }
    }
    else{
      switch(tipo){
        case 1:
          if($obj.cPerCodigo != this.clmdserv.codigonoinst){
            this.regMembresia.cLegMemInstitucion = $obj.cPerCodigo; 
            this.regMembresia.cLegMemInstitucionNavigation = $obj;
          }
          else{
            this.regMembresia.cLegMemInstitucion = this.clmdserv.codigonoinst; this.regMembresia.cLegMemInstitucionNavigation = this.clmdserv.empty_persona();
          }
          break;
      }
    }
  }

}
