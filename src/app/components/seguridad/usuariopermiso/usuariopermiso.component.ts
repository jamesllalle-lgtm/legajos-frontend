import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core'
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import axios from 'axios'
import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from 'src/app/helpers/format-datepicker'
import { DatosUsuario } from 'src/app/models/usuario'
import { SesionService } from 'src/app/services/sesion.service'
import { SidenavService } from 'src/app/services/sidenav.service'
import { environment } from 'src/environments/environment'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { ModalUsuarioSinPermisoComponent } from '../../legajo/modal/modal-usuario-sin-permiso/modal-usuario-sin-permiso.component'

@Component({
  selector: 'app-usuariopermiso',
  templateUrl: './usuariopermiso.component.html',
  styleUrls: ['./usuariopermiso.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class UsuariopermisoComponent implements OnInit {
  @ViewChild('drawer') sideNav: any

  route: string = 'legajo'
  modulo: string = 'LEGAJOS'
  title: string = 'Control de Legajos'
  public personaPermisos: DatosUsuario[] = []
  public name: string = ''
  public nameUser: string = ''
  public permisosLeg: any[] = []
  public permisoXUsuarioLeg: any[] = []
  public bloqueado: boolean = true
  public cPerCodigo: string = ''

  // allComplete: boolean = false

  public columndefs: any[] = ['persona']
  constructor(
    public sidenavservc: SidenavService,
    public sserv: SesionService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { title: 'Permisos' },
  ) {}
  ngOnInit(): void {
    this.sidenavservc.abrirmenu(this.sideNav)
  }

  ngAfterViewInit(): any {
    this.sidenavservc.abrirmenu(this.sideNav)
    this.listarPersonaConPermisos()
    this.obtenerPermisosLeg()
  }

  async listarPersonaConPermisos() {
    //
    await axios
      .get(environment.URLAPI + 'listar_persona_con_permisos', {
        headers: {
          Authorization:
            'Bearer ' +
            this.sserv
              .gettoken(sessionStorage.getItem('token') ?? '')
              .toString(),
        },
      })
      .then((response) => {
        this.personaPermisos = response.data.odata
      })
  }

  async buscarPermisos(element: any) {
    await this.obtenerPermisosXUsuario(element.cPerCodigo)
    this.cPerCodigo = element.cPerCodigo
    this.name = `${element.cPerApellido} ${element.cPerNombre}`
  }

  async obtenerPermisosLeg() {
    let headers = {
      headers: {
        Authorization:
          'Bearer ' +
          this.sserv.gettoken(sessionStorage.getItem('token') ?? '').toString(),
      },
    }
    await axios
      .get(environment.URLAPI + `Interface/permisos_leg`, headers)
      .then((response) => {
        let data = response.data.odata
        let padre = data.filter((v: any) => v.nivel == 1)
        let hijo = data.filter((v: any) => v.nivel == 2)

        padre.forEach((element: any) => {
          let submenu = hijo.filter(
            (v: any) => v.padre == element.cIntJerarquia,
          )
          element.submenu = submenu
          this.permisosLeg.push(element)
        })
      })
  }

  updateAllComplete(item: any) {
    let newSubMenu: any[] = []
    let allComplete =
      item.submenu.filter((v: any) => v.selected == true).length ==
      item.submenu.length
        ? false
        : true

    item.submenu.forEach((element: any) => {
      element.selected = allComplete
      newSubMenu.push(element)
    })

    // this.permisosLeg.forEach(element => {
    //   if
    // });
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
      .get(environment.URLAPI + `Interface/menu/${cPerCodigo}`, headers)
      .then((response) => {
        let data = response.data.odata
        this.validarPermisos(data)
      })
  }

  async validarPermisos(permisos: any) {
    this.bloqueado = false
    this.permisosLeg.map((item: any) => {
      item.submenu.map((item2: any) => {
        item2.selected =
          permisos.filter((v: any) => v.cIntJerarquia == item2.cIntJerarquia)
            .length > 0
            ? true
            : false
      })
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
      this.personaPermisos.forEach((element) => {
        nuevaLista.push(element)
      })

      if (
        nuevaLista.filter((v: any) => v.cPerCodigo == newUser.cPerCodigo)
          .length == 0
      ) {
        nuevaLista.push(newUser)
      }

      this.personaPermisos = nuevaLista
      this.buscarPermisos(newUser)
    })
  }

  async registrarPermisos() {
    var formData = new FormData()
    let nIntCodigo: string = ''
    this.permisosLeg.forEach((element: any) => {
      element.submenu
        .filter((v: any) => v.selected)
        .forEach((element2: any) => {
          nIntCodigo += element2.nIntCodigo + ','
        })
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
      nIntCodigo.substring(0, nIntCodigo.length - 1),
    )
    await axios
      .post(environment.URLAPI + 'legajo/registrar_permisos', formData, headers)
      .then((response) => {
        console.log(response)
      })
  }
}
