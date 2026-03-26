import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SeguridadService } from 'src/app/services/seguridad.service';
import { RegisterService } from 'src/app/services/register.service';
import { CryptService } from 'src/app/services/crypt.service';
import { DatosUsuario } from 'src/app/models/usuario';
@Component({
  selector: 'app-modaldeclaracionjurada',
  templateUrl: './modaldeclaracionjurada.component.html',
  styleUrls: ['./modaldeclaracionjurada.component.sass']
})
export class ModaldeclaracionjuradaComponent implements OnInit {
  public usuarioreg: DatosUsuario = {
    cPerCodigo: '',
    cPerApellido: '',
    cPerNombre: '',
    cPerUsuCodigo: '',
    cPerEmail: '',
    cPerTipoDoc: '',
    cPerNroDoc: '',
    nTipo: 0,
    cTipoDesc: '',
    cCargo: '',
    nRol: 1,
    cToken: '',
    bLegajo: false,
  }
  constructor(
    public segserv: SeguridadService,
    public dialogRef: MatDialogRef<ModaldeclaracionjuradaComponent>,
    public regserv: RegisterService,
    public cryptserv: CryptService,
    @Inject(MAT_DIALOG_DATA) public data: { title: '' }) { }

  ngOnInit(): void {
    this.segserv.obtenerdatosusuario()
  }

  onClickAceptar() {
    this.regserv.ActualizarDatos('Declaración Jurada.', 'declacionjurada/' + this.segserv.usuarioreg.cPerCodigo, null).then((data) => {
      let obj = JSON.parse(this.cryptserv.get(sessionStorage.getItem("user")))
      obj.declaracionjuradaflag = true;
      this.usuarioreg = obj
      sessionStorage.setItem("user", this.cryptserv.set(JSON.stringify(this.usuarioreg)));
      this.dialogRef.close()

      // this.modalDeclaracionJurada = data.declaracionjuradaflag
    })

  }


}
