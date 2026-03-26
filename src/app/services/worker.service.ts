import { Injectable } from '@angular/core';
import { ControlesService } from './controles.service';
import { ListService } from './list.service';
import { RegisterService } from './register.service';
@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  alive: boolean = true
  result: any;
  constructor(
    public ctrlserv: ControlesService,
    public lstserv: ListService,
    public regserv: RegisterService
  ) {
  }


  public notificaciones() {
    //  this.lstserv.listar('worker');
  }



}
