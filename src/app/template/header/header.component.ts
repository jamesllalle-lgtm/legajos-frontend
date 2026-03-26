import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ControlesService } from 'src/app/services/controles.service';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { CambiarpassComponent } from '../cambiarpass/cambiarpass.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  @Output() openNav = new EventEmitter();

  public icon: Boolean = true;
  constructor(
    public sidenavservc: SidenavService,
    public ctrlserv: ControlesService,
    public segurserv: SeguridadService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }
  openSideNav(e: any) {
    console.log('hola bb2')
    this.icon = (this.icon ? false : true);
    this.sidenavservc.toogle(this.openNav.emit(e));
  }

  cambiopass(){
    const dialogRef = this.dialog.open(CambiarpassComponent, {
      width: '350px',
      panelClass: 'divmodal',
      data: {title: 'Cambiar contraseña'},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
}
