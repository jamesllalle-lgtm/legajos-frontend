import { Injectable } from '@angular/core';
import { environment } from "./../../environments/environment";
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class CryptService {

  constructor() { }

  set(value: any) {
    var key = CryptoJS.enc.Utf8.parse(environment.CRYPTKEY);
    var iv = CryptoJS.enc.Utf8.parse(environment.CRYPTKEY);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(value: any) {
    var key = CryptoJS.enc.Utf8.parse(environment.CRYPTKEY);
    var iv = CryptoJS.enc.Utf8.parse(environment.CRYPTKEY);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
