import { Component, OnInit, ViewChild, Inject } from '@angular/core'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import axios from 'axios'
import { Interface } from 'readline'
import { DatosUsuario } from 'src/app/models/usuario'
import { ListService } from 'src/app/services/list.service'
import { SesionService } from 'src/app/services/sesion.service'
import { SidenavService } from 'src/app/services/sidenav.service'
import { environment } from 'src/environments/environment'
import { ModalUsuarioSinPermisoComponent } from '../../legajo/modal/modal-usuario-sin-permiso/modal-usuario-sin-permiso.component'

@Component({
  selector: 'app-acciones',
  templateUrl: './acciones.component.html',
  styleUrls: ['./acciones.component.sass'],
})
export class AccionesComponent implements OnInit {
  
  @ViewChild('drawer') sideNav: any

  route: string = 'legajo'
  modulo: string = 'LEGAJOS'
  title: string = 'Control de Legajos'
  public personaAcciones: DatosUsuario[] = []
  public name: string = ''
  public nameUser: string = ''
  public permisosLeg: any[] = []
  public permisoXUsuarioLeg: any[] = []
  public bloqueado: boolean = true
  public cPerCodigo: string = ''

  public columndefs: any[] = ['persona']

  constructor(
    public sidenavservc: SidenavService,
    public sserv: SesionService,
    public dialog: MatDialog,
    public lstserv: ListService,
    @Inject(MAT_DIALOG_DATA) public data: { title: 'Permisos' },
  ) {}

  ngOnInit(): void {
    this.sidenavservc.abrirmenu(this.sideNav)
  }

  ngAfterViewInit(): any {
    this.sidenavservc.abrirmenu(this.sideNav)
    this.obtenerAcciones()
    this.listarPersonaConAcciones()
    // this.obtenerPermisosLeg()
  }

  async obtenerAcciones() {
    await axios
      .get(environment.URLAPI + 'tarea_modulo/listar_acciones/1', {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then((response) => {
        this.permisosLeg = response.data.odata
      })
    // await this.lstserv.listado('interface/1/4701', '').then((data) => {
    //   let ltipo: Interface[] = data
    //   this.permisosLeg = ltipo
    //   console.log(ltipo)
    // })
  }

  async listarPersonaConAcciones() {
    await axios
      .get(environment.URLAPI + 'listar_persona_con_acciones', {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then((response) => {
        this.personaAcciones = response.data.odata
      })
  }

  async buscarPermisos(element: any) {
    await this.obtenerPermisosXUsuario(element.cPerCodigo)
    this.cPerCodigo = element.cPerCodigo
    this.name = `${element.cPerApellido} ${element.cPerNombre}`
  }

  updateAllComplete(element: any) {
    console.log('ddd')
  }

  async obtenerPermisosXUsuario(cPerCodigo: string) {
    let headers = {
      headers: {
        Authorization:
          'Bearer ' +
          this.sserv.gettoken(sessionStorage.getItem('token') ?? '').toString(),
      },
    }
    await axios
      .get(
        environment.URLAPI +
          `TareaModulo/obtener_acciones_x_usuario/${cPerCodigo}`,
        headers,
      )
      .then((response) => {
        let data = response.data.odata
        this.validarPermisos(data)
      })
  }

  async validarPermisos(permisos: any) {
    this.bloqueado = false
    this.permisosLeg.map((item: any) => {
      item.selected =
        permisos.filter((v: any) => v.nTarModCodigo == item.nTarModCodigo)
          .length > 0
          ? true
          : false
    })
  }

  anadirUsuario(): void {
    const dialogRef = this.dialog.open(ModalUsuarioSinPermisoComponent, {
      disableClose: true,
      width: '35%',
      height: '75%',
    })
    dialogRef.afterClosed().subscribe((res) => {
      let newUser: any = {
        cPerCodigo: res[0].cPerCodigo,
        cPerApellido: res[0].cPerApellido,
        cPerJuridica: '',
        cPerNombre: '',
        cPerUsuClave: null,
        cPerUsuCodigo: '',
        cPerUsuEstado: 1,
        cPudFecha: null,
        nPerRelacion: null,
      }

      let nuevaLista: DatosUsuario[] = []
      this.personaAcciones.forEach((element) => {
        nuevaLista.push(element)
      })
      if (
        nuevaLista.filter((v: any) => v.cPerCodigo == newUser.cPerCodigo)
          .length == 0
      ) {
        nuevaLista.push(newUser)
      }

      this.personaAcciones = nuevaLista
      this.buscarPermisos(newUser)
    })
  }

  async registrarPermisos() {
    var formData = new FormData()
    let nTarModCodigo: string = ''

    this.permisosLeg
      .filter((v: any) => v.selected)
      .forEach((element: any) => {
        nTarModCodigo += element.nTarModCodigo + ','
      })
    let headers = {
      headers: {
        Authorization:
          'Bearer ' +
          this.sserv.gettoken(sessionStorage.getItem('token') ?? '').toString(),
      },
    }

    formData.append('cPerCodigo', this.cPerCodigo)
    formData.append(
      'nIntCodigo',
      nTarModCodigo.substring(0, nTarModCodigo.length - 1),
    )
    await axios
      .post(
        environment.URLAPI + 'legajo/registrar_accionesxusuario',
        formData,
        headers,
      )
      .then((response) => {
        console.log(response)
      })
  }
}
