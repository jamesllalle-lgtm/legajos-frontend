import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from './components/home/login/login.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { HeaderComponent } from './template/header/header.component';
import { MenuComponent } from './template/menu/menu.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RecaptchaModule } from "ng-recaptcha";
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from './template/button/button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TitlemoduleComponent } from './template/titlemodule/titlemodule.component';
import { UsuariopermisoComponent } from './components/seguridad/usuariopermiso/usuariopermiso.component';
import { MensajeComponent } from './components/controles/mensaje/mensaje.component';
import { CambiarpassComponent } from './template/cambiarpass/cambiarpass.component';
import { DecimalesDirective } from './directives/decimales.directive';
import { LetrasDirective } from './directives/letras.directive';
import { CryptService } from './services/crypt.service';
import axios from 'axios';
import { LegajoComponent } from './components/legajo/legajo/legajo.component';
import { NumerosDirective } from './directives/numeros.directive';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormacionComponent } from './components/legajo/formacion/formacion.component';

// EBS - 01/2026 ---------------------->
import { LicenciaProfesionalComponent } from './components/legajo/licenciaprofesional/licenciaprofesional.component';
import { MembresiaComponent } from './components/legajo/membresia/membresia.component';
// EBS - 01/2026 <----------------------

import { ExperienciadocenteComponent } from './components/legajo/experienciadocente/experienciadocente.component';
import { CategoriadocenteComponent } from './components/legajo/categoriadocente/categoriadocente.component';
import { DedicacionComponent } from './components/legajo/dedicacion/dedicacion.component';
import { ExperiencianodocenteComponent } from './components/legajo/experiencianodocente/experiencianodocente.component';
import { IdiomaofimaticaComponent } from './components/legajo/idiomaofimatica/idiomaofimatica.component';
import { DocenteinvestigadorComponent } from './components/legajo/docenteinvestigador/docenteinvestigador.component';
import { AsesorjuradotesisComponent } from './components/legajo/asesorjuradotesis/asesorjuradotesis.component';
import { ProduccioncienciainvestigacionComponent } from './components/legajo/produccioncienciainvestigacion/produccioncienciainvestigacion.component';
import { ParticipacioncongresosComponent } from './components/legajo/participacioncongresos/participacioncongresos.component';
import { CargaadministrativaComponent } from './components/legajo/cargaadministrativa/cargaadministrativa.component';
import { ReconocimientosComponent } from './components/legajo/reconocimientos/reconocimientos.component';
import { CapacitacionesComponent } from './components/legajo/capacitaciones/capacitaciones.component';
import { ProyeccionsocialComponent } from './components/legajo/proyeccionsocial/proyeccionsocial.component';
import { EvaluacionpsicologicaComponent } from './components/evaluacionpsicologica/evaluacionpsicologica.component';
import { CallbackidofPipe } from './pipe/callbackidof.pipe';
import { NgxSpinnerModule } from "ngx-spinner";
import { PrevimageComponent } from './components/controles/previmage/previmage.component';
import { PrevdatosComponent } from './components/legajo/prevdatos/prevdatos.component';
import { UppercaseDirective } from './directives/uppercase.directive';
import { CapinternaComponent } from './components/legajo/capinterna/capinterna.component';
import { ContratoComponent } from './components/legajo/contrato/contrato.component';
import { CapacitacionussComponent } from './components/general/capacitacionuss/capacitacionuss.component';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MensajelegajoComponent } from './components/legajo/legajo/mensajelegajo/mensajelegajo.component';
import { SecurePipe } from './pipe/secure.pipe';
import { AuthInterceptorInterceptor } from './interceptors/auth-interceptor.interceptor';
import { LetrasnumerosDirective } from './directives/letrasnumeros.directive';
import { NumerotelefonoDirective } from './directives/numerotelefono.directive';
import { RepCapacitacionesComponent } from './components/reportes/rep-capacitaciones/rep-capacitaciones.component';
import { ResolucionComponent } from './components/legajo/resolucion/resolucion.component';
import { EvaluaciondesempComponent } from './components/legajo/evaluaciondesemp/evaluaciondesemp.component';
import { SeleccionComponent } from './components/legajo/seleccion/seleccion.component';
import { OrdinarizacionComponent } from './components/legajo/ordinarizacion/ordinarizacion.component';
import { DeclaracionjuradaComponent } from './components/legajo/declaracionjurada/declaracionjurada.component';
import { DocumentacioninternaComponent } from './components/legajo/documentacioninterna/documentacioninterna.component';
import { RepLegajosComponent } from './components/reportes/rep-legajos/rep-legajos.component';
import { DcapacitacionesComponent } from './components/legajo/dcapacitaciones/dcapacitaciones.component';
import { DgeneralComponent } from './components/legajo/dgeneral/dgeneral.component';
import { DinvestigacionComponent } from './components/legajo/dinvestigacion/dinvestigacion.component';
import { RepEvaluaciondComponent } from './components/reportes/rep-evaluaciond/rep-evaluaciond.component';
import { RepCapacinvesComponent } from './components/reportes/rep-capacinves/rep-capacinves.component';
import { RepRankinguniComponent } from './components/reportes/rep-rankinguni/rep-rankinguni.component';
import { CargamasivaComponent } from './components/legajo/cargamasiva/cargamasiva.component';
import { RolloginComponent } from './components/home/rollogin/rollogin.component';
import { ModaldeclaracionjuradaComponent } from './components/home/modaldeclaracionjurada/modaldeclaracionjurada.component';
import { ModalExpartarLegajoComponent } from './components/legajo/modal-expartar-legajo/modal-expartar-legajo.component';
import { ProcesoConvocatoriaComponent } from './components/legajo/proceso-convocatoria/proceso-convocatoria.component';
import { CargaMasivaCapacitacionesComponent } from './components/legajo/carga-masiva-capacitaciones/carga-masiva-capacitaciones.component';
import { GrupoInvestigacionSemilleroComponent } from './components/legajo/grupo-investigacion-semillero/grupo-investigacion-semillero.component';
import { ModalUsuarioSinPermisoComponent } from './components/legajo/modal/modal-usuario-sin-permiso/modal-usuario-sin-permiso.component';
import { AccionesComponent } from './components/seguridad/acciones/acciones.component';

// import { CookieService } from 'ngx-cookie-service';
// import { MatMomentDateModule } from "@angular/material-moment-adapter";

@NgModule({
  declarations: [
    // ComponentesPropios
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    MenuComponent,
    ButtonComponent,
    TitlemoduleComponent,
    UsuariopermisoComponent,
    MensajeComponent,
    CambiarpassComponent,
    DecimalesDirective,
    LetrasDirective,
    LegajoComponent,
    NumerosDirective,
    FormacionComponent,

    // EBS - 01/2026 ---------->
    LicenciaProfesionalComponent,
    MembresiaComponent,
    // EBS - 01/2026 <----------

    ExperienciadocenteComponent,
    CategoriadocenteComponent,
    DedicacionComponent,
    ExperiencianodocenteComponent,
    IdiomaofimaticaComponent,
    DocenteinvestigadorComponent,
    AsesorjuradotesisComponent,
    ProduccioncienciainvestigacionComponent,
    ParticipacioncongresosComponent,
    CargaadministrativaComponent,
    ReconocimientosComponent,
    CapacitacionesComponent,
    ProyeccionsocialComponent,
    EvaluacionpsicologicaComponent,
    CallbackidofPipe,
    PrevimageComponent,
    PrevdatosComponent,
    UppercaseDirective,
    CapinternaComponent,
    ContratoComponent,
    CapacitacionussComponent,
    MensajelegajoComponent,
    SecurePipe,
    LetrasnumerosDirective,
    NumerotelefonoDirective,
    RepCapacitacionesComponent,
    ResolucionComponent,
    EvaluaciondesempComponent,
    SeleccionComponent,
    OrdinarizacionComponent,
    DeclaracionjuradaComponent,
    DocumentacioninternaComponent,
    RepLegajosComponent,
    DcapacitacionesComponent,
    DgeneralComponent,
    DinvestigacionComponent,
    RepEvaluaciondComponent,
    RepCapacinvesComponent,
    RepRankinguniComponent,
    CargamasivaComponent,
    RolloginComponent,
    ModaldeclaracionjuradaComponent,
    ModalExpartarLegajoComponent,
    ProcesoConvocatoriaComponent,
    CargaMasivaCapacitacionesComponent,
    GrupoInvestigacionSemilleroComponent,
    ModalUsuarioSinPermisoComponent,
    AccionesComponent,


    // ComponentesAngular

  ],
  // entryComponents: [
  //   RegistroComponent,
  // ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    MatMenuModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    RecaptchaModule,
    MatPaginatorModule,
    HttpClientModule,
    MaterialFileInputModule,
    MatTabsModule,
    MatStepperModule,
    MatButtonModule,
    NgxSpinnerModule,
    MatBottomSheetModule,
    MatSelectFilterModule
    //  MatMomentDateModule,
  ],
  providers: [{
    provide: MatDialogRef,
    useValue: []
  },
  {
    provide: MAT_DIALOG_DATA,
    useValue: []
  }, { provide: MAT_DATE_LOCALE, useValue: 'es-GB' }, CryptService,
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true },
  [
    { provide: MatBottomSheetRef, useValue: {} },
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
  ]
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
