import { Injectable } from '@angular/core';
import { CryptService } from './crypt.service';
import { SeguridadService } from './seguridad.service';
import { SesionService } from './sesion.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderautorizaService {

  public headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, PUT, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
  });

  public headers_aut = new Headers({
    "Content-Type": "application/json",
    "Authorization": "Bearer " + this.sserv.gettoken(sessionStorage.getItem('token') ?? "").toString(),
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, PUT, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
    // 'Access-Control-Allow-Origin': "*"
  })

  public headers_formimage = new Headers();
  public headers_formfile = new Headers({
    "Content-Disposition": "multipart/form-data",
    'Content-Type': 'multipart/form-data'
  });
  constructor(
    public sserv: SesionService
  ) {
    // this.headers_aut = new Headers({
    //   "Content-Type": "application/json",
    //   "Authorization": "Bearer " + this.sserv.gettoken(sessionStorage.getItem('token')??'').toString() ?? '',
    //   "Access-Control-Allow-Credentials": "true",
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, PUT, OPTIONS",
    //   "Access-Control-Allow-Headers":
    //     "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
    //   // 'Access-Control-Allow-Origin': "*"
    // })
    this.headers_formimage = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Bearer " + this.sserv.gettoken(sessionStorage.getItem('token') ?? '').toString() ?? '',
      // 'Access-Control-Allow-Origin': "*"
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, PUT, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
    })

  }

}
