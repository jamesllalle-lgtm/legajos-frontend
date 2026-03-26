import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { DatosUsuario } from 'src/app/models/usuario'
import { ControlesService } from 'src/app/services/controles.service'
import { RegisterService } from 'src/app/services/register.service'
import { SeguridadService } from 'src/app/services/seguridad.service'
import { SesionService } from 'src/app/services/sesion.service'
import { SidenavService } from 'src/app/services/sidenav.service'
import { ListService } from 'src/app/services/list.service'
import { ConfiguracionService } from 'src/app/services/configuracion.service'
import axios from 'axios'
import { environment } from 'src/environments/environment'
import { Menu } from 'src/app/models/menu'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass'],
})
export class MenuComponent implements OnInit {
  @Output() openNav = new EventEmitter()
  codigoMod: number = 1
  codigoArea: number = 0
  menu: Menu[] = []
  panelOpenState = false
  constructor(
    public sidenavservc: SidenavService,
    public sserv: SesionService,
    public segserv: SeguridadService,
    public ctrlserv: ControlesService,
    public regserv: RegisterService,
    public configserv: ConfiguracionService,
    public listserv: ListService,
  ) {}

  ngOnInit(): void {
    //this.obtenerMenu()

    let usu: DatosUsuario = this.segserv.usuarioreg //JSON.parse(this.sserv.getuser(sessionStorage.getItem('user')??'{}') ?? '{}')
    this.segserv.usuarioreg = usu
    this.segserv.obtenerdatosusuario()
    // console.log(this.segserv.usuarioreg)
    if (this.segserv.usuarioreg.nRol == 1) {
      this.listserv.listado('tareamodulo','/' + this.segserv.usuarioreg.cPerCodigo + '/' + this.codigoMod)
        .then((data) => {
          this.listserv.lTareasPermiso = data
          for (let index = 0;index < this.listserv.lTareasPermiso.length;index++) {
            if (this.listserv.lTareasPermiso[index].nTarModCodigo == 13) {
              this.codigoArea = 13
            } else {
              this.codigoArea = 1
            }
          }
        })
    }
  }

  // async obtenerMenu() {
  //   this.segserv.obtenerdatosusuario()
  //   let usu: DatosUsuario = this.segserv.usuarioreg

  //   let headers = {
  //     headers: {
  //       Authorization:
  //         'Bearer ' +
  //         this.sserv.gettoken(sessionStorage.getItem('token') ?? '').toString(),
  //     },
  //   }
  //   await axios
  //     .get(environment.URLAPI + `Interface/menu/${usu.cPerCodigo}`, headers)
  //     .then((response) => {
  //       let data = response.data.odata

  //       if (!data || !Array.isArray(data)) {
  //         console.error('Error: Los datos del menú son nulos o no son un array.');
  //         return;
  //       }
        
  //       let padre = data.filter((v: any) => v.nivel == 1)
  //       let hijo = data.filter((v: any) => v.nivel == 2)

  //       padre.forEach((element: any) => {
  //         let submenu = hijo.filter(
  //           (v: any) => v.padre == element.cIntJerarquia,
  //         )
  //         element.submenu = submenu
  //         this.menu.push(element)
  //       })
  //       //  padre.forEach(element => {
  //       //     let submenu = hijo.filer(v:any => v.padre == element.cIntJerarquia);
  //       //   });
  //       // console.log(this.menu)
  //     })
  // }
}
