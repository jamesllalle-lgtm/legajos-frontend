
import { Injectable } from '@angular/core';

import { SesionService } from '../services/sesion.service';
import { Observable, Subscriber } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(
    public sserv: SesionService,
  ) {}



  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
        setHeaders: {
            Authorization: `Bearer ` + this.sserv.gettoken(sessionStorage.getItem('token') ?? "").toString()
        }
    });

    return next.handle(request);
}
}
