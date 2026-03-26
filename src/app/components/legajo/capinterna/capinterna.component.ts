import { ThrowStmt } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { CapacitacionesUss } from 'src/app/models/general/capacitaciones-uss';
import { LegCapacitacionInterna } from 'src/app/models/legajo/leg-capacitacion-interna';
import { LegDatosGenerales } from 'src/app/models/legajo/leg-datos-generales';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ControlesService } from 'src/app/services/controles.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { ValidateService } from 'src/app/services/validate.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-capinterna',
  templateUrl: './capinterna.component.html',
  styleUrls: ['./capinterna.component.sass']
})
export class CapinternaComponent implements OnInit {
  public regLegCapacitacionInterna: LegCapacitacionInterna
  public FormGroup: FormGroup;
  erradjunto: boolean = false
  constructor(
    public dialogRef: MatDialogRef<CapinternaComponent>,
    public configserv: ConfiguracionService,
    public ctrlserv: ControlesService,
    public clmdserv: CleanmodelService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: { title: 'Capacitación interna', id: number, obj: LegCapacitacionInterna },
  ) {
    this.regLegCapacitacionInterna = this.clmdserv.empty_capacitacioninterna()
    this.FormGroup = this._formBuilder.group({
      capacitacionControl: ['', Validators.required],
      competenciaControl: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.listar_capacitacionesuss()
    if (this.data.id > 0 && this.data.obj.nLegCicodigo > 0) {
      this.regLegCapacitacionInterna = this.data.obj
      this.customerOnChange(this.data.obj.vCapacitacionUSS, 1)
      this.FormGroup.setValue({
        capacitacionControl: this.data.obj.vCapacitacionUSS.nCapCodigo,
        competenciaControl: this.data.obj.cLegCicompetenciaMejora,
      })
      this.regLegCapacitacionInterna.cFile = this.data.obj.cLegCiarchivo
      this.erradjunto = this.data.obj.cLegCiarchivo != null && this.data.obj.cLegCiarchivo != '' ? true : false
    }
  }

  customerOnChange($obj: any, tipo: number) {
    if ($obj == null) {

      switch (tipo) {
        case 1: this.regLegCapacitacionInterna.nCapCodigo = 0; this.regLegCapacitacionInterna.vCapacitacionUSS = this.clmdserv.empty_capacitacionesuss(); break;
      }
    } else {
      switch (tipo) {
        case 1: this.regLegCapacitacionInterna.nCapCodigo = $obj.nCapCodigo; this.regLegCapacitacionInterna.vCapacitacionUSS = $obj; break;
      }
    }

  }

  listar_capacitacionesuss() {
    this.lstserv.listado('capacitacionesuss', '').then((data) => {
      this.lstserv.lCapacitacionesUSS = data
    })
  }

  fileProgress(fileInput: any): void {
    if (fileInput != null) {
      this.regLegCapacitacionInterna.cLegCiarchivo = <File>fileInput.target.files[0];
      this.preview()
    } else {
      this.regLegCapacitacionInterna.cLegCiarchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regLegCapacitacionInterna.cLegCiarchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regLegCapacitacionInterna.cLegCiarchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo en formato PDF.");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regLegCapacitacionInterna.cLegCiarchivo);
    reader.onload = (_event) => {
      this.regLegCapacitacionInterna.cFile = reader.result;
    }
  }

  guardar($e: any) {
    if (this.FormGroup.status.valueOf() == "INVALID") {
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    }
    var formData = new FormData();
    this.regLegCapacitacionInterna.cLegCicompetenciaMejora = this.FormGroup.get('competenciaControl')?.value ?? ''
    formData.append('nLegCicodigo', this.regLegCapacitacionInterna.nLegCicodigo.toString() ?? '0')
    formData.append('nLegDatCodigo', this.regLegCapacitacionInterna.nLegDatCodigo.toString() ?? '0')
    formData.append('nCapCodigo', this.regLegCapacitacionInterna.nCapCodigo.toString() ?? '0')
    formData.append('cLegCicompetenciaMejora', this.regLegCapacitacionInterna.cLegCicompetenciaMejora.toString() ?? '0')
    formData.append('cFile', this.regLegCapacitacionInterna.cLegCiarchivo)
    formData.append('cLegCiarchivo', '')
    formData.append('bLegCiestado', 'true')


    if (this.regLegCapacitacionInterna.nLegCicodigo > 0) {

    }

    if (this.regLegCapacitacionInterna.nLegCicodigo == 0) {
      if (this.regLegCapacitacionInterna.cFile == null) {
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
        return;
      }
      this.regserv.registroFile('Registro de Legajos', 'legcapacitacioninterna/' + this.data.id, formData).then((data) => {
        this.lstserv.listar_capacitacioninterna(this.data.id)
        this.configserv.onNoClickDialog(this.dialogRef);
      })
    } else {
      this.regserv.actualizarFile('Registro de Legajos', 'legcapacitacioninterna/put/' + this.regLegCapacitacionInterna.nLegCicodigo, formData).then((data) => {
        this.lstserv.listar_capacitacioninterna(this.data.id)
        this.configserv.onNoClickDialog(this.dialogRef);
      })
    }

  }



}
