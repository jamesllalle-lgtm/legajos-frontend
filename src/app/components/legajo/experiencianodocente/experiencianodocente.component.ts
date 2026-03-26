import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { ListService } from 'src/app/services/list.service';
import { RegisterService } from 'src/app/services/register.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/helpers/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Persona } from 'src/app/models/general/persona';
import { CleanmodelService } from 'src/app/services/cleanmodel.service';
import { LegProfesNoDocente } from 'src/app/models/legajo/leg-profes-no-docente';
import { ValidateService } from 'src/app/services/validate.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Constante } from 'src/app/models/general/constante';

@Component({
  selector: 'app-experiencianodocente',
  templateUrl: './experiencianodocente.component.html',
  styleUrls: ['./experiencianodocente.component.sass'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class ExperiencianodocenteComponent implements OnInit {
  public regProfNoDoc: LegProfesNoDocente;
  public lstInstitucion: Persona[] = [];
  public filteredOptions!: Observable<Persona[]>;
  public today: Date = new Date();
  public erradjunto = false;
  myControl = new FormControl();
  public FormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ExperiencianodocenteComponent>,
    public configserv: ConfiguracionService,
    public regserv: RegisterService,
    public lstserv: ListService,
    public clmdserv: CleanmodelService,
    public valserv: ValidateService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.regProfNoDoc = this.clmdserv.empty_profesnodocente();
    this.FormGroup = this.fb.group({
      universidadControl: [''],
      categoriaControl: ['', Validators.required],
      cargoProfControl: ['', Validators.required],
      otraControl: [''],
      dateFecIni: [null, Validators.required],
      dateFecFin: [null],
      DesccargoProfControl: ['', Validators.required],
      archivoControl: [null]
    });
  }

  ngOnInit(): void {
  // Solo disparamos la carga de la lista
  this.listar_categoriadoc();
  
  // Si es un registro nuevo, inicializamos el país en nulo
  if (!(this.data.id > 0 && this.data.formacion?.nLegProCodigo > 0)) {
    this.universidadOnChange(null);
  }
}

listar_categoriadoc(){
    this.lstserv.listado('constante', '/'+ this.configserv.nConDedicacion).then((data)=>{
       let lcategdoc: Constante[] = data;
       this.lstserv.lCategoriaDoc = lcategdoc.filter(x=>x.nConValor != 0);

       // 🚩 AGREGAMOS ESTO: Ahora que la lista existe, disparamos la carga de datos
       if (this.data.id > 0 && this.data.formacion?.nLegProCodigo > 0) {
         this.cargarEdicion();
       }
    })
}

cargarEdicion() {
    this.regProfNoDoc = { ...this.data.formacion };

    // 1. Carga del País e Instituciones
    if (this.data.formacion.cLegProPais) {
      const vpais = this.lstserv.lubigeo.find(
        x => x.cIntJerarquia.trim() === this.data.formacion.cLegProPais.trim()
      );
      if (vpais) {
        this.universidadOnChange(vpais);
        this.FormGroup.get('universidadControl')?.setValue(vpais.nIntCodigo);
      }
    }

    // 2. Institución en el Autocomplete
    this.myControl.setValue(this.data.formacion.cLegProInstitucionNavigation);

    // 3. Carga de los controles del formulario
    // Usamos patchValue con un pequeño delay para asegurar que el mat-select está listo
    setTimeout(() => {
      this.FormGroup.patchValue({
        categoriaControl: Number(this.data.formacion.nValorCargo),
        cargoProfControl: this.data.formacion.cLegProCargoProf,
        otraControl: this.data.formacion.cLegProOtraInst,
        DesccargoProfControl: this.data.formacion.cLegDescCargo,
        dateFecIni: this.data.formacion.dLegProFechaInicio ? new Date(this.data.formacion.dLegProFechaInicio) : null
      });

      // Fecha Fin
      const fechaFin = this.data.formacion.dLegProFechaFin;
      if (fechaFin && !fechaFin.toString().startsWith('0001')) {
        this.FormGroup.get('dateFecFin')?.setValue(new Date(fechaFin));
      }
    }, 150);

    this.erradjunto = !!this.data.formacion.cLegProArchivo;
}

  universidadOnChange(obj: any) {
    this.myControl.setValue('');
    this.lstInstitucion = [];

    if (!obj) return;

    // Usamos trim() para evitar errores por espacios en blanco en la BD
    const codigoPais = obj.cIntJerarquia.trim();
    this.regProfNoDoc.cLegProPais = codigoPais;

    if (this.lstserv.lUniversidad && this.lstserv.lUniversidad.length > 0) {
      this.lstInstitucion = this.lstserv.lUniversidad.filter(x => {
        const ubigeoInst = (x.cUbigeoCodigo || '').trim();

        if (codigoPais === 'PER') {
          // En producción esto suele ser > 3 porque son códigos de provincias/distritos
          // Asegúrate que en local tus datos sigan esa misma regla
          return ubigeoInst.startsWith('01') || ubigeoInst.length > 3;
        } else {
          return ubigeoInst === codigoPais;
        }
      });
    }

    // Agregar la opción "OTRA INSTITUCIÓN" (el empty_persona)
    this.lstInstitucion.push(this.clmdserv.empty_persona());

    // Notificar al autocomplete que la data cambió
    this.cargardata();
  }

  cargardata() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.cPerNombre),
      map(name => name ? this.lstInstitucion.filter(x => x.cPerNombre.toLowerCase().includes(name.toLowerCase())).slice(0, 100) : this.lstInstitucion.slice(0, 100))
    );
  }

  displayFn(inst: Persona): string {
    return inst?.cPerNombre ?? '';
  }

customerOnChange(obj: any, tipo: number) {
  if (tipo === 1 && obj) {
    this.regProfNoDoc.cLegProInstitucion = obj.cPerCodigo;
    this.regProfNoDoc.cLegProInstitucionNavigation = obj;
  }
  
  if (tipo === 2 && obj) {
    // Esto asegura que se guarde 4022 en Cargo y 1 (o el que sea) en Valor
    this.regProfNoDoc.nLegProCargo = obj.nConCodigo; 
    this.regProfNoDoc.nValorCargo = obj.nConValor;
    this.regProfNoDoc.vCargo = obj;
  }
}

  fileProgress(fileInput: any) {
    const file = fileInput?.target?.files[0];
    if (!file) return;
    const mime = file.type;
    if (!mime.match(/image\/|pdf/)) {
      this.valserv.mensaje_info('Formato no válido.');
      return;
    }
    this.erradjunto = true;
    this.regProfNoDoc.cLegProArchivo = file;
  }

  guardar($e?: any) {
    if (this.FormGroup.invalid) {
      this.valserv.mensaje_info('Complete los campos obligatorios.');
      return;
    }

    // 1️⃣ Mapeo de campos del formulario al modelo (Sincronización)
    this.regProfNoDoc.cLegProCargoProf = this.FormGroup.get('cargoProfControl')?.value ?? '';
    this.regProfNoDoc.cLegDescCargo = this.FormGroup.get('DesccargoProfControl')?.value ?? '';

    // Capturamos el valor del select "Tipo" para que no se pierda al editar
    const valorCategoria = this.FormGroup.get('categoriaControl')?.value;
    this.regProfNoDoc.nLegProCargo = valorCategoria;
    this.regProfNoDoc.nValorCargo = valorCategoria;

    this.regProfNoDoc.dLegProFechaInicio = this.FormGroup.get('dateFecIni')?.value;
    this.regProfNoDoc.dLegProFechaFin = this.FormGroup.get('dateFecFin')?.value;
    this.regProfNoDoc.cLegProOtraInst = this.FormGroup.get('otraControl')?.value ?? '';

    if (this.data.id > 0) {
      const formData = new FormData();

      // 2️⃣ Preparación del FormData para el envío al API
      formData.append('nLegProCodigo', this.regProfNoDoc.nLegProCodigo.toString());
      formData.append('cLegProCargoProf', (this.regProfNoDoc.cLegProCargoProf ?? "").toString());
      formData.append('cLegDescCargo', (this.regProfNoDoc.cLegDescCargo ?? "").toString());

      // Enviamos los valores de categoría capturados del select
      formData.append('nLegProCargo', (this.regProfNoDoc.nLegProCargo ?? 0).toString());
      formData.append('nValorCargo', (this.regProfNoDoc.nValorCargo ?? 0).toString());

      formData.append('cLegProInstitucion', (this.regProfNoDoc.cLegProInstitucion ?? "").toString());
      formData.append('cLegProOtraInst', (this.regProfNoDoc.cLegProOtraInst ?? "").toString());
      formData.append('cLegProPais', (this.regProfNoDoc.cLegProPais ?? "").toString());

      // 3️⃣ Formateo de fechas
      const fIni = this.configserv.datepipe.transform(this.regProfNoDoc.dLegProFechaInicio, "yyyy-MM-dd");
      const fFin = this.configserv.datepipe.transform(this.regProfNoDoc.dLegProFechaFin, "yyyy-MM-dd");
      formData.append('dLegProFechaInicio', fIni ?? "");
      formData.append('dLegProFechaFin', fFin ?? "");

      // 4️⃣ Manejo del archivo adjunto
      if (this.regProfNoDoc.cLegProArchivo != this.regProfNoDoc.cFile) {
        formData.append('cFile', this.regProfNoDoc.cLegProArchivo);
      }

      // 5️⃣ Ejecución de servicios (Registro o Actualización)
      if (this.regProfNoDoc.nLegProCodigo == 0) {
        this.regserv.registroFile('Registro de Legajos', 'experiencianodoc/' + this.data.id, formData).then(() => {
          this.lstserv.listar_experiencianodocente(this.data.id);
        });
      } else {
        this.regserv.actualizarFile('Registro de Legajos', 'experiencianodoc/put/' + this.regProfNoDoc.nLegProCodigo, formData).then(() => {
          this.lstserv.listar_experiencianodocente(this.data.id);
        });
      }
    } else {
      // Escenario de guardado local (Lista temporal)
      if (this.regProfNoDoc.cLegProArchivo == null) {
        this.valserv.mensaje_info("Adjunte archivo que valide la información registrada.");
        return;
      }
      this.lstserv.lProfesNoDocente.push(this.regProfNoDoc);
    }

    // Cerrar el diálogo después de guardar
    this.configserv.onNoClickDialog(this.dialogRef);
  }
}