import { Injectable } from '@angular/core';
import { CryptService } from './crypt.service';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor(
    public cryptserv: CryptService
  ) { }

  public gettoken = (value: string) => {
    return this.cryptserv.get(value) ?? null
  }

  public getuser = (value: string) => {
    return this.cryptserv.get(value) ?? null
  }
}
