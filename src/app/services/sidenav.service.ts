import { Injectable } from '@angular/core'
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav'
import { ControlesService } from './controles.service'

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  constructor(public ctrlserv: ControlesService) {}

  public toogle(toogle: any) {
    return toogle
  }

  public abrirmenu($sideNav: any) {
    this.toogle = () => {
      // $sideNav.iconmenu = ($sideNav.iconmenu ? false : true);
      $sideNav.mode = this.ctrlserv.modesidenav
      $sideNav.toggle()
    }
  }
}
