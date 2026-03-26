import { AfterViewInit, Component, Directive, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { SeguridadService } from 'src/app/services/seguridad.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})

export class LoginComponent implements OnInit  {
  public anio: string = new Date().getFullYear().toString();
  public usuario: string = ''
  public password: string = ''
  hide = true;
  constructor(
    public segserv: SeguridadService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    if(this.segserv.conexionactiva()){
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {

  }

  login($recaptchakey: string){
    this.segserv.disload = true;
    this.segserv.login(this.usuario, this.password, $recaptchakey);
  }

  loginDirecto() {
    this.login('');
  }


}
