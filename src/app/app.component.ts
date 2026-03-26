import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { SeguridadService } from './services/seguridad.service';
import { SesionService } from './services/sesion.service';
import { WorkerService } from './services/worker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'projectuss';

  userActivity:any;
  userInactive: Subject<any> = new Subject();

  constructor(
    public workserv: WorkerService,
    private router: Router,
    public segserv: SeguridadService
  ) {
    this.setTimeout();
    this.userInactive.subscribe(() => {
      if (sessionStorage.getItem('token') !== '' && sessionStorage.getItem('token') !== null) {
      // if(sessionStorage.getItem("token") !== '' && sessionStorage.getItem("token") !== null){
        this.segserv.limpiarsesion()
        Swal.fire(this.segserv.namesystem, "Por seguridad el sistema ha cerrado sesión, dado que no hubo actividad.", "info")
      }
    });
  }

  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), (1000 * 60 * 10));
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
}
