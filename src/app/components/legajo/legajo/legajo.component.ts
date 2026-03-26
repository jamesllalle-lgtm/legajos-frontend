import { isNull, THIS_EXPR } from '@angular/compiler/src/output/output_ast'
import { Component, OnInit, ViewChild } from '@angular/core'
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
import { filter, isEmpty, map, startWith } from 'rxjs/operators'
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
import { MensajelegajoComponent } from './mensajelegajo/mensajelegajo.component'
import { LegContrato } from 'src/app/models/legajo/leg-contrato'
import { LegResolucion } from 'src/app/models/legajo/leg-resolucion'
import { LegEvaluacionDesemp } from 'src/app/models/legajo/leg-eval-desempeño'
import { LegSeleccion } from 'src/app/models/legajo/leg-seleccion'
import { LegOrdinarizacion } from 'src/app/models/legajo/leg-ordinarizacion'
import { LegDeclaracionJurada } from 'src/app/models/legajo/leg-declaracion-jurada'
import { LegDocumentacionInterna } from 'src/app/models/legajo/leg-documentacion-interna'
import { MatTabChangeEvent } from '@angular/material/tabs'
@Component({
  selector: 'app-legajo',
  templateUrl: './legajo.component.html',
  styleUrls: ['./legajo.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class LegajoComponent implements OnInit {
  @ViewChild('drawer') sideNav: any
  @ViewChild('stepper') stepper: any
  @ViewChild('stepper2') stepper2: any
  @ViewChild('stepper3') stepper3: any
  modulo: string = 'LEGAJOS'
  title: string = 'Control de Legajos'
  codigoMod: number = 1
  route: string = 'legajo'
  bValidar: number = 0
  dataglobal: DatosUsuario[] = []
  pageEvent: PageEvent = new PageEvent()
  photoControl: FormControl
  registrosuneduControl: FormControl
  policialControl: FormControl
  judicialControl: FormControl
  anexo2Control: FormControl
  anexo6Control: FormControl
  anexo7Control: FormControl
  public errregsunedu: boolean = false
  public errpolicial: boolean = false
  public errjudicial: boolean = false
  public erranexo2: boolean = false
  public erranexo6: boolean = false
  public erranexo7: boolean = false
  public discapacidadFlag: boolean = false
  public otraDiscapacidadFlag: boolean = false
  registrosbuenasalud: FormControl
  public errregbuenasalud: boolean = false
  public errregconadis: boolean = false
  fileData: File = <File>{}
  fileDataCert: File = <File>{}
  previewUrl: any = environment.PHOTODEFAULT
  previewCertUrl: any = environment.CERTDEFAULT
  previewFirmaUrl: any = environment.FIRMADEFAULT
  isMobile = false
  public photo: any
  today: Date | undefined
  date: any
  dateFEmi: any
  dateFExp: any
  edad: String = '0 años'
  ban_colegio: boolean = false
  ban_administrativo: boolean = false
  public regLegDatosGenerales: LegDatosGenerales
  public tabind: number = 0
  public nTieneDiscapacidad: number = 0
  public nTipoDiscapacidad: number = 0

  public lstGradoAcademico: GradoAcademico[] = []
  public lstCurriculos: Curriculo[] = []
  public lstTieneDiscapacidad: Interface[] = []
  public lstTipoDiscapacidad: Interface[] = []
  isLinear = false
  public FormGroupAD: FormGroup
  public FormGroup1: FormGroup
  public FormGroup2: FormGroup
  public FormGroup3: FormGroup
  public FormGroup4: FormGroup
  public FormGroup5: FormGroup
  public FormGroup6: FormGroup
  public FormGroup7: FormGroup
  public FormGroup8: FormGroup
  public FormGroup9: FormGroup
  public FormGroup10: FormGroup
  public FormGroup11: FormGroup
  public FormGroup12: FormGroup
  public FormGroup13: FormGroup
  public FormGroup14: FormGroup
  public FormGroup15: FormGroup
  public FormGroup16: FormGroup
  public EndFormGroup: FormGroup
  public departamento: String = ''
  public FormGroup2_1: FormGroup
  public FormGroup2_2: FormGroup
  public FormGroup2_3: FormGroup
  public FormGroup2_4: FormGroup
  public FormGroup2_5: FormGroup
  public FormGroup2_6: FormGroup
  public FormGroup3_DJ: FormGroup
  public FormGroup3_DI: FormGroup
  public provincia: String = ''
  public distrito: String = ''
  myControl = new FormControl()
  filteredOptions!: Observable<Persona[]>
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
  ) {
    this.FormGroup1 = this._formBuilder.group({
      apellidopaternoControl: ['', Validators.required],
      apellidomaternoControl: ['', Validators.required],
      nombresControl: ['', Validators.required],
      emailControl: [
        '',
        Validators.required,
        '',
        Validators.maxLength(50),
        '',
        Validators.email,
      ],
      telefonoControl: ['', Validators.maxLength(25)],
      movilControl: ['', Validators.maxLength(25), '', Validators.required],
      departamentoControl: ['', Validators.required],
      provinciaControl: ['', Validators.required],
      distritoControl: ['', Validators.required],
      paisNacControl: [''],
      departamentoNacControl: [''],
      provinciaNacControl: [''],
      distritoNacControl: [''],
      edadControl: [''],
      gradoacademicoControl: ['', Validators.required],
      nacionalidadControl: ['', Validators.required],
      tipodocumentoControl: ['', Validators.required],
      nrodocumentoControl: ['', Validators.required],
      sexoControl: ['', Validators.required],
      estadocivilControl: ['', Validators.required],
      tipodomicilioControl: ['', Validators.required],
      zonaControl: ['', Validators.required],
      direccionControl: [
        '',
        Validators.required,
        '',
        Validators.maxLength(150),
      ],
      numeroControl: [''],
      dptoControl: [''],
      mzaControl: [''],
      lteControl: [''],
      referenciaControl: [''],
      idiomaNativoControl: [''],
    })
    this.FormGroup2 = this._formBuilder.group({
      colegioprofControl: [''],
      condicionControl: [''],
      colegionroControl: [''],
    })
    this.registrosbuenasalud = new FormControl(this.photo)
    this.FormGroupAD = this._formBuilder.group({
      nLegDatDiscapacidad: ['', Validators.required],
      nLegDatTipoDiscapacidad: [''],
      cLegDatOtraDiscapcidad: [''],
      cLegDatArchivoConadis: [''],
    })
    this.FormGroup3 = this._formBuilder.group({})
    this.FormGroup4 = this._formBuilder.group({})
    this.FormGroup5 = this._formBuilder.group({})
    this.FormGroup6 = this._formBuilder.group({})
    this.FormGroup7 = this._formBuilder.group({})
    this.FormGroup8 = this._formBuilder.group({})
    this.FormGroup9 = this._formBuilder.group({})
    this.FormGroup10 = this._formBuilder.group({})
    this.FormGroup11 = this._formBuilder.group({})
    this.FormGroup12 = this._formBuilder.group({})
    this.FormGroup13 = this._formBuilder.group({})
    this.FormGroup14 = this._formBuilder.group({})
    this.FormGroup15 = this._formBuilder.group({})
    this.FormGroup16 = this._formBuilder.group({})
    this.FormGroup2_1 = this._formBuilder.group({})
    this.FormGroup2_2 = this._formBuilder.group({})
    this.FormGroup2_3 = this._formBuilder.group({})
    this.FormGroup2_4 = this._formBuilder.group({})
    this.FormGroup2_5 = this._formBuilder.group({})
    this.FormGroup2_6 = this._formBuilder.group({})
    this.FormGroup3_DJ = this._formBuilder.group({})
    this.FormGroup3_DI = this._formBuilder.group({})
    this.EndFormGroup = this._formBuilder.group({
      acercaControl: ['', Validators.maxLength(200)],
    })
    this.photoControl = new FormControl(this.photo)
    this.registrosuneduControl = new FormControl(this.photo)
    this.policialControl = new FormControl(this.photo)
    this.judicialControl = new FormControl(this.photo)
    this.anexo2Control = new FormControl(this.photo)
    this.anexo6Control = new FormControl(this.photo)
    this.anexo7Control = new FormControl(this.photo)
    this.date = new FormControl(new Date(''))
    this.dateFEmi = new FormControl(new Date(''))
    this.dateFExp = new FormControl(new Date(''))
    this.regLegDatosGenerales = clmdserv.empty_datosgenerales()
    if (this.segserv.conexionactiva()) {
      this.spinner.show()
      this.segserv.obtenerdatosusuario()
      this.listar_tareaspermiso()

      this.pageService.dataSource = []
      this.pageEvent.length = 0
      this.pageEvent.pageIndex = 0
      this.pageEvent.pageSize = 10
      this.ctrlserv._banregister =
        this.segserv.usuarioreg.nRol == 1 ? false : true

      this.today = new Date()

      this.ctrlserv._banregister = true
      // if(this.segserv.usuarioreg.nRol==1){
      //   this.ctrlserv._banregister = false
      // }else{
      //   this.ctrlserv._banregister = true
      // }
    } else {
      this.router.navigate(['/login'])
    }
  }

  ngOnInit(): void {
    this.FormGroup1.get('edadControl')?.setValue(this.edad)
    this.photoControl.valueChanges.subscribe((files: any) => {
      this.photo = files
      // if (!Array.isArray(files)) {
      //   this.photo = [files];
      // } else {
      //   this.photo = files;
      // }
    })
    this.listar_periodos()
    this.cargar_idioma()

    this.listar_gradoacademico()
    this.listar_tipodocidentidad()
    this.listar_ubigeo()

    this.listar_tipodomicilio()
    this.listar_tipozona()
    this.listar_sexo()
    this.listar_estadocivil()
    this.listar_colegio()
    this.listar_universidad()
    this.listar_condicion()
    this.CargarTieneDiscapacidad()
    this.CargarTipoDiscapacidad()
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.tabind = tabChangeEvent.index
  }

  acciones(codigo: number, datos: DatosUsuario) {
    this.bValidar = 0
    this.ctrlserv.colaboradornombre = ''
    switch (codigo) {
      case this.configserv.nTareaEditarCV:
        this.editar_cv(datos)
        break
      case this.configserv.nTareaTarjeta:
        this.ver_datos(datos)
        break
      case this.configserv.nTareaExportarCV:
        this.exportar(datos)
        break
      case this.configserv.nTareaContrato:
        this.nuevo_contrato(datos)
        break
      case this.configserv.nTareaCapInt:
        this.nuevo_capacitacioninterna(datos)
        break
      case this.configserv.nTareaResolucion:
        this.nuevo_resolucion(datos)
        break
      case this.configserv.nTareaEvaluacionDesemp:
        this.nuevo_evaluaciondsemp(datos)
        break
      case this.configserv.nTareaSeleccion:
        this.nuevo_seleccion(datos)
        break
      case this.configserv.nTareaOrdinarizacion:
        this.nuevo_ordinarizacion(datos)
        break
      case this.configserv.nTareaDocumentacionInterna:
        this.nuevo_documentacioninterna(datos)
        break
      case this.configserv.nTareaExportarLegajo:
        this.lstserv.listado('legajoaux/', datos.cPerCodigo).then((data) => {
          //
          if (JSON.stringify(data) != '[]') {
            if (data.nLegDatCodigo == 0 || data.nLegDatCodigo == null) {
              Swal.fire(
                'Control de Legajos',
                'No se ha encontrado datos generales. Solicite que el colaborador actualice sus datos.',
                'info',
              )
            } else {
              this.exportar_legajo(datos)
            }
          } else {
            Swal.fire(
              'Control de Legajos',
              'No se ha encontrado datos generales. Solicite que el colaborador actualice sus datos.',
              'info',
            )
          }
        })
        break
      case this.configserv.nTareaValidar:
        this.spinner.show()
        this.lstserv.listado('legajoaux/', datos.cPerCodigo).then((data) => {
          //
          if (JSON.stringify(data) != '[]') {
            if (data.nLegDatCodigo == 0 || data.nLegDatCodigo == null) {
              this.spinner.hide()
              Swal.fire(
                'Control de Legajos',
                'No se ha encontrado datos datos generales. Solicite que el colaborador actualice sus datos.',
                'info',
              )
            } else {
              this.bValidar = 12

              this.editar_cv(datos)
            }
          } else {
            this.spinner.hide()
            Swal.fire(
              'Control de Legajos',
              'No se ha encontrado datos generales. Solicite que el colaborador actualice sus datos.',
              'info',
            )
          }
        })
        break
    }
  }

  limpiar_controles() {
    this.regLegDatosGenerales = this.clmdserv.empty_datosgenerales()
    this.lstserv.lAdminitrativaCarga = []
    this.lstserv.lLegGradoTitulo = []
    this.lstserv.lidiomasofimatica = []
    this.lstserv.lidioma = []
    this.lstserv.lofimatica = []
    this.lstserv.lProyeccionSoc = []
    this.lstserv.lCategoriaDocente = []
    this.lstserv.lcapacitaciones = []
    this.lstserv.lReconocimiento = []
    this.lstserv.lProduccionCiencia = []
    this.lstserv.lProfesNoDocente = []
    this.lstserv.linvestigador = []
    this.lstserv.lLegDocenciaUniv = []
    this.lstserv.lRegimenDedic = []
    this.lstserv.lParticipacion = []
    this.lstserv.lTesisAsesJur = []
    this.lstserv.lLegDocenciaUniv = []

    this.lstserv.lCapacitacionInterna = []
    this.lstserv.lResolucion = []
    this.lstserv.lContrato = []
    this.lstserv.lEvaluacionDesemp = []
    this.lstserv.lSeleccion = []
    this.erranexo2 = false
    this.erranexo6 = false
    this.erranexo7 = false
    this.lstserv.lOrdinarizacion = []
    this.lstserv.lDocumentacionInterna = []
    this.errregbuenasalud = false
    this.errregconadis = false
    this.lstserv.LegDeclaracionJurada = this.clmdserv.empty_declaracionjurada()
    this.FormGroup1.get('apellidopaternoControl')?.setValue('')
    this.FormGroup1.get('apellidomaternoControl')?.setValue('')
    this.FormGroup1.get('nombresControl')?.setValue('')
    this.FormGroup1.get('emailControl')?.setValue('')
    this.FormGroup1.get('telefonoControl')?.setValue('')
    this.FormGroup1.get('movilControl')?.setValue('')
    this.FormGroup1.get('gradoacademicoControl')?.setValue(0)
    this.FormGroup1.get('departamentoControl')?.setValue(0)
    this.FormGroup1.get('provinciaControl')?.setValue(0)
    this.FormGroup1.get('distritoControl')?.setValue(0)
    this.FormGroup1.get('departamentoNacControl')?.setValue(0)
    this.FormGroup1.get('provinciaNacControl')?.setValue(0)
    this.FormGroup1.get('distritoNacControl')?.setValue(0)
    this.FormGroup1.get('paisNacControl')?.setValue(0)
    this.FormGroup1.get('edadControl')?.setValue('0 años')
    this.FormGroup1.get('idiomaNativoControl')?.setValue(0)

    this.FormGroup1.get('nacionalidadControl')?.setValue(0)
    this.FormGroup1.get('tipodocumentoControl')?.setValue(0)
    this.FormGroup1.get('nrodocumentoControl')?.setValue('')
    this.FormGroup1.get('sexoControl')?.setValue(0)
    this.FormGroup1.get('estadocivilControl')?.setValue(0)
    this.FormGroup1.get('tipodomicilioControl')?.setValue(0)
    this.FormGroup1.get('zonaControl')?.setValue(0)
    this.FormGroup1.get('direccionControl')?.setValue('')
    this.FormGroup1.get('numeroControl')?.setValue('')
    this.FormGroup1.get('dptoControl')?.setValue('')
    this.FormGroup1.get('mzaControl')?.setValue('')
    this.FormGroup1.get('lteControl')?.setValue('')
    this.FormGroup1.get('referenciaControl')?.setValue('')
    this.EndFormGroup.get('acercaControl')?.setValue('')
    this.FormGroup2.get('colegioprofControl')?.setValue(0)
    this.FormGroup2.get('condicionControl')?.setValue(-1)
    this.FormGroup2.get('colegionroControl')?.setValue('')
    this.FormGroupAD.get('nLegDatDiscapacidad')?.setValue(0)
    this.FormGroupAD.get('nLegDatTipoDiscapacidad')?.setValue(0)
    this.FormGroupAD.get('cLegDatOtraDiscapcidad')?.setValue('')

    this.date = new FormControl(new Date(''))
    this.dateFEmi = new FormControl(new Date(''))
    this.dateFExp = new FormControl(new Date(''))
    this.customerOnChange(null)
    this.ubigeoOnChange(null, 1)
    this.previewUrl = environment.PHOTODEFAULT
    this.fileData = <File>{}
    this.fileDataCert = <File>{}
    this.lstserv._banvalidar = false
  }

  ngAfterViewInit(): any {
    this.sidenavservc.abrirmenu(this.sideNav)

    this.nvoservc.nuevo = () => {
      this.limpiar_controles()
    }

    this.lstserv.listar = () => {
      this.listadocolaborador()
    }

    this.lstserv.exportLegajos = () => {
      console.log('sssss');
      
      this.exportar_legajos()
    }

    this.nvoservc.registro = () => {
      if (this.tabind == 2) {
        this.guardarDJ()
      } else {
        this.guardarcv()
      }
    }

    this.lstserv.cancelar = () => {
      this.segserv.obtenerdatosusuario()
      if (this.segserv.usuarioreg.nRol == 1) {
        this.ctrlserv._banregister = false
        this.configserv.nLegajoDatos = 0
        this.configserv.cFiltroColaborador = ''
        this.configserv.cPrdNombre = '202102'
        this.listar_periodos()
      } else {
        this.editar_cv(this.segserv.usuarioreg)
      }
    }

    this.nvoservc.exportar = () => {
      this.acciones(3, this.clmdserv.objusuario)
    }
  }

  exportar_legajos() {
    this.spinner.show()
    this.lstserv
      .listado('legajos_exp-pdf/', `0/${this.configserv.cPrdNombre}`)
      .then((data) => {
        console.log('Export legajos :: ' + data)
        Swal.fire(
          'Exportació de Legajos',
          'Puede descargar los documentos en este link : <a href=' +
            data.cConDescripcion +
            ' target="_blank">Descargar</a>',
          'info',
        )
        this.spinner.hide()
      })
  }

  listadocolaborador() {
    // this.listar_tareaspermiso()
    this.spinner.show()
    this.lstserv
      .listado(
        'listausuarios',
        '/' +
          this.configserv.nTipoColaborador +
          '/' +
          this.configserv.cPrdNombre,
      )
      .then((data) => {
        this.lstserv.listColaboradores = data
        if (this.lstserv.listColaboradores.length != this.dataglobal.length) {
          this.pageService.dataglobal = this.lstserv.listColaboradores
          this.pageService.collectionSize = this.lstserv.listColaboradores.length
          this.pageService.dataSource = this.lstserv.listColaboradores
          this.pageEvent.length = this.lstserv.listColaboradores.length
          this.pageService.actualizaTabla2(
            this.lstserv.listColaboradores,
            this.pageEvent,
          )
        }
        this.spinner.hide()
      })
  }

  cargardata() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.c)),
      map((cPerNombre) =>
        cPerNombre ? this._filter(cPerNombre) : this.lstserv.lColegio.slice(),
      ),
    )
  }

  displayFn(inst: Persona): string {
    return inst && inst.cPerNombre ? inst.cPerNombre : ''
  }

  private _filter(name: string): Persona[] {
    const filterValue = name.toLowerCase()
    return this.lstserv.lColegio
      .filter((option) => option.cPerNombre.toLowerCase().includes(filterValue))
      .slice(0, 100)
  }

  handleModelChange(e: any, tipo: number) {
    if (e == '') {
      switch (tipo) {
        case 1:
          this.regLegDatosGenerales.cLegDatColegioProf = ''
          break
      }
    }
  }

  listar_tipodocidentidad() {
    this.lstserv
      .listado('interface', '/' + this.configserv.nIntTipoDocIdent)
      .then((data) => {
        let ltipodoc: Interface[] = data
        this.lstserv.lTipoDocIdentidad = ltipodoc.filter(
          (x) => x.nIntCodigo != 0,
        )
      })
  }

  listar_gradoacademico() {
    this.lstserv
      .listado('interface', '/' + this.configserv.nIntGradoAcad)
      .then((data) => {
        let lgrado: Interface[] = data
        this.lstserv.lGradoAcademico = lgrado.filter((x) => x.nIntCodigo != 0)
      })
  }

  listar_tipodomicilio() {
    this.lstserv
      .listado('constante', '/' + this.configserv.nConTipoDomicilio)
      .then((data) => {
        let ltipodom: Constante[] = data
        this.lstserv.lTipoDomicilio = ltipodom.filter((x) => x.nConValor != 0)
      })
  }

  listar_tipozona() {
    this.lstserv
      .listado('constante', '/' + this.configserv.nConTipoZona)
      .then((data) => {
        let lzona: Constante[] = data
        this.lstserv.lZona = lzona.filter((x) => x.nConValor != 0)
      })
  }

  listar_condicion() {
    this.lstserv
      .listado('constante', '/' + this.configserv.nConCondicion)
      .then((data) => {
        this.lstserv.lCondicionColeg = data
      })
  }

  listar_sexo() {
    this.lstserv
      .listado('constante', '/' + this.configserv.nConSexo)
      .then((data) => {
        let lsex: Constante[] = data
        this.lstserv.lSexo = lsex.filter((x) => x.nConValor != 0)
      })
  }

  listar_estadocivil() {
    this.lstserv
      .listado('constante', '/' + this.configserv.nConEstadoCivil)
      .then((data) => {
        let lestciv: Constante[] = data
        this.lstserv.lEstadoCivil = lestciv.filter((x) => x.nConValor != 0)
      })
  }

  listar_universidad() {
    this.lstserv
      .listado('persona', '/' + this.configserv.nPerUniversidad)
      .then((data) => {
        this.lstserv.lUniversidad = data
      })
  }

  listar_colegio() {
    this.lstserv
      .listado('persona', '/' + this.configserv.nPerColegio)
      .then((data) => {
        this.lstserv.lColegio = data
        this.cargardata()
      })
  }

  listar_legajos() {
    this.segserv.obtenerdatosusuario()
    if (this.segserv.usuarioreg.nRol == 1) {
      this.lstserv.listado('legajo', '').then((data) => {
        this.lstserv.lLegajos = data
      })
    }
  }

  listar_tareaspermiso() {
    this.segserv.obtenerdatosusuario()
    if (this.segserv.usuarioreg.nRol == 1) {
      this.lstserv
        .listado(
          'tareamodulo',
          '/' + this.segserv.usuarioreg.cPerCodigo + '/' + this.codigoMod,
        )
        .then((data) => {
          this.lstserv.lTareasPermiso = data
        })
    }
  }

  listar_periodos() {
    this.segserv.obtenerdatosusuario()
    this.lstserv
      .listado('lst_prdacademico', '/' + this.segserv.usuarioreg.cPerCodigo)
      .then((data) => {
        this.lstserv.lPeriodo = data
      })
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
        this.editar_cv(this.segserv.usuarioreg)
        //  if(this.segserv.usuarioreg.nRol==1){
        //   // this.listar_legajos()
        //   this.listadocolaborador()
        //   this.ctrlserv._banregister = false
        // }else{
        //   this.ctrlserv._banregister = true
        //   this.editar_cv(this.segserv.usuarioreg)
        //   // this.obtener_legajocodigopersona()
        // }

        this.spinner.hide()
      })
  }

  cargar_idioma() {
    this.lstserv.listado('get_idioma', '').then((data) => {
      this.spinner.show()
      let lIdioma: Interface[] = data
      this.lstserv.lIdioma = lIdioma
    })
  }

  // obtener_legajocodigopersona(){
  //   this.lstserv.listado('legajo_percodigo', '/'+ this.segserv.usuarioreg.cPerCodigo).then((data)=>{
  //
  //     if(data == null || data == []){
  //       this.regLegDatosGenerales = this.clmdserv.empty_datosgenerales()
  //     }else{
  //       this.regLegDatosGenerales = data
  //     }

  //     this.editar_cv(this.regLegDatosGenerales)
  //  })
  // }

  customerOnChange($obj: any) {
    if ($obj == null) {
      this.regLegDatosGenerales.cLegDatColegioProf = ''
      this.regLegDatosGenerales.cLegDatColegioProfNavigation = this.clmdserv.empty_persona()
    } else {
      this.regLegDatosGenerales.cLegDatColegioProf = $obj.cPerCodigo
      this.regLegDatosGenerales.cLegDatColegioProfNavigation = $obj
    }
  }

  comboOnChange($obj: any, $tipo: number) {
    if ($obj == null) {
      switch ($tipo) {
        case this.configserv.nIntTipoDocIdent:
          this.regLegDatosGenerales.nLegDatTipoDoc = 0
          this.regLegDatosGenerales.nClaseTipoDoc = 0
          break
        case this.configserv.nIntNacionalidad:
          this.regLegDatosGenerales.nLegDatPais = 0
          this.regLegDatosGenerales.nClasePais = 0
          break
        case this.configserv.nIntGradoAcad:
          this.regLegDatosGenerales.nLegDatGradoAcad = 0
          this.regLegDatosGenerales.nClaseGradoAcad = 0
          break
      }
    } else {
      switch ($tipo) {
        case this.configserv.nIntTipoDocIdent:
          this.regLegDatosGenerales.nLegDatTipoDoc = $obj.nIntCodigo
          this.regLegDatosGenerales.nClaseTipoDoc = $obj.nIntClase
          break
        case this.configserv.nIntNacionalidad:
          this.regLegDatosGenerales.nLegDatPais = $obj.nIntCodigo
          this.regLegDatosGenerales.nClasePais = $obj.nIntClase
          break
        case this.configserv.nIntGradoAcad:
          this.regLegDatosGenerales.nLegDatGradoAcad = $obj.nIntCodigo
          this.regLegDatosGenerales.nClaseGradoAcad = $obj.nIntClase
          break
      }
    }
  }

  comboConsOnChange($obj: any, $tipo: number) {
    if ($obj == null) {
      switch ($tipo) {
        case this.configserv.nConTipoDomicilio:
          this.regLegDatosGenerales.nLegDatTipoDomicilio = 0
          this.regLegDatosGenerales.nValorTipoDomicilio = 0
          break
        case this.configserv.nConSexo:
          this.regLegDatosGenerales.nLegDatSexo = 0
          this.regLegDatosGenerales.nClaseSexo = 0
          break
        case this.configserv.nConCondicion:
          this.regLegDatosGenerales.nLegDatCondicionColeg = 0
          this.regLegDatosGenerales.nValorCondicionColeg = 0
          break
        case this.configserv.nConEstadoCivil:
          this.regLegDatosGenerales.nLegDatEstadoCivil = 0
          this.regLegDatosGenerales.nClaseEstadoCivil = 0
          break
        case this.configserv.nConTipoZona:
          this.regLegDatosGenerales.nLegDatZona = 0
          this.regLegDatosGenerales.nValorZona = 0
          break
      }
    } else {
      switch ($tipo) {
        case this.configserv.nConTipoDomicilio:
          this.regLegDatosGenerales.nLegDatTipoDomicilio = $obj.nConCodigo
          this.regLegDatosGenerales.nValorTipoDomicilio = $obj.nConValor
          break
        case this.configserv.nConSexo:
          this.regLegDatosGenerales.nLegDatSexo = $obj.nConCodigo
          this.regLegDatosGenerales.nClaseSexo = $obj.nConValor
          break
        case this.configserv.nConCondicion:
          this.regLegDatosGenerales.nLegDatCondicionColeg = $obj.nConCodigo
          this.regLegDatosGenerales.nValorCondicionColeg = $obj.nConValor
          break
        case this.configserv.nConEstadoCivil:
          this.regLegDatosGenerales.nLegDatEstadoCivil = $obj.nConCodigo
          this.regLegDatosGenerales.nClaseEstadoCivil = $obj.nConValor
          break
        case this.configserv.nConTipoZona:
          this.regLegDatosGenerales.nLegDatZona = $obj.nConCodigo
          this.regLegDatosGenerales.nValorZona = $obj.nConValor
          break
      }
    }
  }

  ubigeoOnChange($obj: any, $tipo: number) {
    if ($obj == null) {
      switch ($tipo) {
        case 1:
          this.lstserv.lprovincia = []
          this.lstserv.ldistrito = []
          break
        case 2:
          this.lstserv.ldistrito = []
          break
        case 3:
          this.regLegDatosGenerales.nLetDatUbigeo = 0
          this.regLegDatosGenerales.nClaseUbigeo = 0
          break
        case 0:
          this.lstserv.ldepartamentoNac = []
          this.lstserv.lprovinciaNac = []
          this.lstserv.ldistritoNac = []
          break
        case 1:
          this.lstserv.lprovinciaNac = []
          this.lstserv.ldistritoNac = []
          break
        case 2:
          this.lstserv.ldistritoNac = []
          break
        case 3:
          this.regLegDatosGenerales.nLetDatNacimiento = 0
          this.regLegDatosGenerales.nClaseNacimiento = 0
          break
      }
    } else {
      switch ($tipo) {
        case 1:
          this.lstserv.lprovincia = this.lstserv.lubigeo.filter(
            (x) =>
              x.cIntJerarquia.trim().length == 4 &&
              x.cIntJerarquia.trim().substring(0, 2) ==
                $obj.cIntJerarquia.trim(),
          )
          this.lstserv.ldistrito = []
          break
        case 2:
          this.lstserv.ldistrito = this.lstserv.lubigeo.filter(
            (x) =>
              x.cIntJerarquia.trim().length == 6 &&
              x.cIntJerarquia.trim().substring(0, 4) ==
                $obj.cIntJerarquia.trim(),
          )
          break
        case 3:
          this.regLegDatosGenerales.nLetDatUbigeo = $obj.nIntCodigo
          this.regLegDatosGenerales.nClaseUbigeo = $obj.nIntClase
          break
        case 0:
          if ($obj.cIntJerarquia.trim() == 'PER') {
            this.lstserv.ldepartamentoNac = this.lstserv.lubigeo.filter(
              (x) => x.cIntJerarquia.trim().length == 2,
            )
            this.lstserv.lprovinciaNac = []
            this.lstserv.ldistritoNac = []
            this.regLegDatosGenerales.nLetDatNacimiento = 0
            this.regLegDatosGenerales.nClaseNacimiento = 0
          } else {
            this.lstserv.ldepartamentoNac = []
            this.lstserv.lprovinciaNac = []
            this.lstserv.ldistritoNac = []
            this.regLegDatosGenerales.nLetDatNacimiento = $obj.nIntCodigo
            this.regLegDatosGenerales.nClaseNacimiento = $obj.nIntClase
          }
          break
        case 4:
          this.lstserv.lprovinciaNac = this.lstserv.lubigeo.filter(
            (x) =>
              x.cIntJerarquia.trim().length == 4 &&
              x.cIntJerarquia.trim().substring(0, 2) ==
                $obj.cIntJerarquia.trim(),
          )
          this.lstserv.ldistritoNac = []
          break
        case 5:
          this.lstserv.ldistritoNac = this.lstserv.lubigeo.filter(
            (x) =>
              x.cIntJerarquia.trim().length == 6 &&
              x.cIntJerarquia.trim().substring(0, 4) ==
                $obj.cIntJerarquia.trim(),
          )
          break
        case 6:
          this.regLegDatosGenerales.nLetDatNacimiento = $obj.nIntCodigo
          this.regLegDatosGenerales.nClaseNacimiento = $obj.nIntClase
          break
      }
    }
  }

  fileProgress(fileInput: any, btipo: boolean = true): void {
    if (btipo) {
      this.fileData = <File>fileInput.target.files[0]
    } else {
      this.fileDataCert = <File>fileInput.target.files[0]
    }
    this.preview(btipo)
  }

  filePDF(fileInput: any, btipo: number = 0): void {
    let archadj = fileInput != null ? <File>fileInput.target.files[0] : <File>{}
    const mimeType = fileInput != null ? archadj.type : ''
    if (mimeType.match(/pdf\/*/) == null || mimeType == '') {
      this.regLegDatosGenerales.cLegDatSunedu = null
      switch (btipo) {
        case 1:
          this.regLegDatosGenerales.cLegDatSunedu = null
          this.errregsunedu = false
          break
        case 2:
          this.regLegDatosGenerales.cLegDatPolicial = null
          this.errpolicial = false
          break
        case 3:
          this.regLegDatosGenerales.cLegDatJudicial = null
          this.errjudicial = false
          break
        case 4:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2 = null
          this.erranexo2 = false
          break
        case 5:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6 = null
          this.erranexo6 = false
          break
        case 6:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo7 = null
          this.erranexo7 = false
          break
        case 7:
          this.regLegDatosGenerales.cLegDatBuenaSalud = null
          this.errregbuenasalud = false
          break
        case 8:
          this.regLegDatosGenerales.cLegDatArchivoConadis = null
          this.errregconadis = false
          break
      }

      if (mimeType.match(/pdf\/*/) == null && fileInput != null) {
        this.valserv.mensaje_info('Formato no válida. Adjunte un archivo PDF.')
      }
      return
    } else {
      switch (btipo) {
        case 1:
          this.regLegDatosGenerales.cLegDatSunedu = archadj
          this.errregsunedu = true
          break
        case 2:
          this.regLegDatosGenerales.cLegDatPolicial = archadj
          this.errpolicial = true
          break
        case 3:
          this.regLegDatosGenerales.cLegDatJudicial = archadj
          this.errjudicial = true
          break
        case 4:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2 = archadj
          this.erranexo2 = true
          break
        case 5:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6 = archadj
          this.erranexo6 = true
          break
        case 6:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo7 = archadj
          this.erranexo7 = true
          break
        case 7:
          this.regLegDatosGenerales.cLegDatBuenaSalud = archadj
          this.errregbuenasalud = true
          break
        case 8:
          this.regLegDatosGenerales.cLegDatArchivoConadis = archadj
          this.errregconadis = true
          break
      }
    }
    // if(btipo){
    //   this.fileData = <File>fileInput.target.files[0];
    // }else{
    //   this.fileDataCert = <File>fileInput.target.files[0];
    // }
  }

  guardarDJ() {
    if (this.regLegDatosGenerales.nLegDatCodigo == 0) {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales, guarde primero los datos generales.',
        'info',
      )
    } else {
      var formData = new FormData()
      let fecha: any
      formData.append(
        'nLegDjcodigo',
        this.lstserv.LegDeclaracionJurada.nLegDjcodigo.toString() ?? '0',
      )
      formData.append(
        'nLegDjdatCodigo',
        this.regLegDatosGenerales.nLegDatCodigo.toString().toString() ?? '0',
      )
      if (this.lstserv.LegDeclaracionJurada.cLegDjanexo2 == null) {
        this.valserv.mensaje_info('Adjunte archivo de Anexo 2.')
        return
      }
      if (this.lstserv.LegDeclaracionJurada.cLegDjanexo6 == null) {
        this.valserv.mensaje_info('Adjunte archivo de Anexo 6.')
        return
      }

      if (this.lstserv.LegDeclaracionJurada.cLegDjanexo7 == null) {
        this.valserv.mensaje_info('Adjunte archivo de Anexo 7.')
        return
      }
      if (
        this.lstserv.LegDeclaracionJurada.cLegDjanexo2 !=
        this.lstserv.LegDeclaracionJurada.cFileDjanexo2
      ) {
        formData.append(
          'cFileDjanexo2',
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2,
        )
        formData.append('cLegDjanexo2', '')
      } else {
        formData.append(
          'cLegDjanexo2',
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2,
        )
      }
      if (
        this.lstserv.LegDeclaracionJurada.cLegDjanexo6 !=
        this.lstserv.LegDeclaracionJurada.cFileDjanexo6
      ) {
        formData.append(
          'cFileDjanexo6',
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6,
        )
        formData.append('cLegDjanexo6', '')
      } else {
        formData.append(
          'cLegDjanexo6',
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6,
        )
      }
      if (
        this.lstserv.LegDeclaracionJurada.cLegDjanexo7 !=
        this.lstserv.LegDeclaracionJurada.cFileDjanexo7
      ) {
        formData.append(
          'cFileDjanexo7',
          this.lstserv.LegDeclaracionJurada.cLegDjanexo7,
        )
        formData.append('cLegDjanexo7', '')
      } else {
        formData.append(
          'cLegDjanexo7',
          this.lstserv.LegDeclaracionJurada.cLegDjanexo7,
        )
      }

      formData.append('bLegDjestado', 'true')

      this.regserv
        .registroFile(
          'Registro de Legajos',
          'declaracionjurada/' + this.regLegDatosGenerales.nLegDatCodigo,
          formData,
        )
        .then((data) => {
          this.listar_DeclaracionJurada(this.regLegDatosGenerales.nLegDatCodigo)
        })
    }
  }
  preview(btipo: boolean = true): void {
    // Show preview
    const mimeType = btipo ? this.fileData.type : this.fileDataCert.type
    if (mimeType.match(/image\/*/) == null) {
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(btipo ? this.fileData : this.fileDataCert)
    reader.onload = (_event) => {
      if (btipo) {
        this.previewUrl = reader.result
      } else {
        this.previewFirmaUrl = reader.result
      }
    }
  }

  nuevo_gradotitulo($formacion: LegGradoTitulo) {
    this.mdlserv.nuevoModalGradoTitulo(
      'Grados y títulos',
      this.regLegDatosGenerales.nLegDatCodigo,
      $formacion,
    )
  }

  nuevo_experienciadoc($obg: LegDocenciaUniv) {
    this.mdlserv.nuevoModalExperienciaDoc(
      'Docencia universitaria',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
    )
  }

  nuevo_categoriadoc($obg: LegCategoriaDocente) {
    this.mdlserv.nuevoModalCategoriaDOc(
      'Categoría docente',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
    )
  }

  nuevo_dedicaciondoc($obg: LegRegimenDedicacion) {
    this.mdlserv.nuevoModalRegimenDed(
      'Régimen dedicación docente',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
    )
  }

  nuevo_experiencianodoc($obg: LegProfesNoDocente) {
    this.segserv.obtenerdatosusuario()
    this.mdlserv.nuevoModalProfsNoDocenete(
      this.ban_administrativo
        ? 'Experiencia profesional'
        : 'Experiencia profesional no docente',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
      !this.ban_administrativo,
    )
  }

  nuevo_idiomasofimatica($obg: LegIdiomaOfimatica, tipo: boolean) {
    this.mdlserv.nuevoModalIdiomaOfimatica(
      tipo ? 'Dominio de ofimática' : 'Dominio de idiomas',
      this.regLegDatosGenerales.nLegDatCodigo,
      tipo,
      $obg,
    )
  }

  nuevo_investigador($obg: LegInvestigador) {
    this.mdlserv.nuevoModalIvestigador(
      'Docente investigador',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
      this.segserv.usuarioreg.cPerCodigo,
    )
  }

  nuevo_asejurtesis($obg: LegTesisAseJur) {
    this.mdlserv.nuevoModalTesisAsesJur(
      'Asesoría y jurado de tesis',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
      this.segserv.usuarioreg.cPerCodigo,
    )
  }

  nuevo_produccionciencia($obg: LegProduccionCiencia) {
    this.mdlserv.nuevoModalProduccionCiencia(
      'Produccción científica, lectiva y de investigación',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
      this.segserv.usuarioreg.cPerCodigo,
    )
  }

  nuevo_participacion($obg: LegParticipacionCongSem) {
    this.mdlserv.nuevoModalParticipacion(
      'Participación eventos',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
      this.segserv.usuarioreg.cPerCodigo,
    )
  }

  nuevo_cargadmuniv($obg: LegAdminitrativaCarga) {
    this.mdlserv.nuevoModalCargaAdmin(
      'Carga administrativa universitaria',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
    )
  }

  nuevo_reconocimiento($obg: LegReconocimiento) {
    this.mdlserv.nuevoModalReconocimiento(
      'Reconocimiento de otras instituciones',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
    )
  }

  nuevo_capacitacion($obg: LegCapacitaciones) {
    this.segserv.obtenerdatosusuario()
    this.mdlserv.nuevoModalCapacitaciones(
      'Capacitaciones',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
      !this.ban_administrativo,
      this.segserv.usuarioreg.cPerCodigo,
    )
  }

  nuevo_proyeccionsocial($obg: LegProyeccionSocial) {
    this.mdlserv.nuevoModalProyeccionSoc(
      'Proyección social',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
    )
  }

  nuevo_documentacionint($formacion: LegDocumentacionInterna) {
    if (this.regLegDatosGenerales.nLegDatCodigo == 0) {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales, guarde primero los datos generales.',
        'info',
      )
    } else {
      this.mdlserv.nuevoModalDocumentacionInterna(
        'Documentación interna',
        this.regLegDatosGenerales.nLegDatCodigo,
        $formacion,
      )
    }
  }

  nuevo_capacitacionint($formacion: LegCapacitacionInterna) {
    if (this.regLegDatosGenerales.nLegDatCodigo == 0) {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales, guarde primero los datos generales.',
        'info',
      )
    } else {
      this.mdlserv.nuevoModalCapacitacionInterna(
        'Capacitación interna',
        this.regLegDatosGenerales.nLegDatCodigo,
        $formacion,
      )
    }
  }

  nuevo_contratoac($formacion: LegContrato) {
    if (this.regLegDatosGenerales.nLegDatCodigo == 0) {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales, guarde primero los datos generales.',
        'info',
      )
    } else {
      this.mdlserv.nuevoModalContrato(
        'Contrato',
        this.regLegDatosGenerales.nLegDatCodigo,
        $formacion,
      )
    }
  }

  nuevo_resolucionac($formacion: LegResolucion) {
    if (this.regLegDatosGenerales.nLegDatCodigo == 0) {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales, guarde primero los datos generales.',
        'info',
      )
    } else {
      this.mdlserv.nuevoModalResolucion(
        'Resolución',
        this.regLegDatosGenerales.nLegDatCodigo,
        $formacion,
      )
    }
  }

  nuevo_evaluaciondesempac($formacion: LegEvaluacionDesemp) {
    if (this.regLegDatosGenerales.nLegDatCodigo == 0) {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales, guarde primero los datos generales.',
        'info',
      )
    } else {
      this.mdlserv.nuevoModalEvaluacionDesem(
        'Evauación de desempeño',
        this.regLegDatosGenerales.nLegDatCodigo,
        $formacion,
        !this.ban_administrativo,
      )
    }
  }

  nuevo_seleccionac($formacion: LegSeleccion) {
    if (this.regLegDatosGenerales.nLegDatCodigo == 0) {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales, guarde primero los datos generales.',
        'info',
      )
    } else {
      this.mdlserv.nuevoModalSeleccion(
        'Selección',
        this.regLegDatosGenerales.nLegDatCodigo,
        $formacion,
      )
    }
  }

  nuevo_ordinarizacionac($formacion: LegOrdinarizacion) {
    if (this.regLegDatosGenerales.nLegDatCodigo == 0) {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales, guarde primero los datos generales.',
        'info',
      )
    } else {
      this.mdlserv.nuevoModalOrdinarizacion(
        'Ordinarización',
        this.regLegDatosGenerales.nLegDatCodigo,
        $formacion,
      )
    }
  }

  nuevo_capacitacioninterna($objaux: DatosUsuario) {
    if ($objaux.bLegajo) {
      this.lstserv
        .listado('legajo_percodigo/', $objaux.cPerCodigo)
        .then((data) => {
          if (JSON.stringify(data) != '[]') {
            this.mdlserv.nuevoModalCapacitacionInterna(
              'Capacitación interna',
              data.nLegDatCodigo,
              this.clmdserv.empty_capacitacioninterna(),
            )
          } else {
            this.limpiar_controles()
            this.spinner.hide()
            Swal.fire(
              'Control de Legajos',
              'No se ha encontrado datos, proceda a completar los datos solicitados.',
              'info',
            )
          }
        })
    } else {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales.',
        'info',
      )
    }
  }

  nuevo_contrato($objaux: DatosUsuario) {
    if ($objaux.bLegajo) {
      this.lstserv
        .listado('legajo_percodigo/', $objaux.cPerCodigo)
        .then((data) => {
          if (JSON.stringify(data) != '[]') {
            this.mdlserv.nuevoModalContrato(
              'Registro contrato',
              data.nLegDatCodigo,
              this.clmdserv.empty_contratos(),
            )
          } else {
            this.limpiar_controles()
            this.spinner.hide()
            Swal.fire(
              'Control de Legajos',
              'No se ha encontrado datos, proceda a completar los datos solicitados.',
              'info',
            )
          }
        })
    } else {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales.',
        'info',
      )
    }
  }

  nuevo_resolucion($objaux: DatosUsuario) {
    if ($objaux.bLegajo) {
      this.lstserv
        .listado('legajo_percodigo/', $objaux.cPerCodigo)
        .then((data) => {
          if (JSON.stringify(data) != '[]') {
            this.mdlserv.nuevoModalResolucion(
              'Registro resolución',
              data.nLegDatCodigo,
              this.clmdserv.empty_resoluciones(),
            )
          } else {
            this.limpiar_controles()
            this.spinner.hide()
            Swal.fire(
              'Control de Legajos',
              'No se ha encontrado datos, proceda a completar los datos solicitados.',
              'info',
            )
          }
        })
    } else {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales.',
        'info',
      )
    }
  }

  nuevo_evaluaciondsemp($objaux: DatosUsuario) {
    if ($objaux.bLegajo) {
      this.lstserv
        .listado('legajo_percodigo/', $objaux.cPerCodigo)
        .then((data) => {
          if (JSON.stringify(data) != '[]') {
            this.mdlserv.nuevoModalEvaluacionDesem(
              'Registro Evaluación de Desempeño',
              data.nLegDatCodigo,
              this.clmdserv.empty_evaluaciondesemp(),
              $objaux.nTipo == 2 ? false : true,
            )
          } else {
            this.limpiar_controles()
            this.spinner.hide()
            Swal.fire(
              'Control de Legajos',
              'No se ha encontrado datos, proceda a completar los datos solicitados.',
              'info',
            )
          }
        })
    } else {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales.',
        'info',
      )
    }
  }

  nuevo_seleccion($objaux: DatosUsuario) {
    if ($objaux.bLegajo) {
      this.lstserv
        .listado('legajo_percodigo/', $objaux.cPerCodigo)
        .then((data) => {
          if (JSON.stringify(data) != '[]') {
            this.mdlserv.nuevoModalSeleccion(
              'Registro selección',
              data.nLegDatCodigo,
              this.clmdserv.empty_seleccion(),
            )
          } else {
            this.limpiar_controles()
            this.spinner.hide()
            Swal.fire(
              'Control de Legajos',
              'No se ha encontrado datos, proceda a completar los datos solicitados.',
              'info',
            )
          }
        })
    } else {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales.',
        'info',
      )
    }
  }

  nuevo_ordinarizacion($objaux: DatosUsuario) {
    if ($objaux.bLegajo) {
      this.lstserv
        .listado('legajo_percodigo/', $objaux.cPerCodigo)
        .then((data) => {
          if (JSON.stringify(data) != '[]') {
            this.mdlserv.nuevoModalOrdinarizacion(
              'Registro ordinarización',
              data.nLegDatCodigo,
              this.clmdserv.empty_ordinarizacion(),
            )
          } else {
            this.limpiar_controles()
            this.spinner.hide()
            Swal.fire(
              'Control de Legajos',
              'No se ha encontrado datos, proceda a completar los datos solicitados.',
              'info',
            )
          }
        })
    } else {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales.',
        'info',
      )
    }
  }

  nuevo_documentacioninterna($objaux: DatosUsuario) {
    if ($objaux.bLegajo) {
      this.lstserv
        .listado('legajo_percodigo/', $objaux.cPerCodigo)
        .then((data) => {
          if (JSON.stringify(data) != '[]') {
            this.mdlserv.nuevoModalDocumentacionInterna(
              'Registro Documentación Interna',
              data.nLegDatCodigo,
              this.clmdserv.empty_documentacioninterna(),
            )
          } else {
            this.limpiar_controles()
            this.spinner.hide()
            Swal.fire(
              'Control de Legajos',
              'No se ha encontrado datos, proceda a completar los datos solicitados.',
              'info',
            )
          }
        })
    } else {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales.',
        'info',
      )
    }
  }

  editar_capacitacioninterna($obj: LegCapacitacionInterna) {
    this.mdlserv.nuevoModalCapacitacionInterna(
      'Capacitación interna',
      $obj.nLegDatCodigo,
      $obj,
    )
  }

  editar_contrato($obj: LegContrato) {
    this.mdlserv.nuevoModalContrato('Contrato', $obj.nLegConDatCodigo, $obj)
  }

  editar_resolucion($obj: LegResolucion) {
    this.mdlserv.nuevoModalResolucion('Contrato', $obj.nLegResDatCodigo, $obj)
  }

  editar_evaluaciondesemp($obj: LegEvaluacionDesemp) {
    this.segserv.obtenerdatosusuario()
    let $objaux = this.segserv.usuarioreg
    this.ban_administrativo = $objaux.nTipo == 1 ? true: false
    this.mdlserv.nuevoModalEvaluacionDesem(
      'Evaluación de Desempeño',
      $obj.nLegEvalDatCodigo,
      $obj,
      this.ban_administrativo,
    )
  }

  editar_seleccion($obj: LegSeleccion) {
    this.mdlserv.nuevoModalSeleccion('Selección', $obj.nLegSelDatCodigo, $obj)
  }

  editar_ordinarizacion($obj: LegOrdinarizacion) {
    this.mdlserv.nuevoModalOrdinarizacion(
      'Ordinrizacion',
      $obj.nLegOrdDatCodigo,
      $obj,
    )
  }

  eliminar_validar_formacion($obj: LegGradoTitulo, bvalel: boolean) {
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
        if ($obj.nLegGraCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegGraEstado' : '/cLegGraValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'gradotitulo/' + $obj.nLegGraCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_gradotitulo($obj.nLegGraDatCodigo)
            })
        } else {
          var index = this.lstserv.lLegGradoTitulo.indexOf($obj)
          this.lstserv.lLegGradoTitulo.splice(index, 1)
        }
      }
    })
  }

  eliminar_validar_experienciadoc($obg: LegDocenciaUniv, bvalel: boolean) {
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
        if ($obg.nLegDocCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegDocEstado' : '/cLegDocValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'docenciauniv/' + $obg.nLegDocCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_experienciadocencia($obg.nLegDocDatCodigo)
            })
        } else {
          var index = this.lstserv.lLegDocenciaUniv.indexOf($obg)
          this.lstserv.lLegDocenciaUniv.splice(index, 1)
        }
      }
    })
  }

  eliminar_validar_categoriadoc($obg: LegCategoriaDocente, bvalel: boolean) {
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
        if ($obg.nLegCatCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegCatEstado' : '/cLegCatValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'categoriadocente/' + $obg.nLegCatCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_categoriadocente($obg.nLegCatDatCodigo)
            })
        } else {
          var index = this.lstserv.lCategoriaDocente.indexOf($obg)
          this.lstserv.lCategoriaDocente.splice(index, 1)
        }
      }
    })
  }

  eliminar_validar_dedicaciondoc($obg: LegRegimenDedicacion, bvalel: boolean) {
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
        if ($obg.nLegRegCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegRegEstado' : '/cLegRegValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'regimendedicacion/' + $obg.nLegRegCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_regimendedicacion($obg.nLegRegDatCodigo)
            })
        } else {
          var index = this.lstserv.lRegimenDedic.indexOf($obg)
          this.lstserv.lRegimenDed.splice(index, 1)
        }
      }
    })
  }

  eliminar_validar_experiencianodoc($obg: LegProfesNoDocente, bvalel: boolean) {
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
        if ($obg.nLegProCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegProEstado' : '/cLegProValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'experiencianodoc/' + $obg.nLegProCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_experiencianodocente($obg.nLegProDatCodigo)
            })
        } else {
          var index = this.lstserv.lProfesNoDocente.indexOf($obg)
          this.lstserv.lProfesNoDocente.splice(index, 1)
        }
      }
    })
  }

  eliminar_validar_idiomasofimatica(
    $obg: LegIdiomaOfimatica,
    tipo: boolean,
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
        if ($obg.nLegIdOfCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegIdOfEstado' : '/cLegIdOfValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'idiomaofimatica/' + $obg.nLegIdOfCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_domidiomaofimatica($obg.nLegIdOfDatCodigo)
            })
        } else {
          var index = this.lstserv.lidiomasofimatica.indexOf($obg)
          this.lstserv.lidiomasofimatica.splice(index, 1)
        }

        this.lstserv.lofimatica = this.lstserv.lidiomasofimatica.filter(
          (x) => x.cLegIdOfTipo == true,
        )
        this.lstserv.lidioma = this.lstserv.lidiomasofimatica.filter(
          (x) => x.cLegIdOfTipo == false,
        )
      }
    })
  }

  eliminar_validar_investigador($obg: LegInvestigador, bvalel: boolean) {
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
        if ($obg.nLegInvCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegInvEstado' : '/cLegInvValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'investigador/' + $obg.nLegInvCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_docenteinvestigador($obg.nLegInvDatCodigo)
            })
        } else {
          var index = this.lstserv.linvestigador.indexOf($obg)
          this.lstserv.linvestigador.splice(index, 1)
        }
      }
    })
  }

  eliminar_validar_asejurtesis($obg: LegTesisAseJur, bvalel: boolean) {
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
        if ($obg.nLegTesCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegTesEstado' : '/cLegTesValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'tesisasejur/' + $obg.nLegTesCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_tesisasejur($obg.nLegTesDatCodigo)
            })
        } else {
          var index = this.lstserv.lTesisAsesJur.indexOf($obg)
          this.lstserv.lTesisAsesJur.splice(index, 1)
        }
      }
    })
  }

  eliminar_validar_produccionciencia(
    $obg: LegProduccionCiencia,
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
        if ($obg.nLegProdCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegProdEstado' : '/cLegProdValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'produccionciencia/' + $obg.nLegProdCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_produccionciencia($obg.nLegProdDatCodigo)
            })
        } else {
          var index = this.lstserv.lProduccionCiencia.indexOf($obg)
          this.lstserv.lProduccionCiencia.splice(index, 1)
        }
      }
    })
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

  eliminar_validar_cargadmuniv($obg: LegAdminitrativaCarga, bvalel: boolean) {
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
        if ($obg.nLegAdmCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegAdmEstado' : '/cLegAdmValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'cargaadmin/' + $obg.nLegAdmCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_cargaadmin($obg.nLegAdmDatCodigo)
            })
        } else {
          var index = this.lstserv.lAdminitrativaCarga.indexOf($obg)
          this.lstserv.lAdminitrativaCarga.splice(index, 1)
        }
      }
    })
  }

  eliminar_validar_reconocimiento($obg: LegReconocimiento, bvalel: boolean) {
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
        if ($obg.nLegRecCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegRecEstado' : '/cLegRecValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'reconocimiento/' + $obg.nLegRecCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_reconocimiento($obg.nLegRecDatCodigo)
            })
        } else {
          var index = this.lstserv.lReconocimiento.indexOf($obg)
          this.lstserv.lReconocimiento.splice(index, 1)
        }
      }
    })
  }

  eliminar_validar_capacitacion($obg: LegCapacitaciones, bvalel: boolean) {
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
        if ($obg.nLegCapCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegCapEstado' : '/cLegCapValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'capacitacion/' + $obg.nLegCapCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_capacitacion($obg.nLegCapDatCodigo)
            })
        } else {
          var index = this.lstserv.lcapacitaciones.indexOf($obg)
          this.lstserv.lcapacitaciones.splice(index, 1)
        }
      }
    })
  }

  eliminar_validar_proyeccionsocial(
    $obg: LegProyeccionSocial,
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
        if ($obg.nLegProyCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegProyEstado' : '/cLegProyValida',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'proyeccionsocial/' + $obg.nLegProyCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_proyeccionsocial($obg.nLegProyDatCodigo)
            })
        } else {
          var index = this.lstserv.lProyeccionSoc.indexOf($obg)
          this.lstserv.lProyeccionSoc.splice(index, 1)
        }
      }
    })
  }

  eliminar_capacitacioninterna($obg: LegCapacitacionInterna) {
    Swal.fire({
      title: 'Registro de Legajos',
      text: '¿Está seguro de eliminar registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if ($obg.nLegCicodigo > 0) {
          let request = [
            {
              value: false,
              path: '/bLegCiestado',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'legcapacitacioninterna/' + $obg.nLegCicodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_capacitacioninterna($obg.nLegDatCodigo)
            })
        } else {
          var index = this.lstserv.lCapacitacionInterna.indexOf($obg)
          this.lstserv.lCapacitacionInterna.splice(index, 1)
        }
      }
    })
  }

  eliminar_contrato($obg: LegContrato) {
    Swal.fire({
      title: 'Registro de Legajos',
      text: '¿Está seguro de eliminar registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if ($obg.nLegConCodigo > 0) {
          let request = [
            {
              value: false,
              path: '/bLegConEstado',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'contrato/' + $obg.nLegConCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_contrato($obg.nLegConDatCodigo)
            })
        } else {
          var index = this.lstserv.lContrato.indexOf($obg)
          this.lstserv.lContrato.splice(index, 1)
        }
      }
    })
  }

  eliminar_resolucion($obg: LegResolucion) {
    Swal.fire({
      title: 'Registro de Legajos',
      text: '¿Está seguro de eliminar registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if ($obg.nLegResCodigo > 0) {
          let request = [
            {
              value: false,
              path: '/bLegResEstado',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'resolucion/' + $obg.nLegResCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_resoluciones($obg.nLegResDatCodigo)
            })
        } else {
          var index = this.lstserv.lResolucion.indexOf($obg)
          this.lstserv.lResolucion.splice(index, 1)
        }
      }
    })
  }

  eliminar_evaluaciondesemp($obg: LegEvaluacionDesemp) {
    Swal.fire({
      title: 'Registro de Legajos',
      text: '¿Está seguro de eliminar registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if ($obg.nLegEvalCodigo > 0) {
          let request = [
            {
              value: false,
              path: '/bLegEvalEstado',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'evaluaciondesemp/' + $obg.nLegEvalCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_evaluaciondesemp($obg.nLegEvalDatCodigo)
            })
        } else {
          var index = this.lstserv.lEvaluacionDesemp.indexOf($obg)
          this.lstserv.lEvaluacionDesemp.splice(index, 1)
        }
      }
    })
  }

  eliminar_seleccion($obg: LegSeleccion) {
    Swal.fire({
      title: 'Registro de Legajos',
      text: '¿Está seguro de eliminar registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if ($obg.nLegSelCodigo > 0) {
          let request = [
            {
              value: false,
              path: '/bLegSelEstado',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'seleccion/' + $obg.nLegSelCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_Seleccion($obg.nLegSelDatCodigo)
            })
        } else {
          var index = this.lstserv.lSeleccion.indexOf($obg)
          this.lstserv.lSeleccion.splice(index, 1)
        }
      }
    })
  }

  eliminar_documentacioninterna($obg: LegDocumentacionInterna) {
    Swal.fire({
      title: 'Registro de Legajos',
      text: '¿Está seguro de eliminar registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if ($obg.nLegDicodigo > 0) {
          let request = [
            {
              value: false,
              path: '/bLegDiestado',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'documentacioninterna/' + $obg.nLegDicodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_DocumentacionInterna($obg.nLegDidatCodigo)
            })
        } else {
          var index = this.lstserv.lDocumentacionInterna.indexOf($obg)
          this.lstserv.lDocumentacionInterna.splice(index, 1)
        }
      }
    })
  }

  eliminar_ordinarizacion($obg: LegOrdinarizacion) {
    Swal.fire({
      title: 'Registro de Legajos',
      text: '¿Está seguro de eliminar registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if ($obg.nLegOrdCodigo > 0) {
          let request = [
            {
              value: false,
              path: '/bLegOrdEstado',
              op: 'replace',
            },
          ]
          this.regserv
            .actualizarcampo(
              'Registro de Legajo',
              'ordinarizacion/' + $obg.nLegOrdCodigo,
              request,
            )
            .then(() => {
              this.lstserv.listar_Ordinarizacion($obg.nLegOrdDatCodigo)
            })
        } else {
          var index = this.lstserv.lOrdinarizacion.indexOf($obg)
          this.lstserv.lOrdinarizacion.splice(index, 1)
        }
      }
    })
  }

  obtener_edad($e: any) {
    this.regLegDatosGenerales.dLegDatFechaNacimiento = $e
    this.edad = this.ctrlserv.calcular_edad($e).valueOf().toString() + ' años'

    this.FormGroup1.get('edadControl')?.setValue(this.edad)
  }

  guardarcv() {
    try {
      if (this.FormGroup1.status.valueOf() == 'INVALID') {
        this.stepper.selectedIndex = 0
        this.valserv.mensaje_info('Complete los campos solicitados.')
        return
      } else if (this.date.status.valueOf() == 'INVALID') {
        this.valserv.mensaje_info('Ingrese una fecha de nacimiento válida.')
        return
      }
      this.regLegDatosGenerales.cLegDatColegioProf =
        this.regLegDatosGenerales.cLegDatColegioProf == null
          ? ''
          : this.regLegDatosGenerales.cLegDatColegioProf
      if (this.regLegDatosGenerales.cLegDatColegioProf ?? '' != '') {
        if (
          this.FormGroup2.get('colegionroControl')?.value == '' ||
          this.regLegDatosGenerales.nLegDatCondicionColeg?.toString() == '0'
        ) {
          this.stepper.selectedIndex = 2
          this.valserv.mensaje_info('Complete los datos de colegiatura.')
          return
        } else if (this.dateFEmi.status.valueOf() == 'INVALID') {
          this.valserv.mensaje_info('Ingrese fecha de emisión válida.')
          return
        } else if (this.dateFExp.status.valueOf() == 'INVALID') {
          this.valserv.mensaje_info('Ingrese fecha de expiración válida.')
          return
        } else if (this.dateFEmi.value > this.dateFExp.value) {
          this.valserv.mensaje_info(
            'Fecha de emisión no puede ser posterior a fecha de expiración.',
          )
          return
        }
      }
      var formData = new FormData()
      let fecha: any = this.configserv.datepipe.transform(new Date())
      formData.append(
        'cPerCodigo',
        this.regLegDatosGenerales.cPerCodigo.toString(),
      )
      formData.append(
        'nLegDatCodigo',
        this.regLegDatosGenerales.nLegDatCodigo.toString(),
      )
      formData.append(
        'nLegDatTipoDoc',
        this.regLegDatosGenerales.nLegDatTipoDoc.toString(),
      )
      formData.append(
        'nClaseTipoDoc',
        this.regLegDatosGenerales.nClaseTipoDoc.toString(),
      )
      formData.append(
        'cLegDatNroDoc',
        this.FormGroup1.get('nrodocumentoControl')?.value,
      )
      formData.append(
        'cLegDatApellidoPaterno',
        this.FormGroup1.get('apellidopaternoControl')?.value,
      )
      formData.append(
        'cLegDatApellidoMaterno',
        this.FormGroup1.get('apellidomaternoControl')?.value,
      )
      formData.append(
        'cLegDatNombres',
        this.FormGroup1.get('nombresControl')?.value,
      )
      let fechanac: any = this.configserv.datepipe.transform(
        this.regLegDatosGenerales.dLegDatFechaNacimiento,
        'yyyy-MM-dd',
      )
      formData.append('dLegDatFechaNacimiento', fechanac)
      formData.append(
        'nLegDatSexo',
        this.regLegDatosGenerales.nLegDatSexo.toString(),
      )
      formData.append(
        'nClaseSexo',
        this.regLegDatosGenerales.nClaseSexo.toString(),
      )
      formData.append(
        'nLegDatEstadoCivil',
        this.regLegDatosGenerales.nLegDatEstadoCivil.toString(),
      )
      formData.append(
        'nClaseEstadoCivil',
        this.regLegDatosGenerales.nClaseEstadoCivil.toString(),
      )
      formData.append(
        'declaracionjuradaflag ',
        this.regLegDatosGenerales.declaracionjuradaflag.toString(),
      )
      // formData.append("cFile", this.fileData)
      formData.append('cFileFirma', this.fileDataCert)
      if (
        this.regLegDatosGenerales.cLegDatSunedu !=
        this.regLegDatosGenerales.cFileSunedu
      ) {
        formData.append('cFileSunedu', this.regLegDatosGenerales.cLegDatSunedu)
      }
      if (
        this.regLegDatosGenerales.cLegDatPolicial !=
        this.regLegDatosGenerales.cFilePolicial
      ) {
        formData.append(
          'cFilePolicial',
          this.regLegDatosGenerales.cLegDatPolicial,
        )
      }

      //
      if (
        this.regLegDatosGenerales.cLegDatArchivoConadis !=
        this.regLegDatosGenerales.cFileConadis
      ) {
        formData.append(
          'cFileConadis',
          this.regLegDatosGenerales.cLegDatArchivoConadis,
        )
      }
      //
      console.log(this.regLegDatosGenerales.cLegDatBuenaSalud);
      
      if (
        this.regLegDatosGenerales.cLegDatBuenaSalud !=
        this.regLegDatosGenerales.cFileBuenaSalud
      ) {
        formData.append(
          'cFileBuenaSalud',
          this.regLegDatosGenerales.cLegDatBuenaSalud,
        )
      } //
      if (
        this.regLegDatosGenerales.cLegDatJudicial !=
        this.regLegDatosGenerales.cFileJudicial
      ) {
        formData.append(
          'cFileJudicial',
          this.regLegDatosGenerales.cLegDatJudicial,
        )
      }
      formData.append('cLegDatFoto', '')
      formData.append(
        'cLegDatEmail',
        this.FormGroup1.get('emailControl')?.value ?? '',
      )
      formData.append(
        'cLegDatTelefono',
        this.FormGroup1.get('telefonoControl')?.value ?? '',
      )
      formData.append(
        'cLegDatMovil',
        this.FormGroup1.get('movilControl')?.value ?? '',
      )
      formData.append(
        'nLegDatGradoAcad',
        this.regLegDatosGenerales.nLegDatGradoAcad.toString() ?? '',
      )
      formData.append(
        'nClaseGradoAcad',
        this.regLegDatosGenerales.nClaseGradoAcad.toString() ?? '',
      )
      formData.append(
        'nLegDatPais',
        this.regLegDatosGenerales.nLegDatPais.toString() ?? '',
      )
      formData.append(
        'nClasePais',
        this.regLegDatosGenerales.nClasePais.toString() ?? '',
      )
      formData.append(
        'cLegDatAcerca',
        this.EndFormGroup.get('acercaControl')?.value ?? '',
      )
      formData.append(
        'nLegDatTipoDomicilio',
        this.regLegDatosGenerales.nLegDatTipoDomicilio.toString(),
      )
      formData.append(
        'nValorTipoDomicilio',
        this.regLegDatosGenerales.nValorTipoDomicilio.toString(),
      )
      formData.append(
        'nLegDatZona',
        this.regLegDatosGenerales.nLegDatZona.toString(),
      )
      formData.append(
        'nValorZona',
        this.regLegDatosGenerales.nValorZona.toString(),
      )
      formData.append(
        'cLegDatCalleDomicilio',
        this.FormGroup1.get('direccionControl')?.value ?? '',
      )
      formData.append(
        'cLegDatNroDomicilio',
        this.FormGroup1.get('numeroControl')?.value ?? '',
      )
      formData.append(
        'cLegDatMzaDomicilio',
        this.FormGroup1.get('mzaControl')?.value ?? '',
      )
      formData.append(
        'cLegDatLtDomicilio',
        this.FormGroup1.get('lteControl')?.value ?? '',
      )
      formData.append(
        'cLegDatDptoDomicilio',
        this.FormGroup1.get('dptoControl')?.value ?? '',
      )
      formData.append(
        'cLegDatReferencia',
        this.FormGroup1.get('referenciaControl')?.value ?? '',
      )
      formData.append(
        'nLetDatUbigeo',
        this.regLegDatosGenerales.nLetDatUbigeo.toString() ?? '',
      )
      formData.append(
        'nClaseUbigeo',
        this.regLegDatosGenerales.nClaseUbigeo.toString() ?? '',
      )
      formData.append(
        'nLetDatNacimiento',
        this.regLegDatosGenerales.nLetDatNacimiento.toString() ?? '',
      )
      formData.append(
        'nClaseNacimiento',
        this.regLegDatosGenerales.nClaseNacimiento.toString() ?? '',
      )
      formData.append(
        'nLegIdiomaNativo',
        this.regLegDatosGenerales.nLegIdiomaNativo.toString() ?? '',
      )

      formData.append('declaracionjuradaflag', 'true')
      formData.append('CLegDatEstado', 'true')
      formData.append('dFechaRegistro', fecha)
      formData.append('dFechaModifica', fecha)
      formData.append(
        'nLegDatDiscapacidad',
        this.regLegDatosGenerales.nLegDatDiscapacidad.toString() ?? '',
      )
      formData.append(
        'nLegDatTipoDiscapacidad',
        this.regLegDatosGenerales.nLegDatTipoDiscapacidad.toString() ?? '',
      )
      formData.append(
        'cLegDatOtraDiscapcidad',
        this.FormGroupAD.get('cLegDatOtraDiscapcidad')?.value,
      )
      // formData.append('cLegDatArchivoConadis', cLegDatArchivoConadis)

      if (this.regLegDatosGenerales.cLegDatColegioProf ?? '' != '') {
        let fechaemis: any = this.configserv.datepipe.transform(
          this.dateFEmi.value ?? new Date(),
          'yyyy-MM-dd',
        )
        let fechaexp: any = this.configserv.datepipe.transform(
          this.dateFExp.value ?? new Date(),
          'yyyy-MM-dd',
        )
        formData.append('dLegDatosFechaEmisionColeg', fechaemis)
        formData.append('dLegDatosFechaExpiraColeg', fechaexp)
        formData.append(
          'nLegDatCondicionColeg',
          this.regLegDatosGenerales.nLegDatCondicionColeg?.toString(),
        )
        formData.append(
          'nValorCondicionColeg',
          this.regLegDatosGenerales.nValorCondicionColeg?.toString(),
        )
        formData.append(
          'cLegDatColegioProf',
          this.regLegDatosGenerales.cLegDatColegioProf.toString() ?? '',
        )
        formData.append(
          'cLegDatNroColegiatura',
          this.FormGroup2.get('colegionroControl')?.value ?? '',
        )
      }

      if (
        this.regLegDatosGenerales.nLegDatCodigo > 0 &&
        this.regLegDatosGenerales.cPerCodigo.toString() ==
          this.segserv.usuarioreg.cPerCodigo
      ) {
        // if(this.previewFirmaUrl == environment.FIRMADEFAULT){
        //   this.stepper.selectedIndex  = 1
        //   this.valserv.mensaje_info("Adjunte firma digital.")
        //   return;
        // }else
        if (
          this.regLegDatosGenerales.nLetDatNacimiento == 0 ||
          this.regLegDatosGenerales.nLetDatNacimiento == null
        ) {
          this.stepper.selectedIndex = 0
          this.valserv.mensaje_info('Seleccione lugar de nacimiento.')
          return
        }
      }

      if (this.regLegDatosGenerales.nLegDatCodigo == 0) {
        // if(this.fileData == null){
        //   this.valserv.mensaje_info("Adjunte foto.")
        //   return;
        // }else
        //  if(this.regLegDatosGenerales.cLegDatSunedu == null || this.regLegDatosGenerales.cLegDatSunedu == ''){
        //   this.valserv.mensaje_info("Adjunte documento de registro SUNEDU.")
        //   return;
        // }
        this.spinner.show()
        if (
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2 != null &&
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6 != null &&
          this.lstserv.LegDeclaracionJurada.cLegDjanexo7 == null
        ) {
          formData.append(
            'legDeclaracionJurada[0].nLegDjcodigo',
            this.lstserv.LegDeclaracionJurada.nLegDjcodigo.toString() ?? '0',
          )
          formData.append(
            'legDeclaracionJurada[0].cFileDjanexo2',
            this.lstserv.LegDeclaracionJurada.cLegDjanexo2,
          )
          formData.append(
            'legDeclaracionJurada[0].cFileDjanexo6',
            this.lstserv.LegDeclaracionJurada.cLegDjanexo6,
          )
          formData.append(
            'legDeclaracionJurada[0].cFileDjanexo7',
            this.lstserv.LegDeclaracionJurada.cLegDjanexo7,
          )
          formData.append('legDeclaracionJurada[0].cLegDjanexo2', '')
          formData.append('legDeclaracionJurada[0].cLegDjanexo6', '')
          formData.append('legDeclaracionJurada[0].cLegDjanexo7', '')
          formData.append('legDeclaracionJurada[0].bLegDjestado', 'true')
        }

        this.lstserv.lLegGradoTitulo.forEach(
          (element: LegGradoTitulo, index) => {
            let fechaobt: any = this.configserv.datepipe.transform(
              element.dLegGraFecha,
              'yyyy-MM-dd',
            )
            formData.append(
              'legGradoTitulo[' + index + '].nLegGraCodigo',
              element.nLegGraCodigo.toString() ?? '0',
            )
            formData.append(
              'legGradoTitulo[' + index + '].nLegGraGradoAcad',
              element.nLegGraGradoAcad.toString() ?? '0',
            )
            formData.append(
              'legGradoTitulo[' + index + '].nClaseGradoAcad',
              element.nClaseGradoAcad.toString() ?? '0',
            )
            formData.append(
              'legGradoTitulo[' + index + '].cLegGraCarreraProf',
              element.cLegGraCarreraProf.toString() ?? '',
            )
            formData.append(
              'legGradoTitulo[' + index + '].cLegGraInstitucion',
              element.cLegGraInstitucion.toString() ?? '0',
            )
            formData.append(
              'legGradoTitulo[' + index + '].cLegGraOtraInst',
              element.cLegGraOtraInst.toString() ?? '0',
            )
            formData.append(
              'legGradoTitulo[' + index + '].nLegGraPais',
              element.nLegGraPais.toString() ?? '0',
            )
            formData.append(
              'legGradoTitulo[' + index + '].nClasePais',
              element.nClasePais.toString() ?? '0',
            )
            // formData.append('legGradoTitulo['+index+'].nLegGraUbigeo', element.nLegGraUbigeo.toString() ?? '0')
            // formData.append('legGradoTitulo['+index+'].nClaseUbigeo', element.nClaseUbigeo.toString() ?? '0')
            formData.append(
              'legGradoTitulo[' + index + '].dLegGraFecha',
              fechaobt,
            )
            formData.append(
              'legGradoTitulo[' + index + '].cFile',
              element.cLegGraArchivo,
            )
            formData.append('legGradoTitulo[' + index + '].cLegGraArchivo', '')
            formData.append(
              'legGradoTitulo[' + index + '].cLegGraValida',
              'false',
            )
            formData.append(
              'legGradoTitulo[' + index + '].cLegGraEstado',
              'true',
            )
          },
        )

        this.lstserv.lLegDocenciaUniv.forEach(
          (element: LegDocenciaUniv, index) => {
            formData.append(
              'legDocenciaUniv[' + index + '].nLegDocCodigo',
              element.nLegDocCodigo.toString() ?? '0',
            )
            formData.append(
              'legDocenciaUniv[' + index + '].nLegDocRegimen',
              element.nLegDocRegimen.toString() ?? '0',
            )
            formData.append(
              'legDocenciaUniv[' + index + '].nValorRegimen',
              element.nValorRegimen.toString() ?? '0',
            )
            formData.append(
              'legDocenciaUniv[' + index + '].nLegDocCategoria',
              element.nLegDocCategoria.toString() ?? '0',
            )
            formData.append(
              'legDocenciaUniv[' + index + '].nValorCategoria',
              element.nValorCategoria.toString() ?? '0',
            )
            formData.append(
              'legDocenciaUniv[' + index + '].cLegDocUniversidad',
              element.cLegDocUniversidad.toString() ?? '',
            )
            formData.append(
              'legDocenciaUniv[' + index + '].cLegDocOtraInst',
              element.cLegDocOtraInst.toString() ?? '',
            )
            formData.append(
              'legDocenciaUniv[' + index + '].cLegDocPais',
              element.cLegDocPais.toString() ?? '',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegDocFechaInicio,
              'yyyy-MM-dd',
            )
            formData.append(
              'legDocenciaUniv[' + index + '].dLegDocFechaInicio',
              fecha,
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegDocFechaFin,
              'yyyy-MM-dd',
            )
            formData.append(
              'legDocenciaUniv[' + index + '].dLegDocFechaFin',
              fecha,
            )
            formData.append(
              'legDocenciaUniv[' + index + '].cFile',
              element.cLegDocArchivo,
            )
            formData.append('legDocenciaUniv[' + index + '].cLegGraArchivo', '')
            formData.append(
              'legDocenciaUniv[' + index + '].cLegDocValida',
              'false',
            )
            formData.append(
              'legDocenciaUniv[' + index + '].cLegDocEstado',
              'true',
            )
          },
        )

        this.lstserv.lCategoriaDocente.forEach(
          (element: LegCategoriaDocente, index) => {
            formData.append(
              'legCategoriaDocente[' + index + '].nLegCatCodigo',
              element.nLegCatCodigo.toString() ?? '0',
            )
            formData.append(
              'legCategoriaDocente[' + index + '].cLegCatInstitucion',
              element.cLegCatInstitucion.toString() ?? '',
            )
            formData.append(
              'legCategoriaDocente[' + index + '].cLegCatOtraInst',
              element.cLegCatOtraInst.toString() ?? '',
            )
            formData.append(
              'legCategoriaDocente[' + index + '].cLegCatPais',
              element.cLegCatPais.toString() ?? '',
            )
            formData.append(
              'legCategoriaDocente[' + index + '].nLegCatCategoria',
              element.nLegCatCategoria.toString() ?? '0',
            )
            formData.append(
              'legCategoriaDocente[' + index + '].nValorCategoria',
              element.nValorCategoria.toString() ?? '0',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegCatFechaInicio,
              'yyyy-MM-dd',
            )
            formData.append(
              'legCategoriaDocente[' + index + '].dLegCatFechaInicio',
              fecha,
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegCatFechaFin,
              'yyyy-MM-dd',
            )
            formData.append(
              'legCategoriaDocente[' + index + '].dLegCatFechaFin',
              fecha,
            )
            formData.append(
              'legCategoriaDocente[' + index + '].cFile',
              element.cLegCatArchivo,
            )
            formData.append(
              'legCategoriaDocente[' + index + '].cLegGraArchivo',
              '',
            )
            formData.append(
              'legCategoriaDocente[' + index + '].cLegCatValida',
              'false',
            )
            formData.append(
              'legCategoriaDocente[' + index + '].cLegCatEstado',
              'true',
            )
          },
        )

        this.lstserv.lRegimenDedic.forEach(
          (element: LegRegimenDedicacion, index) => {
            formData.append(
              'legRegimenDedicacion[' + index + '].nLegRegCodigo',
              element.nLegRegCodigo.toString() ?? '0',
            )
            formData.append(
              'legRegimenDedicacion[' + index + '].cLegCatInstitucion',
              element.cLegCatInstitucion.toString() ?? '',
            )
            formData.append(
              'legRegimenDedicacion[' + index + '].cLegRegOtraInst',
              element.cLegRegOtraInst.toString() ?? '',
            )
            formData.append(
              'legRegimenDedicacion[' + index + '].cLegRegPais',
              element.cLegRegPais.toString() ?? '',
            )
            formData.append(
              'legRegimenDedicacion[' + index + '].nLegRegDedicacion',
              element.nLegRegDedicacion.toString() ?? '0',
            )
            formData.append(
              'legRegimenDedicacion[' + index + '].nValorDedicacion',
              element.nValorDedicacion.toString() ?? '0',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegRegFechaInicio,
              'yyyy-MM-dd',
            )
            formData.append(
              'legRegimenDedicacion[' + index + '].dLegRegFechaInicio',
              fecha,
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegRegFechaFin,
              'yyyy-MM-dd',
            )
            formData.append(
              'legRegimenDedicacion[' + index + '].dLegRegFechaFin',
              fecha,
            )
            formData.append(
              'legRegimenDedicacion[' + index + '].cFile',
              element.cLegRegArchivo,
            )
            formData.append(
              'legRegimenDedicacion[' + index + '].cLegRegArchivo',
              '',
            )
            formData.append(
              'legRegimenDedicacion[' + index + '].cLegRegValida',
              'false',
            )
            formData.append(
              'legRegimenDedicacion[' + index + '].cLegRegEstado',
              'true',
            )
          },
        )

        this.lstserv.lProfesNoDocente.forEach(
          (element: LegProfesNoDocente, index) => {
            formData.append(
              'legProfesNoDocente[' + index + '].nLegProCodigo',
              element.nLegProCodigo.toString() ?? '0',
            )
            formData.append(
              'legProfesNoDocente[' + index + '].cLegProInstitucion',
              element.cLegProInstitucion.toString() ?? '',
            )
            formData.append(
              'legProfesNoDocente[' + index + '].cLegProOtraInst',
              element.cLegProOtraInst.toString() ?? '',
            )
            formData.append(
              'legProfesNoDocente[' + index + '].cLegProPais',
              element.cLegProPais.toString() ?? '',
            )
            formData.append(
              'legProfesNoDocente[' + index + '].nLegProCargo',
              element.nLegProCargo.toString() ?? '0',
            )
            formData.append(
              'legProfesNoDocente[' + index + '].cLegProCargoProf',
              element.cLegProCargoProf.toString() ?? '',
            )
            formData.append(
              'legProfesNoDocente[' + index + '].nValorCargo',
              element.nValorCargo.toString() ?? '0',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegProFechaInicio,
              'yyyy-MM-dd',
            )
            formData.append(
              'legProfesNoDocente[' + index + '].dLegProFechaInicio',
              fecha,
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegProFechaFin,
              'yyyy-MM-dd',
            )
            formData.append(
              'legProfesNoDocente[' + index + '].dLegProFechaFin',
              fecha,
            )
            formData.append(
              'legProfesNoDocente[' + index + '].cFile',
              element.cLegProArchivo,
            )
            formData.append(
              'legProfesNoDocente[' + index + '].cLegProArchivo',
              '',
            )
            formData.append(
              'legProfesNoDocente[' + index + '].cLegProValida',
              'false',
            )
            formData.append(
              'legProfesNoDocente[' + index + '].cLegProEstado',
              'true',
            )
          },
        )

        this.lstserv.lidiomasofimatica.forEach(
          (element: LegIdiomaOfimatica, index) => {
            formData.append(
              'legIdiomaOfimatica[' + index + '].nLegIdOfCodigo',
              element.nLegIdOfCodigo.toString() ?? '0',
            )
            formData.append(
              'legIdiomaOfimatica[' + index + '].nLegIdOfCodigoDesc',
              element.nLegIdOfCodigoDesc.toString() ?? '',
            )
            formData.append(
              'legIdiomaOfimatica[' + index + '].nValorDesc',
              element.nValorDesc.toString() ?? '0',
            )
            formData.append(
              'legIdiomaOfimatica[' + index + '].nLegIdOfNivel',
              element.nLegIdOfNivel.toString() ?? '0',
            )
            formData.append(
              'legIdiomaOfimatica[' + index + '].nValorNivel',
              element.nValorNivel.toString() ?? '0',
            )
            formData.append(
              'legIdiomaOfimatica[' + index + '].cLegIdOfTipo',
              element.cLegIdOfTipo.toString() ?? '',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegIdOfFecha,
              'yyyy-MM-dd',
            )
            formData.append(
              'legIdiomaOfimatica[' + index + '].dLegIdOfFecha',
              fecha,
            )
            formData.append(
              'legIdiomaOfimatica[' + index + '].cFile',
              element.cLegIdOfArchivo,
            )
            formData.append(
              'legIdiomaOfimatica[' + index + '].cLegIdOfArchivo',
              '',
            )
            formData.append(
              'legIdiomaOfimatica[' + index + '].cLegIdOfValida',
              'false',
            )
            formData.append(
              'legIdiomaOfimatica[' + index + '].cLegIdOfEstado',
              'true',
            )
          },
        )

        this.lstserv.linvestigador.forEach(
          (element: LegInvestigador, index) => {
            formData.append(
              'legInvestigador[' + index + '].nLegInvCodigo',
              element.nLegInvCodigo.toString() ?? '0',
            )
            formData.append(
              'legInvestigador[' + index + '].nLegInvCentroRegistro',
              element.nLegInvCentroRegistro.toString() ?? '',
            )
            formData.append(
              'legInvestigador[' + index + '].nValorCentroRegistro',
              element.nValorCentroRegistro.toString() ?? '0',
            )
            formData.append(
              'legInvestigador[' + index + '].cLegInvNroRegistro',
              element.cLegInvNroRegistro.toString() ?? '0',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegInvFechaInicio,
              'yyyy-MM-dd',
            )
            formData.append(
              'legInvestigador[' + index + '].dLegInvFechaInicio',
              fecha,
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegInvFechaFin,
              'yyyy-MM-dd',
            )
            formData.append(
              'legInvestigador[' + index + '].dLegInvFechaFin',
              fecha,
            )
            formData.append(
              'legInvestigador[' + index + '].cFile',
              element.cLegInvArchivo,
            )
            formData.append('legInvestigador[' + index + '].cLegInvArchivo', '')
            formData.append(
              'legInvestigador[' + index + '].cLegInvValida',
              'false',
            )
            formData.append(
              'legInvestigador[' + index + '].cLegInvEstado',
              'true',
            )
          },
        )

        this.lstserv.lTesisAsesJur.forEach((element: LegTesisAseJur, index) => {
          formData.append(
            'legTesisAseJur[' + index + '].nLegTesCodigo',
            element.nLegTesCodigo.toString() ?? '0',
          )
          formData.append(
            'legTesisAseJur[' + index + '].nLegTesTipo',
            element.nLegTesTipo.toString() ?? '0',
          )
          formData.append(
            'legTesisAseJur[' + index + '].nValorTipo',
            element.nValorTipo.toString() ?? '0',
          )
          formData.append(
            'legTesisAseJur[' + index + '].nLegTesNivel',
            element.nLegTesNivel.toString() ?? '0',
          )
          formData.append(
            'legTesisAseJur[' + index + '].nValorNivel',
            element.nValorNivel.toString() ?? '0',
          )
          formData.append(
            'legTesisAseJur[' + index + '].cLegTesNroResolucion',
            element.cLegTesNroResolucion.toString() ?? '',
          )
          fecha = this.configserv.datepipe.transform(
            element.dLegTesFecha,
            'yyyy-MM-dd',
          )
          formData.append('legTesisAseJur[' + index + '].dLegTesFecha', fecha)
          formData.append(
            'legTesisAseJur[' + index + '].cFile',
            element.cLegTesArchivo,
          )
          formData.append('legTesisAseJur[' + index + '].cLegTesArchivo', '')
          formData.append(
            'legTesisAseJur[' + index + '].cLegTesValida',
            'false',
          )
          formData.append('legTesisAseJur[' + index + '].cLegTesEstado', 'true')
        })

        this.lstserv.lProduccionCiencia.forEach(
          (element: LegProduccionCiencia, index) => {
            formData.append(
              'legProduccionCiencia[' + index + '].nLegProdCodigo',
              element.nLegProdCodigo.toString() ?? '0',
            )
            formData.append(
              'legProduccionCiencia[' + index + '].cLegProdNroResolucion',
              element.cLegProdNroResolucion.toString() ?? '',
            )
            formData.append(
              'legProduccionCiencia[' + index + '].cLegProdTitulo',
              element.cLegProdTitulo.toString() ?? '',
            )
            formData.append(
              'legProduccionCiencia[' + index + '].nLegProdTipo',
              element.nLegProdTipo.toString() ?? '0',
            )
            formData.append(
              'legProduccionCiencia[' + index + '].nValorTipo',
              element.nValorTipo.toString() ?? '0',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegProdFecha,
              'yyyy-MM-dd',
            )
            formData.append(
              'legProduccionCiencia[' + index + '].dLegProdFecha',
              fecha,
            )
            formData.append(
              'legProduccionCiencia[' + index + '].cFile',
              element.cLegProdArchivo,
            )
            formData.append(
              'legProduccionCiencia[' + index + '].cLegProdArchivo',
              '',
            )
            formData.append(
              'legProduccionCiencia[' + index + '].cLegProdValida',
              'false',
            )
            formData.append(
              'legProduccionCiencia[' + index + '].cLegProdEstado',
              'true',
            )
          },
        )

        this.lstserv.lParticipacion.forEach(
          (element: LegParticipacionCongSem, index) => {
            formData.append(
              'legParticipacionCongSem[' + index + '].nLegParCodigo',
              element.nLegParCodigo.toString() ?? '0',
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].cLegParInstitucion',
              element.cLegParInstitucion.toString() ?? '',
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].cLegParOtraInst',
              element.cLegParOtraInst.toString() ?? '',
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].cLegParPais',
              element.cLegParPais.toString() ?? '',
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].cLegParNombre',
              element.cLegParNombre.toString() ?? '',
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].nLegParRol',
              element.nLegParRol.toString() ?? '0',
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].nValorRol',
              element.nValorRol.toString() ?? '0',
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].nLegParAmbito',
              element.nLegParAmbito.toString() ?? '0',
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].nValorAmbito',
              element.nValorAmbito.toString() ?? '0',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegParFecha,
              'yyyy-MM-dd',
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].dLegParFecha',
              fecha,
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].cFile',
              element.cLegParArchivo,
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].cLegParArchivo',
              '',
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].cLegParValida',
              'false',
            )
            formData.append(
              'legParticipacionCongSem[' + index + '].cLegParEstado',
              'true',
            )
          },
        )

        this.lstserv.lAdminitrativaCarga.forEach(
          (element: LegAdminitrativaCarga, index) => {
            formData.append(
              'legAdminitrativaCarga[' + index + '].nLegAdmCodigo',
              element.nLegAdmCodigo.toString() ?? '0',
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].cLegAdmInstitucion',
              element.cLegAdmInstitucion.toString() ?? '',
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].cLegAdmOtraInst',
              element.cLegAdmOtraInst.toString() ?? '',
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].cLegAdmPais',
              element.cLegAdmPais.toString() ?? '',
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].cLegAdmDocumento',
              element.cLegAdmDocumento.toString() ?? '',
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].nLegAdmCargo',
              element.nLegAdmCargo.toString() ?? '0',
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].nClaseCargo',
              element.nClaseCargo.toString() ?? '0',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegAdmFechaInicio,
              'yyyy-MM-dd',
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].dLegAdmFechaInicio',
              fecha,
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegAdmFechaFin,
              'yyyy-MM-dd',
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].dLegAdmFechaFin',
              fecha,
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].cFile',
              element.cLegAdmArchivo,
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].cLegAdmArchivo',
              '',
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].cLegAdmValida',
              'false',
            )
            formData.append(
              'legAdminitrativaCarga[' + index + '].cLegAdmEstado',
              'true',
            )
          },
        )

        this.lstserv.lReconocimiento.forEach(
          (element: LegReconocimiento, index) => {
            formData.append(
              'legReconocimiento[' + index + '].nLegRecCodigo',
              element.nLegRecCodigo.toString() ?? '0',
            )
            formData.append(
              'legReconocimiento[' + index + '].cLegRecInstitucion',
              element.cLegRecInstitucion.toString() ?? '',
            )
            formData.append(
              'legReconocimiento[' + index + '].cLegRecOtraInst',
              element.cLegRecOtraInst.toString() ?? '',
            )
            formData.append(
              'legReconocimiento[' + index + '].cLegRecPais',
              element.cLegRecPais.toString() ?? '',
            )
            formData.append(
              'legReconocimiento[' + index + '].nLegRecDocumento',
              element.nLegRecDocumento.toString() ?? '0',
            )
            formData.append(
              'legReconocimiento[' + index + '].nValorDocumento',
              element.nValorDocumento.toString() ?? '0',
            )
            formData.append(
              'legReconocimiento[' + index + '].nLegRecTipo',
              element.nLegRecTipo.toString() ?? '0',
            )
            formData.append(
              'legReconocimiento[' + index + '].nValorTipo',
              element.nValorTipo.toString() ?? '0',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegRecFecha,
              'yyyy-MM-dd',
            )
            formData.append(
              'legReconocimiento[' + index + '].dLegRecFecha',
              fecha,
            )
            formData.append(
              'legReconocimiento[' + index + '].cFile',
              element.cLegRecArchivo,
            )
            formData.append(
              'legReconocimiento[' + index + '].cLegRecArchivo',
              '',
            )
            formData.append(
              'legReconocimiento[' + index + '].cLegRecValida',
              'false',
            )
            formData.append(
              'legReconocimiento[' + index + '].cLegRecEstado',
              'true',
            )
          },
        )

        this.lstserv.lcapacitaciones.forEach(
          (element: LegCapacitaciones, index) => {
            formData.append(
              'legCapacitaciones[' + index + '].nLegCapCodigo',
              element.nLegCapCodigo.toString() ?? '0',
            )
            formData.append(
              'legCapacitaciones[' + index + '].cLegCapInstitucion',
              element.cLegCapInstitucion.toString() ?? '',
            )
            formData.append(
              'legCapacitaciones[' + index + '].cLegCapOtraInst',
              element.cLegCapOtraInst.toString() ?? '',
            )
            formData.append(
              'legCapacitaciones[' + index + '].cLegCapPais',
              element.cLegCapPais.toString() ?? '',
            )
            formData.append(
              'legCapacitaciones[' + index + '].cLegCapNombre',
              element.cLegCapNombre.toString() ?? '',
            )
            formData.append(
              'legCapacitaciones[' + index + '].nLegCapTipo',
              element.nLegCapTipo.toString() ?? '0',
            )
            formData.append(
              'legCapacitaciones[' + index + '].nValorTipo',
              element.nValorTipo.toString() ?? '0',
            )
            formData.append(
              'legCapacitaciones[' + index + '].nLegCapTipoEsp',
              element.nLegCapTipoEsp.toString() ?? '0',
            )
            formData.append(
              'legCapacitaciones[' + index + '].nValorTipoEsp',
              element.nValorTipoEsp.toString() ?? '0',
            )
            formData.append(
              'legCapacitaciones[' + index + '].nLegCapHoras',
              element.nLegCapHoras.toString() ?? '0',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegCapFechaInicio,
              'yyyy-MM-dd',
            )
            formData.append(
              'legCapacitaciones[' + index + '].dLegCapFechaInicio',
              fecha,
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegCapFechaFin,
              'yyyy-MM-dd',
            )
            formData.append(
              'legCapacitaciones[' + index + '].dLegCapFechaFin',
              fecha,
            )
            formData.append(
              'legCapacitaciones[' + index + '].cFile',
              element.cLegCapArchivo,
            )
            formData.append(
              'legCapacitaciones[' + index + '].cLegCapArchivo',
              '',
            )
            formData.append(
              'legCapacitaciones[' + index + '].cLegCapValida',
              'false',
            )
            formData.append(
              'legCapacitaciones[' + index + '].cLegCapEstado',
              'true',
            )
          },
        )

        this.lstserv.lProyeccionSoc.forEach(
          (element: LegProyeccionSocial, index) => {
            formData.append(
              'legProyeccionSocial[' + index + '].nLegProyCodigo',
              element.nLegProyCodigo.toString() ?? '0',
            )
            formData.append(
              'legProyeccionSocial[' + index + '].cLegProyInstitucion',
              element.cLegProyInstitucion.toString() ?? '',
            )
            formData.append(
              'legProyeccionSocial[' + index + '].cLegProyOtraInst',
              element.cLegProyOtraInst.toString() ?? '',
            )
            formData.append(
              'legProyeccionSocial[' + index + '].cLegProyPais',
              element.cLegProyPais.toString() ?? '',
            )
            formData.append(
              'legProyeccionSocial[' + index + '].cLegProyDescripcion',
              element.cLegProyDescripcion.toString() ?? '',
            )
            formData.append(
              'legProyeccionSocial[' + index + '].nLegProyTipo',
              element.nLegProyTipo.toString() ?? '0',
            )
            formData.append(
              'legProyeccionSocial[' + index + '].nValorTipo',
              element.nValorTipo.toString() ?? '0',
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegProyFechaInicio,
              'yyyy-MM-dd',
            )
            formData.append(
              'legProyeccionSocial[' + index + '].dLegProyFechaInicio',
              fecha,
            )
            fecha = this.configserv.datepipe.transform(
              element.dLegProyFechaFin,
              'yyyy-MM-dd',
            )
            formData.append(
              'legProyeccionSocial[' + index + '].dLegProyFechaFin',
              fecha,
            )
            formData.append(
              'legProyeccionSocial[' + index + '].cFile',
              element.cLegProyArchivo,
            )
            formData.append(
              'legProyeccionSocial[' + index + '].cLegProyArchivo',
              '',
            )
            formData.append(
              'legProyeccionSocial[' + index + '].cLegProyValida',
              'false',
            )
            formData.append(
              'legProyeccionSocial[' + index + '].cLegProyEstado',
              'true',
            )
          },
        )

        this.regserv
          .registroFile('Registro de Legajos', 'legajo', formData)
          .then((data) => {
            this.spinner.hide()
            if (this.segserv.usuarioreg.nRol == 1) {
              this.ctrlserv._banregister = false
            }
          })
      } else {
        this.spinner.show()
        this.regserv
          .actualizarFile(
            'Registro de Legajos',
            'legajo/put/' + this.regLegDatosGenerales.nLegDatCodigo,
            formData,
          )
          .then((data) => {
            this.spinner.hide()
            if (this.segserv.usuarioreg.nRol == 1) {
              this.ctrlserv._banregister = false
            }
          })
      }
    } catch (e) {
      this.spinner.hide()
      console.log(e)
    }
  }

  eliminar_cv($obj: LegDatosGenerales) {}

  filterIdiomas(regis: LegIdiomaOfimatica) {
    return regis.cLegIdOfTipo == false
  }

  filterOfimatica(regis: LegIdiomaOfimatica) {
    return regis.cLegIdOfTipo == true
  }

  async exportar($objaux: DatosUsuario) {
    let validacion = this.validar_Exportar($objaux)

    if (validacion) {
      let data: any = await this.lstserv.verififcarValidacionDocumento(
        $objaux.cPerCodigo,
      )
      if (data.cstate) {
        window.open(
          environment.URLAPI +
            'legajo_pdf/' +
            btoa($objaux.cPerCodigo) +
            '/' +
            btoa($objaux.nTipo.toString()),
          '_blank',
        )
      } else {
        Swal.fire({
          title: data.cmessage,
          //showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          //denyButtonText: `Cancelar`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            window.open(
              environment.URLAPI +
                'legajo_pdf/' +
                btoa($objaux.cPerCodigo) +
                '/' +
                btoa($objaux.nTipo.toString()),
              '_blank',
            )
          }
          // else if (result.isDenied) {
          //   Swal.fire('Changes are not saved', '', 'info')
          // }
        })
      }
    } else {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales. Solicite que el colaborador actualice sus datos.',
        'error',
      )
    }

    // if (this.pageService.dataSource.filter(v => v.cPerCodigo == $objaux.cPerCodigo)[0].bLegajo == true) {
    //   window.open(
    //     environment.URLAPI + 'legajo_pdf/' + btoa($objaux.cPerCodigo) + '/' + btoa($objaux.nTipo.toString())
    //     ,
    //     "_blank"
    //   );
    // } else {
    //   Swal.fire("Control de Legajos", "No se ha encontrado datos generales. Solicite que el colaborador actualice sus datos.", "error")
    // }
  }

  validar_Exportar($objaux: DatosUsuario) {
    let val = true
    if (this.pageService.dataSource.length > 0) {
      val =
        this.pageService.dataSource.filter(
          (v) => v.cPerCodigo == $objaux.cPerCodigo,
        )[0].bLegajo == true
    } else {
      val = $objaux.bLegajo
    }

    // (this.pageService.dataSource.filter(v => v.cPerCodigo == $objaux.cPerCodigo)[0].bLegajo == true) || this.pageService.dataSource.length == 0
    return val
  }

  exportar_legajo($objaux: DatosUsuario) {
    console.log('legajoexp-pdf :: ' + $objaux)
    window.open(
      environment.URLAPI +
        'legajoexp-pdf/' +
        btoa($objaux.cPerCodigo) +
        '/' +
        btoa($objaux.nTipo.toString()),
      '_blank',
    )
  }

  ver_datos($objaux: DatosUsuario) {
    if ($objaux.bLegajo) {
      this.lstserv
        .listado('legajo_percodigo', '/' + $objaux.cPerCodigo)
        .then((data) => {
          data.vGradoAcad.cIntDescripcion =
            data.vGradoAcad.cIntDescripcion ?? ''
          this.mdlserv.nuevoModalDatosGenerales('Datos Generales', data)
        })
    } else {
      Swal.fire(
        'Control de Legajos',
        'No se ha encontrado datos generales.',
        'info',
      )
    }
  }

  editar_cv($objaux: DatosUsuario) {
    this.spinner.show()
    this.limpiar_controles()
    this.regLegDatosGenerales.cPerCodigo = $objaux.cPerCodigo

    this.clmdserv.objusuario = $objaux

    this.segserv.obtenerdatosusuario()
    this.ban_administrativo = $objaux.nTipo == 1 ? true: false
    this.lstserv.listado('legajoaux/', $objaux.cPerCodigo).then((data) => {
      //
      if (JSON.stringify(data) != '[]') {
        if (this.configserv.nTareaValidar != this.bValidar) {
          this.lstserv
            .listado(
              'mensajelegajo/',
              data.nLegDatCodigo + '/' + !this.ban_administrativo,
            )
            .then((data) => {
              if (data.toString().trim() != '') {
                this.lstserv.lmsjLegajo = data
                this._bottomSheet.open(MensajelegajoComponent)
              }
            })
        }
        if (data.nLegDatCodigo == 0 || data.nLegDatCodigo == null) {
          Swal.fire(
            'Control de Legajos',
            'Legajo no tiene datos generales, se cargaron datos de SEUSS, proceda a completar los datos y guardar.',
            'info',
          )
        }
        this.regLegDatosGenerales = data
        let $obj: LegDatosGenerales = this.regLegDatosGenerales
        this.previewUrl = environment.PHOTOSEUSS + $obj.cPerCodigo
        this.previewFirmaUrl =
          $obj.cLegDatFirma != null && $obj.cLegDatFirma != ''
            ? environment.APIFILE + $obj.cLegDatFirma
            : environment.FIRMADEFAULT
        // -------------------
        this.regLegDatosGenerales.cFileSunedu =
          $obj.cLegDatSunedu != null && $obj.cLegDatSunedu != ''
            ? environment.APIFILEPDF + $obj.cLegDatSunedu
            : ''
       // -------------------
        this.regLegDatosGenerales.cFilePolicial =
          $obj.cLegDatPolicial != null && $obj.cLegDatPolicial != ''
            ? environment.APIFILEPDF + $obj.cLegDatPolicial
            : ''
        //
        this.regLegDatosGenerales.cFileConadis =
          $obj.cLegDatArchivoConadis != null && $obj.cLegDatArchivoConadis != ''
            ? environment.APIFILEPDF + $obj.cLegDatArchivoConadis
            : ''
        //
        this.regLegDatosGenerales.cFileJudicial =
          $obj.cLegDatJudicial != null && $obj.cLegDatJudicial != ''
            ? environment.APIFILEPDF + $obj.cLegDatJudicial
            : ''
        this.errregsunedu =
          $obj.cLegDatSunedu != null && $obj.cLegDatSunedu != '' ? true : false
        this.errregconadis =
          $obj.cLegDatArchivoConadis != null && $obj.cLegDatArchivoConadis != ''
            ? true
            : false
        this.errpolicial =
          $obj.cLegDatPolicial != null && $obj.cLegDatPolicial != ''
            ? true
            : false
        this.errjudicial =
          $obj.cLegDatJudicial != null && $obj.cLegDatJudicial != ''
            ? true
            : false
            // -------------------
            this.regLegDatosGenerales.cFileBuenaSalud =
            $obj.cLegDatBuenaSalud != null && $obj.cLegDatBuenaSalud != ''
            ? environment.APIFILEPDF + $obj.cLegDatBuenaSalud
            : ''
            // -------------------

        this.errregbuenasalud =
          $obj.cLegDatBuenaSalud != null && $obj.cLegDatBuenaSalud != ''
            ? true
            : false
        let nacimiento: number = 0
        let dptonacimiento: number = 0
        let provnacimiento: number = 0
        let distnacimiento: number = 0

        let dptodomic: number = 0
        let provdomic: number = 0
        let distdomic: number = 0

        console.log(this.regLegDatosGenerales.cLegDatBuenaSalud)

        if ($obj.nClaseNacimiento != null && $obj.nClaseNacimiento != 0) {
          if ($obj.vNacimiento.cIntJerarquia.trim().length == 3) {
            let objnac: Interface[] = this.lstserv.lpaisNac.filter(
              (x) => x.nIntCodigo == $obj.vNacimiento.nIntCodigo,
            )
            nacimiento = objnac.length > 0 ? objnac[0].nIntCodigo : 0
          } else {
            let filter = this.lstserv.lpaisNac.filter(
              (x) => x.cIntJerarquia.trim() == 'PER',
            )
            nacimiento = filter[0].nIntCodigo
            this.ubigeoOnChange(filter[0], 0)

            filter = this.lstserv.lubigeo.filter(
              (x) =>
                x.cIntJerarquia.trim() ==
                $obj.vNacimiento.cIntJerarquia.trim().substring(0, 2),
            )
            dptonacimiento = filter[0].nIntCodigo
            this.ubigeoOnChange(filter[0], 4)

            filter = this.lstserv.lubigeo.filter(
              (x) =>
                x.cIntJerarquia.trim() ==
                $obj.vNacimiento.cIntJerarquia.trim().substring(0, 4),
            )
            provnacimiento = filter[0].nIntCodigo
            this.ubigeoOnChange(filter[0], 5)

            filter = this.lstserv.lubigeo.filter(
              (x) =>
                x.cIntJerarquia.trim() ==
                $obj.vNacimiento.cIntJerarquia.trim().substring(0, 6),
            )
            distnacimiento = filter[0].nIntCodigo
            this.ubigeoOnChange(filter[0], 6)
          }
        }
        if ($obj.nLetDatUbigeo != null && $obj.nLetDatUbigeo != 0) {
          let ubigeo = this.lstserv.lubigeo.filter(
            (x) => x.nIntCodigo == $obj.nLetDatUbigeo,
          )[0]
          let filter = this.lstserv.lubigeo.filter(
            (x) =>
              x.cIntJerarquia.trim() ==
              ubigeo.cIntJerarquia.trim().substring(0, 2),
          )
          dptodomic = filter[0].nIntCodigo
          this.ubigeoOnChange(filter[0], 1)

          filter = this.lstserv.lubigeo.filter(
            (x) =>
              x.cIntJerarquia.trim() ==
              ubigeo.cIntJerarquia.trim().substring(0, 4),
          )
          provdomic = filter[0].nIntCodigo
          this.ubigeoOnChange(filter[0], 2)

          filter = this.lstserv.lubigeo.filter(
            (x) =>
              x.cIntJerarquia.trim() ==
              ubigeo.cIntJerarquia.trim().substring(0, 6),
          )
          distdomic = filter[0].nIntCodigo
          this.ubigeoOnChange(filter[0], 3)
        }
        if (
          $obj.nValorCondicionColeg != null &&
          $obj.nValorCondicionColeg != 0
        ) {
          this.FormGroup2.setValue({
            colegioprofControl: $obj.cLegDatColegioProf,
            condicionControl: $obj.vCondicionColeg.nConValor ?? 0,
            colegionroControl: $obj.cLegDatNroColegiatura ?? '',
          })
          this.myControl.setValue($obj.cLegDatColegioProfNavigation.cPerNombre)
          this.dateFEmi =
            $obj.dLegDatosFechaEmisionColeg == new Date(this.clmdserv.fechadef)
              ? new FormControl(new Date(''))
              : new FormControl(new Date($obj.dLegDatosFechaEmisionColeg))
          this.dateFExp =
            $obj.dLegDatosFechaExpiraColeg == new Date(this.clmdserv.fechadef)
              ? new FormControl(new Date(''))
              : new FormControl(new Date($obj.dLegDatosFechaExpiraColeg))
        }
        if ($obj.vGradoAcad != null)
          $obj.vGradoAcad.cIntDescripcion == $obj.vGradoAcad.cIntDescripcion ??
            ''

        this.FormGroup1.setValue({
          apellidopaternoControl:
            $obj.cLegDatApellidoPaterno == null
              ? ''
              : $obj.cLegDatApellidoPaterno.trim() ?? '',
          apellidomaternoControl:
            $obj.cLegDatApellidoMaterno == null
              ? ''
              : $obj.cLegDatApellidoMaterno.trim() ?? '',
          nombresControl:
            $obj.cLegDatNombres == null ? '' : $obj.cLegDatNombres.trim() ?? '',
          emailControl:
            $obj.cLegDatEmail == null ? '' : $obj.cLegDatEmail.trim() ?? '',
          telefonoControl:
            $obj.cLegDatTelefono == null
              ? ''
              : $obj.cLegDatTelefono.trim() ?? '',
          movilControl:
            $obj.cLegDatMovil == null ? '' : $obj.cLegDatMovil.trim() ?? '',
          departamentoControl: dptodomic,
          provinciaControl: provdomic,
          distritoControl: distdomic,
          paisNacControl: nacimiento,
          departamentoNacControl: dptonacimiento,
          provinciaNacControl: provnacimiento,
          distritoNacControl: distnacimiento,
          edadControl: '',
          gradoacademicoControl:
            $obj.vGradoAcad == null ? 0 : $obj.vGradoAcad.nIntCodigo ?? 0,
          nacionalidadControl:
            $obj.vPais == null ? 0 : $obj.vPais.nIntCodigo ?? 0,
          tipodocumentoControl:
            $obj.vTipoDoc == null ? 0 : $obj.vTipoDoc.nIntCodigo ?? 0,
          nrodocumentoControl:
            $obj.cLegDatNroDoc == null ? '' : $obj.cLegDatNroDoc,
          sexoControl: $obj.vSexo == null ? 0 : $obj.vSexo.nConValor,
          estadocivilControl:
            $obj.vEstadoCivil == null ? 0 : $obj.vEstadoCivil.nConValor ?? 0,
          tipodomicilioControl:
            $obj.vTipoDomicilio == null
              ? 0
              : $obj.vTipoDomicilio.nConValor ?? 0,
          zonaControl: $obj.vZona == null ? 0 : $obj.vZona.nConValor ?? 0,
          direccionControl:
            $obj.cLegDatCalleDomicilio == null
              ? ''
              : $obj.cLegDatCalleDomicilio.trim() ?? '',
          numeroControl:
            $obj.cLegDatNroDomicilio == null
              ? ''
              : $obj.cLegDatNroDomicilio.trim() ?? '',
          dptoControl:
            $obj.cLegDatDptoDomicilio == null
              ? ''
              : $obj.cLegDatDptoDomicilio.trim() ?? '',
          mzaControl:
            $obj.cLegDatMzaDomicilio == null
              ? ''
              : $obj.cLegDatMzaDomicilio.trim() ?? '',
          lteControl:
            $obj.cLegDatLtDomicilio == null
              ? ''
              : $obj.cLegDatLtDomicilio.trim() ?? '',
          referenciaControl:
            $obj.cLegDatReferencia == null
              ? ''
              : $obj.cLegDatReferencia.trim() ?? '',
          idiomaNativoControl:
            $obj.nLegIdiomaNativo == null ? 0 : $obj.nLegIdiomaNativo ?? 0,
        })
        this.EndFormGroup.setValue({
          acercaControl: $obj.cLegDatAcerca,
        })
        this.ctrlserv.colaboradornombre =
          this.FormGroup1.get('nombresControl')?.value +
          ' ' +
          this.FormGroup1.get('apellidopaternoControl')?.value +
          ' ' +
          this.FormGroup1.get('apellidomaternoControl')?.value

        this.date =
          $obj.dLegDatFechaNacimiento == new Date(this.clmdserv.fechadef)
            ? new FormControl(new Date(''))
            : new FormControl(new Date($obj.dLegDatFechaNacimiento))
        if ($obj.dLegDatFechaNacimiento != new Date(this.clmdserv.fechadef)) {
          this.obtener_edad(new Date($obj.dLegDatFechaNacimiento))
        }
        if ($obj.legGradoTitulo.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legGradoTitulo = $obj.legGradoTitulo.filter(
              (x) => x.cLegGraValida == false,
            )
          }
          $obj.legGradoTitulo.forEach((item) => {
            if (item.cLegGraInstitucion.trim() == '') {
              item.cLegGraInstitucion = this.clmdserv.codigonoinst
              item.cLegGraInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.cLegGraInstitucionNavigation.cPerNombre =
              item.cLegGraInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.vGradoAcad.cIntDescripcion =
              item.vGradoAcad.cIntDescripcion ?? ''
            item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegGraArchivo =
              item.cLegGraArchivo != ''
                ? (item.cUsuRegistro == 'pdf'
                    ? environment.APIFILEPDF
                    : environment.APIFILE) + item.cLegGraArchivo
                : environment.CERTDEFAULT
          })
          this.lstserv.lLegGradoTitulo = $obj.legGradoTitulo
        }

        if ($obj.legDocenciaUniv.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legDocenciaUniv = $obj.legDocenciaUniv.filter(
              (x) => x.cLegDocValida == false,
            )
          }
          $obj.legDocenciaUniv.forEach((item) => {
            if (item.cLegDocUniversidad.trim() == '') {
              item.cLegDocUniversidad = this.clmdserv.codigonoinst
              item.cLegDocUniversidadNavigation = this.clmdserv.empty_persona()
            }
            item.cLegDocUniversidadNavigation.cPerNombre =
              item.cLegDocUniversidadNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.vCategoria.cConDescripcion =
              item.vCategoria.cConDescripcion ?? ''
            item.vRegimen.cConDescripcion = item.vRegimen.cConDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegDocArchivo = item.cLegDocArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegDocArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lLegDocenciaUniv = $obj.legDocenciaUniv
        }

        if ($obj.legCategoriaDocente.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legCategoriaDocente = $obj.legCategoriaDocente.filter(
              (x) => x.cLegCatValida == false,
            )
          }
          $obj.legCategoriaDocente.forEach((item) => {
            if (item.cLegCatInstitucion.trim() == '') {
              item.cLegCatInstitucion = this.clmdserv.codigonoinst
              item.cLegCatInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.cLegCatInstitucionNavigation.cPerNombre =
              item.cLegCatInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.vCategoria.cConDescripcion =
              item.vCategoria.cConDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegCatArchivo = item.cLegCatArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegCatArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lCategoriaDocente = $obj.legCategoriaDocente
        }
        if ($obj.legRegimenDedicacion.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legRegimenDedicacion = $obj.legRegimenDedicacion.filter(
              (x) => x.cLegRegValida == false,
            )
          }
          $obj.legRegimenDedicacion.forEach((item) => {
            if (item.cLegCatInstitucion.trim() == '') {
              item.cLegCatInstitucion = this.clmdserv.codigonoinst
              item.cLegCatInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.cLegCatInstitucionNavigation.cPerNombre =
              item.cLegCatInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.vDedicacion.cConDescripcion =
              item.vDedicacion.cConDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegRegArchivo = item.cLegRegArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegRegArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lRegimenDedic = $obj.legRegimenDedicacion
        }
        if ($obj.legProfesNoDocente.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legProfesNoDocente = $obj.legProfesNoDocente.filter(
              (x) => x.cLegProValida == false,
            )
          }
          $obj.legProfesNoDocente.forEach((item) => {
            if (item.cLegProInstitucion.trim() == '') {
              item.cLegProInstitucion = this.clmdserv.codigonoinst
              item.cLegProInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.cLegProInstitucionNavigation.cPerNombre =
              item.cLegProInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.vCargo =
              item.vCargo == null
                ? this.clmdserv.empty_constante()
                : item.vCargo
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegProArchivo = item.cLegProArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegProArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lProfesNoDocente = $obj.legProfesNoDocente
        }
        if ($obj.legIdiomaOfimatica.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legIdiomaOfimatica = $obj.legIdiomaOfimatica.filter(
              (x) => x.cLegIdOfValida == false,
            )
          }
          $obj.legIdiomaOfimatica.forEach((item) => {
            item.vCodigoDesc.cConDescripcion =
              item.vCodigoDesc.cConDescripcion ?? ''
            item.vNivel.cConDescripcion = item.vNivel.cConDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegIdOfArchivo = item.cLegIdOfArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegIdOfArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lidiomasofimatica = $obj.legIdiomaOfimatica

          this.lstserv.lofimatica = this.lstserv.lidiomasofimatica.filter(
            (x) => x.cLegIdOfTipo == true,
          )
          this.lstserv.lidioma = this.lstserv.lidiomasofimatica.filter(
            (x) => x.cLegIdOfTipo == false,
          )
        }
        if ($obj.legInvestigador.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legInvestigador = $obj.legInvestigador.filter(
              (x) => x.cLegInvValida == false,
            )
          }
          $obj.legInvestigador.forEach((item) => {
            item.vCentroRegistro.cIntDescripcion =
              item.vCentroRegistro.cIntDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegInvArchivo = item.cLegInvArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegInvArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.linvestigador = $obj.legInvestigador
        }
        if ($obj.legTesisAseJur.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legTesisAseJur = $obj.legTesisAseJur.filter(
              (x) => x.cLegTesValida == false,
            )
          }
          $obj.legTesisAseJur.forEach((item) => {
            item.vNivel.cConDescripcion = item.vNivel.cConDescripcion ?? ''
            item.vTipo.cIntDescripcion = item.vTipo.cIntDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegTesArchivo = item.cLegTesArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegTesArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lTesisAsesJur = $obj.legTesisAseJur
        }
        if ($obj.legProduccionCiencia.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legProduccionCiencia = $obj.legProduccionCiencia.filter(
              (x) => x.cLegProdValida == false,
            )
          }
          $obj.legProduccionCiencia.forEach((item) => {
            item.vTipo.cIntDescripcion = item.vTipo.cIntDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegProdArchivo = item.cLegProdArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegProdArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lProduccionCiencia = $obj.legProduccionCiencia
        }
        if ($obj.legParticipacionCongSem.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legParticipacionCongSem = $obj.legParticipacionCongSem.filter(
              (x) => x.cLegParValida == false,
            )
          }
          $obj.legParticipacionCongSem.forEach((item) => {
            if (item.cLegParInstitucion.trim() == '') {
              item.cLegParInstitucion = this.clmdserv.codigonoinst
              item.cLegParInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.cLegParInstitucionNavigation.cPerNombre =
              item.cLegParInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.vRol.cIntDescripcion = item.vRol.cIntDescripcion ?? ''
            item.vAmbito.cIntDescripcion = item.vAmbito.cIntDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegParArchivo = item.cLegParArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegParArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lParticipacion = $obj.legParticipacionCongSem
        }
        if ($obj.legAdminitrativaCarga.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legAdminitrativaCarga = $obj.legAdminitrativaCarga.filter(
              (x) => x.cLegAdmValida == false,
            )
          }
          $obj.legAdminitrativaCarga.forEach((item) => {
            if (item.cLegAdmInstitucion.trim() == '') {
              item.cLegAdmInstitucion = this.clmdserv.codigonoinst
              item.cLegAdmInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.vCargo.cConDescripcion = item.vCargo.cConDescripcion ?? ''
            item.cLegAdmInstitucionNavigation.cPerNombre =
              item.cLegAdmInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegAdmArchivo = item.cLegAdmArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegAdmArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lAdminitrativaCarga = $obj.legAdminitrativaCarga
        }
        if ($obj.legReconocimiento.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legReconocimiento = $obj.legReconocimiento.filter(
              (x) => x.cLegRecValida == false,
            )
          }
          $obj.legReconocimiento.forEach((item) => {
            if (item.cLegRecInstitucion.trim() == '') {
              item.cLegRecInstitucion = this.clmdserv.codigonoinst
              item.cLegRecInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.vDocumento.cConDescripcion =
              item.vDocumento.cConDescripcion ?? ''
            item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
            item.cLegRecInstitucionNavigation.cPerNombre =
              item.cLegRecInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegRecArchivo = item.cLegRecArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegRecArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lReconocimiento = $obj.legReconocimiento
        }
        if ($obj.legCapacitaciones.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legCapacitaciones = $obj.legCapacitaciones.filter(
              (x) => x.cLegCapValida == false,
            )
          }
          $obj.legCapacitaciones.forEach((item) => {
            if (item.cLegCapInstitucion.trim() == '') {
              item.cLegCapInstitucion = this.clmdserv.codigonoinst
              item.vInstitucion = this.clmdserv.empty_persona()
            }
            item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
            item.vTipoEsp.cConDescripcion = item.vTipoEsp.cConDescripcion ?? ''
            item.vInstitucion.cPerNombre =
              item.vInstitucion.cPerNombre ?? this.clmdserv.nombrenoinst
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegCapArchivo = item.cLegCapArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegCapArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lcapacitaciones = $obj.legCapacitaciones
        }
        if ($obj.legProyeccionSocial.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legProyeccionSocial = $obj.legProyeccionSocial.filter(
              (x) => x.cLegProyValida == false,
            )
          }
          $obj.legProyeccionSocial.forEach((item) => {
            if (item.cLegProyInstitucion.trim() == '') {
              item.cLegProyInstitucion = this.clmdserv.codigonoinst
              item.cLegProyInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
            item.cLegProyInstitucionNavigation.cPerNombre =
              item.cLegProyInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegProyArchivo = item.cLegProyArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegProyArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lProyeccionSoc = $obj.legProyeccionSocial
        }
        if ($obj.legCapacitacionInternas.length > 0) {
          $obj.legCapacitacionInternas.forEach((item) => {
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegCiarchivo = item.cLegCiarchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegCiarchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lCapacitacionInterna = $obj.legCapacitacionInternas
        }

        if ($obj.legContratos.length > 0) {
          $obj.legContratos.forEach((item) => {
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
            item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
            item.cLegConArchivo = item.cLegConArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegConArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lContrato = $obj.legContratos
        }

        if ($obj.legResoluciones.length > 0) {
          $obj.legResoluciones.forEach((item) => {
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.vResolucion.cConDescripcion =
              item.vResolucion.cConDescripcion ?? ''
            item.cLegResArchivo = item.cLegResArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegResArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lResolucion = $obj.legResoluciones
        }

        if ($obj.legEvaluacionDesemp.length > 0) {
          $obj.legEvaluacionDesemp.forEach((item) => {
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
            item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
            item.vNivel.cConDescripcion = item.vNivel.cConDescripcion ?? ''
            item.cLegEvalArchivo = item.cLegEvalArchivo
              ? (item.cUsuRegistro == 'pdf'
                  ? environment.APIFILEPDF
                  : environment.APIFILE) + item.cLegEvalArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lEvaluacionDesemp = $obj.legEvaluacionDesemp
        }

        if ($obj.legSeleccion.length > 0) {
          $obj.legSeleccion.forEach((item) => {
            item.cLegSelEvaluacionCv =
              environment.APIFILEPDF + item.cLegSelEvaluacionCv ??
              environment.CERTDEFAULT
            item.cLegSelClaseModelo =
              environment.APIFILEPDF + item.cLegSelClaseModelo ??
              environment.CERTDEFAULT
            item.cLegSelEvaluacionPsico =
              environment.APIFILEPDF + item.cLegSelEvaluacionPsico ??
              environment.CERTDEFAULT
            item.cLegSelEntrevistaPers =
              environment.APIFILEPDF + item.cLegSelEntrevistaPers ??
              environment.CERTDEFAULT
            item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
            item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
          })
          this.lstserv.lSeleccion = $obj.legSeleccion
        }

        if ($obj.legOrdinarizacion.length > 0) {
          $obj.legOrdinarizacion.forEach((item) => {
            item.cLegOrdFichaInscripcion =
              environment.APIFILEPDF + item.cLegOrdFichaInscripcion ??
              environment.CERTDEFAULT
            item.cLegOrdEvaluacionCv =
              environment.APIFILEPDF + item.cLegOrdEvaluacionCv ??
              environment.CERTDEFAULT
            item.cLegOrdClaseModelo =
              environment.APIFILEPDF + item.cLegOrdClaseModelo ??
              environment.CERTDEFAULT
            item.cLegOrdEvaluacionPsico =
              environment.APIFILEPDF + item.cLegOrdEvaluacionPsico ??
              environment.CERTDEFAULT
            item.cLegOrdEntrevistaPers =
              environment.APIFILEPDF + item.cLegOrdEntrevistaPers ??
              environment.CERTDEFAULT
            item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
            item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
          })
          this.lstserv.lOrdinarizacion = $obj.legOrdinarizacion
        }

        if ($obj.legDeclaracionJurada.length > 0) {
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2 =
            environment.APIFILEPDF +
              $obj.legDeclaracionJurada[0].cLegDjanexo2 ?? ''
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6 =
            environment.APIFILEPDF +
              $obj.legDeclaracionJurada[0].cLegDjanexo6 ?? ''
          this.lstserv.LegDeclaracionJurada.cLegDjanexo7 =
            environment.APIFILEPDF +
              $obj.legDeclaracionJurada[0].cLegDjanexo7 ?? ''
          this.lstserv.LegDeclaracionJurada.cFileDjanexo2 = this.lstserv.LegDeclaracionJurada.cLegDjanexo2
          this.lstserv.LegDeclaracionJurada.cFileDjanexo6 = this.lstserv.LegDeclaracionJurada.cLegDjanexo6
          this.lstserv.LegDeclaracionJurada.cFileDjanexo7 = this.lstserv.LegDeclaracionJurada.cLegDjanexo7
          this.erranexo2 = true
          this.erranexo6 = true
          this.erranexo7 = true
        }

        if ($obj.legDocumentacionInterna.length > 0) {
          $obj.legDocumentacionInterna.forEach((item) => {
            item.cLegDiarchivo =
              environment.APIFILEPDF + item.cLegDiarchivo ??
              environment.CERTDEFAULT
            item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
          })
          this.lstserv.lDocumentacionInterna = $obj.legDocumentacionInterna
        }

        this.FormGroupAD.setValue({
          nLegDatDiscapacidad:
            $obj.nLegDatDiscapacidad == null
              ? 0
              : $obj.nLegDatDiscapacidad ?? 0,
          nLegDatTipoDiscapacidad:
            $obj.nLegDatTipoDiscapacidad == null
              ? 0
              : $obj.nLegDatTipoDiscapacidad ?? 0,
          cLegDatOtraDiscapcidad:
            $obj.cLegDatOtraDiscapcidad == null
              ? 0
              : $obj.cLegDatOtraDiscapcidad ?? '',
          cLegDatArchivoConadis:
            $obj.cLegDatArchivoConadis == null
              ? 0
              : $obj.cLegDatArchivoConadis ?? '',
        })

        if ($obj.nLegDatDiscapacidad) {
          this.comboOnChangeTieneDiscacidad($obj.nLegDatDiscapacidad)
        }
        if ($obj.nLegDatTipoDiscapacidad) {
          this.comboOnChangeTipoDiscapacidad($obj.nLegDatTipoDiscapacidad)
        }

        this.spinner.hide()
      } else {
        this.limpiar_controles()
        this.regLegDatosGenerales.cPerCodigo = $objaux.cPerCodigo
        this.spinner.hide()
        Swal.fire(
          'Control de Legajos',
          'No se ha encontrado datos, proceda a completar los datos solicitados.',
          'info',
        )
      }
    })

    if (this.configserv.nTareaValidar == this.bValidar)
      this.lstserv._banvalidar = true
    else this.lstserv._banvalidar = false

    this.ctrlserv._banregister = true
  }

  listar_DeclaracionJurada(ncodigo: number) {
    this.lstserv
      .listado('declaracionjurada_lst', '/' + ncodigo)
      .then((data) => {
        let datos: LegDeclaracionJurada[] = data
        if (datos.length > 0) {
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2 =
            environment.APIFILEPDF + datos[0].cLegDjanexo2 ?? ''
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6 =
            environment.APIFILEPDF + datos[0].cLegDjanexo6 ?? ''
          this.lstserv.LegDeclaracionJurada.cLegDjanexo7 =
            environment.APIFILEPDF + datos[0].cLegDjanexo7 ?? ''
          this.lstserv.LegDeclaracionJurada.cFileDjanexo2 = this.lstserv.LegDeclaracionJurada.cLegDjanexo2
          this.lstserv.LegDeclaracionJurada.cFileDjanexo6 = this.lstserv.LegDeclaracionJurada.cLegDjanexo6
          this.lstserv.LegDeclaracionJurada.cFileDjanexo7 = this.lstserv.LegDeclaracionJurada.cLegDjanexo7
          this.erranexo2 = true
          this.erranexo6 = true
          this.erranexo7 = true
        }
      })
  }

  async CargarTieneDiscapacidad() {
    await this.lstserv.listado('interface/10/4110', '').then((data) => {
      let ltipo: Interface[] = data
      this.lstTieneDiscapacidad = ltipo
    })
  }

  async CargarTipoDiscapacidad() {
    await this.lstserv.listado('interface/10/4077', '').then((data) => {
      let ltipo: Interface[] = data

      this.lstTipoDiscapacidad = ltipo.filter((x) => x.nIntCodigo != 0)
    })
  }

  comboOnChangeTieneDiscacidad($nIntCodigo: number) {
    this.discapacidadFlag = $nIntCodigo == 1 ? true : false
    this.regLegDatosGenerales.nLegDatDiscapacidad = $nIntCodigo
    // nIntCodigo
  }
  comboOnChangeTipoDiscapacidad($nIntCodigo: number) {
    this.otraDiscapacidadFlag = $nIntCodigo == 7 ? true : false
    this.regLegDatosGenerales.nLegDatTipoDiscapacidad = $nIntCodigo
  }
}
