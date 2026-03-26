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
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LegArchivos } from 'src/app/models/legajo/leg-archivos';

@Component({
  selector: 'app-participacioncongresos',
  templateUrl: './participacioncongresos.component.html',
  styleUrls: ['./participacioncongresos.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class ParticipacioncongresosComponent implements OnInit {
  public regParticipacion: LegParticipacionCongSem
  public lstInstitucion: Persona[] = []
  filterInst: any
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFecha: any;

  dateFechaFin: any;

  fileData: any;
  previewUrl: any = "./.assets/images/certdefault.jpg"
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Persona[]>;

  public fecha_minima: any;

  constructor(
    public dialogRef: MatDialogRef<ParticipacioncongresosComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: { title: 'Grados y títulos', id: 0, formacion: LegParticipacionCongSem, Leg_cPerCodigo: string },
  ) {
    this.today = new Date();
    this.dateFecha = new FormControl(new Date(''));
    this.dateFechaFin = new FormControl(new Date(''));

    this.regParticipacion = this.clmdserv.empty_participacion()
    this.FormGroup = this._formBuilder.group({
      paisControl: ['', Validators.required],
      horasControl: ['', Validators.required],
      ambitoControl: ['', Validators.required],
      rolControl: ['', Validators.required],
      nombreEventoControl: ['', Validators.required],
      otraControl: (['']),
    })
  }


  ngOnInit(): void {
    this.listar_rolpart()
    this.listar_ambitopart()
    this.listar_archivos()

    let paisuniv: number = 0;
    let vpais: Interface = this.clmdserv.empty_interface()

    this.fecha_minima = new Date(new Date().getFullYear() - 5, new Date().getMonth(), new Date().getDate())

    if (this.data.id > 0 && this.data.formacion.nLegParCodigo > 0) {
      this.regParticipacion = this.data.formacion

      vpais = this.lstserv.lubigeo.filter(x => x.cIntJerarquia.trim() == this.data.formacion.cLegParPais)[0]
      paisuniv = vpais.nIntCodigo

      this.universidadOnChange(vpais)
      this.FormGroup.setValue({
        paisControl: paisuniv,
        horasControl: this.data.formacion.nLegParHoras,
        ambitoControl: this.data.formacion.vAmbito.nIntCodigo,
        rolControl: this.data.formacion.vRol.nIntCodigo,
        nombreEventoControl: this.data.formacion.cLegParNombre,
        otraControl: this.data.formacion.cLegParOtraInst
      })
      if (this.regParticipacion.cLegParOtraInst.trim() != "") {
        this.regParticipacion.cLegParInstitucionNavigation = this.clmdserv.empty_persona()
        this.regParticipacion.cLegParInstitucion = this.clmdserv.codigonoinst
      }
      this.regParticipacion.cFile = this.data.formacion.cLegParArchivo
      this.erradjunto = this.data.formacion.cLegParArchivo != null && this.data.formacion.cLegParArchivo != '' ? true : false
      this.myControl.setValue(this.data.formacion.cLegParInstitucionNavigation.cPerNombre)
      this.dateFecha = new FormControl(new Date(this.data.formacion.dLegParFecha))
      this.dateFechaFin = new FormControl(new Date(this.data.formacion.dLegParFechaFin))
    }
    else { this.universidadOnChange(null) }
  }

  listar_rolpart() {
    this.lstserv.listado('interface', '/' + this.configserv.nConRolCong).then((data) => {
      let ltipo: Interface[] = data;
      this.lstserv.lRolPart = ltipo.filter(x => x.nIntClase != 0)
    })

  }

  listar_ambitopart() {
    this.lstserv.listado('interface', '/' + this.configserv.nConAmbitoCong).then((data) => {
      let ltipo: Interface[] = data;
      this.lstserv.lAmbitoPart = ltipo.filter(x => x.nIntClase != 0)
    })

  }

  listar_archivos() {
    this.lstserv.listado('legarchivos_lst', '/' + this.data.Leg_cPerCodigo).then((data) => {
      this.lstserv.lArchivos = data;
    })
  }

  fileProgress(fileInput: any): void {
    if (fileInput != null) {
      this.regParticipacion.cLegParArchivo = <File>fileInput.target.files[0];
      this.preview()
    } else {
      this.regParticipacion.cLegParArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regParticipacion.cLegParArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regParticipacion.cLegParArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regParticipacion.cLegParArchivo);
    reader.onload = (_event) => {
      this.regParticipacion.cFile = reader.result;
    }
  }


  cargardata() {
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



  handleModelChange(e: any, tipo: number) {
    if (e == '') {
      switch (tipo) {
        case 1: this.regParticipacion.cLegParInstitucion = ''; break;
      }

    }
  }

  universidadOnChange($obj: any) {
    this.myControl.setValue('')
    if ($obj == null) {
      this.lstInstitucion = []
    } else {
      if ($obj.cIntJerarquia.trim() != 'PER') {
        this.regParticipacion.cLegParPais = $obj.cIntJerarquia.trim()
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x => x.cUbigeoCodigo.trim() == $obj.cIntJerarquia.trim());
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      } else {
        this.regParticipacion.cLegParPais = "PER"
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x => x.cUbigeoCodigo.length > 3);
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      }
      this.lstInstitucion.push(this.clmdserv.empty_persona())
      this.cargardata();
    }
  }
  customerOnChange($obj: any, tipo: number) {
    if ($obj == null) {
      switch (tipo) {
        case 1:

          this.regParticipacion.cLegParInstitucion = ""; this.regParticipacion.cLegParInstitucionNavigation = this.clmdserv.empty_persona();
          break;
        case 2: this.regParticipacion.nLegParRol = 0; this.regParticipacion.nValorRol = 0; this.regParticipacion.vRol = this.clmdserv.empty_interface(); break;
        case 3: this.regParticipacion.nLegParAmbito = 0; this.regParticipacion.nValorAmbito = 0; this.regParticipacion.vAmbito = this.clmdserv.empty_interface(); break;
      }
    } else {
      switch (tipo) {
        case 1:
          if ($obj.cPerCodigo != this.clmdserv.codigonoinst) {
            this.regParticipacion.cLegParInstitucion = $obj.cPerCodigo; this.regParticipacion.cLegParInstitucionNavigation = $obj;
          } else {
            this.regParticipacion.cLegParInstitucion = this.clmdserv.codigonoinst; this.regParticipacion.cLegParInstitucionNavigation = this.clmdserv.empty_persona();
          } break;
        case 2: this.regParticipacion.nLegParRol = $obj.nIntClase; this.regParticipacion.nValorRol = $obj.nIntCodigo; this.regParticipacion.vRol = $obj; break;
        case 3: this.regParticipacion.nLegParAmbito = $obj.nIntClase; this.regParticipacion.nValorAmbito = $obj.nIntCodigo; this.regParticipacion.vAmbito = $obj; break;
      }
    }

  }



  guardar($e: any) {
    let flag = 0;

    for (let i = 0; i < this.lstserv.lArchivos.length; i++) {
      if (this.lstserv.lArchivos[i].cLegArcNombre == this.regParticipacion.cLegParArchivo.name) {
        flag++;
      }
    }
    if (this.regParticipacion.cFile == null) {
      this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
      return;
    }
    if (this.FormGroup.status.valueOf() == "INVALID") {
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    } else if (this.regParticipacion.cLegParInstitucion.trim() == '') {
      this.valserv.mensaje_info("Seleccione institución.");
      return;
    } else if (this.dateFecha.status.valueOf() == 'INVALID') {
      this.valserv.mensaje_info("Ingrese fecha de certificación válida.");
      return;
    }
    else if (this.regParticipacion.cLegParArchivoOrig == this.regParticipacion.cLegParArchivo.name) {
      this.valserv.mensaje_info("Ingrese un archivo diferente. Ya existe un archivo con el mismo nombre");
      return;
    }
    else if (flag > 0) {
      this.valserv.mensaje_info("Existe un archivo con el mismo nombre. Carge otro archivo por favor.");
      return;
    }
    if (this.data.id > 0) {
      var formData = new FormData();
      let fecha: any
      let fechaFin: any

      formData.append('nLegParCodigo', this.regParticipacion.nLegParCodigo.toString() ?? '0')
      formData.append('cLegParInstitucion', this.regParticipacion.cLegParInstitucion == this.clmdserv.codigonoinst ? "" : this.regParticipacion.cLegParInstitucion.toString() ?? '')
      formData.append('cLegParPais', this.regParticipacion.cLegParPais.toString() ?? '')
      formData.append('cLegParOtraInst', this.regParticipacion.cLegParInstitucion != this.clmdserv.codigonoinst ? "" : this.FormGroup.get('otraControl')?.value ?? '')
      formData.append('cLegParNombre', this.FormGroup.get('nombreEventoControl')?.value ?? '')
      formData.append('nLegParRol', this.regParticipacion.nLegParRol.toString() ?? '0')
      formData.append('nValorRol', this.regParticipacion.nValorRol.toString() ?? '0')
      formData.append('nLegParAmbito', this.regParticipacion.nLegParAmbito.toString() ?? '0')
      formData.append('nValorAmbito', this.regParticipacion.nValorAmbito.toString() ?? '0')

      fecha = this.configserv.datepipe.transform(this.dateFecha.value, "yyyy-MM-dd")
      formData.append('dLegParFecha', fecha)
      fechaFin = this.configserv.datepipe.transform(this.dateFechaFin.value, "yyyy-MM-dd")
      formData.append('dLegParFechaFin', fechaFin)
      formData.append('nLegParHoras', this.FormGroup.get('horasControl')?.value ?? '0')



      if (this.regParticipacion.cLegParArchivo != this.regParticipacion.cFile) {
        formData.append('cFile', this.regParticipacion.cLegParArchivo)
      }

      formData.append('cLegParArchivoOrig', '')
      formData.append('cLegParArchivo', '')
      formData.append('cLegParValida', 'false')
      formData.append('cLegParEstado', 'true')

      if (this.regParticipacion.nLegParCodigo == 0) {
        if (this.regParticipacion.cFile == null) {
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'participacion/' + this.data.id, formData).then((data) => {
          if (data) {
            var formData_archivos = new FormData();
            formData_archivos.append('cPerCodigo', this.data.Leg_cPerCodigo)
            formData_archivos.append('cLegArcNombre', this.regParticipacion.cLegParArchivo.name)
            formData_archivos.append('nLegArcTipo', '1')

            this.regserv.registroFile('Registro de LegArchivos', 'legarchivos/', formData_archivos).then((data) => {
            })
          }
          this.lstserv.listar_participacion(this.data.id)
        })
      }
      else {
        this.regserv.actualizarFile('Registro de Legajos', 'participacion/put/' + this.regParticipacion.nLegParCodigo, formData).then((data) => {
          if (data) {

            if (this.regParticipacion.cLegParArchivo) {
              var formData_archivos = new FormData();
              formData_archivos.append('cPerCodigo', this.data.Leg_cPerCodigo)
              formData_archivos.append('cLegArcNombre', this.regParticipacion.cLegParArchivo.name)
              formData_archivos.append('nLegArcTipo', '1')

              this.regserv.registroFile('Registro de LegArchivos', 'legarchivos/', formData_archivos).then
                ((data) => {
                })
            }

          }
          this.lstserv.listar_participacion(this.data.id)
        })
      }
    }
    else {
      this.regParticipacion.dLegParFecha = this.dateFecha.value

      this.regParticipacion.dLegParFechaFin = this.dateFechaFin.value
      this.regParticipacion.nLegParHoras = this.FormGroup.get('horasControl')?.value

      this.regParticipacion.cLegParNombre = this.FormGroup.get('nombreEventoControl')?.value
      this.lstserv.lParticipacion.push(this.regParticipacion)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
