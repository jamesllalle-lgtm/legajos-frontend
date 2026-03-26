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
import { LegCapacitaciones } from 'src/app/models/legajo/leg-capacitaciones';
import { environment } from 'src/environments/environment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-capacitaciones',
  templateUrl: './capacitaciones.component.html',
  styleUrls: ['./capacitaciones.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class CapacitacionesComponent implements OnInit {
  public regCapacitacion: LegCapacitaciones
  public lstInstitucion: Persona[] = []
  public filterInst: any
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFechaInicio: any;
  dateFechaFin: any;
  fileData: any;
  previewUrl: any = "./.assets/images/certdefault.jpg"
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Persona[]>;

  public fecha_minima: any;

  constructor(
    public dialogRef: MatDialogRef<CapacitacionesComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { title: 'Grados y títulos', id: 0, formacion: LegCapacitaciones, docente: true, Leg_cPerCodigo: string },
    private spinner: NgxSpinnerService,
  ) {
    this.today = new Date();
    this.dateFechaInicio = new FormControl(new Date(''));
    this.dateFechaFin = new FormControl(new Date(''));
    this.regCapacitacion = this.clmdserv.empty_capacitaciones()
    this.FormGroup = this._formBuilder.group({
      paisControl: ['', Validators.required],
      horasControl: ['', Validators.required],
      tipocapControl: ['', Validators.required],
      especialidadControl: ['', Validators.required],
      nombreCapacitacionControl: ['', Validators.required],
      otraControl: (['']),
    })
  }


  ngOnInit(): void {
    this.listar_tipocap()
    this.listar_especialidadcap()
    this.listar_archivos()

    let paisuniv: number = 0;
    let vpais: Interface = this.clmdserv.empty_interface()

    this.fecha_minima = new Date(new Date().getFullYear() - 5, new Date().getMonth(), new Date().getDate())

    if (this.data.id > 0 && this.data.formacion.nLegCapCodigo > 0) {
      this.regCapacitacion = this.data.formacion
      vpais = this.lstserv.lubigeo.filter(x => x.cIntJerarquia.trim() == this.data.formacion.cLegCapPais)[0]
      paisuniv = vpais.nIntCodigo
      this.universidadOnChange(vpais)
      this.FormGroup.setValue({
        paisControl: paisuniv,
        tipocapControl: this.data.formacion.vTipo.nConValor,
        especialidadControl: this.data.formacion.vTipoEsp.nConValor,
        horasControl: this.data.formacion.nLegCapHoras,
        nombreCapacitacionControl: this.data.formacion.cLegCapNombre,
        otraControl: this.data.formacion.cLegCapOtraInst
      })
      if (this.regCapacitacion.cLegCapOtraInst.trim() != "") {
        this.regCapacitacion.vInstitucion = this.clmdserv.empty_persona()
        this.regCapacitacion.cLegCapInstitucion = this.clmdserv.codigonoinst
      }
      this.regCapacitacion.cFile = this.data.formacion.cLegCapArchivo
      this.erradjunto = this.data.formacion.cLegCapArchivo != null && this.data.formacion.cLegCapArchivo != '' ? true : false
      this.myControl.setValue(this.data.formacion.vInstitucion.cPerNombre)
      this.dateFechaInicio = new FormControl(new Date(this.data.formacion.dLegCapFechaInicio))
      this.dateFechaFin = new FormControl(new Date(this.data.formacion.dLegCapFechaFin))
    } else { this.universidadOnChange(null) }
  }


  listar_tipocap() {
    this.lstserv.listado('constante', '/' + this.configserv.nConTipoCapacitacion).then((data) => {
      let ltipo: Constante[] = data;
      this.lstserv.lTipoCap = ltipo.filter(x => x.nConValor != 0)
    })

  }

  listar_especialidadcap() {
    this.lstserv.listado('constante', '/' + (this.data.docente ? this.configserv.nConTipoEspeCap : this.configserv.nConTipoDuracion)).then((data) => {
      let ltipo: Constante[] = data;
      this.lstserv.lEspecialidadCap = ltipo.filter(x => x.nConValor != 0)
    })
  }

  listar_archivos() {
    this.lstserv.listado('legarchivos_lst', '/' + this.data.Leg_cPerCodigo).then((data) => {
      this.lstserv.lArchivos = data;
    })
  }

  fileProgress(fileInput: any): void {
    if (fileInput != null) {
      this.regCapacitacion.cLegCapArchivo = <File>fileInput.target.files[0];
      this.preview()
    } else {
      this.regCapacitacion.cLegCapArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regCapacitacion.cLegCapArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regCapacitacion.cLegCapArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regCapacitacion.cLegCapArchivo);
    reader.onload = (_event) => {
      this.regCapacitacion.cFile = reader.result;
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
        case 1: this.regCapacitacion.cLegCapInstitucion = ''; break;
      }

    }
  }

  universidadOnChange($obj: any) {
    this.myControl.setValue('')
    if ($obj == null) {
      this.lstInstitucion = []
    } else {
      if ($obj.cIntJerarquia.trim() != 'PER') {
        this.regCapacitacion.cLegCapPais = $obj.cIntJerarquia.trim()
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x => x.cUbigeoCodigo.trim() == $obj.cIntJerarquia.trim());
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      } else {
        this.regCapacitacion.cLegCapPais = "PER"
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
          this.regCapacitacion.cLegCapInstitucion = ""; this.regCapacitacion.vInstitucion = this.clmdserv.empty_persona();
          break;
        case 2: this.regCapacitacion.nLegCapTipo = 0; this.regCapacitacion.nValorTipo = 0; this.regCapacitacion.vTipo = this.clmdserv.empty_constante(); break;
        case 3: this.regCapacitacion.nLegCapTipoEsp = 0; this.regCapacitacion.nValorTipoEsp = 0; this.regCapacitacion.vTipoEsp = this.clmdserv.empty_constante(); break;
      }
    } else {
      switch (tipo) {
        case 1:
          if ($obj.cPerCodigo != this.clmdserv.codigonoinst) {
            this.regCapacitacion.cLegCapInstitucion = $obj.cPerCodigo; this.regCapacitacion.vInstitucion = $obj;
          } else {
            this.regCapacitacion.cLegCapInstitucion = this.clmdserv.codigonoinst; this.regCapacitacion.vInstitucion = this.clmdserv.empty_persona();
          }
          break;
        case 2: this.regCapacitacion.nLegCapTipo = $obj.nConCodigo; this.regCapacitacion.nValorTipo = $obj.nConValor; this.regCapacitacion.vTipo = $obj; break;
        case 3: this.regCapacitacion.nLegCapTipoEsp = $obj.nConCodigo; this.regCapacitacion.nValorTipoEsp = $obj.nConValor; this.regCapacitacion.vTipoEsp = $obj; break;
      }
    }

  }



  guardar($e: any) {

    let flag = 0;

    for (let i = 0; i < this.lstserv.lArchivos.length; i++) {
      if (this.lstserv.lArchivos[i].cLegArcNombre == this.regCapacitacion.cLegCapArchivo.name) {
        flag++;
      }
    }

    if (this.FormGroup.status.valueOf() == "INVALID") {
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    } else if (this.regCapacitacion.cLegCapInstitucion.trim() == '') {
      this.valserv.mensaje_info("Seleccione institución.");
      return;
    } else if (this.dateFechaInicio.status.valueOf() == 'INVALID') {
      this.valserv.mensaje_info("Ingrese fecha de inicio válida.");
      return;
    }
    else if (this.dateFechaFin.status.valueOf() == 'INVALID') {
      this.valserv.mensaje_info("Ingrese fecha de fin válida.");
      return;
    } else if (this.dateFechaInicio.value > this.dateFechaFin.value) {
      this.valserv.mensaje_info("La fecha inicio no puede ser posterior a la fecha fin.");
      return;
    }
    else if (flag > 0) {
      this.valserv.mensaje_info("Existe un archivo con el mismo nombre. Carge otro archivo por favor.");
      return;
    }
    if (this.data.id > 0) {
      var formData = new FormData();
      let fecha: any
      formData.append('nLegCapCodigo', this.regCapacitacion.nLegCapCodigo.toString() ?? '0')
      formData.append('cLegCapInstitucion', this.regCapacitacion.cLegCapInstitucion == this.clmdserv.codigonoinst ? "" : this.regCapacitacion.cLegCapInstitucion.toString() ?? '')
      formData.append('cLegCapPais', this.regCapacitacion.cLegCapPais.toString() ?? '')
      formData.append('cLegCapOtraInst', this.regCapacitacion.cLegCapInstitucion != this.clmdserv.codigonoinst ? "" : this.FormGroup.get('otraControl')?.value ?? '')
      formData.append('cLegCapNombre', this.FormGroup.get('nombreCapacitacionControl')?.value ?? '0')
      formData.append('nLegCapTipo', this.regCapacitacion.nLegCapTipo.toString() ?? '0')
      formData.append('nValorTipo', this.regCapacitacion.nValorTipo.toString() ?? '0')
      formData.append('nLegCapTipoEsp', this.regCapacitacion.nLegCapTipoEsp.toString() ?? '0')
      formData.append('nValorTipoEsp', this.regCapacitacion.nValorTipoEsp.toString() ?? '0')
      formData.append('nLegCapHoras', this.FormGroup.get('horasControl')?.value ?? '0')
      fecha = this.configserv.datepipe.transform(this.dateFechaInicio.value, "yyyy-MM-dd")
      formData.append('dLegCapFechaInicio', fecha)
      fecha = this.configserv.datepipe.transform(this.dateFechaFin.value, "yyyy-MM-dd")
      formData.append('dLegCapFechaFin', fecha)
      if (this.regCapacitacion.cLegCapArchivo != this.regCapacitacion.cFile) {
        formData.append('cFile', this.regCapacitacion.cLegCapArchivo)
      }
      formData.append('cLegCapArchivo', '')
      formData.append('cLegCapValida', 'false')
      formData.append('cLegCapEstado', 'true')
      if (this.regCapacitacion.nLegCapCodigo == 0) {
        if (this.regCapacitacion.cFile == null) {
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'capacitacion/' + this.data.id, formData).then((data) => {
          if (data) {
            var formData_archivos = new FormData();
            formData_archivos.append('cPerCodigo', this.data.Leg_cPerCodigo)
            formData_archivos.append('cLegArcNombre', this.regCapacitacion.cLegCapArchivo.name)
            formData_archivos.append('nLegArcTipo', '2')

            this.regserv.registroFile('Registro de LegArchivos', 'legarchivos/', formData_archivos).then((data) => {
            })
          }
          this.lstserv.listar_capacitacion(this.data.id)
        })
      } else {
        this.regserv.actualizarFile('Registro de Legajos', 'capacitacion/put/' + this.regCapacitacion.nLegCapCodigo, formData).then((data) => {
          if (data) {
            var formData_archivos = new FormData();
            formData_archivos.append('cPerCodigo', this.data.Leg_cPerCodigo)
            formData_archivos.append('cLegArcNombre', this.regCapacitacion.cLegCapArchivo.name)
            formData_archivos.append('nLegArcTipo', '2')

            this.regserv.registroFile('Registro de LegArchivos', 'legarchivos/', formData_archivos).then
              ((data) => {
              })
          }
          this.lstserv.listar_capacitacion(this.data.id)
        })
      }
    } else {
      if (this.regCapacitacion.cFile == null) {
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regCapacitacion.dLegCapFechaInicio = this.dateFechaInicio.value
      this.regCapacitacion.dLegCapFechaFin = this.dateFechaFin.value
      this.regCapacitacion.nLegCapHoras = this.FormGroup.get('horasControl')?.value
      this.regCapacitacion.cLegCapNombre = this.FormGroup.get('nombreCapacitacionControl')?.value
      this.lstserv.lcapacitaciones.push(this.regCapacitacion)
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }

}
