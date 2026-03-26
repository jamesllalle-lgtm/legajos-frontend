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
import { Constante } from 'src/app/models/general/constante';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-experienciadocente',
  templateUrl: './experienciadocente.component.html',
  styleUrls: ['./experienciadocente.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class ExperienciadocenteComponent implements OnInit {
  public regExperinciaDoc: LegDocenciaUniv
  public lstInstitucion: Persona[] = []
  filterInst: any
  today: Date | undefined;
  public FormGroup: FormGroup;
  dateFecIni: any;
  dateFecFin: any;
  fileData: any;
  previewUrl: any = "./.assets/images/certdefault.jpg"
  erradjunto: boolean = false
  myControl = new FormControl();
  filteredOptions!: Observable<Persona[]>;
  constructor(
    public dialogRef: MatDialogRef<ExperienciadocenteComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: { title: 'Grados y títulos', id: 0, formacion: LegDocenciaUniv },
  ) {
    this.today = new Date();
    this.dateFecIni = new FormControl(new Date(''));
    this.dateFecFin = new FormControl(new Date(''));
    this.regExperinciaDoc = this.clmdserv.empty_docenciauniv()
    this.FormGroup = this._formBuilder.group({
      universidadControl: ['', Validators.required],
      dedicacionControl: ['', Validators.required],
      categoriaControl: ['', Validators.required],
      cargoControl: ['', Validators.required],
      otraControl: [''],
    })
  }


  ngOnInit(): void {
    this.listar_categoriadoc()
    this.listar_regimendedic()
    let paisuniv: number = 0;
    let vpais: Interface = this.clmdserv.empty_interface()

    if (this.data.id > 0 && this.data.formacion.nLegDocCodigo > 0) {
      this.regExperinciaDoc = this.data.formacion
      vpais = this.lstserv.lubigeo.filter(x => x.cIntJerarquia.trim() == this.data.formacion.cLegDocPais)[0]
      paisuniv = vpais.nIntCodigo

      this.universidadOnChange(vpais)

      // CORRECCIÓN AQUÍ: Añadimos cargoControl al objeto de valores iniciales
      this.FormGroup.setValue({
        universidadControl: paisuniv,
        dedicacionControl: this.data.formacion.vRegimen.nConValor,
        categoriaControl: this.data.formacion.vCategoria.nConValor,
        cargoControl: this.data.formacion.cLegDocCargo ?? '', // 🔹 CARGA LA DESCRIPCIÓN
        otraControl: this.data.formacion.cLegDocOtraInst
      })

      if (this.regExperinciaDoc.cLegDocOtraInst.trim() != "") {
        this.regExperinciaDoc.cLegDocUniversidadNavigation = this.clmdserv.empty_persona()
        this.regExperinciaDoc.cLegDocUniversidad = this.clmdserv.codigonoinst
      }

      this.regExperinciaDoc.cFile = this.data.formacion.cLegDocArchivo
      this.erradjunto = this.data.formacion.cLegDocArchivo != null && this.data.formacion.cLegDocArchivo != '' ? true : false
      this.myControl.setValue(this.data.formacion.cLegDocUniversidadNavigation.cPerNombre)
      this.dateFecIni = new FormControl(new Date(this.data.formacion.dLegDocFechaInicio))
      this.dateFecFin = new FormControl(new Date(this.data.formacion.dLegDocFechaFin))
    } else {
      this.universidadOnChange(null)
    }
  }

  listar_institucion($ubig: String) {
    this.lstInstitucion = this.lstserv.lUniversidad.filter(x => x.cUbigeoCodigo == $ubig);
    this.cargardata();
  }

  listar_regimendedic() {
    this.lstserv.listado('constante', '/' + this.configserv.nConDedicacion).then((data) => {
      let lregded: Constante[] = data;
      this.lstserv.lRegimenDed = lregded.filter(x => x.nConValor != 0)
    })
  }

  listar_categoriadoc() {
    this.lstserv.listado('constante', '/' + this.configserv.nConCategoriaDoc).then((data) => {
      let lcategdoc: Constante[] = data;
      this.lstserv.lCategoriaDoc = lcategdoc.filter(x => x.nConValor != 0)
    })
  }



  fileProgress(fileInput: any): void {
    if (fileInput != null) {
      this.regExperinciaDoc.cLegDocArchivo = <File>fileInput.target.files[0];
      this.preview()
    } else {
      this.regExperinciaDoc.cLegDocArchivo = null
      this.erradjunto = false
    }

  }
  preview(): void {
    // Show preview
    const mimeType = this.regExperinciaDoc.cLegDocArchivo.type;
    if (mimeType.match(/image\/*/) == null && mimeType.match(/pdf\/*/) == null) {
      this.regExperinciaDoc.cLegDocArchivo = null;
      this.erradjunto = false
      this.valserv.mensaje_info("Formato no válido. Adjunte archivo(jpg, jpeg, png o pdf).");
      return;
    }
    this.erradjunto = true
    const reader = new FileReader();
    reader.readAsDataURL(this.regExperinciaDoc.cLegDocArchivo);
    reader.onload = (_event) => {
      this.regExperinciaDoc.cFile = reader.result;
    }
  }

  cargardata() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.c),
        map(cPerNombre => cPerNombre ? this._filter(cPerNombre) : this.lstInstitucion.slice(0, 100))
      );
  }


  displayFn(inst: Persona): string {
    return inst && inst.cPerNombre ? inst.cPerNombre : '';
  }

  private _filter(name: string): Persona[] {
    const filterValue = name.toLowerCase();
    return this.lstInstitucion.filter(option => option.cPerNombre.toLowerCase().includes(filterValue)).slice(0, 100);
  }



  handleModelChange(e: any, tipo: number) {
    if (e == '') {
      switch (tipo) {
        case 1: this.regExperinciaDoc.cLegDocUniversidad = ''; break;
      }

    }
  }

  universidadOnChange($obj: any) {
    this.myControl.setValue('')
    if ($obj == null) {
      this.lstInstitucion = []
    } else {
      if ($obj.cIntJerarquia.trim() != 'PER') {
        this.regExperinciaDoc.cLegDocPais = $obj.cIntJerarquia.trim()
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x => x.cUbigeoCodigo.trim() == $obj.cIntJerarquia.trim());
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      } else {
        this.regExperinciaDoc.cLegDocPais = "PER"
        this.lstInstitucion = this.lstserv.lUniversidad.filter(x => x.cUbigeoCodigo.length > 3);
        // this.lstInstitucion.push(this.clmdserv.empty_persona())
        // this.cargardata();
      }
      this.lstInstitucion.push(this.clmdserv.empty_persona())
      this.cargardata();
    }
  }

  customerOnChange($obj: any, tipo: number) {
    if ($obj == null) {
      switch (tipo) {
        case 1:
          this.regExperinciaDoc.cLegDocUniversidad = "";
          this.regExperinciaDoc.cLegDocUniversidadNavigation = this.clmdserv.empty_persona();
          break;
        case 2:
          // ❌ Antes tenías $obj.nConCodigo (siendo null). 
          // ✅ Ahora usamos valores por defecto:
          this.regExperinciaDoc.nLegDocRegimen = 0;
          this.regExperinciaDoc.nValorRegimen = 0;
          this.regExperinciaDoc.vRegimen = this.clmdserv.empty_constante();
          break;
        case 3:
          this.regExperinciaDoc.nLegDocCategoria = 0;
          this.regExperinciaDoc.nValorCategoria = 0;
          this.regExperinciaDoc.vCategoria = this.clmdserv.empty_constante();
          break;
      }
    } else {
      switch (tipo) {
        case 1:
          if ($obj.cPerCodigo != this.clmdserv.codigonoinst) {
            this.regExperinciaDoc.cLegDocUniversidad = $obj.cPerCodigo;
            this.regExperinciaDoc.cLegDocUniversidadNavigation = $obj;
          } else {
            this.regExperinciaDoc.cLegDocUniversidad = this.clmdserv.codigonoinst;
            this.regExperinciaDoc.cLegDocUniversidadNavigation = this.clmdserv.empty_persona();
          }
          break;
        case 2:
          this.regExperinciaDoc.nLegDocRegimen = $obj.nConCodigo;
          this.regExperinciaDoc.nValorRegimen = $obj.nConValor;
          this.regExperinciaDoc.vRegimen = $obj;
          break;
        case 3:
          this.regExperinciaDoc.nLegDocCategoria = $obj.nConCodigo;
          this.regExperinciaDoc.nValorCategoria = $obj.nConValor;
          this.regExperinciaDoc.vCategoria = $obj;
          break;
      }
    }
  }

  guardar($e: any) {
    if (this.FormGroup.status.valueOf() == "INVALID") {
      this.valserv.mensaje_info("Complete los campos solicitados.");
      return;
    } else if (this.regExperinciaDoc.cLegDocUniversidad.trim() == '') {
      this.valserv.mensaje_info("Seleccione institución.");
      return;
    } else if (this.dateFecIni.status.valueOf() == 'INVALID') {
      this.valserv.mensaje_info("Ingrese fecha de inicio válida.");
      return;
    }

    if (this.dateFecFin.value != 'Invalid Date' && this.dateFecFin.value != null) {
      if (this.dateFecIni.value > this.dateFecFin.value) {
        this.valserv.mensaje_info("La fecha inicio no puede ser posterior a la fecha fin.");
        return;
      }
    } else {
      this.dateFecFin = new FormControl(new Date(this.clmdserv.fechahoradefault));
    }

    // 🔹 ASIGNACIÓN CRUCIAL: Pasamos el texto del formulario al objeto del modelo
    this.regExperinciaDoc.cLegDocCargo = this.FormGroup.get('cargoControl')?.value ?? '';

    if (this.data.id > 0) {
      var formData = new FormData();
      let fecha: any;

      formData.append('nLegDocCodigo', this.regExperinciaDoc.nLegDocCodigo.toString() ?? '0');
      formData.append('nLegDocRegimen', this.regExperinciaDoc.nLegDocRegimen.toString() ?? '0');
      formData.append('nValorRegimen', this.regExperinciaDoc.nValorRegimen.toString() ?? '0');
      formData.append('nLegDocCategoria', this.regExperinciaDoc.nLegDocCategoria.toString() ?? '0');
      formData.append('nValorCategoria', this.regExperinciaDoc.nValorCategoria.toString() ?? '0');

      // 🔹 ENVIAR AL BACKEND: Agregamos el campo nuevo al FormData
      formData.append('cLegDocCargo', this.regExperinciaDoc.cLegDocCargo);

      formData.append('cLegDocUniversidad', this.regExperinciaDoc.cLegDocUniversidad == this.clmdserv.codigonoinst ? "" : this.regExperinciaDoc.cLegDocUniversidad.toString() ?? '');
      formData.append('cLegDocPais', this.regExperinciaDoc.cLegDocPais.toString() ?? '');
      formData.append('cLegDocOtraInst', this.regExperinciaDoc.cLegDocUniversidad != this.clmdserv.codigonoinst ? "" : this.FormGroup.get('otraControl')?.value ?? '');

      fecha = this.configserv.datepipe.transform(this.dateFecIni.value, "yyyy-MM-dd");
      formData.append('dLegDocFechaInicio', fecha);
      fecha = this.configserv.datepipe.transform(this.dateFecFin.value, "yyyy-MM-dd");
      formData.append('dLegDocFechaFin', fecha);

      if (this.regExperinciaDoc.cLegDocArchivo != this.regExperinciaDoc.cFile) {
        formData.append('cFile', this.regExperinciaDoc.cLegDocArchivo);
      }
      formData.append('cLegGraArchivo', '');
      formData.append('cLegDocValida', 'false');
      formData.append('cLegDocEstado', 'true');

      if (this.regExperinciaDoc.nLegDocCodigo == 0) {
        if (this.regExperinciaDoc.cFile == null) {
          this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.");
          return;
        }
        this.regserv.registroFile('Registro de Legajos', 'docenciauniv/' + this.data.id, formData).then((data) => {
          this.lstserv.listar_experienciadocencia(this.data.id);
        });
      } else {
        this.regserv.actualizarFile('Registro de Legajos', 'docenciauniv/put/' + this.regExperinciaDoc.nLegDocCodigo, formData).then((data) => {
          this.lstserv.listar_experienciadocencia(this.data.id);
        });
      }
    } else {
      // 🔹 GUARDADO LOCAL: Para que se vea en la tabla antes de persistir
      if (this.regExperinciaDoc.cFile == null) {
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.");
        return;
      }
      this.regExperinciaDoc.dLegDocFechaInicio = this.dateFecIni.value;
      this.regExperinciaDoc.dLegDocFechaFin = this.dateFecFin.value;

      // Aquí regExperinciaDoc ya lleva el cargo asignado líneas arriba
      this.lstserv.lLegDocenciaUniv.push(this.regExperinciaDoc);
    }
    this.configserv.onNoClickDialog(this.dialogRef);
  }
}
