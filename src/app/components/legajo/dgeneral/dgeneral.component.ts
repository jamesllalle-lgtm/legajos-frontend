import { Component, OnInit, ViewChild } from '@angular/core'
import {
  FormBuilder,
  FormControl,
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
import { MensajelegajoComponent } from '../legajo/mensajelegajo/mensajelegajo.component'
import { LegContrato } from 'src/app/models/legajo/leg-contrato'
import { LegResolucion } from 'src/app/models/legajo/leg-resolucion'
import { LegEvaluacionDesemp } from 'src/app/models/legajo/leg-eval-desempeño'
import { LegSeleccion } from 'src/app/models/legajo/leg-seleccion'
import { LegOrdinarizacion } from 'src/app/models/legajo/leg-ordinarizacion'
import { LegDeclaracionJurada } from 'src/app/models/legajo/leg-declaracion-jurada'
import { LegDocumentacionInterna } from 'src/app/models/legajo/leg-documentacion-interna'
import { MatTabChangeEvent } from '@angular/material/tabs'

// EBS - 01/2026 ------------------>
import { LegLicenciaProfesional } from 'src/app/models/legajo/leg-licencia-profesional'
import { LegMembresia } from 'src/app/models/legajo/leg-membresia'
// EBS - 01/2026 <------------------

@Component({
  selector: 'app-dgeneral',
  templateUrl: './dgeneral.component.html',
  styleUrls: ['./dgeneral.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class DgeneralComponent implements OnInit {
  @ViewChild('drawer') sideNav: any
  @ViewChild('stepper') stepper: any
  @ViewChild('stepper2') stepper2: any
  @ViewChild('stepper3') stepper3: any
  modulo: string = 'LEGAJOS'
  title: string = 'Información General'
  codigoMod: number = 1
  codigoArea: number = 0
  route: string = 'dgeneral'
  bValidar: number = 0
  dataglobal: DatosUsuario[] = []
  pageEvent: PageEvent = new PageEvent()
  photoControl: FormControl
  registrosbuenasalud: FormControl
  registrosuneduControl: FormControl
  policialControl: FormControl
  judicialControl: FormControl

  // Variable de Clase id de Declaracion Jurada - EBS 11/2025 ------------------>
  nLegDjcodigo: number = 0
  // Declara esta variable para guardar los resultados de la búsqueda
  public filternacionalidad: any[] = [];
  // -------- Edgar BS - 2025 ------------------>
  anexo1Control: FormControl
  anexo2_2Control: FormControl
  anexo3Control: FormControl
  anexo4Control: FormControl
  anexo5Control: FormControl
  anexo6_2Control: FormControl
  djDNIControl: FormControl
  djDNI_DHControl: FormControl
  djFotoCarnetControl: FormControl
  djNumCtaControl: FormControl
  djConsJubilacionControl: FormControl
  djConsAfiliacionOnpAfpControl: FormControl
  // -------- Edgar BS - 2025 ------------------>

  public errregsunedu: boolean = false
  public errpolicial: boolean = false
  public errjudicial: boolean = false

  public errregbuenasalud: boolean = false
  public errregconadis: boolean = false
  public discapacidadFlag: boolean = false
  public otraDiscapacidadFlag: boolean = false
  fileData: File = <File>{}
  fileDataCert: File = <File>{}
  previewUrl: any = environment.PHOTODEFAULT
  previewCertUrl: any = environment.CERTDEFAULT
  previewFirmaUrl: any = environment.FIRMADEFAULT
  isMobile = false
  public photo: any
  today: Date | undefined
  date: any
  dateCeseControl: any
  dateFEmi: any
  dateFExp: any
  edad: String = '0 años'
  ban_colegio: boolean = false
  ban_administrativo: boolean = false
  public regLegDatosGenerales: LegDatosGenerales
  public tabind: number = 0
  public nTieneDiscapacidad: number = 0
  public nTipoDiscapacidad: number = 0

  // -------- Edgar BS - 2025 ------------------>
  nLegDatAceptaTerminos = false;
  mostrarEntidad = false;
  mostrarBotonDescarga = false;
  mostrarCamposCesante = false;
  mostrarBanco = false;
  mostrarBancoAperturar = false;
  pdfUrl = '';

  public erranexo1: boolean = false
  public erranexo2_2: boolean = false
  public erranexo3: boolean = false
  public erranexo4: boolean = false
  public erranexo5: boolean = false
  public erranexo6_2: boolean = false
  public errdjDNI: boolean = false
  public errdjDNI_DH: boolean = false
  public errdjFotoCarnet: boolean = false
  public errdjNumCta: boolean = false
  public errdjConsJubilacion: boolean = false
  public errdjConsAfiliacionOnpAfp: boolean = false

  public mostrarDomicilio: boolean = false;

  private campoEtiquetas: { [key: string]: string } = {
    apellidopaternoControl: 'Apellido Paterno',
    apellidomaternoControl: 'Apellido Materno',
    nombresControl: 'Nombres',
    emailControl: 'Correo electrónico',
    movilControl: 'Teléfono móvil',
    departamentoControl: 'Departamento',
    provinciaControl: 'Provincia',
    distritoControl: 'Distrito',
    tipodocumentoControl: 'Tipo de documento',
    nrodocumentoControl: 'Número de documento',
    sexoControl: 'Sexo',
    estadocivilControl: 'Estado civil',
    tipodomicilioControl: 'Tipo de domicilio',
    direccionControl: 'Dirección',
    gradoacademicoControl: 'Grado académico',
    nacionalidadControl: 'Nacionalidad',
    mencionEnMayGradAcadControl: 'Mención en mayor grado académico',
    institucionMayGradAcadControl: 'Institución del mayor grado académico',
    numCuentaControl: 'Número de cuenta',
    numCuentaCciControl: 'CCI de la cuenta',
  };

  // Propiedades para las URLs de previsualizacion de documentos - EBS 11/2025
  previewAnexo1Url: string | null = null;
  previewAnexo2_2Url: string | null = null;
  previewAnexo3Url: string | null = null;
  previewAnexo4Url: string | null = null;
  previewAnexo5Url: string | null = null;
  previewAnexo6_2Url: string | null = null;
  previewDjDNIUrl: string | null = null;
  previewDjDNI_DHUrl: string | null = null;
  previewDjFotoCarnetUrl: string | null = null;
  previewDjNumCtaUrl: string | null = null;
  previewDjConsJubilacionUrl: string | null = null;
  previewDjConsAfiliacionOnpAfpUrl: string | null = null;
  // -------- Edgar BS - 2025 ------------------>

  public lstGradoAcademico: GradoAcademico[] = []
  public lstCurriculos: Curriculo[] = []
  public lstTieneDiscapacidad: Interface[] = []
  public lstTipoDiscapacidad: Interface[] = []
  public lstInstituciones: Persona[] = [];
  public filteredInstituciones!: Observable<Persona[]>;
  public institucionMayGradAcadControl = new FormControl();

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
  public FormGroup17: FormGroup
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
      emailControl: ['', Validators.required, '', Validators.maxLength(50), '', Validators.email],
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

      idiomaNativoControl: [''],
      nacionalidadControl: ['', Validators.required],
      tipodocumentoControl: ['', Validators.required],
      nrodocumentoControl: ['', Validators.required],
      sexoControl: ['', Validators.required],
      estadocivilControl: ['', Validators.required],
      tipodomicilioControl: ['', Validators.required],
      zonaControl: ['', Validators.required],
      direccionControl: ['', Validators.required, '', Validators.maxLength(150)],
      numeroControl: [''],
      dptoControl: [''],
      mzaControl: [''],
      lteControl: [''],
      referenciaControl: [''],

      afiliadoControl: ['', Validators.required],
      entidadControl: ['', Validators.required],
      haberesControl: ['', Validators.required],
      bancoControl: ['', Validators.required],
      bancoAperturarControl: ['', Validators.required],
      numCuentaControl: ['', Validators.maxLength(14), '', Validators.required],
      numCuentaCciControl: ['', Validators.maxLength(20), '', Validators.required],

      gradoacademicoControl: [0, Validators.required],
      mencionEnMayGradAcadControl: [''],
      institucionMayGradAcadControl: ['']
    })
    this.FormGroup2 = this._formBuilder.group({
      colegioprofControl: [''],
      condicionControl: [''],
      colegionroControl: [''],
    })
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
    this.FormGroup17 = this._formBuilder.group({})
    this.FormGroup2_1 = this._formBuilder.group({})
    this.FormGroup2_2 = this._formBuilder.group({})
    this.FormGroup2_3 = this._formBuilder.group({})
    this.FormGroup2_4 = this._formBuilder.group({})
    this.FormGroup2_5 = this._formBuilder.group({})
    this.FormGroup2_6 = this._formBuilder.group({})
    this.FormGroup3_DJ = this._formBuilder.group({})
    this.FormGroup3_DI = this._formBuilder.group({})
    this.EndFormGroup = this._formBuilder.group({ acercaControl: ['', Validators.maxLength(200)] })
    this.photoControl = new FormControl(this.photo)
    this.registrosuneduControl = new FormControl(this.photo)
    this.registrosbuenasalud = new FormControl(this.photo)
    this.policialControl = new FormControl(this.photo)
    this.judicialControl = new FormControl(this.photo)

    this.anexo1Control = new FormControl(this.photo)
    this.anexo2_2Control = new FormControl(this.photo)
    this.anexo3Control = new FormControl(this.photo)
    this.anexo4Control = new FormControl(this.photo)
    this.anexo5Control = new FormControl(this.photo)
    this.anexo6_2Control = new FormControl(this.photo)
    this.djDNIControl = new FormControl(this.photo)
    this.djDNI_DHControl = new FormControl(this.photo)
    this.djFotoCarnetControl = new FormControl(this.photo)
    this.djNumCtaControl = new FormControl(this.photo)
    this.djConsJubilacionControl = new FormControl(this.photo)
    this.djConsAfiliacionOnpAfpControl = new FormControl(this.photo)

    this.date = new FormControl(new Date(''))
    this.dateCeseControl = new FormControl(new Date(''))
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
      this.pageEvent.pageSize = 5
      this.today = new Date()

      this.ctrlserv._banregister = true
    }
    else {
      this.router.navigate(['/login'])
    }
  }

  ngOnInit(): void {

    // Obtener el valor actual al cargar
    const valorInicial = this.FormGroup1.get('tipodocumentoControl')?.value;
    console.log("tipoDocumento" + valorInicial);
    if (valorInicial !== null && valorInicial !== undefined) {
      this.onTipoDocumentoChange(valorInicial);
    }

    this.FormGroup1.get('edadControl')?.setValue(this.edad)
    this.photoControl.valueChanges.subscribe((files: any) => {
      this.photo = files
      // if (!Array.isArray(files)) {
      //   this.photo = [files];
      // } else {
      //   this.photo = files;
      // }
    })

    this.segserv.obtenerdatosusuario()


    // Lista de promesas a ejecutar en paralelo
    const promesas = [
      this.listar_periodos(),
      this.listar_gradoacademico(),
      this.listar_tipodocidentidad(),
      this.listar_ubigeo(),
      this.listar_tipodomicilio(),
      this.listar_tipozona(),
      this.listar_sexo(),
      this.listar_estadocivil(),
      this.listar_colegio(),
      this.listar_universidad(),
      this.listar_condicion(),
      this.cargar_idioma(),
      this.CargarTieneDiscapacidad(),
      this.CargarTipoDiscapacidad(),
      this.listar_afiliado(),
      this.listar_entidad(),
      this.listar_haberes(),
      this.listar_banco(),
      this.listar_bancoAperturar()
    ];

    Promise.all(promesas).then(() => {
      console.log("Todas las listas se han cargado. Ejecutando editar_cv...");
      console.log(this.segserv.usuarioreg);
      this.editar_cv(this.segserv.usuarioreg);
    }).catch(error => {
      console.error("Error al cargar datos:", error);
    });

    this.FormGroup1.get('tipodocumentoControl')?.valueChanges.subscribe(valor => {
      console.log("El usuario cambió el tipo de documento a:", valor);
    });
  }

  // Habilitar o deshabilitar validaciones
  habilitarDomicilio(habilitar: boolean) {
    const domicilioControls = [
      'zonaControl',
      'tipodomicilioControl',
      'direccionControl',
      'numeroControl',
      'dptoControl',
      'mzaControl',
      'lteControl',
      'referenciaControl',
      'departamentoControl',
      'provinciaControl',
      'distritoControl'
    ];

    domicilioControls.forEach(ctrl => {
      const control = this.FormGroup1.get(ctrl);
      if (habilitar) {
        control?.enable();
        control?.setValidators([]); // o Validators.required si quieres
      } else {
        control?.disable();
        control?.clearValidators();
        //control?.reset();
      }
      control?.updateValueAndValidity();
    });
  }

  listar_tareaspermiso() {
    if (this.segserv.usuarioreg.nRol == 1) {
      this.lstserv.listado('tareamodulo', '/' + this.segserv.usuarioreg.cPerCodigo + '/' + this.codigoMod)
        .then((data) => {
          this.lstserv.lTareasPermiso = data
          for (let index = 0; index < this.lstserv.lTareasPermiso.length; index++) {
            if (this.lstserv.lTareasPermiso[index].nTarModCodigo == 13) {
              this.codigoArea = 13
            }
            else {
              this.codigoArea = 1
            }
          }
        }
        )
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


  listar_gradoacademico() {
    this.lstserv
      .listado('interface', '/' + this.configserv.nIntGradoAcad)
      .then((data) => {
        let lgrado: Interface[] = data
        this.lstserv.lGradoAcademico = lgrado.filter((x) => x.nIntCodigo != 0)
      })
  }


  listar_tipodocidentidad() {
    this.lstserv.listado('interface', '/' + this.configserv.nIntTipoDocIdent)
      .then((data) => {
        let ltipodoc: Interface[] = data
        this.lstserv.lTipoDocIdentidad = ltipodoc.filter(
          (x) => x.nIntCodigo != 0,
        )
      })
  }

  listar_ubigeo() {
    this.spinner.show()
    this.lstserv
      .listado('interface', '/' + this.configserv.nIntUbigeo)
      .then((data) => {
        let lubigeo: Interface[] = data
        this.lstserv.lubigeo = lubigeo.filter((x) => x.nIntCodigo != 0)

        // Aquí se traen las nacionalidades
        this.lstserv.lnacionalidad = this.lstserv.lubigeo.filter(
          (x) => x.cIntJerarquia.trim().length == 3,
        )

        // 🚩 AGREGA ESTA LÍNEA AQUÍ PARA QUE LA LISTA NO SALGA VACÍA:
        this.filternacionalidad = this.lstserv.lnacionalidad.slice();

        this.lstserv.lpaisNac = this.lstserv.lnacionalidad
        this.lstserv.filterpais = this.lstserv.lpaisNac.slice()
        this.lstserv.ldepartamento = this.lstserv.lubigeo.filter(
          (x) => x.cIntJerarquia.trim().length == 2,
        )
        this.spinner.hide()
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

  listar_colegio() {
    this.lstserv
      .listado('persona', '/' + this.configserv.nPerColegio)
      .then((data) => {
        this.lstserv.lColegio = data
        this.cargardata()
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
          }
          else {
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
        // En ngOnInit() después de inicializar el FormGroup
        this.inicializarAutocompletadoInstitucion();
      })
  }

  cargar_idioma() {
    this.lstserv.listado('get_idioma', '').then((data) => {
      this.spinner.show()
      let lIdioma: Interface[] = data
      this.lstserv.lIdioma = lIdioma
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


  listar_afiliado() {
    this.lstserv.listado('constante', '/' + this.configserv.nConAfiliado).then((data) => {
      let lAfiliado: Constante[] = data;
      this.lstserv.lAfiliado = lAfiliado.filter(x => x.nConValor != 0)
    })
  }

  listar_entidad() {
    this.lstserv.listado('constante', '/' + this.configserv.nConEntidad).then((data) => {
      let lEntidad: Constante[] = data;
      this.lstserv.lEntidad = lEntidad.filter(x => x.nConValor != 0)
    })
  }

  listar_haberes() {
    this.lstserv.listado('constante', '/' + this.configserv.nConHaberes).then((data) => {
      let lHaberes: Constante[] = data;
      this.lstserv.lHaberes = lHaberes.filter(x => x.nConValor != 0)
    })
  }

  listar_banco() {
    this.lstserv.listado('constante', '/' + this.configserv.nConBanco).then((data) => {
      let lBanco: Constante[] = data;
      this.lstserv.lBanco = lBanco.filter(x => x.nConValor != 0)
    })
  }

  listar_bancoAperturar() {
    this.lstserv.listado('constante', '/' + this.configserv.nConBancoAperturar).then((data) => {
      let lBancoAperturar: Constante[] = data;
      this.lstserv.lBancoAperturar = lBancoAperturar.filter(x => x.nConValor != 0)
    })
  }

  inicializarAutocompletadoInstitucion() {
    // Cargar las instituciones (similar a universidadOnChange en el modal)
    this.lstInstituciones = this.lstserv.lUniversidad.filter(x => x.cUbigeoCodigo.length > 3);
    this.lstInstituciones.push(this.clmdserv.empty_persona());

    // Inicializar el autocompletado
    this.filteredInstituciones = this.institucionMayGradAcadControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.cPerNombre || ''),
        map(cPerNombre => cPerNombre ? this._filterInstituciones(cPerNombre) : this.lstInstituciones.slice(0, 100))
      );

    // Si hay un valor previo, establecerlo
    if (this.regLegDatosGenerales.cLegDatInstitucionMayGradAcad &&
      this.regLegDatosGenerales.cLegDatInstitucionMayGradAcad !== this.clmdserv.codigonoinst) {
      const institucion = this.lstInstituciones.find(i => i.cPerCodigo === this.regLegDatosGenerales.cLegDatInstitucionMayGradAcad);
      if (institucion) {
        this.institucionMayGradAcadControl.setValue(institucion.cPerNombre);
      }
    }
  }

  displayFnInstitucion(institucion?: Persona): string {
    return institucion && institucion.cPerNombre ? institucion.cPerNombre : '';
  }

  private _filterInstituciones(name: string): Persona[] {
    const filterValue = name.toLowerCase();
    return this.lstInstituciones.filter(option =>
      option.cPerNombre.toLowerCase().includes(filterValue)).slice(0, 100);
  }

  handleInstitucionChange(e: any) {
    if (e === '') {
      this.regLegDatosGenerales.cLegDatInstitucionMayGradAcad = '';
    }
  }

  institucionOnChange(obj: any) {
    if (obj == null) {
      this.regLegDatosGenerales.cLegDatInstitucionMayGradAcad = "";
      this.regLegDatosGenerales.cLegDatInstitucionMayGradAcadNavigation = this.clmdserv.empty_persona();
    }
    else {
      if (obj.cPerCodigo !== this.clmdserv.codigonoinst) {
        this.regLegDatosGenerales.cLegDatInstitucionMayGradAcad = obj.cPerCodigo;
        this.regLegDatosGenerales.cLegDatInstitucionMayGradAcadNavigation = obj;
      }
      else {
        this.regLegDatosGenerales.cLegDatInstitucionMayGradAcad = this.clmdserv.codigonoinst;
        this.regLegDatosGenerales.cLegDatInstitucionMayGradAcadNavigation = this.clmdserv.empty_persona();
      }
    }
  }

  editar_cv($objaux: DatosUsuario) {
    this.spinner.show()
    this.limpiar_controles()
    this.regLegDatosGenerales.cPerCodigo = $objaux.cPerCodigo
    this.clmdserv.objusuario = $objaux
    this.segserv.obtenerdatosusuario()
    this.ban_administrativo = $objaux.nTipo == 1 ? true : false

    this.lstserv.listado('legajoaux/', $objaux.cPerCodigo).then((data) => {
      if (JSON.stringify(data) != '[]') {
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

        this.previewFirmaUrl = $obj.cLegDatFirma != null && $obj.cLegDatFirma != '' ? environment.APIFILE + $obj.cLegDatFirma : environment.FIRMADEFAULT
        this.regLegDatosGenerales.cFileSunedu = $obj.cLegDatSunedu != null && $obj.cLegDatSunedu != '' ? environment.APIFILEPDF + $obj.cLegDatSunedu : ''
        this.regLegDatosGenerales.cFilePolicial = $obj.cLegDatPolicial != null && $obj.cLegDatPolicial != '' ? environment.APIFILEPDF + $obj.cLegDatPolicial : ''
        this.regLegDatosGenerales.cFileJudicial = $obj.cLegDatJudicial != null && $obj.cLegDatJudicial != '' ? environment.APIFILEPDF + $obj.cLegDatJudicial : ''
        this.regLegDatosGenerales.cFileBuenaSalud = $obj.cLegDatBuenaSalud != null && $obj.cLegDatBuenaSalud != '' ? environment.APIFILEPDF + $obj.cLegDatBuenaSalud : ''
        this.errregsunedu = $obj.cLegDatSunedu != null && $obj.cLegDatSunedu != '' ? true : false
        this.errpolicial = $obj.cLegDatPolicial != null && $obj.cLegDatPolicial != '' ? true : false
        this.errregbuenasalud = $obj.cLegDatBuenaSalud != null && $obj.cLegDatBuenaSalud != '' ? true : false


        this.mostrarEntidad = $obj.nLegDatRegPenAfiliado != null && $obj.nValorAfiliado == 1 ? true : false
        this.mostrarBotonDescarga = $obj.nLegDatRegPenAfiliado != null && $obj.nValorAfiliado == 2 ? true : false
        this.mostrarCamposCesante = $obj.nLegDatRegPenAfiliado != null && $obj.nValorAfiliado == 3 ? true : false
        this.mostrarBanco = $obj.nLegDatCtaHabHaberes != null && $obj.nValorHaberes == 1 ? true : false
        this.mostrarBancoAperturar = $obj.nLegDatCtaHabHaberes != null && $obj.nValorHaberes == 2 ? true : false


        this.errjudicial = $obj.cLegDatJudicial != null && $obj.cLegDatJudicial != '' ? true : false
        this.errregconadis = $obj.cLegDatArchivoConadis != null && $obj.cLegDatArchivoConadis != '' ? true : false
        let nacimiento: number = 0
        let dptonacimiento: number = 0
        let provnacimiento: number = 0
        let distnacimiento: number = 0

        let dptodomic: number = 0
        let provdomic: number = 0
        let distdomic: number = 0

        if ($obj.nClaseNacimiento != null && $obj.nClaseNacimiento != 0) {//6602
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
        if ($obj.nValorCondicionColeg != null && $obj.nValorCondicionColeg != 0) {
          this.FormGroup2.setValue({
            colegioprofControl: $obj.cLegDatColegioProf,
            condicionControl: $obj.vCondicionColeg.nConValor ?? 0,
            colegionroControl: $obj.cLegDatNroColegiatura ?? ''
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
        if ($obj.vGradoAcad != null) {
          $obj.vGradoAcad.cIntDescripcion = $obj.vGradoAcad.cIntDescripcion || '';
        }


        this.FormGroup1.setValue({
          apellidopaternoControl: $obj.cLegDatApellidoPaterno == null ? '' : $obj.cLegDatApellidoPaterno.trim() ?? '',
          apellidomaternoControl: $obj.cLegDatApellidoMaterno == null ? '' : $obj.cLegDatApellidoMaterno.trim() ?? '',
          nombresControl: $obj.cLegDatNombres == null ? '' : $obj.cLegDatNombres.trim() ?? '',
          emailControl: $obj.cLegDatEmail == null ? '' : $obj.cLegDatEmail.trim() ?? '',
          telefonoControl: $obj.cLegDatTelefono == null ? '' : $obj.cLegDatTelefono.trim() ?? '',
          movilControl: $obj.cLegDatMovil == null ? '' : $obj.cLegDatMovil.trim() ?? '',
          departamentoControl: dptodomic,
          provinciaControl: provdomic,
          distritoControl: distdomic,
          paisNacControl: nacimiento,
          departamentoNacControl: dptonacimiento,
          provinciaNacControl: provnacimiento,
          distritoNacControl: distnacimiento,
          edadControl: '',
          gradoacademicoControl: $obj.nLegDatGradoAcad == null ? 0 : $obj.nLegDatGradoAcad ?? 0,
          nacionalidadControl: $obj.vPais == null ? 0 : $obj.vPais.nIntCodigo ?? 0,
          tipodocumentoControl: $obj.nLegDatTipoDoc == null ? 0 : $obj.nLegDatTipoDoc ?? 0,
          nrodocumentoControl: $obj.cLegDatNroDoc == null ? '' : $obj.cLegDatNroDoc,
          sexoControl: $obj.vSexo == null ? 0 : $obj.vSexo.nConValor,
          estadocivilControl: $obj.vEstadoCivil == null ? 0 : $obj.vEstadoCivil.nConValor ?? 0,
          tipodomicilioControl: $obj.vTipoDomicilio == null ? 0 : $obj.vTipoDomicilio.nConValor ?? 0,
          zonaControl: $obj.vZona == null ? 0 : $obj.vZona.nConValor ?? 0,
          direccionControl: $obj.cLegDatCalleDomicilio == null ? '' : $obj.cLegDatCalleDomicilio.trim() ?? '',
          numeroControl: $obj.cLegDatNroDomicilio == null ? '' : $obj.cLegDatNroDomicilio.trim() ?? '',
          dptoControl: $obj.cLegDatDptoDomicilio == null ? '' : $obj.cLegDatDptoDomicilio.trim() ?? '',
          mzaControl: $obj.cLegDatMzaDomicilio == null ? '' : $obj.cLegDatMzaDomicilio.trim() ?? '',
          lteControl: $obj.cLegDatLtDomicilio == null ? '' : $obj.cLegDatLtDomicilio.trim() ?? '',
          referenciaControl: $obj.cLegDatReferencia == null ? '' : $obj.cLegDatReferencia.trim() ?? '',
          idiomaNativoControl: $obj.nLegIdiomaNativo == null ? 0 : $obj.nLegIdiomaNativo ?? 0,

          afiliadoControl: $obj.vAfiliado == null ? "" : $obj.vAfiliado.nConValor ?? 0,
          entidadControl: $obj.vEntidad == null ? "" : $obj.vEntidad.nConValor ?? 0,
          haberesControl: $obj.vHaberes == null ? "" : $obj.vHaberes.nConValor ?? 0,
          bancoControl: $obj.vBanco == null ? "" : $obj.vBanco.nConValor ?? 0,
          bancoAperturarControl: $obj.vBancoAperturar == null ? "" : $obj.vBancoAperturar.nConValor ?? 0,
          numCuentaControl: $obj.cLegDatCtaHabNumCta == null ? "" : $obj.cLegDatCtaHabNumCta.trim() ?? "",
          numCuentaCciControl: $obj.cLegDatCtaHabNumCtaCci == null ? "" : $obj.cLegDatCtaHabNumCtaCci.trim() ?? "",

          mencionEnMayGradAcadControl: $obj.cLegDatMencionEnMayGradAcad == null ? "" : $obj.cLegDatMencionEnMayGradAcad.trim() ?? "",
          institucionMayGradAcadControl: ""
        })

        if ($obj.cLegDatInstitucionMayGradAcad) {
          const institucion = this.lstInstituciones.find(i => i.cPerCodigo === $obj.cLegDatInstitucionMayGradAcad);
          if (institucion) {
            this.institucionMayGradAcadControl.setValue(institucion.cPerNombre);
            this.institucionOnChange(institucion);
          }
        }

        this.EndFormGroup.setValue({
          acercaControl: $obj.cLegDatAcerca,
        })
        this.ctrlserv.colaboradornombre = this.FormGroup1.get('nombresControl')?.value + ' ' + this.FormGroup1.get('apellidopaternoControl')?.value + ' ' + this.FormGroup1.get('apellidomaternoControl')?.value

        this.date = $obj.dLegDatFechaNacimiento == new Date(this.clmdserv.fechadef) ? new FormControl(new Date('')) : new FormControl(new Date($obj.dLegDatFechaNacimiento))
        if ($obj.dLegDatFechaNacimiento != new Date(this.clmdserv.fechadef)) {
          this.obtener_edad(new Date($obj.dLegDatFechaNacimiento))
        }

        this.dateCeseControl = $obj.dLegDatRegPenFechaCese == new Date(this.clmdserv.fechadef) ? new FormControl(new Date("")) : new FormControl(new Date($obj.dLegDatRegPenFechaCese))

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
            item.cLegGraInstitucionNavigation.cPerNombre = item.cLegGraInstitucionNavigation.cPerNombre ?? this.clmdserv.nombrenoinst

            item.vGradoAcad.cIntDescripcion = item.vGradoAcad.cIntDescripcion ?? ''
            item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegGraArchivo = item.cLegGraArchivo != '' ? (item.cUsuRegistro == 'pdf' ? environment.APIFILEPDF : environment.APIFILE) + item.cLegGraArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lLegGradoTitulo = $obj.legGradoTitulo
        }

        //  EBS - 01/2026 -------------------->
        // ===== LICENCIAS PROFESIONALES =====
        if ($obj.legLicenciaProfesional && $obj.legLicenciaProfesional.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legLicenciaProfesional = $obj.legLicenciaProfesional.filter(
              (x) => x.cLegLicValida == false
            );
          }
          $obj.legLicenciaProfesional.forEach((item) => {
            // Normalizar institución
            if (item.cLegLicInstitucion.trim() == '') {
              item.cLegLicInstitucion = this.clmdserv.codigonoinst;
              item.cLegLicInstitucionNavigation = this.clmdserv.empty_persona();
            }
            item.cLegLicInstitucionNavigation.cPerNombre =
              item.cLegLicInstitucionNavigation.cPerNombre ?? this.clmdserv.nombrenoinst;

            // Normalizar descripciones
            item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? '';
            item.vCondicion.cIntDescripcion = item.vCondicion.cIntDescripcion ?? '';

            // Formatear fechas para visualización
            item.dLegLicFechaEmision = new Date(item.dLegLicFechaEmision);
            item.dLegLicFechaExpiracion = new Date(item.dLegLicFechaExpiracion);

            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
          });
          this.lstserv.lLegLicenciaProfesional = $obj.legLicenciaProfesional;
        }

        // ===== MEMBRESIAS =====
        if ($obj.legMembresia && $obj.legMembresia.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legMembresia = $obj.legMembresia.filter(
              (x) => x.cLegMemValida == false
            );
          }
          $obj.legMembresia.forEach((item) => {
            // Normalizar institución
            if (item.cLegMemInstitucion.trim() == '') {
              item.cLegMemInstitucion = this.clmdserv.codigonoinst;
              item.cLegMemInstitucionNavigation = this.clmdserv.empty_persona();
            }
            item.cLegMemInstitucionNavigation.cPerNombre =
              item.cLegMemInstitucionNavigation.cPerNombre ?? this.clmdserv.nombrenoinst;

            // Normalizar descripciones
            item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? '';

            // Formatear fechas para visualización
            item.dLegMemFechaEmision = new Date(item.dLegMemFechaEmision);
            item.dLegMemFechaExpiracion = new Date(item.dLegMemFechaExpiracion);

            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
          });
          this.lstserv.lLegMembresia = $obj.legMembresia;
        }
        //  EBS - 01/2026 -------------------->

        // BUSCA ESTE BLOQUE DENTRO DE editar_cv:
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

            // 🔹 LÍNEA IMPORTANTE: Aseguramos que la descripción pase a la tabla
            item.cLegDocCargo = item.cLegDocCargo ?? '';

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
          // Reemplaza el bloque dentro del forEach de legProfesNoDocente
          $obj.legProfesNoDocente.forEach((item) => {
            // 1. Validar institución
            if (!item.cLegProInstitucion || item.cLegProInstitucion.trim() == '') {
              item.cLegProInstitucion = this.clmdserv.codigonoinst;
              item.cLegProInstitucionNavigation = this.clmdserv.empty_persona();
            }

            item.cLegProInstitucionNavigation.cPerNombre =
              item.cLegProInstitucionNavigation.cPerNombre ?? this.clmdserv.nombrenoinst;

            // 2. Validar cargo
            item.vCargo = item.vCargo == null ? this.clmdserv.empty_constante() : item.vCargo;

            // 3. 🚩 AQUÍ ESTÁ LA CORRECCIÓN CRÍTICA:
            if (item.cUsuRegistro && item.cUsuRegistro.length >= 3) {
              item.cUsuRegistro = item.cUsuRegistro.substr(item.cUsuRegistro.length - 3, 3);
            } else {
              item.cUsuRegistro = 'img'; // Valor por defecto si es nulo
            }

            // 4. Validar archivo
            item.cLegProArchivo = item.cLegProArchivo
              ? (item.cUsuRegistro == 'pdf' ? environment.APIFILEPDF : environment.APIFILE) + item.cLegProArchivo
              : environment.CERTDEFAULT;
          });
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
            item.vCentroRegistro.cIntDescripcion = item.vCentroRegistro.cIntDescripcion ?? ''
            item.vNivelRenacyt.cIntDescripcion = item.vNivelRenacyt.cIntDescripcion ?? ''
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
            if (item.cLegTesInstitucion != null) {
              if (item.cLegTesInstitucion.trim() == '') {
                item.cLegTesInstitucion = this.clmdserv.codigonoinst
                item.cLegTesInstitucionNavigation = this.clmdserv.empty_persona()
              }
            }

            if (!item.cLegTesInstitucionNavigation) {
              item.cLegTesInstitucionNavigation = this.clmdserv.empty_persona();
            }

            item.cLegTesInstitucionNavigation.cPerNombre =
              item.cLegTesInstitucionNavigation.cPerNombre ?? this.clmdserv.nombrenoinst;


            item.vNivel.cConDescripcion = item.vNivel.cConDescripcion ?? ''
            item.vTipo.cIntDescripcion = item.vTipo.cIntDescripcion ?? ''
            item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? ''
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
          // if (this.configserv.nTareaValidar == this.bValidar) {
          //   $obj.legCapacitaciones = $obj.legCapacitaciones.filter(
          //     (x) => x.cLegCapValida == false,
          //   )
          // }
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
            item.cLegCiarchivo = item.cLegCiarchivo ? (item.cUsuRegistro == 'pdf' ? environment.APIFILEPDF : environment.APIFILE) + item.cLegCiarchivo : environment.CERTDEFAULT
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
            item.cLegSelEvaluacionCv = environment.APIFILEPDF + (item.cLegSelEvaluacionCv ?? environment.CERTDEFAULT);
            item.cLegSelClaseModelo = environment.APIFILEPDF + (item.cLegSelClaseModelo ?? environment.CERTDEFAULT);
            item.cLegSelEvaluacionPsico = environment.APIFILEPDF + (item.cLegSelEvaluacionPsico ?? environment.CERTDEFAULT);
            item.cLegSelEntrevistaPers = environment.APIFILEPDF + (item.cLegSelEntrevistaPers ?? environment.CERTDEFAULT);

            item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
            item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
          })
          this.lstserv.lSeleccion = $obj.legSeleccion
        }
        if ($obj.legOrdinarizacion.length > 0) {
          $obj.legOrdinarizacion.forEach((item) => {
            item.cLegOrdFichaInscripcion = environment.APIFILEPDF + (item.cLegOrdFichaInscripcion ?? environment.CERTDEFAULT);
            item.cLegOrdEvaluacionCv = environment.APIFILEPDF + (item.cLegOrdEvaluacionCv ?? environment.CERTDEFAULT);
            item.cLegOrdClaseModelo = environment.APIFILEPDF + (item.cLegOrdClaseModelo ?? environment.CERTDEFAULT);
            item.cLegOrdEvaluacionPsico = environment.APIFILEPDF + (item.cLegOrdEvaluacionPsico ?? environment.CERTDEFAULT);
            item.cLegOrdEntrevistaPers = environment.APIFILEPDF + (item.cLegOrdEntrevistaPers ?? environment.CERTDEFAULT);
            item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
            item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
          })
          this.lstserv.lOrdinarizacion = $obj.legOrdinarizacion
        }
        if ($obj.legDeclaracionJurada && $obj.legDeclaracionJurada.length > 0) {
          const legDJ = $obj.legDeclaracionJurada[0];

          this.nLegDjcodigo = legDJ.nLegDjcodigo
          this.lstserv.LegDeclaracionJurada.cFileDjanexo1 = legDJ.cLegDjanexo1
          this.lstserv.LegDeclaracionJurada.cFileDjanexo2_2 = legDJ.cLegDjanexo2_2
          this.lstserv.LegDeclaracionJurada.cFileDjanexo3 = legDJ.cLegDjanexo3
          this.lstserv.LegDeclaracionJurada.cFileDjanexo4 = legDJ.cLegDjanexo4
          this.lstserv.LegDeclaracionJurada.cFileDjanexo5 = legDJ.cLegDjanexo5
          this.lstserv.LegDeclaracionJurada.cFileDjanexo6_2 = legDJ.cLegDjanexo6_2
          this.lstserv.LegDeclaracionJurada.cFileDjDNI = legDJ.cLegDjDNI
          this.lstserv.LegDeclaracionJurada.cFileDjDNI_DH = legDJ.cLegDjDNI_DH
          this.lstserv.LegDeclaracionJurada.cFileDjFotoCarnet = legDJ.cLegDjFotoCarnet
          this.lstserv.LegDeclaracionJurada.cFileDjNumCta = legDJ.cLegDjNumCta
          this.lstserv.LegDeclaracionJurada.cFileDjConsJubilacion = legDJ.cLegDjConsJubilacion
          this.lstserv.LegDeclaracionJurada.cFileDjConsAfiliacionOnpAfp = legDJ.cLegDjConsAfiliacionOnpAfp


          this.lstserv.LegDeclaracionJurada.cLegDjanexo1 = legDJ.cLegDjanexo1 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo1}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2_2 = legDJ.cLegDjanexo2_2 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo2_2}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo3 = legDJ.cLegDjanexo3 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo3}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo4 = legDJ.cLegDjanexo4 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo4}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo5 = legDJ.cLegDjanexo5 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo5}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6_2 = legDJ.cLegDjanexo6_2 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo6_2}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjDNI = legDJ.cLegDjDNI ? `${environment.APIFILEPDF}${legDJ.cLegDjDNI}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjDNI_DH = legDJ.cLegDjDNI_DH ? `${environment.APIFILEPDF}${legDJ.cLegDjDNI_DH}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjFotoCarnet = legDJ.cLegDjFotoCarnet ? `${environment.APIFILEPDF}${legDJ.cLegDjFotoCarnet}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjNumCta = legDJ.cLegDjNumCta ? `${environment.APIFILEPDF}${legDJ.cLegDjNumCta}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjConsJubilacion = legDJ.cLegDjConsJubilacion ? `${environment.APIFILEPDF}${legDJ.cLegDjConsJubilacion}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjConsAfiliacionOnpAfp = legDJ.cLegDjConsAfiliacionOnpAfp ? `${environment.APIFILEPDF}${legDJ.cLegDjConsAfiliacionOnpAfp}` : "";

          this.erranexo1 = legDJ.cLegDjanexo1 ? true : false;
          this.erranexo2_2 = legDJ.cLegDjanexo2_2 ? true : false;
          this.erranexo3 = legDJ.cLegDjanexo3 ? true : false;
          this.erranexo4 = legDJ.cLegDjanexo4 ? true : false;
          this.erranexo5 = legDJ.cLegDjanexo5 ? true : false;
          this.erranexo6_2 = legDJ.cLegDjanexo6_2 ? true : false;
          this.errdjDNI = legDJ.cLegDjDNI ? true : false;
          this.errdjDNI_DH = legDJ.cLegDjDNI_DH ? true : false;
          this.errdjFotoCarnet = legDJ.cLegDjFotoCarnet ? true : false;
          this.errdjNumCta = legDJ.cLegDjNumCta ? true : false;
          this.errdjConsJubilacion = legDJ.cLegDjConsJubilacion ? true : false;
          this.errdjConsAfiliacionOnpAfp = legDJ.cLegDjConsAfiliacionOnpAfp ? true : false;
        }
        if ($obj.legDocumentacionInterna.length > 0) {
          $obj.legDocumentacionInterna.forEach((item) => {
            item.cLegDiarchivo = environment.APIFILEPDF + (item.cLegDiarchivo ?? environment.CERTDEFAULT)
            item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
          })
          this.lstserv.lDocumentacionInterna = $obj.legDocumentacionInterna
        }

        this.FormGroupAD.setValue({
          nLegDatDiscapacidad: $obj.nLegDatDiscapacidad == null ? 0 : $obj.nLegDatDiscapacidad ?? 0,
          nLegDatTipoDiscapacidad: $obj.nLegDatTipoDiscapacidad == null ? 0 : $obj.nLegDatTipoDiscapacidad ?? 0,
          cLegDatOtraDiscapcidad: $obj.cLegDatOtraDiscapcidad == null ? '' : $obj.cLegDatOtraDiscapcidad ?? '',
          cLegDatArchivoConadis: $obj.cLegDatArchivoConadis == null ? 0 : $obj.cLegDatArchivoConadis ?? '',
        })

        if ($obj.nLegDatDiscapacidad) {
          this.comboOnChangeTieneDiscacidad($obj.nLegDatDiscapacidad)
        }
        if ($obj.nLegDatTipoDiscapacidad) {
          this.comboOnChangeTipoDiscapacidad($obj.nLegDatTipoDiscapacidad)
        }

        this.spinner.hide()
      }
      else {
        this.limpiar_controles()
        this.regLegDatosGenerales.cPerCodigo = $objaux.cPerCodigo
        this.spinner.hide()
        Swal.fire('Control de Legajos', 'No se ha encontrado datos, proceda a completar los datos solicitados.', 'info')
      }
    })

    if (this.configserv.nTareaValidar == this.bValidar)
      this.lstserv._banvalidar = true
    else this.lstserv._banvalidar = false

    this.ctrlserv._banregister = true
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.tabind = tabChangeEvent.index
    // console.log('tabChangeEvent => ', tabChangeEvent);
    // console.log('index => ', tabChangeEvent.index);
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
          }
          else {
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

  scrollToActiveStep() {
    // Le damos un respiro de 250ms a Angular para que termine la animación de colapsar el paso anterior
    setTimeout(() => {
      // Buscamos en el HTML la cabecera del paso que se acaba de activar
      const activeStep = document.querySelector('.mat-step-header[aria-selected="true"]');

      if (activeStep) {
        // Obligamos a la pantalla a hacer scroll suavemente hasta ese título
        activeStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 250);
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
    this.errregconadis = false


    // this.erranexo2 = false
    // this.erranexo6 = false
    // this.erranexo7 = false
    this.erranexo1 = false
    this.erranexo2_2 = false
    this.erranexo3 = false
    this.erranexo4 = false
    this.erranexo5 = false
    this.erranexo6_2 = false

    this.errdjDNI = false
    this.errdjDNI_DH = false
    this.errdjFotoCarnet = false
    this.errdjNumCta = false
    this.errdjConsJubilacion = false
    this.errdjConsAfiliacionOnpAfp = false

    this.mostrarEntidad = false
    this.mostrarBotonDescarga = false
    this.mostrarCamposCesante = false
    this.mostrarBanco = false
    this.mostrarBancoAperturar = false



    this.errregbuenasalud = false
    this.lstserv.lOrdinarizacion = []
    this.lstserv.lDocumentacionInterna = []
    this.lstserv.LegDeclaracionJurada = this.clmdserv.empty_declaracionjurada()
    this.FormGroup1.get('apellidopaternoControl')?.setValue('')
    this.FormGroup1.get('apellidomaternoControl')?.setValue('')
    this.FormGroup1.get('nombresControl')?.setValue('')
    this.FormGroup1.get('emailControl')?.setValue('')
    this.FormGroup1.get('telefonoControl')?.setValue('')
    this.FormGroup1.get('movilControl')?.setValue('')

    this.FormGroup1.get('departamentoControl')?.setValue(0)
    this.FormGroup1.get('provinciaControl')?.setValue(0)
    this.FormGroup1.get('distritoControl')?.setValue(0)
    this.FormGroup1.get('departamentoNacControl')?.setValue(0)
    this.FormGroup1.get('provinciaNacControl')?.setValue(0)
    this.FormGroup1.get('distritoNacControl')?.setValue(0)
    this.FormGroup1.get('paisNacControl')?.setValue(0)
    this.FormGroup1.get('edadControl')?.setValue('0 años')
    this.FormGroup1.get('idiomaNativoControl')?.setValue(0)


    this.FormGroup1.get('afiliadoControl')?.setValue(0)
    this.FormGroup1.get('entidadControl')?.setValue(0)
    this.FormGroup1.get('haberesControl')?.setValue(0)
    this.FormGroup1.get('bancoControl')?.setValue(0)
    this.FormGroup1.get('bancoAperturarControl')?.setValue(0)
    this.FormGroup1.get('numCuentaControl')?.setValue('')
    this.FormGroup1.get('numCuentaCciControl')?.setValue('')

    this.FormGroup1.get('gradoacademicoControl')?.setValue(0)
    this.FormGroup1.get('mencionEnMayGradAcadControl')?.setValue('')
    this.FormGroup1.get('institucionMayGradAcadControl')?.setValue(0)

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

    this.dateCeseControl = new FormControl(new Date(''))

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
      this.configserv.nLegajoDatos = 0
      this.configserv.cFiltroColaborador = ''
      this.listadocolaborador()
    }
    this.nvoservc.registro = () => {
      // console.log(this.tabind)
      // if (this.tabind == 1) {
      //   this.guardarDJ()
      // } else {
      //   this.guardarcv()
      // }

      this.guardarTodo()
    }

    this.lstserv.cancelar = () => {
      // console.log('cancelar')
      this.segserv.obtenerdatosusuario()
      if (this.segserv.usuarioreg.nRol == 1) {
        this.ctrlserv._banregister = false
        this.configserv.nLegajoDatos = 0
        this.configserv.cFiltroColaborador = ''
        this.configserv.cPrdNombre = '202102'
      } else {
        this.editar_cv(this.segserv.usuarioreg)
      }
    }

    this.nvoservc.exportar = () => {
      this.acciones(3, this.clmdserv.objusuario)
    }
  }

  listadocolaborador() {
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

  listar_condicion() {
    this.lstserv
      .listado('constante', '/' + this.configserv.nConCondicion)
      .then((data) => {
        this.lstserv.lCondicionColeg = data
      })
  }

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
        case this.configserv.nIntIdiomaNativo:
          this.regLegDatosGenerales.nLegIdiomaNativo = 0

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
        case this.configserv.nIntIdiomaNativo:
          this.regLegDatosGenerales.nLegIdiomaNativo = $obj.nConValor

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
          break;
        case this.configserv.nConSexo:
          this.regLegDatosGenerales.nLegDatSexo = 0
          this.regLegDatosGenerales.nClaseSexo = 0
          break;
        case this.configserv.nConCondicion:
          this.regLegDatosGenerales.nLegDatCondicionColeg = 0
          this.regLegDatosGenerales.nValorCondicionColeg = 0
          break;
        case this.configserv.nConEstadoCivil:
          this.regLegDatosGenerales.nLegDatEstadoCivil = 0
          this.regLegDatosGenerales.nClaseEstadoCivil = 0
          break;
        case this.configserv.nConTipoZona:
          this.regLegDatosGenerales.nLegDatZona = 0
          this.regLegDatosGenerales.nValorZona = 0
          break;


        case this.configserv.nConAfiliado:
          this.regLegDatosGenerales.nLegDatRegPenAfiliado = 0
          this.regLegDatosGenerales.nValorAfiliado = 0
          break;
        case this.configserv.nConEntidad:
          this.regLegDatosGenerales.nLegDatRegPenEntidad = 0
          this.regLegDatosGenerales.nValorEntidad = 0
          break;

        case this.configserv.nConHaberes:
          this.regLegDatosGenerales.nLegDatCtaHabHaberes = 0
          this.regLegDatosGenerales.nValorHaberes = 0
          break;
        case this.configserv.nConBanco:
          this.regLegDatosGenerales.nLegDatCtaHabBanco = 0
          this.regLegDatosGenerales.nValorBanco = 0
          break;
        case this.configserv.nConBancoAperturar:
          this.regLegDatosGenerales.nLegDatCtaHabBancoAperturar = 0
          this.regLegDatosGenerales.nValorBancoAperturar = 0
          break;
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


        case this.configserv.nConAfiliado:
          this.regLegDatosGenerales.nLegDatRegPenAfiliado = $obj.nConCodigo
          this.regLegDatosGenerales.nValorAfiliado = $obj.nConValor
          break;
        case this.configserv.nConEntidad:
          this.regLegDatosGenerales.nLegDatRegPenEntidad = $obj.nConCodigo
          this.regLegDatosGenerales.nValorEntidad = $obj.nConValor
          break;

        case this.configserv.nConHaberes:
          this.regLegDatosGenerales.nLegDatCtaHabHaberes = $obj.nConCodigo
          this.regLegDatosGenerales.nValorHaberes = $obj.nConValor
          break;
        case this.configserv.nConBanco:
          this.regLegDatosGenerales.nLegDatCtaHabBanco = $obj.nConCodigo
          this.regLegDatosGenerales.nValorBanco = $obj.nConValor
          break;
        case this.configserv.nConBancoAperturar:
          this.regLegDatosGenerales.nLegDatCtaHabBancoAperturar = $obj.nConCodigo
          this.regLegDatosGenerales.nValorBancoAperturar = $obj.nConValor
          break;
      }
    }
  }

  ubigeoOnChange($obj: any, $tipo: number) {
    if ($obj == null) {
      switch ($tipo) {
        case 0:
          this.lstserv.ldepartamentoNac = []
          this.lstserv.lprovinciaNac = []
          this.lstserv.ldistritoNac = []
          break
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

        case 4:
          this.lstserv.lprovinciaNac = []
          this.lstserv.ldistritoNac = []
          break
        case 5:
          this.lstserv.ldistritoNac = []
          break
        case 6:
          this.regLegDatosGenerales.nLetDatNacimiento = 0
          this.regLegDatosGenerales.nClaseNacimiento = 0
          break
      }
    } else {
      switch ($tipo) {
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

  onTipoDocumentoChange(value: number) {
    if (value === 22 ||
      value === 28 ||
      value === 29 ||
      value === 30 ||
      value === 31 ||
      value === 32) {

      this.mostrarDomicilio = false;
      this.habilitarDomicilio(false);
    } else {
      this.mostrarDomicilio = true;
      this.habilitarDomicilio(true);
    }
  }


  onAfiliadoChange(value: number) {
    this.mostrarEntidad = value === 1;
    this.mostrarBotonDescarga = value === 2;
    this.mostrarCamposCesante = value === 3;
  }

  onHaberesChange(value: number) {
    const bancoControl = this.FormGroup1.get('bancoControl');
    const numCuentaControl = this.FormGroup1.get('numCuentaControl');
    const numCuentaCciControl = this.FormGroup1.get('numCuentaCciControl');
    const bancoAperturarControl = this.FormGroup1.get('bancoAperturarControl');

    if (value === 1) { // SI tiene cuenta
      this.mostrarBanco = true;
      this.mostrarBancoAperturar = false;

      // Banco y Cuentas pasan a ser OBLIGATORIOS
      bancoControl?.setValidators([Validators.required]);
      numCuentaControl?.setValidators([Validators.required, Validators.maxLength(14)]);
      numCuentaCciControl?.setValidators([Validators.required, Validators.maxLength(20)]);

      // Banco Aperturar deja de ser obligatorio y se limpia
      bancoAperturarControl?.clearValidators();
      bancoAperturarControl?.setValue(0);
    }
    else if (value === 2) { // NO tiene cuenta
      this.mostrarBanco = false;
      this.mostrarBancoAperturar = true;

      // Banco Aperturar pasa a ser OBLIGATORIO
      bancoAperturarControl?.setValidators([Validators.required]);

      // Los otros dejan de ser obligatorios y se limpian
      bancoControl?.clearValidators();
      numCuentaControl?.clearValidators();
      numCuentaCciControl?.clearValidators();

      bancoControl?.setValue(0);
      numCuentaControl?.setValue('');
      numCuentaCciControl?.setValue('');
    }

    // IMPORTANTE: Actualizar el estado de los controles para que Angular se entere del cambio
    bancoControl?.updateValueAndValidity();
    numCuentaControl?.updateValueAndValidity();
    numCuentaCciControl?.updateValueAndValidity();
    bancoAperturarControl?.updateValueAndValidity();
  }

  fileProgress(fileInput: any, btipo: boolean = true): void {
    if (btipo) {
      this.fileData = <File>fileInput.target.files[0]
    } else {
      this.fileDataCert = <File>fileInput.target.files[0]
    }
    this.preview(btipo)
  }

  // Modificar el método filePDF para crear URLs de previsualización - EBS 11/2025

  filePDF(fileInput: any, btipo: number = 0): void {
    let archadj = fileInput != null ? <File>fileInput.target.files[0] : <File>{}
    const mimeType = fileInput != null ? archadj.type : ''

    // Limpiar previsualización si el archivo no es válido
    if (mimeType.match(/pdf\/*/) == null || mimeType == '') {
      this.limpiarPreviewUrl(btipo);

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
        case 7:
          this.regLegDatosGenerales.cLegDatBuenaSalud = null
          this.errregbuenasalud = false
          break
        case 8:
          this.regLegDatosGenerales.cLegDatArchivoConadis = null
          this.errregconadis = false
          break
        case 9:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo1 = null
          this.erranexo1 = false
          break
        case 10:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2_2 = null
          this.erranexo2_2 = false
          break
        case 11:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo3 = null
          this.erranexo3 = false
          break
        case 12:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo4 = null
          this.erranexo4 = false
          break
        case 13:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo5 = null
          this.erranexo5 = false
          break
        case 14:
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6_2 = null
          this.erranexo6_2 = false
          break
        case 15:
          this.lstserv.LegDeclaracionJurada.cLegDjDNI = null
          this.errdjDNI = false
          break
        case 16:
          this.lstserv.LegDeclaracionJurada.cLegDjDNI_DH = null
          this.errdjDNI_DH = false
          break
        case 17:
          this.lstserv.LegDeclaracionJurada.cLegDjFotoCarnet = null
          this.errdjFotoCarnet = false
          break
        case 18:
          this.lstserv.LegDeclaracionJurada.cLegDjNumCta = null
          this.errdjNumCta = false
          break
        case 19:
          this.lstserv.LegDeclaracionJurada.cLegDjConsJubilacion = null
          this.errdjConsJubilacion = false
          break
        case 20:
          this.lstserv.LegDeclaracionJurada.cLegDjConsAfiliacionOnpAfp = null
          this.errdjConsAfiliacionOnpAfp = false
          break
      }

      if (mimeType.match(/pdf\/*/) == null && fileInput != null) {
        this.valserv.mensaje_info('Formato no válida. Adjunte un archivo PDF.')
      }
      return;
    }

    // Crear URL de previsualización SOLO para archivos válidos  - EBS 11/2025
    const previewUrl = URL.createObjectURL(archadj);

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
      case 7:
        this.regLegDatosGenerales.cLegDatBuenaSalud = archadj
        this.errregbuenasalud = true
        break
      case 8:
        this.regLegDatosGenerales.cLegDatArchivoConadis = archadj
        this.errregconadis = true
        break
      case 9:
        this.lstserv.LegDeclaracionJurada.cLegDjanexo1 = archadj
        this.erranexo1 = true
        this.previewAnexo1Url = previewUrl; // Asignar la URL de previsualización
        break
      case 10:
        this.lstserv.LegDeclaracionJurada.cLegDjanexo2_2 = archadj
        this.erranexo2_2 = true
        this.previewAnexo2_2Url = previewUrl;
        break
      case 11:
        this.lstserv.LegDeclaracionJurada.cLegDjanexo3 = archadj
        this.erranexo3 = true
        this.previewAnexo3Url = previewUrl;
        break
      case 12:
        this.lstserv.LegDeclaracionJurada.cLegDjanexo4 = archadj
        this.erranexo4 = true
        this.previewAnexo4Url = previewUrl;
        break
      case 13:
        this.lstserv.LegDeclaracionJurada.cLegDjanexo5 = archadj
        this.erranexo5 = true
        this.previewAnexo5Url = previewUrl;
        break
      case 14:
        this.lstserv.LegDeclaracionJurada.cLegDjanexo6_2 = archadj
        this.erranexo6_2 = true
        this.previewAnexo6_2Url = previewUrl;
        break
      case 15:
        this.lstserv.LegDeclaracionJurada.cLegDjDNI = archadj
        this.errdjDNI = true
        this.previewDjDNIUrl = previewUrl;
        break
      case 16:
        this.lstserv.LegDeclaracionJurada.cLegDjDNI_DH = archadj
        this.errdjDNI_DH = true
        this.previewDjDNI_DHUrl = previewUrl;
        break
      case 17:
        this.lstserv.LegDeclaracionJurada.cLegDjFotoCarnet = archadj
        this.errdjFotoCarnet = true
        this.previewDjFotoCarnetUrl = previewUrl;
        break
      case 18:
        this.lstserv.LegDeclaracionJurada.cLegDjNumCta = archadj
        this.errdjNumCta = true
        this.previewDjNumCtaUrl = previewUrl;
        break
      case 19:
        this.lstserv.LegDeclaracionJurada.cLegDjConsJubilacion = archadj
        this.errdjConsJubilacion = true
        this.previewDjConsJubilacionUrl = previewUrl;
        break
      case 20:
        this.lstserv.LegDeclaracionJurada.cLegDjConsAfiliacionOnpAfp = archadj
        this.errdjConsAfiliacionOnpAfp = true
        this.previewDjConsAfiliacionOnpAfpUrl = previewUrl;
        break
    }
  }

  // Limpiar URLs de previsualización  - EBS 11/2025
  private limpiarPreviewUrl(btipo: number): void {
    switch (btipo) {
      case 9:
        if (this.previewAnexo1Url) URL.revokeObjectURL(this.previewAnexo1Url);
        this.previewAnexo1Url = null;
        break;
      case 10:
        if (this.previewAnexo2_2Url) URL.revokeObjectURL(this.previewAnexo2_2Url);
        this.previewAnexo2_2Url = null;
        break;
      case 11:
        if (this.previewAnexo3Url) URL.revokeObjectURL(this.previewAnexo3Url);
        this.previewAnexo3Url = null;
        break;
      case 12:
        if (this.previewAnexo4Url) URL.revokeObjectURL(this.previewAnexo4Url);
        this.previewAnexo4Url = null;
        break;
      case 13:
        if (this.previewAnexo5Url) URL.revokeObjectURL(this.previewAnexo5Url);
        this.previewAnexo5Url = null;
        break;
      case 14:
        if (this.previewAnexo6_2Url) URL.revokeObjectURL(this.previewAnexo6_2Url);
        this.previewAnexo6_2Url = null;
        break;
      case 15:
        if (this.previewDjDNIUrl) URL.revokeObjectURL(this.previewDjDNIUrl);
        this.previewDjDNIUrl = null;
        break;
      case 16:
        if (this.previewDjDNI_DHUrl) URL.revokeObjectURL(this.previewDjDNI_DHUrl);
        this.previewDjDNI_DHUrl = null;
        break;
      case 17:
        if (this.previewDjFotoCarnetUrl) URL.revokeObjectURL(this.previewDjFotoCarnetUrl);
        this.previewDjFotoCarnetUrl = null;
        break;
      case 18:
        if (this.previewDjNumCtaUrl) URL.revokeObjectURL(this.previewDjNumCtaUrl);
        this.previewDjNumCtaUrl = null;
        break;
      case 19:
        if (this.previewDjConsJubilacionUrl) URL.revokeObjectURL(this.previewDjConsJubilacionUrl);
        this.previewDjConsJubilacionUrl = null;
        break;
      case 20:
        if (this.previewDjConsAfiliacionOnpAfpUrl) URL.revokeObjectURL(this.previewDjConsAfiliacionOnpAfpUrl);
        this.previewDjConsAfiliacionOnpAfpUrl = null;
        break;
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
    this.mdlserv.nuevoModalGradoTitulo('Grados y títulos',
      this.regLegDatosGenerales.nLegDatCodigo,
      $formacion,
    )
  }


  // EBS - 01/2026 ---------------->
  nuevo_licenciaprofesional($licenciaprofesional: LegLicenciaProfesional) {
    this.mdlserv.nuevoModalLicenciaProfesional('Licencia Profesional',
      this.regLegDatosGenerales.nLegDatCodigo,
      $licenciaprofesional,
    )
  }

  nuevo_membresia($membresia: LegMembresia) {
    this.mdlserv.nuevoModalMembresia('membresia',
      this.regLegDatosGenerales.nLegDatCodigo,
      $membresia,
    )
  }
  // EBS - 01/2026 <----------------


  nuevo_experienciadoc($obg: LegDocenciaUniv) {
    this.mdlserv.nuevoModalExperienciaDoc('Docencia universitaria',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
    )
  }

  nuevo_categoriadoc($obg: LegCategoriaDocente) {
    this.mdlserv.nuevoModalCategoriaDOc('Categoría docente',
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
    this.mdlserv.nuevoModalIvestigador('Docente investigador',
      this.regLegDatosGenerales.nLegDatCodigo,
      $obg,
      this.segserv.usuarioreg.cPerCodigo,
    )
  }

  nuevo_asejurtesis($obg: LegTesisAseJur) {
    this.mdlserv.nuevoModalTesisAsesJur(
      'Actividades de Servicio (Dentro y fuera de la insitución)',
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
      'Honores y Reconocimientos',
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
    this.ban_administrativo = $objaux.nTipo == 1 ? true : false
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
      heightAuto: false
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
          this.regserv.actualizarcampo(
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

  // EBS -01/2026 ---------------------------->
  eliminar_validar_licencia($obj: LegLicenciaProfesional, bvalel: boolean) {
    Swal.fire({
      title: 'Registro de Licencias',
      text: bvalel
        ? '¿Está seguro de eliminar registro?'
        : '¿Está seguro de validar registro?',
      icon: 'question',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if ($obj.nLegLicCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegLicEstado' : '/cLegLicValida',
              op: 'replace',
            },
          ]
          this.regserv.actualizarcampo(
            'Registro de Legajo',
            'licenciaprofesional/' + $obj.nLegLicCodigo,
            request,
          )
            .then(() => {
              this.lstserv.listar_licenciaprofesional($obj.nLegLicDatCodigo)
            })
        } else {
          var index = this.lstserv.lLegLicenciaProfesional.indexOf($obj)
          this.lstserv.lLegLicenciaProfesional.splice(index, 1)
        }
      }
    })
  }

  eliminar_validar_membresia($obj: LegMembresia, bvalel: boolean) {
    Swal.fire({
      title: 'Registro de Membresias',
      text: bvalel
        ? '¿Está seguro de eliminar registro?'
        : '¿Está seguro de validar registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      heightAuto: false
    }).then((result) => {
      if (result.value) {
        if ($obj.nLegMemCodigo > 0) {
          let request = [
            {
              value: bvalel ? false : true,
              path: bvalel ? '/cLegMemEstado' : '/cLegMemValida',
              op: 'replace',
            },
          ]
          this.regserv.actualizarcampo(
            'Registro de Membresia',
            'membresia/' + $obj.nLegMemCodigo,
            request,
          )
            .then(() => {
              this.lstserv.listar_membresia($obj.nLegMemDatCodigo)
            })
        } else {
          var index = this.lstserv.lLegMembresia.indexOf($obj)
          this.lstserv.lLegMembresia.splice(index, 1)
        }
      }
    })
  }
  // EBS - 01/2026 ---------------------------->



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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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
      heightAuto: false
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

  async guardarDJ() {

    if (this.regLegDatosGenerales.nLegDatCodigo == 0) {
      Swal.fire(
        'Guardar Declaracion Jurada',
        'No se ha encontrado datos generales, guarde primero los datos generales.',
        'info',
      )
      return;
    }
    else {

      try {
        var formData = new FormData()
        let fecha: any

        formData.append('nLegDjcodigo', this.lstserv.LegDeclaracionJurada.nLegDjcodigo.toString() ?? '0')
        formData.append('nLegDjdatCodigo', this.regLegDatosGenerales.nLegDatCodigo.toString() ?? '0')

        if (!this.lstserv.LegDeclaracionJurada.cLegDjanexo1 && this.regLegDatosGenerales.nValorAfiliado === 2) {
          this.valserv.mensaje_info('Adjunte archivo de Anexo 1.')
          return
        }
        if (!this.lstserv.LegDeclaracionJurada.cLegDjNumCta && this.regLegDatosGenerales.nValorHaberes === 1) {
          this.valserv.mensaje_info('Adjunte archivo de Nº de Cuenta (voucher o captura).')
          return
        }
        if (!this.lstserv.LegDeclaracionJurada.cLegDjConsJubilacion && this.regLegDatosGenerales.nValorAfiliado === 3) {
          this.valserv.mensaje_info('Adjunte archivo de la Constancia de Jubilación.')
          return
        }
        if (!this.lstserv.LegDeclaracionJurada.cLegDjConsAfiliacionOnpAfp && this.regLegDatosGenerales.nValorAfiliado === 1) {
          this.valserv.mensaje_info('Adjunte archivo de la Constancia de Afiliación.')
          return
        }


        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo1 != this.lstserv.LegDeclaracionJurada.cFileDjanexo1) {
          formData.append('cFileDjanexo1', this.lstserv.LegDeclaracionJurada.cLegDjanexo1)
          formData.append('cLegDjanexo1', '')
        } else {
          formData.append('cLegDjanexo1', this.lstserv.LegDeclaracionJurada.cLegDjanexo1)
        }
        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo2_2 != this.lstserv.LegDeclaracionJurada.cFileDjanexo2_2) {
          formData.append('cFileDjanexo2_2', this.lstserv.LegDeclaracionJurada.cLegDjanexo2_2)
          formData.append('cLegDjanexo2_2', '')
        } else {
          formData.append('cLegDjanexo2_2', this.lstserv.LegDeclaracionJurada.cLegDjanexo2_2)
        }
        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo3 != this.lstserv.LegDeclaracionJurada.cFileDjanexo3) {
          formData.append('cFileDjanexo3', this.lstserv.LegDeclaracionJurada.cLegDjanexo3)
          formData.append('cLegDjanexo3', '')
        } else {
          formData.append('cLegDjanexo3', this.lstserv.LegDeclaracionJurada.cLegDjanexo3)
        }
        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo4 != this.lstserv.LegDeclaracionJurada.cFileDjanexo4) {
          formData.append('cFileDjanexo4', this.lstserv.LegDeclaracionJurada.cLegDjanexo4)
          formData.append('cLegDjanexo4', '')
        } else {
          formData.append('cLegDjanexo4', this.lstserv.LegDeclaracionJurada.cLegDjanexo4)
        }
        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo5 != this.lstserv.LegDeclaracionJurada.cFileDjanexo5) {
          formData.append('cFileDjanexo5', this.lstserv.LegDeclaracionJurada.cLegDjanexo5)
          formData.append('cLegDjanexo5', '')
        } else {
          formData.append('cLegDjanexo5', this.lstserv.LegDeclaracionJurada.cLegDjanexo5)
        }
        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo6_2 != this.lstserv.LegDeclaracionJurada.cFileDjanexo6_2) {
          formData.append('cFileDjanexo6_2', this.lstserv.LegDeclaracionJurada.cLegDjanexo6_2)
          formData.append('cLegDjanexo6_2', '')
        } else {
          formData.append('cLegDjanexo6_2', this.lstserv.LegDeclaracionJurada.cLegDjanexo6_2)
        }

        if (this.lstserv.LegDeclaracionJurada.cLegDjDNI != this.lstserv.LegDeclaracionJurada.cFileDjDNI) {
          formData.append('cFileDjDNI', this.lstserv.LegDeclaracionJurada.cLegDjDNI)
          formData.append('cLegDjDNI', '')
        } else {
          formData.append('cLegDjDNI', this.lstserv.LegDeclaracionJurada.cLegDjDNI)
        }
        if (this.lstserv.LegDeclaracionJurada.cLegDjDNI_DH != this.lstserv.LegDeclaracionJurada.cFileDjDNI_DH) {
          formData.append('cFileDjDNI_DH', this.lstserv.LegDeclaracionJurada.cLegDjDNI_DH)
          formData.append('cLegDjDNI_DH', '')
        } else {
          formData.append('cLegDjDNI_DH', this.lstserv.LegDeclaracionJurada.cLegDjDNI_DH)
        }
        if (this.lstserv.LegDeclaracionJurada.cLegDjFotoCarnet != this.lstserv.LegDeclaracionJurada.cFileDjFotoCarnet) {
          formData.append('cFileDjFotoCarnet', this.lstserv.LegDeclaracionJurada.cLegDjFotoCarnet)
          formData.append('cLegDjFotoCarnet', '')
        } else {
          formData.append('cLegDjFotoCarnet', this.lstserv.LegDeclaracionJurada.cLegDjFotoCarnet)
        }
        if (this.lstserv.LegDeclaracionJurada.cLegDjNumCta != this.lstserv.LegDeclaracionJurada.cFileDjNumCta) {
          formData.append('cFileDjNumCta', this.lstserv.LegDeclaracionJurada.cLegDjNumCta)
          formData.append('cLegDjNumCta', '')
        } else {
          formData.append('cLegDjNumCta', this.lstserv.LegDeclaracionJurada.cLegDjNumCta)
        }
        if (this.lstserv.LegDeclaracionJurada.cLegDjConsJubilacion != this.lstserv.LegDeclaracionJurada.cFileDjConsJubilacion) {
          formData.append('cFileDjConsJubilacion', this.lstserv.LegDeclaracionJurada.cLegDjConsJubilacion)
          formData.append('cLegDjConsJubilacion', '')
        } else {
          formData.append('cLegDjConsJubilacion', this.lstserv.LegDeclaracionJurada.cLegDjConsJubilacion)
        }
        if (this.lstserv.LegDeclaracionJurada.cLegDjConsAfiliacionOnpAfp != this.lstserv.LegDeclaracionJurada.cFileDjConsAfiliacionOnpAfp) {
          formData.append('cFileDjConsAfiliacionOnpAfp', this.lstserv.LegDeclaracionJurada.cLegDjConsAfiliacionOnpAfp)
          formData.append('cLegDjConsAfiliacionOnpAfp', '')
        } else {
          formData.append('cLegDjConsAfiliacionOnpAfp', this.lstserv.LegDeclaracionJurada.cLegDjConsAfiliacionOnpAfp)
        }


        formData.append('bLegDjestado', 'true')

        const data = await this.regserv.registroFile('Registro de Legajos', 'declaracionjurada/' + this.regLegDatosGenerales.nLegDatCodigo, formData, false)

        // Ahora que el registro ha terminado, podemos listar
        if (this.tabind === 1) {
          this.listar_DeclaracionJurada(this.regLegDatosGenerales.nLegDatCodigo);
        }
        return data; // Devolvemos el resultado para usarlo en `guardarTodo()`

      } catch (error) {
        console.error("Error en guardarDJ:", error);
        throw error;
      }
    }
  }

  eliminar_cv($obj: LegDatosGenerales) { }

  filterIdiomas(regis: LegIdiomaOfimatica) {
    return regis.cLegIdOfTipo == false
  }

  filterOfimatica(regis: LegIdiomaOfimatica) {
    return regis.cLegIdOfTipo == true
  }

  exportar($objaux: DatosUsuario) {
    window.open(
      environment.URLAPI + 'legajo_pdf/' + btoa($objaux.cPerCodigo) + '/' + btoa($objaux.nTipo.toString()), '_blank',
    )
  }

  exportar_legajo($objaux: DatosUsuario) {
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

  listar_DeclaracionJurada(ncodigo: number) {
    this.lstserv
      .listado('declaracionjurada_lst', '/' + ncodigo)
      .then((data) => {
        let datos: LegDeclaracionJurada[] = data
        if (datos.length > 0) {
          const legDJ = datos[0];

          this.lstserv.LegDeclaracionJurada.cFileDjanexo1 = legDJ.cLegDjanexo1 ?? "";
          this.lstserv.LegDeclaracionJurada.cFileDjanexo2_2 = legDJ.cLegDjanexo2_2 ?? "";
          this.lstserv.LegDeclaracionJurada.cFileDjanexo3 = legDJ.cLegDjanexo3 ?? "";
          this.lstserv.LegDeclaracionJurada.cFileDjanexo4 = legDJ.cLegDjanexo4 ?? "";
          this.lstserv.LegDeclaracionJurada.cFileDjanexo5 = legDJ.cLegDjanexo5 ?? "";
          this.lstserv.LegDeclaracionJurada.cFileDjanexo6_2 = legDJ.cLegDjanexo6_2 ?? "";
          this.lstserv.LegDeclaracionJurada.cFileDjDNI = legDJ.cLegDjDNI ?? "";
          this.lstserv.LegDeclaracionJurada.cFileDjDNI_DH = legDJ.cLegDjDNI_DH ?? "";
          this.lstserv.LegDeclaracionJurada.cFileDjFotoCarnet = legDJ.cLegDjFotoCarnet ?? "";
          this.lstserv.LegDeclaracionJurada.cFileDjNumCta = legDJ.cLegDjNumCta ?? "";
          this.lstserv.LegDeclaracionJurada.cFileDjConsJubilacion = legDJ.cLegDjConsJubilacion ?? "";
          this.lstserv.LegDeclaracionJurada.cFileDjConsAfiliacionOnpAfp = legDJ.cLegDjConsAfiliacionOnpAfp ?? "";

          this.lstserv.LegDeclaracionJurada.cLegDjanexo1 = legDJ.cLegDjanexo1 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo1}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2_2 = legDJ.cLegDjanexo2_2 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo2_2}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo3 = legDJ.cLegDjanexo3 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo3}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo4 = legDJ.cLegDjanexo4 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo4}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo5 = legDJ.cLegDjanexo5 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo5}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6_2 = legDJ.cLegDjanexo6_2 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo6_2}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjDNI = legDJ.cLegDjDNI ? `${environment.APIFILEPDF}${legDJ.cLegDjDNI}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjDNI_DH = legDJ.cLegDjDNI_DH ? `${environment.APIFILEPDF}${legDJ.cLegDjDNI_DH}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjFotoCarnet = legDJ.cLegDjFotoCarnet ? `${environment.APIFILEPDF}${legDJ.cLegDjFotoCarnet}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjNumCta = legDJ.cLegDjNumCta ? `${environment.APIFILEPDF}${legDJ.cLegDjNumCta}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjConsJubilacion = legDJ.cLegDjConsJubilacion ? `${environment.APIFILEPDF}${legDJ.cLegDjConsJubilacion}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjConsAfiliacionOnpAfp = legDJ.cLegDjConsAfiliacionOnpAfp ? `${environment.APIFILEPDF}${legDJ.cLegDjConsAfiliacionOnpAfp}` : "";

          this.erranexo1 = legDJ.cLegDjanexo1 ? true : false;
          this.erranexo2_2 = legDJ.cLegDjanexo2_2 ? true : false;
          this.erranexo3 = legDJ.cLegDjanexo3 ? true : false;
          this.erranexo4 = legDJ.cLegDjanexo4 ? true : false;
          this.erranexo5 = legDJ.cLegDjanexo5 ? true : false;
          this.erranexo6_2 = legDJ.cLegDjanexo6_2 ? true : false;
          this.errdjDNI = legDJ.cLegDjDNI ? true : false;
          this.errdjDNI_DH = legDJ.cLegDjDNI_DH ? true : false;
          this.errdjFotoCarnet = legDJ.cLegDjFotoCarnet ? true : false;
          this.errdjNumCta = legDJ.cLegDjNumCta ? true : false;
          this.errdjConsJubilacion = legDJ.cLegDjConsJubilacion ? true : false;
          this.errdjConsAfiliacionOnpAfp = legDJ.cLegDjConsAfiliacionOnpAfp ? true : false;
        }
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


  anexos: { nombre: string; archivo: string }[] = [
    {
      nombre: 'ANEXO 1 - BOLETIN INFORMATIVO DE SISTEMA PENSIONARIO',
      archivo: 'ANEXO_1-BOLETIN_INFORMATIVO_DE_SISTEMA_PENSIONARIO.pdf'
    },

    {
      nombre: 'ANEXO 2 - CONSTANCIA DE BOLETIN DE SISTEMA PENSIONARIO',
      archivo: 'ANEXO_2-CONSTANCIA_DE_BOLETIN_DE_SISTEMA_PENSIONARIO.pdf'
    },

    {
      nombre: 'ANEXO 3 - CONSTANCIA DE ENTREGA REGLAMENTOS INTERNOS',
      archivo: 'ANEXO_3-CONSTANCIA_DE_ENTREGA_REGLAMENTOS_INTERNOS.pdf'
    },

    {
      nombre: 'ANEXO 4 - DECLARACIÓN JURADA DE GOZAR DE BUENA SALUD FÍSICA Y MENTAL',
      archivo: 'ANEXO_4-DECLARACION_JURADA_DE_GOZAR_DE_BUENA_SALUD_FISICA_Y_MENTAL.pdf'
    },

    {
      nombre: 'ANEXO 5 - DECLARACION JURADA DTC',
      archivo: 'ANEXO_5-DECLARACION_JURADA_DTC.pdf'
    },

    {
      nombre: 'ANEXO 6 - FORMATO DJ VIDA LEY',
      archivo: 'ANEXO_6-FORMATO_DJ_VIDA_LEY.pdf'
    }
  ];

  anexos2: { nombre: string; archivo: string }[] = [
    {
      nombre: 'PDF 1 - REGLAMENTO INTERNO DE TRABAJO',
      archivo: '1_REGLAMENTO_INTERNO_DE_TRABAJO.pdf'
    },

    {
      nombre: 'PDF 2 - MANUAL DE PREVENCIÓN DEL HOSTIGAMIENTO SEXUAL',
      archivo: '2_MANUAL_DE_PREVENCION_DEL_HOSTIGAMIENTO_SEXUAL.pdf'
    },

    {
      nombre: 'PDF 3 - REGLAMENTO INTERNO DE ASISTENCIA Y PERMANECIA DEL PERSONAL',
      archivo: '3_REGLAMENTO_INTERNO_DE_ASISTENCIA_Y_PERMANENCIA_DEL_PERSONAL.pdf'
    },

    {
      nombre: 'PDF 4 - REGLAMENTO INTERNO DE SEGURIDAD Y SALUD EN EL TRABAJO',
      archivo: '4_REGLAMENTO_INTERNO_DE_SEGURIDAD_Y_SALUD_EN_EL_TRABAJO.pdf'
    },

    {
      nombre: 'PDF 5 - REGLAMENTO DE EVALUACION DE DESEMPEÑO',
      archivo: '5_REGLAMENTO_DE_EVALUACION_DE_DESEMPENO.pdf'
    },

    {
      nombre: 'PDF 6 - DOCUMENTOS POLITICA SALARIAL',
      archivo: '6_DOCUMENTOS_POLITICA_SALARIAL.pdf'
    },

    {
      nombre: 'PDF 7 - MANUAL TRABAJO REMOTO USS UHHP',
      archivo: '7_MANUAL_TRABAJO_REMOTO_USS_UHHP.pdf'
    }
  ];

  descargarArchivo(fileName: string) {
    const encodeFileName = btoa(fileName);
    const downloadUrl = `${environment.APIFILEANEXOS}${encodeFileName}`;
    window.open(downloadUrl, '_blank');
  }


  private obtenerCamposInvalidos(formGroup: FormGroup): string[] {
    const invalidos: string[] = [];
    const controles = formGroup.controls;

    Object.keys(controles).forEach(key => {
      const control = controles[key];
      if (control.invalid) {
        const etiqueta = this.campoEtiquetas[key] || key;
        invalidos.push(etiqueta);
      }
    });

    return invalidos;
  }


  // Eliminación de documentos para subir (Anexos) - EBS 11/2025   ------------>
  eliminarDocumento(tipo: number): void {
    Swal.fire({
      title: '¿Eliminar documento?',
      text: '¿Está seguro de que desea eliminar este documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarEliminacionDocumento(tipo);
      }
    });
  }

  private procesarEliminacionDocumento(tipo: number): void {
    switch (tipo) {
      case 9: // Anexo 1
        this.limpiarPreviewUrl(9);

        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo1) {
          this.lstserv.LegDeclaracionJurada.cLegDjanexo1 = null;
          this.erranexo1 = false;
        }
        // Si ya estaba guardado en el servidor
        if (this.lstserv.LegDeclaracionJurada.cFileDjanexo1) {
          this.lstserv.LegDeclaracionJurada.cFileDjanexo1 = null;
          this.eliminarDocumentoServidor('anexo1');
        }
        break;

      case 10: // Anexo 2.2
        this.limpiarPreviewUrl(10);
        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo2_2) {
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2_2 = null;
          this.erranexo2_2 = false;
        }
        if (this.lstserv.LegDeclaracionJurada.cFileDjanexo2_2) {
          this.lstserv.LegDeclaracionJurada.cFileDjanexo2_2 = null;
          this.eliminarDocumentoServidor('anexo2_2');
        }
        break;
      case 11: // Anexo 3
        this.limpiarPreviewUrl(11);
        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo3) {
          this.lstserv.LegDeclaracionJurada.cLegDjanexo3 = null;
          this.erranexo3 = false;
        }
        if (this.lstserv.LegDeclaracionJurada.cFileDjanexo3) {
          this.lstserv.LegDeclaracionJurada.cFileDjanexo3 = null;
          this.eliminarDocumentoServidor('anexo3');
        }
        break;
      case 12: // Anexo 4
        this.limpiarPreviewUrl(12);
        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo4) {
          this.lstserv.LegDeclaracionJurada.cLegDjanexo4 = null;
          this.erranexo4 = false;
        }
        if (this.lstserv.LegDeclaracionJurada.cFileDjanexo4) {
          this.lstserv.LegDeclaracionJurada.cFileDjanexo4 = null;
          this.eliminarDocumentoServidor('anexo4');
        }
        break;
      case 13: // Anexo 5
        this.limpiarPreviewUrl(13);
        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo5) {
          this.lstserv.LegDeclaracionJurada.cLegDjanexo5 = null;
          this.erranexo5 = false;
        }
        if (this.lstserv.LegDeclaracionJurada.cFileDjanexo5) {
          this.lstserv.LegDeclaracionJurada.cFileDjanexo5 = null;
          this.eliminarDocumentoServidor('anexo5');
        }
        break;
      case 14: // Anexo 6_2
        this.limpiarPreviewUrl(14);
        if (this.lstserv.LegDeclaracionJurada.cLegDjanexo6_2) {
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6_2 = null;
          this.erranexo6_2 = false;
        }
        if (this.lstserv.LegDeclaracionJurada.cFileDjanexo6_2) {
          this.lstserv.LegDeclaracionJurada.cFileDjanexo6_2 = null;
          this.eliminarDocumentoServidor('anexo6_2');
        }
        break;
      case 15: // Anexo DNI
        this.limpiarPreviewUrl(15);
        if (this.lstserv.LegDeclaracionJurada.cLegDjDNI) {
          this.lstserv.LegDeclaracionJurada.cLegDjDNI = null;
          this.errdjDNI = false;
        }
        if (this.lstserv.LegDeclaracionJurada.cFileDjDNI) {
          this.lstserv.LegDeclaracionJurada.cFileDjDNI = null;
          this.eliminarDocumentoServidor('dni');
        }
        break;
      case 16: // Anexo DNI Derecho Habiente
        this.limpiarPreviewUrl(16);
        if (this.lstserv.LegDeclaracionJurada.cLegDjDNI_DH) {
          this.lstserv.LegDeclaracionJurada.cLegDjDNI_DH = null;
          this.errdjDNI_DH = false;
        }
        if (this.lstserv.LegDeclaracionJurada.cFileDjDNI_DH) {
          this.lstserv.LegDeclaracionJurada.cFileDjDNI_DH = null;
          this.eliminarDocumentoServidor('dni_dh');
        }
        break;
      case 17: // Anexo Foto Carnet
        this.limpiarPreviewUrl(17);
        if (this.lstserv.LegDeclaracionJurada.cLegDjFotoCarnet) {
          this.lstserv.LegDeclaracionJurada.cLegDjFotoCarnet = null;
          this.errdjFotoCarnet = false;
        }
        if (this.lstserv.LegDeclaracionJurada.cFileDjFotoCarnet) {
          this.lstserv.LegDeclaracionJurada.cFileDjFotoCarnet = null;
          this.eliminarDocumentoServidor('fotocarnet');
        }
        break;
      case 18: // Anexo Numero de Cuenta
        this.limpiarPreviewUrl(18);
        if (this.lstserv.LegDeclaracionJurada.cLegDjNumCta) {
          this.lstserv.LegDeclaracionJurada.cLegDjNumCta = null;
          this.errdjNumCta = false;
        }
        if (this.lstserv.LegDeclaracionJurada.cFileDjNumCta) {
          this.lstserv.LegDeclaracionJurada.cFileDjNumCta = null;
          this.eliminarDocumentoServidor('numcta');
        }
        break;
      case 19: // Anexo Constancia de Jubilacion
        this.limpiarPreviewUrl(19);
        if (this.lstserv.LegDeclaracionJurada.cLegDjConsJubilacion) {
          this.lstserv.LegDeclaracionJurada.cLegDjConsJubilacion = null;
          this.errdjConsJubilacion = false;
        }
        if (this.lstserv.LegDeclaracionJurada.cFileDjConsJubilacion) {
          this.lstserv.LegDeclaracionJurada.cFileDjConsJubilacion = null;
          this.eliminarDocumentoServidor('consjubilacion');
        }
        break;
      case 20: // Anexo Constancia de Jubilacion
        this.limpiarPreviewUrl(20);
        if (this.lstserv.LegDeclaracionJurada.cLegDjConsAfiliacionOnpAfp) {
          this.lstserv.LegDeclaracionJurada.cLegDjConsAfiliacionOnpAfp = null;
          this.errdjConsAfiliacionOnpAfp = false;
        }
        if (this.lstserv.LegDeclaracionJurada.cFileDjConsAfiliacionOnpAfp) {
          this.lstserv.LegDeclaracionJurada.cFileDjConsAfiliacionOnpAfp = null;
          this.eliminarDocumentoServidor('consafiliacion');
        }
        break;
    }
  }

  private async eliminarDocumentoServidor(tipoDocumento: string): Promise<void> {
    console.log("codigoDJ::" + this.nLegDjcodigo);

    if (this.nLegDjcodigo <= 0) return;

    this.spinner.show();
    try {
      // Preparar el objeto request con los parámetros necesarios
      const request = {
        tipoDocumento: tipoDocumento,
        codigoDJ: this.nLegDjcodigo
      };

      // Llamar al servicio con el nuevo formato
      const resultado = await this.regserv.eliminarDocumento(
        "Eliminar Documento Anexo",
        "declaracionjurada/eliminar_documento_legajo",
        request
      );

      if (resultado) {
        Swal.fire('Éxito', 'Documento eliminado correctamente', 'success');
      }
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      Swal.fire('Error', 'No se pudo eliminar el documento', 'error');
    } finally {
      this.spinner.hide();
    }
  }
  // Eliminación de documentos para subir (Anexos) - EBS 11/2025   ------------>
  get legajoGuardado(): boolean {
    return this.regLegDatosGenerales &&
      this.regLegDatosGenerales.nLegDatCodigo != null &&
      this.regLegDatosGenerales.nLegDatCodigo > 0;
  }

  irAlPaso1(): void {
    this.stepper.selectedIndex = 0;
  }

   async guardarTodo() {
    const aceptado = await this.confirmarTerminos();
    if (!aceptado) return;

    if (!this.validarFormulario()) return;
    
    try {
      this.spinner.show();
 
      const formData = this.construirFormDataDatosGenerales();
      this.agregarColeccionesAlFormData(formData);
 
      const dataCV = await this.persistirLegajo(formData);
      const dataDJ = await this.guardarDJ();
 
      this.mostrarResultadoGuardado(dataCV, dataDJ);
    } catch (e) {
      console.error('Error al guardar:', e);
    } finally {
      this.spinner.hide();
    }
  }

   // ─── PASO 1: Confirmación de términos ────────────────────────
  private async confirmarTerminos(): Promise<boolean> {
    const yaAceptado = this.regLegDatosGenerales.nLegDatAceptaTerminos || false;
    if (yaAceptado) return true;
 
    const result = await Swal.fire({
      title: 'PROTECCIÓN DE DATOS PERSONALES',
      html: `Al hacer clic en "ENVIAR", aceptas enviar tu información a la UNIVERSIDAD SEÑOR DE SIPAN,
             que usará conforme a la LEY N°29733. Debes aceptar los términos y condiciones para continuar.<br>
             <div id="downloadLink" style="color: blue; text-decoration: underline; cursor: pointer;">
               Leer términos y condiciones
             </div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      heightAuto: false,
      input: 'checkbox',
      inputValue: 0,
      inputPlaceholder: 'Acepto los términos y condiciones',
      inputValidator: (value) => value ? null : 'Debe aceptar los términos y condiciones',
      didOpen: () => {
        const link = Swal.getHtmlContainer()?.querySelector('#downloadLink');
        link?.addEventListener('click', (e) => {
          e.preventDefault();
          this.descargarArchivo('PROTECCION_DE_DATOS_PERSONALES.pdf');
        });
      },
    });
 
    if (result.isConfirmed && result.value) {
      this.regLegDatosGenerales.nLegDatAceptaTerminos = true;
      return true;
    }
 
    return false;
  }

  private validarFormulario(): boolean {
    if (this.FormGroup1.invalid) {
      this.stepper.selectedIndex = 0;
      const campos = this.obtenerCamposInvalidos(this.FormGroup1);
      this.valserv.mensaje_info('Los siguientes campos son obligatorios:\n• ' + campos.join('\n• '));
      return false;
    }
 
    if (this.date.invalid) {
      this.valserv.mensaje_info('Ingrese una fecha de nacimiento válida.');
      return false;
    }
 
    if (this.dateCeseControl.invalid) {
      this.valserv.mensaje_info('Ingrese una fecha de Cese válida.');
      return false;
    }
 
    if (!this.validarDocumentosRequeridos()) return false;
    if (!this.validarColegiatura()) return false;
    if (!this.validarLugarNacimiento()) return false;
 
    return true;
  }

   private validarDocumentosRequeridos(): boolean {
    const tipo = this.segserv.usuarioreg.nTipo;
    if (tipo !== 1 && tipo !== 2) return true;
 
    const dj = this.lstserv.LegDeclaracionJurada;
    const reg = this.regLegDatosGenerales;
 
    if (!dj.cLegDjanexo1 && reg.nValorAfiliado === 2) {
      this.valserv.mensaje_info('Adjunte archivo de Anexo 1.\nEn: Documentos para Contratación -> Documentos para Subir');
      return false;
    }
    if (!dj.cLegDjNumCta && reg.nValorHaberes === 1) {
      this.valserv.mensaje_info('Adjunte archivo de Nº de Cuenta (voucher o captura).\nEn: Documentos para Contratación -> Documentos para Subir');
      return false;
    }
    if (!dj.cLegDjConsJubilacion && reg.nValorAfiliado === 3) {
      this.valserv.mensaje_info('Adjunte archivo de Constancia de Jubilación.\nEn: Documentos para Contratación -> Documentos para Subir');
      return false;
    }
    if (!dj.cLegDjConsAfiliacionOnpAfp && reg.nValorAfiliado === 1) {
      this.valserv.mensaje_info('Adjunte archivo de Constancia de Afiliación de ONP o AFP.\nEn: Documento para Contratación -> Documentos para Subir');
      return false;
    }
 
    return true;
  }

  private validarColegiatura(): boolean {
    this.regLegDatosGenerales.cLegDatColegioProf ??= '';
    if (!this.regLegDatosGenerales.cLegDatColegioProf) return true;
 
    if (!this.FormGroup2.get('colegionroControl')?.value || this.regLegDatosGenerales.nLegDatCondicionColeg?.toString() === '0') {
      this.stepper.selectedIndex = 2;
      this.valserv.mensaje_info('Complete los datos de colegiatura.');
      return false;
    }
    if (this.dateFEmi.invalid) {
      this.valserv.mensaje_info('Ingrese fecha de emisión válida.');
      return false;
    }
    if (this.dateFExp.invalid) {
      this.valserv.mensaje_info('Ingrese fecha de expiración válida.');
      return false;
    }
    if (this.dateFEmi.value > this.dateFExp.value) {
      this.valserv.mensaje_info('Fecha de emisión no puede ser posterior a fecha de expiración.');
      return false;
    }
 
    return true;
  }

   private validarLugarNacimiento(): boolean {
    const reg = this.regLegDatosGenerales;
    const esPropioCodigo = reg.cPerCodigo.toString() === this.segserv.usuarioreg.cPerCodigo;
 
    if (reg.nLegDatCodigo > 0 && esPropioCodigo) {
      if (!reg.nLetDatNacimiento || reg.nLetDatNacimiento === 0) {
        this.stepper.selectedIndex = 0;
        this.valserv.mensaje_info('Seleccione lugar de nacimiento.');
        return false;
      }
    }
 
    return true;
  }
 
  private construirFormDataDatosGenerales(): FormData {
    const formData = new FormData();
    const reg = this.regLegDatosGenerales;
    const fecha = this.configserv.datepipe.transform(new Date());
    const fechanac = this.configserv.datepipe.transform(reg.dLegDatFechaNacimiento, 'yyyy-MM-dd') ?? '';
    const fg1 = this.FormGroup1;
 
    // Identificación
    formData.append('cPerCodigo',              reg.cPerCodigo.toString());
    formData.append('nLegDatCodigo',           reg.nLegDatCodigo.toString() ?? '');
    formData.append('nLegDatTipoDoc',          reg.nLegDatTipoDoc.toString() ?? '');
    formData.append('nClaseTipoDoc',           reg.nClaseTipoDoc.toString() ?? '');
    formData.append('cLegDatNroDoc',           fg1.get('nrodocumentoControl')?.value);
    formData.append('cLegDatApellidoPaterno',  fg1.get('apellidopaternoControl')?.value);
    formData.append('cLegDatApellidoMaterno',  fg1.get('apellidomaternoControl')?.value);
    formData.append('cLegDatNombres',          fg1.get('nombresControl')?.value);
    formData.append('dLegDatFechaNacimiento',  fechanac);
    formData.append('nLegDatSexo',             reg.nLegDatSexo.toString() ?? '');
    formData.append('nClaseSexo',              reg.nClaseSexo.toString() ?? '');
    formData.append('nLegDatEstadoCivil',      reg.nLegDatEstadoCivil.toString() ?? '');
    formData.append('nClaseEstadoCivil',       reg.nClaseEstadoCivil.toString() ?? '');
    formData.append('declaracionjuradaflag',   reg.declaracionjuradaflag.toString() ?? '');
 
    // Datos pensionarios y cuenta haberes
    formData.append('nLegDatRegPenAfiliado',        reg.nLegDatRegPenAfiliado?.toString() ?? '');
    formData.append('nValorAfiliado',               reg.nValorAfiliado?.toString() ?? '');
    formData.append('nLegDatRegPenEntidad',         reg.nLegDatRegPenEntidad?.toString() ?? '');
    formData.append('nValorEntidad',                reg.nValorEntidad?.toString() ?? '');
    formData.append('nLegDatCtaHabHaberes',         reg.nLegDatCtaHabHaberes?.toString() ?? '');
    formData.append('nValorHaberes',                reg.nValorHaberes?.toString() ?? '');
    formData.append('nLegDatCtaHabBanco',           reg.nLegDatCtaHabBanco?.toString() ?? '');
    formData.append('nValorBanco',                  reg.nValorBanco?.toString() ?? '');
    formData.append('nLegDatCtaHabBancoAperturar',  reg.nLegDatCtaHabBancoAperturar?.toString() ?? '');
    formData.append('nValorBancoAperturar',         reg.nValorBancoAperturar?.toString() ?? '');
    formData.append('cLegDatCtaHabNumCta',          fg1.get('numCuentaControl')?.value ?? '');
    formData.append('cLegDatCtaHabNumCtaCci',       fg1.get('numCuentaCciControl')?.value ?? '');
 
    // Grado académico e institución
    formData.append('cLegDatMencionEnMayGradAcad',      fg1.get('mencionEnMayGradAcadControl')?.value ?? '');
    formData.append('cLegDatInstitucionMayGradAcad',    reg.cLegDatInstitucionMayGradAcad ?? '');
    formData.append('nLegDatAceptaTerminos',            (reg.nLegDatAceptaTerminos ?? true).toString());
 
    // Archivos / firma
    formData.append('cFileFirma', this.fileDataCert);
    this.agregarArchivoSiCambio(formData, 'cFileSunedu',    reg.cLegDatSunedu,       reg.cFileSunedu);
    this.agregarArchivoSiCambio(formData, 'cFileBuenaSalud', reg.cLegDatBuenaSalud,  reg.cFileBuenaSalud);
    this.agregarArchivoSiCambio(formData, 'cFilePolicial',  reg.cLegDatPolicial,     reg.cFilePolicial);
    this.agregarArchivoSiCambio(formData, 'cFileJudicial',  reg.cLegDatJudicial,     reg.cFileJudicial);
    this.agregarArchivoSiCambio(formData, 'cFileConadis',   reg.cLegDatArchivoConadis, reg.cFileConadis);
 
    // Contacto y domicilio
    formData.append('cLegDatFoto',          '');
    formData.append('cLegDatEmail',         fg1.get('emailControl')?.value ?? '');
    formData.append('cLegDatTelefono',      fg1.get('telefonoControl')?.value ?? '');
    formData.append('cLegDatMovil',         fg1.get('movilControl')?.value ?? '');
    formData.append('nLegDatGradoAcad',     reg.nLegDatGradoAcad.toString() ?? '');
    formData.append('nClaseGradoAcad',      reg.nClaseGradoAcad.toString() ?? '');
    formData.append('nLegDatPais',          reg.nLegDatPais.toString() ?? '');
    formData.append('nClasePais',           reg.nClasePais.toString() ?? '');
    formData.append('cLegDatAcerca',        this.EndFormGroup.get('acercaControl')?.value ?? '');
    formData.append('nLegDatTipoDomicilio', reg.nLegDatTipoDomicilio.toString() ?? '');
    formData.append('nValorTipoDomicilio',  reg.nValorTipoDomicilio.toString() ?? '');
    formData.append('nLegDatZona',          reg.nLegDatZona.toString() ?? '');
    formData.append('nValorZona',           reg.nValorZona.toString() ?? '');
    formData.append('cLegDatCalleDomicilio', fg1.get('direccionControl')?.value ?? '');
    formData.append('cLegDatNroDomicilio',  fg1.get('numeroControl')?.value ?? '');
    formData.append('cLegDatMzaDomicilio',  fg1.get('mzaControl')?.value ?? '');
    formData.append('cLegDatLtDomicilio',   fg1.get('lteControl')?.value ?? '');
    formData.append('cLegDatDptoDomicilio', fg1.get('dptoControl')?.value ?? '');
    formData.append('cLegDatReferencia',    fg1.get('referenciaControl')?.value ?? '');
    formData.append('nLetDatUbigeo',        reg.nLetDatUbigeo.toString() ?? '');
    formData.append('nClaseUbigeo',         reg.nClaseUbigeo.toString() ?? '');
    formData.append('nLetDatNacimiento',    reg.nLetDatNacimiento.toString() ?? '');
    formData.append('nClaseNacimiento',     reg.nClaseNacimiento.toString() ?? '');
 
    // Otros datos
    formData.append('nLegIdiomaNativo',         reg.nLegIdiomaNativo ? reg.nLegIdiomaNativo.toString() : '0');
    formData.append('nLegDatDiscapacidad',      reg.nLegDatDiscapacidad ? reg.nLegDatDiscapacidad.toString() : '');
    formData.append('nLegDatTipoDiscapacidad',  reg.nLegDatTipoDiscapacidad ? reg.nLegDatTipoDiscapacidad.toString() : '');
    formData.append('cLegDatOtraDiscapcidad',   this.FormGroupAD.get('cLegDatOtraDiscapcidad')?.value ?? '');
    formData.append('declaracionjuradaflag',    'true');
    formData.append('CLegDatEstado',            'true');
    formData.append('dFechaRegistro',           fecha ?? ''); 
    formData.append('dFechaModifica',           fecha ?? ''); 
 
    // Colegiatura (solo si aplica)
    if (reg.cLegDatColegioProf) {
      formData.append('dLegDatosFechaEmisionColeg', this.configserv.datepipe.transform(this.dateFEmi.value ?? new Date(), 'yyyy-MM-dd') ?? '');
      formData.append('dLegDatosFechaExpiraColeg',  this.configserv.datepipe.transform(this.dateFExp.value ?? new Date(), 'yyyy-MM-dd') ?? '');
      formData.append('nLegDatCondicionColeg',      reg.nLegDatCondicionColeg?.toString() ?? '');
      formData.append('nValorCondicionColeg',       reg.nValorCondicionColeg?.toString() ?? '');
      formData.append('cLegDatColegioProf',         reg.cLegDatColegioProf.toString() ?? '');
      formData.append('cLegDatNroColegiatura',      this.FormGroup2.get('colegionroControl')?.value ?? '');
    }
 
    // Declaración Jurada (solo en nuevo registro)
    if (reg.nLegDatCodigo === 0) {
      this.agregarDeclaracionJuradaAlFormData(formData);
    }
 
    return formData;
  }

   private agregarArchivoSiCambio(formData: FormData, campo: string, valorActual: any, valorOriginal: any): void {
    if (valorActual !== valorOriginal) {
      formData.append(campo, valorActual);
    }
  }
 
  private agregarDeclaracionJuradaAlFormData(formData: FormData): void {
    const dj = this.lstserv.LegDeclaracionJurada;
    const pre = 'legDeclaracionJurada[0]';
 
    formData.append(`${pre}.nLegDjcodigo`,              dj.nLegDjcodigo.toString() ?? '0');
    formData.append(`${pre}.cFileDjanexo1`,             dj.cLegDjanexo1);
    formData.append(`${pre}.cFileDjanexo2_2`,           dj.cLegDjanexo2_2);
    formData.append(`${pre}.cFileDjanexo3`,             dj.cLegDjanexo3);
    formData.append(`${pre}.cFileDjanexo4`,             dj.cLegDjanexo4);
    formData.append(`${pre}.cFileDjanexo5`,             dj.cLegDjanexo5);
    formData.append(`${pre}.cFileDjanexo6_2`,           dj.cLegDjanexo6_2);
    formData.append(`${pre}.cFileDjDNI`,                dj.cLegDjDNI);
    formData.append(`${pre}.cFileDjDNI_DH`,             dj.cLegDjDNI_DH);
    formData.append(`${pre}.cFileDjFotoCarnet`,         dj.cLegDjFotoCarnet);
    formData.append(`${pre}.cFileDjNumCta`,             dj.cLegDjNumCta);
    formData.append(`${pre}.cFileDjConsJubilacion`,     dj.cLegDjConsJubilacion);
    formData.append(`${pre}.cFileDjConsAfiliacionOnpAfp`, dj.cLegDjConsAfiliacionOnpAfp);
 
    // Rutas vacías (las llena el servidor)
    ['cLegDjanexo1','cLegDjanexo2_2','cLegDjanexo3','cLegDjanexo4','cLegDjanexo5',
     'cLegDjanexo6_2','cLegDjDNI','cLegDjDNI_DH','cLegDjFotoCarnet',
     'cLegDjNumCta','cLegDjConsJubilacion','cLegDjConsAfiliacionOnpAfp'
    ].forEach(campo => formData.append(`${pre}.${campo}`, ''));
 
    formData.append(`${pre}.bLegDjestado`, 'true');
  }
 
  // ─── PASO 3b: FormData — colecciones ─────────────────────────
  private agregarColeccionesAlFormData(formData: FormData): void {
    // Solo se envían colecciones en nuevo registro
    if (this.regLegDatosGenerales.nLegDatCodigo !== 0) return;
 
    this.agregarGradoTitulo(formData);
    this.agregarDocenciaUniv(formData);
    this.agregarCategoriaDocente(formData);
    this.agregarRegimenDedicacion(formData);
    this.agregarProfesNoDocente(formData);
    this.agregarIdiomaOfimatica(formData);
    this.agregarInvestigador(formData);
    this.agregarTesisAseJur(formData);
    this.agregarProduccionCiencia(formData);
    this.agregarParticipacion(formData);
    this.agregarAdminitrativaCarga(formData);
    this.agregarReconocimiento(formData);
    this.agregarCapacitaciones(formData);
    this.agregarProyeccionSocial(formData);
    this.agregarLicenciasProfesionales(formData);
  }
 
  private agregarGradoTitulo(formData: FormData): void {
    this.lstserv.lLegGradoTitulo.forEach((el: LegGradoTitulo, i) => {
      const pre = `legGradoTitulo[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegGraFecha, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegGraCodigo`,       el.nLegGraCodigo.toString() ?? '0');
      formData.append(`${pre}.nLegGraGradoAcad`,    el.nLegGraGradoAcad.toString() ?? '0');
      formData.append(`${pre}.nClaseGradoAcad`,     el.nClaseGradoAcad.toString() ?? '0');
      formData.append(`${pre}.cLegGraCarreraProf`,  el.cLegGraCarreraProf.toString() ?? '');
      formData.append(`${pre}.cLegGraInstitucion`,  el.cLegGraInstitucion.toString() ?? '0');
      formData.append(`${pre}.cLegGraOtraInst`,     el.cLegGraOtraInst.toString() ?? '0');
      formData.append(`${pre}.nLegGraPais`,         el.nLegGraPais.toString() ?? '0');
      formData.append(`${pre}.nClasePais`,          el.nClasePais.toString() ?? '0');
      formData.append(`${pre}.dLegGraFecha`,        fecha);
      formData.append(`${pre}.cFile`,               el.cLegGraArchivo);
      formData.append(`${pre}.cLegGraArchivo`,      '');
      formData.append(`${pre}.cLegGraValida`,       'false');
      formData.append(`${pre}.cLegGraEstado`,       'true');
    });
  }
 
  private agregarDocenciaUniv(formData: FormData): void {
    this.lstserv.lLegDocenciaUniv.forEach((el: LegDocenciaUniv, i) => {
      const pre = `legDocenciaUniv[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegDocFechaInicio, 'yyyy-MM-dd') ?? ''; 
      const fFin = this.configserv.datepipe.transform(el.dLegDocFechaFin, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegDocCodigo`,      el.nLegDocCodigo.toString() ?? '0');
      formData.append(`${pre}.nLegDocRegimen`,     el.nLegDocRegimen.toString() ?? '0');
      formData.append(`${pre}.nValorRegimen`,      el.nValorRegimen.toString() ?? '0');
      formData.append(`${pre}.nLegDocCategoria`,   el.nLegDocCategoria.toString() ?? '0');
      formData.append(`${pre}.nValorCategoria`,    el.nValorCategoria.toString() ?? '0');
      formData.append(`${pre}.cLegDocUniversidad`, el.cLegDocUniversidad.toString() ?? '');
      formData.append(`${pre}.cLegDocOtraInst`,    el.cLegDocOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegDocPais`,        el.cLegDocPais.toString() ?? '');
      formData.append(`${pre}.dLegDocFechaInicio`, fIni);
      formData.append(`${pre}.dLegDocFechaFin`,    fFin);
      formData.append(`${pre}.cFile`,              el.cLegDocArchivo);
      formData.append(`${pre}.cLegGraArchivo`,     '');
      formData.append(`${pre}.cLegDocValida`,      'false');
      formData.append(`${pre}.cLegDocEstado`,      'true');
    });
  }
 
  private agregarCategoriaDocente(formData: FormData): void {
    this.lstserv.lCategoriaDocente.forEach((el: LegCategoriaDocente, i) => {
      const pre = `legCategoriaDocente[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegCatFechaInicio, 'yyyy-MM-dd') ?? '';
      const fFin = this.configserv.datepipe.transform(el.dLegCatFechaFin, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegCatCodigo`,     el.nLegCatCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegCatInstitucion`, el.cLegCatInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegCatOtraInst`,   el.cLegCatOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegCatPais`,       el.cLegCatPais.toString() ?? '');
      formData.append(`${pre}.nLegCatCategoria`,  el.nLegCatCategoria.toString() ?? '0');
      formData.append(`${pre}.nValorCategoria`,   el.nValorCategoria.toString() ?? '0');
      formData.append(`${pre}.dLegCatFechaInicio`, fIni);
      formData.append(`${pre}.dLegCatFechaFin`,   fFin);
      formData.append(`${pre}.cFile`,             el.cLegCatArchivo);
      formData.append(`${pre}.cLegGraArchivo`,    '');
      formData.append(`${pre}.cLegCatValida`,     'false');
      formData.append(`${pre}.cLegCatEstado`,     'true');
    });
  }
 
  private agregarRegimenDedicacion(formData: FormData): void {
    this.lstserv.lRegimenDedic.forEach((el: LegRegimenDedicacion, i) => {
      const pre = `legRegimenDedicacion[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegRegFechaInicio, 'yyyy-MM-dd') ?? '';
      const fFin = this.configserv.datepipe.transform(el.dLegRegFechaFin, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegRegCodigo`,      el.nLegRegCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegCatInstitucion`, el.cLegCatInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegRegOtraInst`,    el.cLegRegOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegRegPais`,        el.cLegRegPais.toString() ?? '');
      formData.append(`${pre}.nLegRegDedicacion`,  el.nLegRegDedicacion.toString() ?? '0');
      formData.append(`${pre}.nValorDedicacion`,   el.nValorDedicacion.toString() ?? '0');
      formData.append(`${pre}.dLegRegFechaInicio`, fIni ?? '');
      formData.append(`${pre}.dLegRegFechaFin`,    fFin ?? '');
      formData.append(`${pre}.cFile`,              el.cLegRegArchivo);
      formData.append(`${pre}.cLegRegArchivo`,     '');
      formData.append(`${pre}.cLegRegValida`,      'false');
      formData.append(`${pre}.cLegRegEstado`,      'true');
    });
  }
 
  private agregarProfesNoDocente(formData: FormData): void {
    this.lstserv.lProfesNoDocente.forEach((el: LegProfesNoDocente, i) => {
      const pre = `legProfesNoDocente[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegProFechaInicio, 'yyyy-MM-dd') ?? '';
      const fFin = this.configserv.datepipe.transform(el.dLegProFechaFin, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegProCodigo`,      el.nLegProCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegProInstitucion`, el.cLegProInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegProOtraInst`,    el.cLegProOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegProPais`,        el.cLegProPais.toString() ?? '');
      formData.append(`${pre}.nLegProCargo`,       el.nLegProCargo.toString() ?? '0');
      formData.append(`${pre}.cLegProCargoProf`,   el.cLegProCargoProf.toString() ?? '');
      formData.append(`${pre}.nValorCargo`,        el.nValorCargo.toString() ?? '0');
      formData.append(`${pre}.dLegProFechaInicio`, fIni ?? '');
      formData.append(`${pre}.dLegProFechaFin`,    fFin ?? '');
      formData.append(`${pre}.cFile`,              el.cLegProArchivo);
      formData.append(`${pre}.cLegProArchivo`,     '');
      formData.append(`${pre}.cLegProValida`,      'false');
      formData.append(`${pre}.cLegProEstado`,      'true');
    });
  }
 
  private agregarIdiomaOfimatica(formData: FormData): void {
    this.lstserv.lidiomasofimatica.forEach((el: LegIdiomaOfimatica, i) => {
      const pre = `legIdiomaOfimatica[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegIdOfFecha, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegIdOfCodigo`,      el.nLegIdOfCodigo.toString() ?? '0');
      formData.append(`${pre}.nLegIdOfCodigoDesc`,  el.nLegIdOfCodigoDesc.toString() ?? '');
      formData.append(`${pre}.nValorDesc`,          el.nValorDesc.toString() ?? '0');
      formData.append(`${pre}.nLegIdOfNivel`,       el.nLegIdOfNivel.toString() ?? '0');
      formData.append(`${pre}.nValorNivel`,         el.nValorNivel.toString() ?? '0');
      formData.append(`${pre}.cLegIdOfTipo`,        el.cLegIdOfTipo.toString() ?? '');
      formData.append(`${pre}.dLegIdOfFecha`,       fecha ?? '');
      formData.append(`${pre}.cFile`,               el.cLegIdOfArchivo);
      formData.append(`${pre}.cLegIdOfArchivo`,     '');
      formData.append(`${pre}.cLegIdOfValida`,      'false');
      formData.append(`${pre}.cLegIdOfEstado`,      'true');
    });
  }
 
  private agregarInvestigador(formData: FormData): void {
    this.lstserv.linvestigador.forEach((el: LegInvestigador, i) => {
      const pre = `legInvestigador[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegInvFechaInicio, 'yyyy-MM-dd') ?? '';
      const fFin = this.configserv.datepipe.transform(el.dLegInvFechaFin, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegInvCodigo`,          el.nLegInvCodigo.toString() ?? '0');
      formData.append(`${pre}.nLegInvCentroRegistro`,  el.nLegInvCentroRegistro.toString() ?? '');
      formData.append(`${pre}.nValorCentroRegistro`,   el.nValorCentroRegistro.toString() ?? '0');
      formData.append(`${pre}.cLegInvNroRegistro`,     el.cLegInvNroRegistro.toString() ?? '0');
      formData.append(`${pre}.dLegInvFechaInicio`,     fIni ?? '');
      formData.append(`${pre}.dLegInvFechaFin`,        fFin ?? '');
      formData.append(`${pre}.cFile`,                  el.cLegInvArchivo);
      formData.append(`${pre}.cLegInvArchivo`,         '');
      formData.append(`${pre}.cLegInvValida`,          'false');
      formData.append(`${pre}.cLegInvEstado`,          'true');
    });
  }
 
  private agregarTesisAseJur(formData: FormData): void {
    this.lstserv.lTesisAsesJur.forEach((el: LegTesisAseJur, i) => {
      const pre = `legTesisAseJur[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegTesFecha, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegTesCodigo`,       el.nLegTesCodigo.toString() ?? '0');
      formData.append(`${pre}.nLegTesTipo`,         el.nLegTesTipo.toString() ?? '0');
      formData.append(`${pre}.nValorTipo`,          el.nValorTipo.toString() ?? '0');
      formData.append(`${pre}.nLegTesNivel`,        el.nLegTesNivel.toString() ?? '0');
      formData.append(`${pre}.nValorNivel`,         el.nValorNivel.toString() ?? '0');
      formData.append(`${pre}.cLegTesNroResolucion`, el.cLegTesNroResolucion.toString() ?? '');
      formData.append(`legTesis[${i}].cLegTesInstitucion`, el.cLegTesInstitucion.toString() ?? '0');
      formData.append(`legTesis[${i}].cLegTesOtraInst`,    el.cLegTesOtraInst.toString() ?? '0');
      formData.append(`legTesis[${i}].nLegTesPais`,        el.nLegTesPais.toString() ?? '0');
      formData.append(`legTesis[${i}].nClasePais`,         el.nClasePais.toString() ?? '0');
      formData.append(`${pre}.dLegTesFecha`,        fecha ?? '');
      formData.append(`${pre}.cFile`,               el.cLegTesArchivo);
      formData.append(`${pre}.cLegTesArchivo`,      '');
      formData.append(`${pre}.cLegTesValida`,       'false');
      formData.append(`${pre}.cLegTesEstado`,       'true');
    });
  }
 
  private agregarProduccionCiencia(formData: FormData): void {
    this.lstserv.lProduccionCiencia.forEach((el: LegProduccionCiencia, i) => {
      const pre = `legProduccionCiencia[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegProdFecha, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegProdCodigo`,        el.nLegProdCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegProdNroResolucion`, el.cLegProdNroResolucion.toString() ?? '');
      formData.append(`${pre}.cLegProdTitulo`,        el.cLegProdTitulo.toString() ?? '');
      formData.append(`${pre}.nLegProdTipo`,          el.nLegProdTipo.toString() ?? '0');
      formData.append(`${pre}.nValorTipo`,            el.nValorTipo.toString() ?? '0');
      formData.append(`${pre}.dLegProdFecha`,         fecha ?? '');
      formData.append(`${pre}.cFile`,                 el.cLegProdArchivo);
      formData.append(`${pre}.cLegProdArchivo`,       '');
      formData.append(`${pre}.cLegProdValida`,        'false');
      formData.append(`${pre}.cLegProdEstado`,        'true');
    });
  }
 
  private agregarParticipacion(formData: FormData): void {
    this.lstserv.lParticipacion.forEach((el: LegParticipacionCongSem, i) => {
      const pre = `legParticipacionCongSem[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegParFecha, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegParCodigo`,      el.nLegParCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegParInstitucion`, el.cLegParInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegParOtraInst`,    el.cLegParOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegParPais`,        el.cLegParPais.toString() ?? '');
      formData.append(`${pre}.cLegParNombre`,      el.cLegParNombre.toString() ?? '');
      formData.append(`${pre}.nLegParRol`,         el.nLegParRol.toString() ?? '0');
      formData.append(`${pre}.nValorRol`,          el.nValorRol.toString() ?? '0');
      formData.append(`${pre}.nLegParAmbito`,      el.nLegParAmbito.toString() ?? '0');
      formData.append(`${pre}.nValorAmbito`,       el.nValorAmbito.toString() ?? '0');
      formData.append(`${pre}.dLegParFecha`,       fecha ?? '');
      formData.append(`${pre}.cFile`,              el.cLegParArchivo);
      formData.append(`${pre}.cLegParArchivo`,     '');
      formData.append(`${pre}.cLegParValida`,      'false');
      formData.append(`${pre}.cLegParEstado`,      'true');
    });
  }
 
  private agregarAdminitrativaCarga(formData: FormData): void {
    this.lstserv.lAdminitrativaCarga.forEach((el: LegAdminitrativaCarga, i) => {
      const pre = `legAdminitrativaCarga[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegAdmFechaInicio, 'yyyy-MM-dd') ?? '';
      const fFin = this.configserv.datepipe.transform(el.dLegAdmFechaFin, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegAdmCodigo`,      el.nLegAdmCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegAdmInstitucion`, el.cLegAdmInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegAdmOtraInst`,    el.cLegAdmOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegAdmPais`,        el.cLegAdmPais.toString() ?? '');
      formData.append(`${pre}.cLegAdmDocumento`,   el.cLegAdmDocumento.toString() ?? '');
      formData.append(`${pre}.nLegAdmCargo`,       el.nLegAdmCargo.toString() ?? '0');
      formData.append(`${pre}.nClaseCargo`,        el.nClaseCargo.toString() ?? '0');
      formData.append(`${pre}.dLegAdmFechaInicio`, fIni);
      formData.append(`${pre}.dLegAdmFechaFin`,    fFin);
      formData.append(`${pre}.cFile`,              el.cLegAdmArchivo);
      formData.append(`${pre}.cLegAdmArchivo`,     '');
      formData.append(`${pre}.cLegAdmValida`,      'false');
      formData.append(`${pre}.cLegAdmEstado`,      'true');
    });
  }
 
  private agregarReconocimiento(formData: FormData): void {
    this.lstserv.lReconocimiento.forEach((el: LegReconocimiento, i) => {
      const pre = `legReconocimiento[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegRecFecha, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegRecCodigo`,      el.nLegRecCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegRecInstitucion`, el.cLegRecInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegRecOtraInst`,    el.cLegRecOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegRecPais`,        el.cLegRecPais.toString() ?? '');
      formData.append(`${pre}.nLegRecDocumento`,   el.nLegRecDocumento.toString() ?? '0');
      formData.append(`${pre}.nValorDocumento`,    el.nValorDocumento.toString() ?? '0');
      formData.append(`${pre}.nLegRecTipo`,        el.nLegRecTipo.toString() ?? '0');
      formData.append(`${pre}.nValorTipo`,         el.nValorTipo.toString() ?? '0');
      formData.append(`${pre}.dLegRecFecha`,       fecha);
      formData.append(`${pre}.cFile`,              el.cLegRecArchivo);
      formData.append(`${pre}.cLegRecArchivo`,     '');
      formData.append(`${pre}.cLegRecValida`,      'false');
      formData.append(`${pre}.cLegRecEstado`,      'true');
    });
  }
 
  private agregarCapacitaciones(formData: FormData): void {
    this.lstserv.lcapacitaciones.forEach((el: LegCapacitaciones, i) => {
      const pre = `legCapacitaciones[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegCapFechaInicio, 'yyyy-MM-dd') ?? '';
      const fFin = this.configserv.datepipe.transform(el.dLegCapFechaFin, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegCapCodigo`,      el.nLegCapCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegCapInstitucion`, el.cLegCapInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegCapOtraInst`,    el.cLegCapOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegCapPais`,        el.cLegCapPais.toString() ?? '');
      formData.append(`${pre}.cLegCapNombre`,      el.cLegCapNombre.toString() ?? '');
      formData.append(`${pre}.nLegCapTipo`,        el.nLegCapTipo.toString() ?? '0');
      formData.append(`${pre}.nValorTipo`,         el.nValorTipo.toString() ?? '0');
      formData.append(`${pre}.nLegCapTipoEsp`,     el.nLegCapTipoEsp.toString() ?? '0');
      formData.append(`${pre}.nValorTipoEsp`,      el.nValorTipoEsp.toString() ?? '0');
      formData.append(`${pre}.nLegCapHoras`,       el.nLegCapHoras.toString() ?? '0');
      formData.append(`${pre}.dLegCapFechaInicio`, fIni);
      formData.append(`${pre}.dLegCapFechaFin`,    fFin);
      formData.append(`${pre}.cFile`,              el.cLegCapArchivo);
      formData.append(`${pre}.cLegCapArchivo`,     '');
      formData.append(`${pre}.cLegCapValida`,      'false');
      formData.append(`${pre}.cLegCapEstado`,      'true');
    });
  }
 
  private agregarProyeccionSocial(formData: FormData): void {
    this.lstserv.lProyeccionSoc.forEach((el: LegProyeccionSocial, i) => {
      const pre = `legProyeccionSocial[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegProyFechaInicio, 'yyyy-MM-dd') ?? '';
      const fFin = this.configserv.datepipe.transform(el.dLegProyFechaFin, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegProyCodigo`,      el.nLegProyCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegProyInstitucion`, el.cLegProyInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegProyOtraInst`,    el.cLegProyOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegProyPais`,        el.cLegProyPais.toString() ?? '');
      formData.append(`${pre}.cLegProyDescripcion`, el.cLegProyDescripcion.toString() ?? '');
      formData.append(`${pre}.nLegProyTipo`,        el.nLegProyTipo.toString() ?? '0');
      formData.append(`${pre}.nValorTipo`,          el.nValorTipo.toString() ?? '0');
      formData.append(`${pre}.dLegProyFechaInicio`, fIni);
      formData.append(`${pre}.dLegProyFechaFin`,    fFin);
      formData.append(`${pre}.cFile`,               el.cLegProyArchivo);
      formData.append(`${pre}.cLegProyArchivo`,     '');
      formData.append(`${pre}.cLegProyValida`,      'false');
      formData.append(`${pre}.cLegProyEstado`,      'true');
    });
  }
 
  private agregarLicenciasProfesionales(formData: FormData): void {
    this.lstserv.lLegLicenciaProfesional.forEach((el: LegLicenciaProfesional, i) => {
      const pre = `legLicenciaProfesional[${i}]`;
      const fEmi = this.configserv.datepipe.transform(el.dLegLicFechaEmision, 'yyyy-MM-dd') ?? '';
      const fExp = this.configserv.datepipe.transform(el.dLegLicFechaExpiracion, 'yyyy-MM-dd') ?? '';
      formData.append(`${pre}.nLegLicCodigo`,        el.nLegLicCodigo?.toString() ?? '0');
      formData.append(`${pre}.nLegLicDatCodigo`,     this.regLegDatosGenerales.nLegDatCodigo.toString());
      formData.append(`${pre}.nLegLicPais`,          el.nLegLicPais?.toString() ?? '0');
      formData.append(`${pre}.nClasePais`,           el.nClasePais?.toString() ?? '0');
      formData.append(`${pre}.cLegLicInstitucion`,   el.cLegLicInstitucion ?? '');
      formData.append(`${pre}.cLegLicOtraInst`,      el.cLegLicOtraInst.toString() ?? '');
      formData.append(`${pre}.nLegLicCondicion`,     el.nLegLicCondicion?.toString() ?? '0');
      formData.append(`${pre}.nClaseCondicion`,      el.nClaseCondicion?.toString() ?? '0');
      formData.append(`${pre}.cLegLicNroRegistro`,   el.cLegLicNroRegistro.toString() ?? '');
      formData.append(`${pre}.dLegLicFechaEmision`,  fEmi);
      formData.append(`${pre}.dLegLicFechaExpiracion`, el.dLegLicFechaExpiracion ? fExp : '');
      formData.append(`${pre}.cLegLicValida`,        'false');
      formData.append(`${pre}.cLegLicEstado`,        'true');
    });
  }
 
  // ─── PASO 4: Persistir (POST o PUT) ──────────────────────────
  private async persistirLegajo(formData: FormData): Promise<any> {
  const esNuevo = this.regLegDatosGenerales.nLegDatCodigo === 0;

  formData.append(
    'dLegDatRegPenFechaCese',
    this.dateCeseControl.value
      ? new Date(this.dateCeseControl.value).toISOString()
      : ''
  );

  // Ver contenido del FormData
  console.log('=== FormData enviado ===');
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  if (esNuevo) {
    return this.regserv.registroFile('Registro de Legajos', 'legajo', formData, false);
  }

  return this.regserv.actualizarFile(
    'Registro de Legajos',
    `legajo/put/${this.regLegDatosGenerales.nLegDatCodigo}`,
    formData,
    false
  );
}
 
  // ─── PASO 5: Mostrar resultado ───────────────────────────────
  private mostrarResultadoGuardado(dataCV: any, dataDJ: any): void {
    if (dataCV && dataDJ) {
      Swal.fire('Registro de Legajos', 'Datos guardados correctamente.', 'success');
    } else if (dataCV) {
      Swal.fire('Registro de Legajos', 'Datos Legajo guardados correctamente.', 'success');
    } else if (dataDJ) {
      Swal.fire('Registro de Legajos', 'Datos Declaraciones Juradas guardadas correctamente.', 'success');
    } else {
      Swal.fire('Advertencia', 'Algunos datos no se guardaron correctamente.', 'warning');
    }
  }
 
}