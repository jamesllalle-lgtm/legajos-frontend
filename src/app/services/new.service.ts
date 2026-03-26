import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatosUsuario } from '../models/usuario';
import { ConfiguracionService } from './configuracion.service';
import { RegisterService } from './register.service';

@Injectable({
  providedIn: 'root'
})
export class NewService {
  public _egreso: boolean = true
  public nvoval: string = '';

  constructor(
    public dialog: MatDialog,
    public configserv: ConfiguracionService,
    private regserv: RegisterService
  ) {

  }

  public nuevo(nuevo: any) {
    return nuevo;
  }

  public registro(registro: any) {
    return registro;
  }

  public exportar(registro: any) {
    return registro;
  }


}

