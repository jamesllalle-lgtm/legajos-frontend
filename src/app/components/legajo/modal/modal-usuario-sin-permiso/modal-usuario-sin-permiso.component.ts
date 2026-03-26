import { MatTableModule } from '@angular/material/table'
import { Component, NgModule, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import axios from 'axios'
import { Persona } from 'src/app/models/general/persona'
import { SesionService } from 'src/app/services/sesion.service'
import { SidenavService } from 'src/app/services/sidenav.service'
import { environment } from 'src/environments/environment'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatDialogRef } from '@angular/material/dialog'
import { ThemePalette } from '@angular/material/core'
import {
  MatProgressBarModule,
  ProgressBarMode,
} from '@angular/material/progress-bar'



@Component({
  selector: 'app-modal-usuario-sin-permiso',
  templateUrl: './modal-usuario-sin-permiso.component.html',
  styleUrls: ['./modal-usuario-sin-permiso.component.sass'],
})
export class ModalUsuarioSinPermisoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  mode: ProgressBarMode = 'determinate'
  public dataSource = new MatTableDataSource<Persona>()
  public cPerNombre: String = ''
  public existeSeleccionado: boolean = false
  public perSelected!: Persona
  public loading: boolean = false
  public columndefs: any[] = [
    // 'codigo',
    'persona',
    // 'codigo',
  ]
  public persona: Persona[] = []

  constructor(
    public sidenavservc: SidenavService,
    public dialogRef: MatDialogRef<ModalUsuarioSinPermisoComponent>,
    public sserv: SesionService,
  ) {}

  ngAfterViewInit() {}
  ngOnInit(): void {
    // this.dataSource = new MatTableDataSource<Persona>(this.persona)
  }

  async buscar() {
    let headers = {
      headers: {
        Authorization:
          'Bearer ' +
          this.sserv.gettoken(sessionStorage.getItem('token') ?? '').toString(),
      },
    }
    await axios
      .get(
        environment.URLAPI + `Persona/buscar_por_apellido/${this.cPerNombre}`,
        headers,
      )
      .then((response) => {
        this.dataSource.data = response.data.odata
        this.dataSource.paginator = this.paginator
        // this.dataSource.paginator = this.paginator
      })
  }
  obtenerRegistro(i: any) {
    this.existeSeleccionado = true
    this.perSelected = i
    this.dataSource.data.map((item: any) => {
      if (item.cPerCodigo == i.cPerCodigo) {
        item.selected = true
      } else {
        item.selected = false
      }
    })
  }

  registrarUsuario() {
    this.dialogRef.close(this.dataSource.data.filter((v: any) => v.selected))
  }
}
