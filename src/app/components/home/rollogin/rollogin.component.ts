import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  Inject,
  NgModule,
  OnInit,
  ViewChildren,
} from '@angular/core'
import { SeguridadService } from 'src/app/services/seguridad.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { CryptService } from '../../../services/crypt.service'
import { DatosUsuario } from '../../../models/usuario'
import { ListService } from 'src/app/services/list.service'
import { Interface } from 'src/app/models/general/interface'
import Swal from 'sweetalert2'
import { PerUsuario } from 'src/app/models/general/per-usuario'
import { LegDocumentacionInterna } from '../../../models/legajo/leg-documentacion-interna'
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog'
import { ModaldeclaracionjuradaComponent } from '../modaldeclaracionjurada/modaldeclaracionjurada.component'
// import { CryptService } from './../../crypt.service';
// import { Component, OnInit } from '@angular/core';

interface Roles {
  value: string
  viewValue: string
}

@Component({
  selector: 'app-rollogin',
  templateUrl: './rollogin.component.html',
  styleUrls: ['./rollogin.component.sass'],
})

// @NgModule({

// })
export class RolloginComponent implements OnInit {
  public modalDeclaracionJurada: boolean = false

  public lDocumentacionInterna: LegDocumentacionInterna[] = []
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
  public anio: string = new Date().getFullYear().toString()
  public modalDJ: boolean = true
  hide = true
  public rol: string = ''

  roles: Roles[] = [
    // { value: '1', viewValue: 'Adminstrativo' },
    // { value: '2', viewValue: 'Docente' },
  ]

  constructor(
    public dialog: MatDialog,
    public segserv: SeguridadService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public cryptserv: CryptService,
    public lstserv: ListService,
  ) {}

  ngOnInit(): void {
    this.segserv.obtenerdatosusuario()
    this.validarDeclaracionJurada()
    this.CargarTipoUsuario()
  }

  continuar() {
    let obj = JSON.parse(this.cryptserv.get(sessionStorage.getItem('user')))
    obj.nTipo = this.rol
    obj.declaracionjuradaflag = true
    this.usuarioreg = obj
    // console.log(obj)

    sessionStorage.setItem(
      'user',
      this.cryptserv.set(JSON.stringify(this.usuarioreg)),
    )
    this.segserv.obtenerdatosusuario()

    switch (this.rol) {
      case '':
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'Para continuar debe seleccionar un Perfil.',
        })
        break
      case '1':
        this.router.navigate(['/dashboard'])
        break
      default:
        this.router.navigate(['/dgeneral'])
        break
    }
  }
  CargarTipoUsuario() {
    this.spinner.show()
    this.lstserv
      .listado('tipousuario', '/' + this.segserv.usuarioreg.cPerCodigo)
      .then((data) => {
        let combo: PerUsuario[] = data
        let dataCombo = []
        if (combo.filter((v) => v.nPerRelacion == 1).length > 0) {
          dataCombo.push({ value: '1', viewValue: 'Administrativo' })
        }
        if (combo.filter((v) => v.nPerRelacion == 2).length > 0) {
          dataCombo.push({ value: '2', viewValue: 'Docente' })
        }

        this.roles = dataCombo
        if (this.roles.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error',
            text: 'El usuario no cuenta con un perfil para legajo.',
            footer: 'Comuníquese con el administrador del sistema.',
          })
        }
        if (this.roles.length == 1) {
          this.router.navigate(['/dgeneral'])
        }
        // console.log(this.roles);
        this.spinner.hide()
      })
  }
  validarDeclaracionJurada() {
    this.lstserv
      .listado(
        'obtenerdeclaracionjurada',
        '/' + this.segserv.usuarioreg.cPerCodigo,
      )
      .then((data) => {
        if (!data.declaracionjuradaflag) {
          this.openModal()
          this.CargarTipoUsuario()
        } else {
        }
        // this.modalDeclaracionJurada = data.declaracionjuradaflag
      })
  }
  openModal(): void {
    const dialogRef = this.dialog.open(ModaldeclaracionjuradaComponent, {
      width: '50%',
      hasBackdrop: false, //Here line to add
      disableClose: true, //Here line to add
    })
  }
}
