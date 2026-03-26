import { Injectable } from '@angular/core'
import { DatosUsuario } from '../models/usuario'
import { ValidateService } from './validate.service'
import Swal from 'sweetalert2'
import axios from 'axios'
import { environment } from './../../environments/environment'
import { HeaderautorizaService } from './headerautoriza.service'
import { Router } from '@angular/router'
import { WorkerService } from './worker.service'
import { HttpClient } from '@angular/common/http'
import { DeviceDetectorService } from 'ngx-device-detector'
import { CryptService } from './crypt.service'
import { ControlesService } from './controles.service'
import { MatDialog } from '@angular/material/dialog'
import { MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { MensajelegajoComponent } from '../components/legajo/legajo/mensajelegajo/mensajelegajo.component'
@Injectable({
  providedIn: 'root',
})
export class SeguridadService {
  public namesystem: string = 'Sistema Legajos GTH - USS'
  public keyrecaptcha: string = environment.SITEKEY

  public usuarioreg: DatosUsuario = {
    cPerCodigo: '',
    cPerApellido: '',
    cPerNombre: '',
    cPerUsuCodigo: '',
    cPerEmail: '',
    cPerTipoDoc: '',
    cPerNroDoc: '',
    nTipo: 0,
    cTipoDesc: '',
    cCargo: '',
    nRol: 1,
    cToken: '',
    bLegajo: false,
    //declaracionjuradaflag: false,
  }
  ip: string = '0.0.0.0'
  browser: string = ''
  device: string = ''
  public disload: boolean = false

  constructor(
    public valserv: ValidateService,
    public hautserv: HeaderautorizaService,
    public workserv: WorkerService,
    private router: Router,
    public http: HttpClient,
    private deviceService: DeviceDetectorService,
    private dialogRef: MatDialog,
    // private bottomSheetRef: MatBottomSheetRef<MensajelegajoComponent>,
    public cryptserv: CryptService,
  ) {
    //   this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
    //   this.ip = res.ip
    //   this.browser = navigator.userAgent
    //   this.device = this.deviceService.deviceType
    // });
  }

  async login($usuario: string, $password: string, $recaptchakey: string) {
    let $ban: boolean = this.valserv.validatelogin($usuario, $password)

    if ($ban) {
      let request = {
        usuario: $usuario ?? '',
        password: $password ?? '',
        recaptcha: $recaptchakey ?? '',
        ip: this.ip ?? '0.0.0.0',
        browser: this.browser,
        device: this.device,
      }
      //console.log(btoa($password))
      await axios
        .post(
          environment.URLAPI + 'login/' + $usuario + '/' + btoa($password),
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods':
                'GET, POST, PATCH, DELETE, PUT, OPTIONS',
              'Access-Control-Allow-Headers':
                'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
            },
          },
        )
        .then((response) => {
          this.disload = false
          if (response.data.cstate) {
            Swal.fire(this.namesystem, response.data.cmessage, 'success').then(() => {
                this.usuarioreg = response.data.odata
                sessionStorage.setItem('user', this.cryptserv.set(JSON.stringify(this.usuarioreg)))
                sessionStorage.setItem('token', this.cryptserv.set(this.usuarioreg.cToken))
                if (response.data.odata.bLegajo != true) {
                  this.router.navigate(['/rolxusuario'])
                } else {
                  this.router.navigate(['/dgeneral'])
                }
              },
            )
          } else {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
            this.valserv.validaban = false
            this.valserv.validatext = response.data.cmessage
            this.valserv.cerrarmensaje()
          }
        })
        .catch((error) => {
          this.disload = false
          console.log(error)
        })
    } else {
      this.disload = false
      this.valserv.cerrarmensaje()
    }
  }

  async logout() {
    Swal.fire({
      title: this.namesystem,
      text: '¿Está seguro de cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.limpiarsesion()
      }
    })
  }

  conexionactiva(): boolean {
    let $state: boolean = true
    if (
      sessionStorage.getItem('token') !== '' &&
      sessionStorage.getItem('token') !== null
    ) {
      if (
        sessionStorage.getItem('user') !== '' &&
        sessionStorage.getItem('user') !== null
      ) {
        $state = true
      } else {
        $state = false
      }
    } else {
      $state = false
    }
    if (!$state) {
      this.limpiarsesion()
    } else {
      setInterval(() => {
        if (this.workserv.alive) {
          this.workserv.notificaciones()
        }
      }, 5000)
    }
    return $state
  }

  limpiarsesion() {
    this.dialogRef.closeAll()
    // this.bottomSheetRef.dismiss
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    this.workserv.alive = false
    this.router.navigate(['/login'])
  }

  obtenerdatosusuario() {
    let obj = this.cryptserv.get(sessionStorage.getItem('user'))
    this.usuarioreg = JSON.parse(obj)
  }
  obtenerdatostoken() {
    this.cryptserv.get(sessionStorage.getItem('token'))
  }
}
