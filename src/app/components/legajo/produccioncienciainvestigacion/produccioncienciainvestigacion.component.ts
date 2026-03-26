import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Formacion } from 'src/app/models/formacion';
import { GradoAcademico } from 'src/app/models/gradoacademico';
import { CarreraProfesional } from 'src/app/models/carreraprofesional';
import { Institucion } from 'src/app/models/institucion';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/helpers/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Persona } from 'src/app/models/general/persona';
import { Interface } from 'src/app/models/general/interface';
import { LegGradoTitulo } from 'src/app/models/legajo/leg-grado-titulo';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { LegDocenciaUniv } from 'src/app/models/legajo/leg-docencia-univ';
import { LegInvestigador } from 'src/app/models/legajo/leg-investigador';
import { LegTesisAseJur } from 'src/app/models/legajo/leg-tesis-ase-jur';
import { LegProduccionCiencia } from 'src/app/models/legajo/leg-produccion-ciencia';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constante } from 'src/app/models/general/constante';
@Component({
  selector: 'app-produccioncienciainvestigacion',
  templateUrl: './produccioncienciainvestigacion.component.html',
  styleUrls: ['./produccioncienciainvestigacion.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class ProduccioncienciainvestigacionComponent implements OnInit {

  public regProduccion: LegProduccionCiencia
  public lstInstitucion: Persona[] = []
  filterInst: any
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFecha: any;
  fileData: any;
  previewUrl: any = "./.assets/images/certdefault.jpg"
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Persona[]>;

  public fecha_minima: any;

  constructor(
    public dialogRef: MatDialogRef<ProduccioncienciainvestigacionComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: { title: 'Grados y títulos', id: 0, formacion: LegProduccionCiencia, Leg_cPerCodigo: string },
  ) {
    this.dialogRef.disableClose = true;
    this.today = new Date();
    this.dateFecha = new FormControl(new Date(''));
    this.regProduccion = this.clmdserv.empty_produccionciencia()
    this.FormGroup = this._formBuilder.group({
      tipoControl: ['', Validators.required],
      tituloControl: ['', Validators.required],
      nroResolucionControl: ['', Validators.required],
      paisControl: ['', Validators.required],
      participacionControl: ['', Validators.required] // 🚩 Asegúrate que exista aquí
    });
  }


  ngOnInit(): void {
    this.listar_tipoprod();
    this.listar_archivos();

    this.fecha_minima = new Date(new Date().getFullYear() - 5, new Date().getMonth(), new Date().getDate());

    if (this.data.id > 0 && this.data.formacion.nLegProdCodigo > 0) {
      this.regProduccion = this.data.formacion;

      // Usamos patchValue con un pequeño delay para que los combos tengan tiempo de renderizar
      setTimeout(() => {
        this.FormGroup.patchValue({
          tipoControl: this.data.formacion.nValorTipo, // Usa el código del valor
          tituloControl: this.data.formacion.cLegProdTitulo,
          nroResolucionControl: this.data.formacion.cLegProdNroResolucion,
          paisControl: this.data.formacion.nLegProdPais,
          participacionControl: this.data.formacion.nLegProdParticipacion // 🚩 TE FALTABA ESTO
        });
      }, 200);

      this.regProduccion.cFile = this.data.formacion.cLegProdArchivo;
      this.erradjunto = !!this.data.formacion.cLegProdArchivo;
      this.dateFecha = new FormControl(new Date(this.data.formacion.dLegProdFecha));
    }
  }

  listar_tipoprod() {
    this.lstserv.listado('interface', '/' + this.configserv.nConTipoPublicaInv).then((data) => {
      let ltipo: Interface[] = data;
      this.lstserv.lTipoProd = ltipo.filter(x => x.nIntCodigo != 0)
    })
  }

  listar_archivos() {
    this.lstserv.listado('legarchivos_lst', '/' + this.data.Leg_cPerCodigo).then((data) => {
      this.lstserv.lArchivos = data;
    })
  }

  fileProgress(fileInput: any): void {
    if (fileInput != null) {
      this.regProduccion.cLegProdArchivo = <File>fileInput.target.files[0];
      this.preview()
    } else {
      this.regProduccion.cLegProdArchivo = null
      this.erradjunto = false
    }

  }

  preview(): void {
    // Show preview
    const mimeType = this.regProduccion.cLegProdArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regProduccion.cLegProdArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regProduccion.cLegProdArchivo);
    reader.onload = (_event) => {
      this.regProduccion.cFile = reader.result;
    }
  }

  customerOnChange($obj: any, tipo: number) {
  if ($obj == null) {
    switch (tipo) {
      case 1: this.regProduccion.nLegProdTipo = 0; this.regProduccion.nValorTipo = 0; this.regProduccion.vTipo = this.clmdserv.empty_interface(); break;
      case 2: this.regProduccion.nLegProdParticipacion = 0; break; // Si fuera numérico
      case 3: this.regProduccion.nLegProdPais = 0; this.regProduccion.vPais = this.clmdserv.empty_interface(); break; // 🚩 PAIS
    }
  } else {
    switch (tipo) {
      case 1: this.regProduccion.nLegProdTipo = $obj.nIntClase; this.regProduccion.nValorTipo = $obj.nIntCodigo; this.regProduccion.vTipo = $obj; break;
      case 2: this.regProduccion.nLegProdParticipacion = $obj; break; 
      case 3: this.regProduccion.nLegProdPais = $obj.nIntCodigo; this.regProduccion.vPais = $obj; break; // 🚩 PAIS
    }
  }
}

  guardar($e: any) {
    if ($e) {
        $e.preventDefault(); // Evita cualquier acción automática del navegador
        $e.stopPropagation(); // Evita que el evento suba a otros elementos
    }
    // --- Validaciones tempranas (early return) ---
    if (!this.esFormularioValido()) return;

    // --- Flujo principal ---
    if (this.data.id > 0) {
      const formData = this.construirFormData();
      this.guardarConArchivo(formData);
    } else {
      this.agregarProduccionLocal();
    }

    // this.configserv.onNoClickDialog(this.dialogRef);
  }

  // ─── Validaciones ────────────────────────────────────────────────────────────

  private esFormularioValido(): boolean {
    if (this.FormGroup.status === 'INVALID') {
      this.valserv.mensaje_info('Complete los campos solicitados.');
      return false;
    }

    if (this.dateFecha.status === 'INVALID') {
      this.valserv.mensaje_info('Ingrese fecha válida.');
      return false;
    }

    if (this.archivoYaExiste()) {
      this.valserv.mensaje_info('Existe un archivo con el mismo nombre. Carge otro archivo por favor.');
      return false;
    }

    return true;
  }

  private archivoYaExiste(): boolean {
    const nombreArchivo = this.regProduccion.cLegProdArchivo?.name;
    return this.lstserv.lArchivos.some(
      (archivo) => archivo.cLegArcNombre === nombreArchivo
    );
  }

  // ─── Construcción de FormData ────────────────────────────────────────────────

  private construirFormData(): FormData {
    const formData = new FormData();
    const fecha = this.configserv.datepipe.transform(this.dateFecha.value, 'yyyy-MM-dd');

    formData.append('nLegProdCodigo', this.regProduccion.nLegProdCodigo?.toString() ?? '0');
    formData.append('cLegProdNroResolucion', this.FormGroup.get('nroResolucionControl')?.value ?? '');
    formData.append('cLegProdTitulo', this.FormGroup.get('tituloControl')?.value ?? '');
    formData.append('nLegProdTipo', this.regProduccion.nLegProdTipo?.toString() ?? '0');
    formData.append('nValorTipo', this.regProduccion.nValorTipo?.toString() ?? '0');
    formData.append('nLegProdPais', this.FormGroup.get('paisControl')?.value?.toString() ?? '0');
    formData.append('nLegProdParticipacion', this.FormGroup.get('participacionControl')?.value?.toString() ?? '0');
    formData.append('dLegProdFecha', fecha ?? '');
    formData.append('cLegProdArchivo', '');
    formData.append('cLegProdValida', 'false');
    formData.append('cLegProdEstado', 'true');

    const archivoEsNuevo = this.regProduccion.cLegProdArchivo !== this.regProduccion.cFile;
    if (archivoEsNuevo) {
      formData.append('cFile', this.regProduccion.cLegProdArchivo);
    }

    return formData;
  }

  // ─── Lógica de guardado ───────────────────────────────────────────────────────

  private guardarConArchivo(formData: FormData): void {
    const esNuevoRegistro = this.regProduccion.nLegProdCodigo === 0;

    if (esNuevoRegistro && this.regProduccion.cFile == null) {
      this.valserv.mensaje_info('Adjunte archivo que valide la información registrada.');
      return;
    }

    if (esNuevoRegistro) {
      this.crearProduccion(formData);
    } else {
      this.actualizarProduccion(formData);
    }
  }

 private crearProduccion(formData: FormData): void {
  this.regserv
    .registroFile('Registro de Legajos', `produccionciencia/${this.data.id}`, formData)
    .then((data) => {
      if (data) {
        this.registrarArchivo();
        this.lstserv.listar_produccionciencia(this.data.id);
        // Cierra el diálogo solo cuando los datos ya se enviaron
        this.dialogRef.close(); 
      }
    });
}

  private actualizarProduccion(formData: FormData): void {
    this.regserv
      .actualizarFile('Registro de Legajos', `produccionciencia/put/${this.regProduccion.nLegProdCodigo}`, formData)
      .then((data) => {
        if (data) this.registrarArchivo();
        this.lstserv.listar_produccionciencia(this.data.id);
      });
  }

  private registrarArchivo(): void {
    const formData = new FormData();
    formData.append('cPerCodigo', this.data.Leg_cPerCodigo);
    formData.append('cLegArcNombre', this.regProduccion.cLegProdArchivo.name);
    formData.append('nLegArcTipo', '5');

    this.regserv.registroFile('Registro de LegArchivos', 'legarchivos/', formData);
  }

  // ─── Flujo sin id (solo local) ────────────────────────────────────────────────

  private agregarProduccionLocal(): void {
    if (this.regProduccion.cFile == null) {
      this.valserv.mensaje_info('Adjunte archivo que valide la información registrada.');
      return;
    }

    this.regProduccion.dLegProdFecha = this.dateFecha.value;
    this.regProduccion.cLegProdNroResolucion = this.FormGroup.get('nroResolucionControl')?.value;
    this.regProduccion.cLegProdTitulo = this.FormGroup.get('tituloControl')?.value;
    this.regProduccion.nLegProdParticipacion = this.FormGroup.get('participacionControl')?.value;
    this.lstserv.lProduccionCiencia.push(this.regProduccion);
  }

  // guardar($e: any) {

  //   let flag = 0;

  //   for (let i = 0; i < this.lstserv.lArchivos.length; i++) {
  //     if (this.lstserv.lArchivos[i].cLegArcNombre == this.regProduccion.cLegProdArchivo.name) {
  //       flag++;
  //     }
  //   }

  //   if (this.FormGroup.status.valueOf() == "INVALID") {
  //     this.valserv.mensaje_info("Complete los campos solicitados.");
  //     return;
  //   } else if (this.dateFecha.status.valueOf() == 'INVALID') {
  //     this.valserv.mensaje_info("Ingrese fecha válida.");
  //     return;
  //   }
  //   else if (flag > 0) {
  //     this.valserv.mensaje_info("Existe un archivo con el mismo nombre. Carge otro archivo por favor.");
  //     return;
  //   }
  //   if (this.data.id > 0) {
  //     var formData = new FormData();
  //     let fecha: any
  //     formData.append('nLegProdCodigo', this.regProduccion.nLegProdCodigo.toString() ?? '0')
  //     formData.append('cLegProdNroResolucion', this.FormGroup.get('nroResolucionControl')?.value ?? '')
  //     formData.append('cLegProdTitulo', this.FormGroup.get('tituloControl')?.value ?? '')
  //     formData.append('nLegProdTipo', this.regProduccion.nLegProdTipo.toString() ?? '0')
  //     formData.append('nValorTipo', this.regProduccion.nValorTipo.toString() ?? '0')
  //     fecha = this.configserv.datepipe.transform(this.dateFecha.value, "yyyy-MM-dd")
  //     formData.append('dLegProdFecha', fecha)
  //     if (this.regProduccion.cLegProdArchivo != this.regProduccion.cFile) {
  //       formData.append('cFile', this.regProduccion.cLegProdArchivo)
  //     }
  //     formData.append('cLegProdArchivo', '')
  //     formData.append('cLegProdValida', 'false')
  //     formData.append('cLegProdEstado', 'true')
  //     if (this.regProduccion.nLegProdCodigo == 0) {
  //       if (this.regProduccion.cFile == null) {
  //         this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
  //         return;
  //       }
  //       this.regserv.registroFile('Registro de Legajos', 'produccionciencia/' + this.data.id, formData).then((data) => {
  //         if (data) {
  //           var formData_archivos = new FormData();
  //           formData_archivos.append('cPerCodigo', this.data.Leg_cPerCodigo)
  //           formData_archivos.append('cLegArcNombre', this.regProduccion.cLegProdArchivo.name)
  //           formData_archivos.append('nLegArcTipo', '5')

  //           this.regserv.registroFile('Registro de LegArchivos', 'legarchivos/', formData_archivos).then((data) => {
  //           })
  //         }
  //         this.lstserv.listar_produccionciencia(this.data.id)
  //       })
  //     } else {
  //       this.regserv.actualizarFile('Registro de Legajos', 'produccionciencia/put/' + this.regProduccion.nLegProdCodigo, formData).then((data) => {
  //         if (data) {
  //           var formData_archivos = new FormData();
  //           formData_archivos.append('cPerCodigo', this.data.Leg_cPerCodigo)
  //           formData_archivos.append('cLegArcNombre', this.regProduccion.cLegProdArchivo.name)
  //           formData_archivos.append('nLegArcTipo', '5')

  //           this.regserv.registroFile('Registro de LegArchivos', 'legarchivos/', formData_archivos).then
  //             ((data) => {
  //             })
  //         }
  //         this.lstserv.listar_produccionciencia(this.data.id)
  //       })
  //     }
  //   } else {
  //     if (this.regProduccion.cFile == null) {
  //       this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.")
  //       return;
  //     }
  //     this.regProduccion.dLegProdFecha = this.dateFecha.value
  //     this.regProduccion.cLegProdNroResolucion = this.FormGroup.get('nroResolucionControl')?.value
  //     this.regProduccion.cLegProdTitulo = this.FormGroup.get('tituloControl')?.value
  //     this.lstserv.lProduccionCiencia.push(this.regProduccion)
  //   }
  //   this.configserv.onNoClickDialog(this.dialogRef);
  // }
}
