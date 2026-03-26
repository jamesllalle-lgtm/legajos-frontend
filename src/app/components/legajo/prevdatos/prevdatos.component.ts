import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { LegDatosGenerales } from 'src/app/models/legajo/leg-datos-generales';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ControlesService } from 'src/app/services/controles.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-prevdatos',
  templateUrl: './prevdatos.component.html',
  styleUrls: ['./prevdatos.component.sass']
})
export class PrevdatosComponent implements OnInit {

  edad:String = '';
  dateFecha: any;
  fileData: any;
  previewUrl: any = environment.PHOTODEFAULT

  constructor(
    public dialogRef: MatDialogRef<PrevdatosComponent>,
    public configserv: ConfiguracionService,
    public ctrlserv: ControlesService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: {title: 'Datos Generales', obj: LegDatosGenerales},
  ) {
    this.edad = this.ctrlserv.calcular_edad(data.obj.dLegDatFechaNacimiento).valueOf().toString() + ' años'
    this.previewUrl = environment.PHOTOSEUSS + data.obj.cPerCodigo
    // data.obj.vTipoDoc.cIntNombre
  }

  ngOnInit(): void {

  }
}

