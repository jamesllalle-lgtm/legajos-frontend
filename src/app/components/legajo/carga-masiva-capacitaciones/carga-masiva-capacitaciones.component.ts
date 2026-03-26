import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { Formacion } from 'src/app/models/formacion'
import { GradoAcademico } from 'src/app/models/gradoacademico'
import { CarreraProfesional } from 'src/app/models/carreraprofesional'
import { Institucion } from 'src/app/models/institucion'
import { ConfiguracionService } from 'src/app/services/configuracion.service'
import { ListService } from 'src/app/services/list.service'
import { RegisterService } from 'src/app/services/register.service'
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from 'src/app/helpers/format-datepicker'
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core'
import { Persona } from 'src/app/models/general/persona'
import { Interface } from 'src/app/models/general/interface'
import { LegGradoTitulo } from 'src/app/models/legajo/leg-grado-titulo'
import { CleanmodelService } from 'src/app/services/cleanmodel.service'
import { LegDocenciaUniv } from 'src/app/models/legajo/leg-docencia-univ'
import { Constante } from 'src/app/models/general/constante'
import { LegInvestigador } from 'src/app/models/legajo/leg-investigador'
import { LegTesisAseJur } from 'src/app/models/legajo/leg-tesis-ase-jur'
import { LegProduccionCiencia } from 'src/app/models/legajo/leg-produccion-ciencia'
import { LegParticipacionCongSem } from 'src/app/models/legajo/leg-participacion-cong-sem'
import { LegAdminitrativaCarga } from 'src/app/models/legajo/leg-adminitrativa-carga'
import { LegProyeccionSocial } from 'src/app/models/legajo/leg-proyeccion-social'
import { LegCapacitaciones } from 'src/app/models/legajo/leg-capacitaciones'
import { environment } from 'src/environments/environment'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'
import Swal from 'sweetalert2'
import { ValidateService } from 'src/app/services/validate.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { SidenavService } from 'src/app/services/sidenav.service'
import { NewService } from 'src/app/services/new.service'
import { ControlesService } from 'src/app/services/controles.service'
import { NewmodalService } from 'src/app/services/newmodal.service'
import { SeguridadService } from 'src/app/services/seguridad.service'
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { PaginationService } from 'src/app/services/pagination.service'
import { MatBottomSheet } from '@angular/material/bottom-sheet'

@Component({
  selector: 'app-carga-masiva-capacitaciones',
  templateUrl: './carga-masiva-capacitaciones.component.html',
  styleUrls: ['./carga-masiva-capacitaciones.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class CargaMasivaCapacitacionesComponent implements OnInit {
  @ViewChild('drawer') sideNav: any
  modulo: string = 'LEGAJOS'
  route: string = 'legajo'
  title: string = 'Control de Legajos - Carga Masiva Capacitación'
  public regCapacitacion: LegCapacitaciones
  public lstInstitucion: Persona[] = []
  public filterInst: any
  today: Date | undefined
  public FormGroup: FormGroup
  dateFechaInicio: any
  dateFechaFin: any
  fileData: File[] = <File[]>{}
  previewUrl: any = './.assets/images/certdefault.jpg'
  erradjunto: boolean = false
  myControl = new FormControl()
  filteredOptions!: Observable<Persona[]>
  errcodigo: boolean = false
  mensajeCargaMasiva: string = ''
  codigosPersonaRegistro: string = ''
  public fecha_minima: any

  constructor(
    public dialogRef: MatDialogRef<CargaMasivaCapacitacionesComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    public sidenavservc: SidenavService,
    public nvoservc: NewService,
    public ctrlserv: ControlesService,
    public mdlserv: NewmodalService,
    public segserv: SeguridadService,
    public segurserv: SeguridadService,
    private router: Router,
    private sanitizer: DomSanitizer,
    public pageService: PaginationService,
    private _bottomSheet: MatBottomSheet,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: 'Carca de Capacitaciones masivas.'
      id: 0
      formacion: LegCapacitaciones
      docente: true
      Leg_cPerCodigo: string
    },
    private spinner: NgxSpinnerService,
  ) {
    this.today = new Date()
    this.dateFechaInicio = new FormControl(new Date(''))
    this.dateFechaFin = new FormControl(new Date(''))
    this.regCapacitacion = this.clmdserv.empty_capacitaciones()
    this.FormGroup = this._formBuilder.group({
      paisControl: ['', Validators.required],
      horasControl: ['', Validators.required],
      tipocapControl: ['', Validators.required],
      especialidadControl: ['', Validators.required],
      nombreCapacitacionControl: ['', Validators.required],
      otraControl: [''],
    })
  }

  ngOnInit(): void {
    this.listar_ubigeo()
    let vpais: Interface = this.clmdserv.empty_interface()

    vpais = this.lstserv.lubigeo.filter(
      (x) => x.cIntJerarquia.trim() == this.data.formacion.cLegCapPais,
    )[0]

    this.listar_tipocap()
    this.listar_especialidadcap()
    this.listar_archivos()
    this.listar_universidad()
    this.listar_ubigeo()

    // vpais = this.lstserv.lubigeo.filter(
    //   (x) => x.cIntJerarquia.trim() == this.data.formacion.cLegCapPais,
    // )[0]
    this.fecha_minima = new Date(
      new Date().getFullYear() - 5,
      new Date().getMonth(),
      new Date().getDate(),
    )

    // if (this.data.id > 0 && this.data.formacion.nLegCapCodigo > 0) {
    //   this.regCapacitacion = this.data.formacion
    //   vpais = this.lstserv.lubigeo.filter(
    //     (x) => x.cIntJerarquia.trim() == this.data.formacion.cLegCapPais,
    //   )[0]

    //   paisuniv = vpais.nIntCodigo
    //   this.universidadOnChange(vpais)
    //   this.FormGroup.setValue({
    //     paisControl: paisuniv,
    //     tipocapControl: this.data.formacion.vTipo.nConValor,
    //     especialidadControl: this.data.formacion.vTipoEsp.nConValor,
    //     horasControl: this.data.formacion.nLegCapHoras,
    //     nombreCapacitacionControl: this.data.formacion.cLegCapNombre,
    //     otraControl: this.data.formacion.cLegCapOtraInst,
    //   })
    //   if (this.regCapacitacion.cLegCapOtraInst.trim() != '') {
    //     this.regCapacitacion.vInstitucion = this.clmdserv.empty_persona()
    //     this.regCapacitacion.cLegCapInstitucion = this.clmdserv.codigonoinst
    //   }
    //   this.regCapacitacion.cFile = this.data.formacion.cLegCapArchivo
    //   this.erradjunto =
    //     this.data.formacion.cLegCapArchivo != null &&
    //     this.data.formacion.cLegCapArchivo != ''
    //       ? true
    //       : false
    //   this.myControl.setValue(this.data.formacion.vInstitucion.cPerNombre)
    //   this.dateFechaInicio = new FormControl(
    //     new Date(this.data.formacion.dLegCapFechaInicio),
    //   )
    //   this.dateFechaFin = new FormControl(
    //     new Date(this.data.formacion.dLegCapFechaFin),
    //   )
    // } else {
    //   this.universidadOnChange(null)
    // }
  }
  ngAfterViewInit(): any {
    this.sidenavservc.abrirmenu(this.sideNav)
    this.nvoservc.registro = () => {
      this.guardar()
    }
  }
  listar_tipocap() {
    this.lstserv
      .listado('constante', '/' + this.configserv.nConTipoCapacitacion)
      .then((data) => {
        let ltipo: Constante[] = data
        this.lstserv.lTipoCap = ltipo.filter((x) => x.nConValor != 0)
      })
  }

  listar_especialidadcap() {
    this.lstserv
      .listado(
        'constante',
        '/' +
          (this.data.docente
            ? this.configserv.nConTipoEspeCap
            : this.configserv.nConTipoDuracion),
      )
      .then((data) => {
        let ltipo: Constante[] = data
        this.lstserv.lEspecialidadCap = ltipo.filter((x) => x.nConValor != 0)
      })
  }

  listar_archivos() {
    this.lstserv
      .listado('legarchivos_lst', '/' + this.data.Leg_cPerCodigo)
      .then((data) => {
        this.lstserv.lArchivos = data
      })
  }

  async fileProgress(fileInput: any): Promise<any> {
    let codigo = ''
    this.fileData = []
    this.spinner.show()
    this.errcodigo = false
    this.erradjunto = false

    if (fileInput != null) {
      for (let i = 0; i < fileInput.target.files.length; i++) {
        // console.log(fileInput.target.files[i])
        let ext =
          fileInput.target.files[i].name.length -
          fileInput.target.files[i].name.lastIndexOf('.')
        this.fileData.push(<File>fileInput.target.files[i])
        if (codigo == '' || codigo == '') {
          codigo += fileInput.target.files[i].name.slice(0, -ext)
        } else {
          codigo += ',' + fileInput.target.files[i].name.slice(0, -ext)
        }
      }
      this.preview()
      // this.regParticipacion.cLegParArchivo = <File>fileInput.target.files[0];
    } else {
      this.fileData = []
      this.erradjunto = false
    }

    if ((await this.lstserv.validar_codigo_personas(codigo)) == false) {
      this.mensajeCargaMasiva = 'Algún código no se encuentra registrado.'
      this.errcodigo = true
      this.spinner.hide()
    } else {
      this.errcodigo = false
      this.erradjunto = true
      this.mensajeCargaMasiva = 'Archivos cargados satisfactoriamente.'
      this.codigosPersonaRegistro = codigo
      this.spinner.hide()
    }
  }
  preview(): void {
    // Show preview
    this.fileData.forEach((element) => {
      const mimeType = element.type
      if (
        mimeType.match(/image\/*/) == null &&
        mimeType.match(/pdf\/*/) == null
      ) {
        this.erradjunto = true
        this.erradjunto = false
        this.mensajeCargaMasiva =
          'Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).'
        return
      }

      const reader = new FileReader()
      reader.readAsDataURL(element)
    })
  }

  cargardata() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.c)),
      map((cPerNombre) =>
        cPerNombre
          ? this._filter(cPerNombre)
          : this.lstInstitucion.slice(0, 100),
      ),
    )
  }

  displayFn(inst: Persona): string {
    return inst && inst.cPerNombre ? inst.cPerNombre : ''
  }

  private _filter(name: string): Persona[] {
    const filterValue = name.toLowerCase()
    return this.lstInstitucion
      .filter((option) => option.cPerNombre.toLowerCase().includes(filterValue))
      .slice(0, 100)
  }

  handleModelChange(e: any, tipo: number) {
    if (e == '') {
      switch (tipo) {
        case 1:
          this.regCapacitacion.cLegCapInstitucion = ''
          break
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
        this.lstInstitucion = this.lstserv.lUniversidad.filter(
          (x) => x.cUbigeoCodigo.trim() == $obj.cIntJerarquia.trim(),
        )
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      } else {
        this.regCapacitacion.cLegCapPais = 'PER'
        this.lstInstitucion = this.lstserv.lUniversidad.filter(
          (x) => x.cUbigeoCodigo.length > 3,
        )
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      }
      this.lstInstitucion.push(this.clmdserv.empty_persona())
      this.cargardata()
    }
  }
  customerOnChange($obj: any, tipo: number) {
    if ($obj == null) {
      switch (tipo) {
        case 1:
          this.regCapacitacion.cLegCapInstitucion = ''
          this.regCapacitacion.vInstitucion = this.clmdserv.empty_persona()
          break
        case 2:
          this.regCapacitacion.nLegCapTipo = 0
          this.regCapacitacion.nValorTipo = 0
          this.regCapacitacion.vTipo = this.clmdserv.empty_constante()
          break
        case 3:
          this.regCapacitacion.nLegCapTipoEsp = 0
          this.regCapacitacion.nValorTipoEsp = 0
          this.regCapacitacion.vTipoEsp = this.clmdserv.empty_constante()
          break
      }
    } else {
      switch (tipo) {
        case 1:
          if ($obj.cPerCodigo != this.clmdserv.codigonoinst) {
            this.regCapacitacion.cLegCapInstitucion = $obj.cPerCodigo
            this.regCapacitacion.vInstitucion = $obj
          } else {
            this.regCapacitacion.cLegCapInstitucion = this.clmdserv.codigonoinst
            this.regCapacitacion.vInstitucion = this.clmdserv.empty_persona()
          }
          break
        case 2:
          this.regCapacitacion.nLegCapTipo = $obj.nConCodigo
          this.regCapacitacion.nValorTipo = $obj.nConValor
          this.regCapacitacion.vTipo = $obj
          break
        case 3:
          this.regCapacitacion.nLegCapTipoEsp = $obj.nConCodigo
          this.regCapacitacion.nValorTipoEsp = $obj.nConValor
          this.regCapacitacion.vTipoEsp = $obj
          break
      }
    }
  }

  guardar() {
    if (this.FormGroup.status.valueOf() == 'INVALID') {
      this.valserv.mensaje_info('Complete los campos solicitados.')
      return
    } else if (this.regCapacitacion.cLegCapInstitucion.trim() == '') {
      this.valserv.mensaje_info('Seleccione institución.')
      return
    } else if (this.dateFechaInicio.status.valueOf() == 'INVALID') {
      this.valserv.mensaje_info('Ingrese fecha de inicio válida.')
      return
    } else if (this.dateFechaFin.status.valueOf() == 'INVALID') {
      this.valserv.mensaje_info('Ingrese fecha de fin válida.')
      return
    } else if (this.dateFechaInicio.value > this.dateFechaFin.value) {
      this.valserv.mensaje_info(
        'La fecha inicio no puede ser posterior a la fecha fin.',
      )
      return
    }

    if (this.fileData.length == null) {
      this.valserv.mensaje_info(
        'Adjunte archivo que valide la información registrada.',
      )
      return
    }

    var formData = new FormData()
    let fecha: any
    formData.append(
      'nLegCapCodigo',
      this.regCapacitacion.nLegCapCodigo.toString() ?? '0',
    )
    formData.append(
      'cLegCapInstitucion',
      this.regCapacitacion.cLegCapInstitucion == this.clmdserv.codigonoinst
        ? ''
        : this.regCapacitacion.cLegCapInstitucion.toString() ?? '',
    )
    formData.append(
      'cLegCapPais',
      this.regCapacitacion.cLegCapPais.toString() ?? '',
    )
    formData.append(
      'cLegCapOtraInst',
      this.regCapacitacion.cLegCapInstitucion != this.clmdserv.codigonoinst
        ? ''
        : this.FormGroup.get('otraControl')?.value ?? '',
    )
    formData.append(
      'cLegCapNombre',
      this.FormGroup.get('nombreCapacitacionControl')?.value ?? '0',
    )
    formData.append(
      'nLegCapTipo',
      this.regCapacitacion.nLegCapTipo.toString() ?? '0',
    )
    formData.append(
      'nValorTipo',
      this.regCapacitacion.nValorTipo.toString() ?? '0',
    )
    formData.append(
      'nLegCapTipoEsp',
      this.regCapacitacion.nLegCapTipoEsp.toString() ?? '0',
    )
    formData.append(
      'nValorTipoEsp',
      this.regCapacitacion.nValorTipoEsp.toString() ?? '0',
    )
    formData.append(
      'nLegCapHoras',
      this.FormGroup.get('horasControl')?.value ?? '0',
    )
    fecha = this.configserv.datepipe.transform(
      this.dateFechaInicio.value,
      'yyyy-MM-dd',
    )
    formData.append('dLegCapFechaInicio', fecha)
    fecha = this.configserv.datepipe.transform(
      this.dateFechaFin.value,
      'yyyy-MM-dd',
    )
    for (let i = 0; i < this.fileData.length; i++) {
      formData.append('cFiles', this.fileData[i])
    }
    formData.append('cLegCapArchivo', '')
    formData.append('CUsuRegistro', this.segurserv.usuarioreg.cPerCodigo)
    formData.append('CUsuModifica', this.segurserv.usuarioreg.cPerCodigo)
    formData.append('cLegCapValida', 'false')
    formData.append('cLegCapEstado', 'true')

    this.regserv.registroFile(
      'Registro de Legajos',
      'capacitacion/reg_masivo_cap',
      formData,
    )
  }
  listar_ubigeo() {
    this.ctrlserv._banregister = true
    this.spinner.show()
    this.lstserv
      .listado('interface', '/' + this.configserv.nIntUbigeo)
      .then((data) => {
        let lubigeo: Interface[] = data
        this.lstserv.lubigeo = lubigeo.filter((x) => x.nIntCodigo != 0)
        this.lstserv.lnacionalidad = this.lstserv.lubigeo.filter(
          (x) => x.cIntJerarquia.trim().length == 3,
        )
        this.lstserv.lpaisNac = this.lstserv.lnacionalidad
        this.lstserv.filterpais = this.lstserv.lpaisNac.slice()
        this.lstserv.ldepartamento = this.lstserv.lubigeo.filter(
          (x) => x.cIntJerarquia.trim().length == 2,
        )
        this.segserv.obtenerdatosusuario()
        // this.editar_cv(this.segserv.usuarioreg)

        this.spinner.hide()
      })
  }
  listar_universidad() {
    this.lstserv
      .listado('persona', '/' + this.configserv.nPerUniversidad)
      .then((data) => {
        var $lUniversidad1: Persona[] = data
        let cont = 0
        for (let i = 0; i < $lUniversidad1.length; i++) {
          let obj: Persona
          if ($lUniversidad1[i].cPerApellido == 'Otra') {
          } else {
            obj = {
              cPerCodigo: $lUniversidad1[i].cPerCodigo,
              cPerApellido: $lUniversidad1[i].cPerApellido,
              cPerApellPat: $lUniversidad1[i].cPerApellPat,
              cPerNombre: $lUniversidad1[i].cPerNombre,
              dPerNacimiento: $lUniversidad1[i].dPerNacimiento,
              nPerTipo: $lUniversidad1[i].nPerTipo,
              nPerEstado: $lUniversidad1[i].nPerEstado,
              cUbigeoCodigo: $lUniversidad1[i].cUbigeoCodigo,
              cperestadobiblio: $lUniversidad1[i].cperestadobiblio,
              nUbiGeoCodigo: $lUniversidad1[i].nUbiGeoCodigo,
            }
            this.lstserv.lUniversidad[cont] = obj
            cont++
          }
        }
      })
  }
}
