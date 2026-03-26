import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ControlesService } from 'src/app/services/controles.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SidenavService } from 'src/app/services/sidenav.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})

export class DashboardComponent implements OnInit {
  @ViewChild('drawer') sideNav: any;
  ipAddress: string = '0.0.0.0'
  constructor(
    public sidenavservc: SidenavService,
    public segserv: SeguridadService,
    private router: Router,
    public ctrlserv: ControlesService,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public listserv: ListService,

  ) {

    if(this.segserv.conexionactiva()){
      this.segserv.disload = false;
    }else{
      this.router.navigate(['/login']);
    }
   }



  ngOnInit(): void {
  }



  ngAfterViewInit(): any {
    this.sidenavservc.abrirmenu(this.sideNav);
  }

}
