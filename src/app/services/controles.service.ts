import { BreakpointObserver } from '@angular/cdk/layout';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';
import { ConfiguracionService } from './configuracion.service';
import { ListService } from './list.service';
import { RegisterService } from './register.service';
import { SeguridadService } from './seguridad.service';

@Injectable({
  providedIn: 'root'
})

export class ControlesService {
  @Output() openList = new EventEmitter();
  public _banregister: Boolean = false;
  public edad: String = '0 años'
  public urlprev: any = environment.PHOTODEFAULT
  public colaboradornombre: String = ""
  public persona_aut!: string;
  public persona_ent!: string;
  public persona: any
  public disctrolmbr: boolean = true
  public diasmax: number = 2
  public minfechadias: number = 2
  public saldorubro: any = 0.0.toFixed(2)
  public saldorubrotransf: any = 0.0.toFixed(2)
  nmbrctrl: string = ''
  public vsald: boolean = true
  public isSmallScreen: any
  public modesidenav: MatDrawerMode = "push" as MatDrawerMode
  constructor(
    public regserv: RegisterService,
    public listserv: ListService,
    public configserv: ConfiguracionService,
    public breakpointObserver: BreakpointObserver
  ) {
    this.isSmallScreen = breakpointObserver.isMatched('(max-width: 970px)');
  }

  cargardatos($tipo: boolean, $id: string) {
    // console.log($datos)

  }



  calcular_edad($e: any) {
    let value = this.configserv.datepipe.transform($e, "dd-MM-YYYY")?.toString() ?? ''
    let fecha = new Date();
    let fechanac = value.split("-");
    let anios = fecha.getFullYear() - parseInt(fechanac[2]);
    let meses = fecha.getMonth() + 1 - parseInt(fechanac[1]);
    let dias = fecha.getDate() - parseInt(fechanac[0]);
    if (meses < 0) {
      anios -= 1;
    } else if (meses == 0) {
      if (dias < 0) anios -= 1;
    }
    return anios;
  }


}
