import { isNull, THIS_EXPR } from '@angular/compiler/src/output/output_ast'
import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms'
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core'
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { isEmpty, map, startWith } from 'rxjs/operators'
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from 'src/app/helpers/format-datepicker'
import { Curriculo } from 'src/app/models/curriculo'
import { Formacion } from 'src/app/models/formacion'
import { Constante } from 'src/app/models/general/constante'
import { Interface } from 'src/app/models/general/interface'
import { Persona } from 'src/app/models/general/persona'
import { GradoAcademico } from 'src/app/models/gradoacademico'
import { LegAdminitrativaCarga } from 'src/app/models/legajo/leg-adminitrativa-carga'
import { LegCapacitaciones } from 'src/app/models/legajo/leg-capacitaciones'
import { LegCategoriaDocente } from 'src/app/models/legajo/leg-categoria-docente'
import { LegDatosGenerales } from 'src/app/models/legajo/leg-datos-generales'
import { LegDocenciaUniv } from 'src/app/models/legajo/leg-docencia-univ'
import { LegGradoTitulo } from 'src/app/models/legajo/leg-grado-titulo'
import { LegIdiomaOfimatica } from 'src/app/models/legajo/leg-idioma-ofimatica'
import { LegInvestigador } from 'src/app/models/legajo/leg-investigador'
import { LegParticipacionCongSem } from 'src/app/models/legajo/leg-participacion-cong-sem'
import { LegProduccionCiencia } from 'src/app/models/legajo/leg-produccion-ciencia'
import { LegProfesNoDocente } from 'src/app/models/legajo/leg-profes-no-docente'
import { LegProyeccionSocial } from 'src/app/models/legajo/leg-proyeccion-social'
import { LegReconocimiento } from 'src/app/models/legajo/leg-reconocimiento'
import { LegRegimenDedicacion } from 'src/app/models/legajo/leg-regimen-dedicacion'
import { LegTesisAseJur } from 'src/app/models/legajo/leg-tesis-ase-jur'
import { Ubigeo } from 'src/app/models/ubigeo'
import { CleanmodelService } from 'src/app/services/cleanmodel.service'
import { ConfiguracionService } from 'src/app/services/configuracion.service'
import { ControlesService } from 'src/app/services/controles.service'
import { ListService } from 'src/app/services/list.service'
import { NewService } from 'src/app/services/new.service'
import { NewmodalService } from 'src/app/services/newmodal.service'
import { RegisterService } from 'src/app/services/register.service'
import { SeguridadService } from 'src/app/services/seguridad.service'
import { SidenavService } from 'src/app/services/sidenav.service'
import { environment } from 'src/environments/environment'
import Swal from 'sweetalert2'
import { NgxSpinnerService } from 'ngx-spinner'
import { DatosUsuario } from 'src/app/models/usuario'
import { PageEvent } from '@angular/material/paginator'
import { PaginationService } from 'src/app/services/pagination.service'
import { ValidateService } from 'src/app/services/validate.service'
import { LegCapacitacionInterna } from 'src/app/models/legajo/leg-capacitacion-interna'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
// import { MensajelegajoComponent } from './mensajelegajo/mensajelegajo.component';
import { LegContrato } from 'src/app/models/legajo/leg-contrato'
import { LegResolucion } from 'src/app/models/legajo/leg-resolucion'
import { LegEvaluacionDesemp } from 'src/app/models/legajo/leg-eval-desempeño'
import { LegSeleccion } from 'src/app/models/legajo/leg-seleccion'
import { LegOrdinarizacion } from 'src/app/models/legajo/leg-ordinarizacion'
// import { LegDeclaracionJurada } from 'src/app/models/legajo/leg-declaracion-jurada';
import { LegDocumentacionInterna } from 'src/app/models/legajo/leg-documentacion-interna'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
@Component({
  selector: 'app-cargamasiva',
  templateUrl: './cargamasiva.component.html',
  styleUrls: ['./cargamasiva.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class CargamasivaComponent implements OnInit {
  @ViewChild('drawer') sideNav: any
  modulo: string = 'LEGAJOS'
  title: string = 'Control de Legajos - Carga Masiva Participación'
  route: string = 'legajo'
  dateFecha: any
  dateFechaFin: any
  fileData: File[] = <File[]>{}
  erradjunto: boolean = false
  errcodigo: boolean = false
  codigosPersonaRegistro: string = ''
  today: Date | undefined
  mensajeCargaMasiva: string = ''
  previewUrl: any = environment.PHOTODEFAULT
  public fecha_minima: any
  public FormGroup11: FormGroup
  public tabind: number = 0
  bValidar: number = 0
  public regParticipacion: LegParticipacionCongSem
  filteredOptions!: Observable<Persona[]>
  public lstInstitucion: Persona[] = []
  myControl = new FormControl()
  public FormGroup: FormGroup

  constructor(
    public sidenavservc: SidenavService,
    public nvoservc: NewService,
    public ctrlserv: ControlesService,
    public lstserv: ListService,
    public regserv: RegisterService,
    public clmdserv: CleanmodelService,
    public mdlserv: NewmodalService,
    public configserv: ConfiguracionService,
    public segserv: SeguridadService,
    public segurserv: SeguridadService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    public valserv: ValidateService,
    public pageService: PaginationService,
    private _bottomSheet: MatBottomSheet,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: 'Carga Masiva'
      id: 0
      formacion: LegParticipacionCongSem
      Leg_cPerCodigo: string
    },
  ) {
    this.today = new Date()
    this.dateFecha = new FormControl(new Date(''))
    this.dateFechaFin = new FormControl(new Date(''))
    this.FormGroup11 = this._formBuilder.group({})
    // this.regLegDatosGenerales = clmdserv.empty_datosgenerales()
    this.today = new Date()
    this.regParticipacion = this.clmdserv.empty_participacion()
    this.FormGroup = this._formBuilder.group({
      paisControl: ['', Validators.required],
      horasControl: ['', Validators.required],
      ambitoControl: ['', Validators.required],
      rolControl: ['', Validators.required],
      nombreEventoControl: ['', Validators.required],
      otraControl: [''],
    })
  }

  ngOnInit(): void {
    let vpais: Interface = this.clmdserv.empty_interface()
    vpais = this.lstserv.lubigeo.filter(
      (x) => x.cIntJerarquia.trim() == this.data.formacion.cLegParPais,
    )[0]
    this.ctrlserv._banregister = true
    this.universidadOnChange(vpais)
    this.listar_rolpart()
    this.listar_ambitopart()
    this.listar_universidad()
    this.listar_ubigeo()
  }
  ngAfterViewInit(): any {
    this.sidenavservc.abrirmenu(this.sideNav)
    this.nvoservc.registro = () => {
      this.guardar()
    }
  }
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.tabind = tabChangeEvent.index
    this.fecha_minima = new Date(
      new Date().getFullYear() - 5,
      new Date().getMonth(),
      new Date().getDate(),
    )
  }

  acciones(codigo: number, datos: DatosUsuario) {
    this.bValidar = 0
  }
 
  customerOnChange($obj: any, tipo: number) {
    if ($obj == null) {
      switch (tipo) {
        case 1:
          this.regParticipacion.cLegParInstitucion = ''
          this.regParticipacion.cLegParInstitucionNavigation = this.clmdserv.empty_persona()
          break
        case 2:
          this.regParticipacion.nLegParRol = 0
          this.regParticipacion.nValorRol = 0
          this.regParticipacion.vRol = this.clmdserv.empty_interface()
          break
        case 3:
          this.regParticipacion.nLegParAmbito = 0
          this.regParticipacion.nValorAmbito = 0
          this.regParticipacion.vAmbito = this.clmdserv.empty_interface()
          break
      }
    } else {
      switch (tipo) {
        case 1:
          if ($obj.cPerCodigo != this.clmdserv.codigonoinst) {
            this.regParticipacion.cLegParInstitucion = $obj.cPerCodigo
            this.regParticipacion.cLegParInstitucionNavigation = $obj
          } else {
            this.regParticipacion.cLegParInstitucion = this.clmdserv.codigonoinst
            this.regParticipacion.cLegParInstitucionNavigation = this.clmdserv.empty_persona()
          }
          break
        case 2:
          this.regParticipacion.nLegParRol = $obj.nIntClase
          this.regParticipacion.nValorRol = $obj.nIntCodigo
          this.regParticipacion.vRol = $obj
          break
        case 3:
          this.regParticipacion.nLegParAmbito = $obj.nIntClase
          this.regParticipacion.nValorAmbito = $obj.nIntCodigo
          this.regParticipacion.vAmbito = $obj
          break
      }
    }
  }
  eliminar_validar_participacion(
    $obg: LegParticipacionCongSem,
    bvalel: boolean,
  ) {
    Swal.fire({
      title: 'Registro de Legajos',
      text: bvalel
        ? '¿Está seguro de eliminar registro?'
        : '¿Está seguro de validar registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if ($obg.nLegParCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegParEstado' : '/cLegParValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'participacion/' + $obg.nLegParCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_participacion($obg.nLegParDatCodigo)
            })
        } else {
          var index = this.lstserv.lParticipacion.indexOf($obg)
          this.lstserv.lParticipacion.splice(index, 1)
        }
      }
    })
  }

  displayFn(inst: Persona): string {
    return inst && inst.cPerNombre ? inst.cPerNombre : ''
  }
  handleModelChange(e: any, tipo: number) {
    if (e == '') {
      switch (tipo) {
        case 1:
          this.regParticipacion.cLegParInstitucion = ''
          break
      }
    }
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

  private _filter(name: string): Persona[] {
    const filterValue = name.toLowerCase()
    return this.lstInstitucion
      .filter((option) => option.cPerNombre.toLowerCase().includes(filterValue))
      .slice(0, 100)
  }

  universidadOnChange($obj: any) {
    this.myControl.setValue('')
    if ($obj == null) {
      this.lstInstitucion = []
    } else {
      if ($obj.cIntJerarquia.trim() != 'PER') {
        this.regParticipacion.cLegParPais = $obj.cIntJerarquia.trim()
        this.lstInstitucion = this.lstserv.lUniversidad.filter(
          (x) => x.cUbigeoCodigo.trim() == $obj.cIntJerarquia.trim(),
        )
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      } else {
        this.regParticipacion.cLegParPais = 'PER'

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

  async fileProgress(fileInput: any): Promise<any> {
    let codigo = ''
    this.fileData = []
    this.spinner.show()
    this.errcodigo = false
    this.erradjunto = false
    if (fileInput != null) {
      for (let i = 0; i < fileInput.target.files.length; i++) {
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
        ;
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

  listar_rolpart() {
    this.lstserv
      .listado('interface', '/' + this.configserv.nConRolCong)
      .then((data) => {
        let ltipo: Interface[] = data
        this.lstserv.lRolPart = ltipo.filter((x) => x.nIntClase != 0)
      })
  }

  listar_ambitopart() {
    this.lstserv
      .listado('interface', '/' + this.configserv.nConAmbitoCong)
      .then((data) => {
        let ltipo: Interface[] = data
        this.lstserv.lAmbitoPart = ltipo.filter((x) => x.nIntClase != 0)
      })
  }

  listar_ubigeo() {
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
        this.spinner.hide()
      })
  }
  guardar() {
    try {
      if (this.FormGroup.status.valueOf() == 'INVALID') {
        // this.stepper.selectedIndex = 0
        this.valserv.mensaje_info('Complete los campos solicitados.')
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
      let fechaFin: any

      fecha = this.configserv.datepipe.transform(
        this.dateFecha.value,
        'yyyy-MM-dd',
      )
      fechaFin = this.configserv.datepipe.transform(
        this.dateFechaFin.value,
        'yyyy-MM-dd',
      )

      for (let i = 0; i < this.fileData.length; i++) {
        formData.append('cFiles', this.fileData[i])
      }

      formData.append(
        'NLegParRol',
        this.regParticipacion.nLegParRol.toString() ?? '0',
      )
      formData.append(
        'NLegParAmbito',
        this.regParticipacion.nLegParAmbito.toString() ?? '0',
      )
      formData.append(
        'nValorAmbito',
        this.regParticipacion.nValorAmbito.toString() ?? '0',
      )
      formData.append(
        'CLegParNombre',
        this.FormGroup.get('nombreEventoControl')?.value ?? '',
      )
      formData.append('DLegParFecha', fecha ?? '0')
      formData.append('DLegParFechaFin', fechaFin ?? '0')
      formData.append(
        'NLegParDatCodigo',
        this.regParticipacion.nLegParDatCodigo.toString() ?? '0',
      )
      formData.append(
        'CLegParOtraInst',
        this.regParticipacion.cLegParOtraInst.toString() ?? '0',
      )
      formData.append(
        'CLegParPais',
        this.regParticipacion.cLegParPais.toString() ?? '0',
      )
      formData.append(
        'NLegParHoras',
        this.regParticipacion.nLegParHoras.toString() ?? '0',
      )
      formData.append(
        'cLegParInstitucion',
        this.regParticipacion.cLegParInstitucion.toString() ?? '0',
      )
      formData.append(
        'nValorRol',
        this.regParticipacion.nValorRol.toString() ?? '0',
      )
      formData.append('cLegParValida', 'false')
      formData.append('cLegParEstado', 'true')

      this.regserv.registarCargaMasiva(
        'Registro',
        'participacion/registrarCargaMasiva',
        formData,
      )
    } catch (e) {
      this.spinner.hide()
      console.log(e)
    }
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
