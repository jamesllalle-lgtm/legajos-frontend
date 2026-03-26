import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Constante } from 'src/app/models/general/constante'
import { Interface } from 'src/app/models/general/interface'
import { Leg_Grup_Inv_Sem } from 'src/app/models/legajo/leg_grup_inv_sem'
import { CleanmodelService } from 'src/app/services/cleanmodel.service'
import { ConfiguracionService } from 'src/app/services/configuracion.service'
import { ListService } from 'src/app/services/list.service'
import { RegisterService } from 'src/app/services/register.service'
import { SeguridadService } from 'src/app/services/seguridad.service'
import { ValidateService } from 'src/app/services/validate.service'

@Component({
  selector: 'app-grupo-investigacion-semillero',
  templateUrl: './grupo-investigacion-semillero.component.html',
  styleUrls: ['./grupo-investigacion-semillero.component.sass'],
})
export class GrupoInvestigacionSemilleroComponent implements OnInit {
  public FormGroup: FormGroup
  public legGrupInvSem: Leg_Grup_Inv_Sem
  private nPrdCodigo: any
  private nIntCodigoLinea: any
  private nIntCodigoTipInv: any
  erradjunto: boolean = false
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: ''
      nLegDatCodigo: 0
      datos: Leg_Grup_Inv_Sem
      Leg_cPerCodigo: ''
    },
    public dialogRef: MatDialogRef<GrupoInvestigacionSemilleroComponent>,
    public listserv: ListService,
    public configservc: ConfiguracionService,
    public segserv: SeguridadService,
    private _formBuilder: FormBuilder,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    public regserv: RegisterService,
  ) {
    this.legGrupInvSem = this.clmdserv.empty_GrupoInvestigacion()
    this.FormGroup = this._formBuilder.group({
      cPerCodigo: ['', Validators.required],
      nLegLidGrupInvSemTitulo: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.FormGroup.setValue({
      cPerCodigo: this.data.datos.cPerCodigo,
      nLegLidGrupInvSemTitulo: this.data.datos.nLegLidGrupInvSemTitulo,
    })
    this.CargarTiposLegLidGrupInvSemCodigo()
    this.CargarLineaLegLidGrupInvSemCodigo()
  }

  onClickCerrar(): void {
    this.dialogRef.close()
  }

  comboOnChangePer(periodo: any) {
    this.nPrdCodigo = periodo.nPrdCodigo
    this.configservc.nLegajoDatos = 0
    this.configservc.cPrdNombre = periodo.cPrdDescripcion
    // console.log('primero periodo:' + periodo.cPrdDescripcion)
  }

  fileProgress(fileInput: any): void {
    if (fileInput != null) {
      this.legGrupInvSem.nLegLidGrupInvSemArchivo = <File>(
        fileInput.target.files[0]
      )
      this.preview()
    } else {
      this.legGrupInvSem.nLegLidGrupInvSemArchivo = null
      // this.erradjunto = false
    }
  }
  preview(): void {
    // Show preview
    const mimeType = this.legGrupInvSem.nLegLidGrupInvSemArchivo.type
    if (
      mimeType.match(/image\/*/) == null &&
      mimeType.match(/pdf\/*/) == null
    ) {
      this.legGrupInvSem.nLegLidGrupInvSemArchivo = null
      this.erradjunto = false
      this.valserv.mensaje_info(
        'Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).',
      )
      return
    }
    this.erradjunto = true
    const reader = new FileReader()
    reader.readAsDataURL(this.legGrupInvSem.nLegLidGrupInvSemArchivo)
    reader.onload = (_event) => {
      this.legGrupInvSem.cFile = reader.result
    }
  }
  async CargarTiposLegLidGrupInvSemCodigo() {
    await this.listserv.listado('interface/10/5208', '').then((data) => {
      let ltipo: Interface[] = data
      this.listserv.lTipoGrupoInvestigador = ltipo.filter(
        (x) => x.nIntCodigo != 0,
      )
    })
  }
  async CargarLineaLegLidGrupInvSemCodigo() {
    await this.listserv.listado('interface/10/5207', '').then((data) => {
      let lLinea: Interface[] = data
      this.listserv.lLineas = lLinea.filter((x) => x.nIntCodigo != 0)
    })
  }
  comboOnChangeTipoGrupoInv(tipoInvestigador: any) {
    this.nIntCodigoTipInv = tipoInvestigador.nIntCodigo
  }
  comboOnChangeLinea(lineas: any) {
    this.nIntCodigoLinea = lineas.nIntCodigo
  }
  async guardar() {
    try {
      if (this.FormGroup.status.valueOf() == 'INVALID') {
        // this.stepper.selectedIndex = 0
        this.valserv.mensaje_info('Complete los campos solicitados.')
        return
      }
      if (this.legGrupInvSem.nLegLidGrupInvSemArchivo == null) {
        this.valserv.mensaje_info(
          'Adjunte archivo que valide la información registrada.',
        )
        return
      }
      var formData = new FormData()

      formData.append(
        'nTipoLegLidGrupInvSemCodigo',
        this.nIntCodigoTipInv.toString() ?? '0',
      )
      formData.append('nInvCodigo', this.nIntCodigoLinea.toString() ?? '0')
      formData.append('cPerCodigo', this.data.Leg_cPerCodigo)
      formData.append('nPrdCodigo', this.nPrdCodigo)
      formData.append(
        'nLegLidGrupInvSemTitulo',
        this.FormGroup.get('nLegLidGrupInvSemTitulo')?.value ?? '',
      )
      formData.append('cFile', this.legGrupInvSem.nLegLidGrupInvSemArchivo)
      formData.append('nLegLidGrupInvSemEstado', 'true')
      formData.append('cUsuRegistro', this.segserv.usuarioreg.cPerCodigo)
      formData.append('cUsuModifica', this.segserv.usuarioreg.cPerCodigo)

      await this.regserv
        .registroFile(
          'Registro',
          'leg_grup_inv_sem/registro_leg_grup_inv/' +
            this.segserv.usuarioreg.cPerCodigo,
          formData,
        )
        .then((res) => {
          this.listserv.listar_grupo_investigacion(
            this.segserv.usuarioreg.cPerCodigo,
          )
        })
    } catch (e) {
      console.log(e)
    }
  }
}
