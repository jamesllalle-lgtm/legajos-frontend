import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { PrevimageComponent } from '../components/controles/previmage/previmage.component';
import { CapacitacionussComponent } from '../components/general/capacitacionuss/capacitacionuss.component';
import { AsesorjuradotesisComponent } from '../components/legajo/asesorjuradotesis/asesorjuradotesis.component';
import { CapacitacionesComponent } from '../components/legajo/capacitaciones/capacitaciones.component';
import { CapinternaComponent } from '../components/legajo/capinterna/capinterna.component';
import { CargaadministrativaComponent } from '../components/legajo/cargaadministrativa/cargaadministrativa.component';
import { CategoriadocenteComponent } from '../components/legajo/categoriadocente/categoriadocente.component';
import { ContratoComponent } from '../components/legajo/contrato/contrato.component';
import { DedicacionComponent } from '../components/legajo/dedicacion/dedicacion.component';
import { DocenteinvestigadorComponent } from '../components/legajo/docenteinvestigador/docenteinvestigador.component';
import { EvaluaciondesempComponent } from '../components/legajo/evaluaciondesemp/evaluaciondesemp.component';
import { ExperienciadocenteComponent } from '../components/legajo/experienciadocente/experienciadocente.component';
import { ExperiencianodocenteComponent } from '../components/legajo/experiencianodocente/experiencianodocente.component';
import { FormacionComponent } from '../components/legajo/formacion/formacion.component';
import { IdiomaofimaticaComponent } from '../components/legajo/idiomaofimatica/idiomaofimatica.component';
import { OrdinarizacionComponent } from '../components/legajo/ordinarizacion/ordinarizacion.component';
import { ParticipacioncongresosComponent } from '../components/legajo/participacioncongresos/participacioncongresos.component';
import { PrevdatosComponent } from '../components/legajo/prevdatos/prevdatos.component';
import { ProduccioncienciainvestigacionComponent } from '../components/legajo/produccioncienciainvestigacion/produccioncienciainvestigacion.component';
import { ProyeccionsocialComponent } from '../components/legajo/proyeccionsocial/proyeccionsocial.component';
import { ReconocimientosComponent } from '../components/legajo/reconocimientos/reconocimientos.component';
import { ResolucionComponent } from '../components/legajo/resolucion/resolucion.component';
import { SeleccionComponent } from '../components/legajo/seleccion/seleccion.component';
import { CapacitacionesUss } from '../models/general/capacitaciones-uss';
import { LegAdminitrativaCarga } from '../models/legajo/leg-adminitrativa-carga';
import { LegCapacitacionInterna } from '../models/legajo/leg-capacitacion-interna';
import { LegCapacitaciones } from '../models/legajo/leg-capacitaciones';
import { LegCategoriaDocente } from '../models/legajo/leg-categoria-docente';
import { LegContrato } from '../models/legajo/leg-contrato';
import { LegDatosGenerales } from '../models/legajo/leg-datos-generales';
import { LegDocenciaUniv } from '../models/legajo/leg-docencia-univ';
import { LegEvaluacionDesemp } from '../models/legajo/leg-eval-desempeño';
import { LegGradoTitulo } from '../models/legajo/leg-grado-titulo';
import { LegIdiomaOfimatica } from '../models/legajo/leg-idioma-ofimatica';
import { LegInvestigador } from '../models/legajo/leg-investigador';
import { LegOrdinarizacion } from '../models/legajo/leg-ordinarizacion';
import { LegParticipacionCongSem } from '../models/legajo/leg-participacion-cong-sem';
import { LegProduccionCiencia } from '../models/legajo/leg-produccion-ciencia';
import { LegProfesNoDocente } from '../models/legajo/leg-profes-no-docente';
import { LegProyeccionSocial } from '../models/legajo/leg-proyeccion-social';
import { LegReconocimiento } from '../models/legajo/leg-reconocimiento';
import { LegRegimenDedicacion } from '../models/legajo/leg-regimen-dedicacion';
import { LegDocumentacionInterna } from '../models/legajo/leg-documentacion-interna';
import { LegResolucion } from '../models/legajo/leg-resolucion';
import { LegSeleccion } from '../models/legajo/leg-seleccion';
import { LegTesisAseJur } from '../models/legajo/leg-tesis-ase-jur';
import { ConfiguracionService } from './configuracion.service';
import { ValidateService } from './validate.service';
import { DocumentacioninternaComponent } from '../components/legajo/documentacioninterna/documentacioninterna.component';
import { Leg_Grup_Inv_Sem } from '../models/legajo/leg_grup_inv_sem';
import { GrupoInvestigacionSemilleroComponent } from '../components/legajo/grupo-investigacion-semillero/grupo-investigacion-semillero.component';


// EBS - 01/2026 ----------------->
import { LegLicenciaProfesional } from '../models/legajo/leg-licencia-profesional';
import { LegMembresia } from '../models/legajo/leg-membresia';

import { LicenciaProfesionalComponent } from '../components/legajo/licenciaprofesional/licenciaprofesional.component';
import { MembresiaComponent } from '../components/legajo/membresia/membresia.component';
// EBS - 01/2026 <-----------------

@Injectable({
  providedIn: 'root'
})
export class NewmodalService {

  constructor(
    public dialog: MatDialog,
    public configserv: ConfiguracionService,
    public valserv: ValidateService
  ) { }

  nuevoModalGradoTitulo($title: String, $id: number, $obj: LegGradoTitulo) {
    const dialogRef = this.dialog.open(FormacionComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  // EBS - 01/2026 ----------------------->
  nuevoModalLicenciaProfesional($title: String, $id: number, $obj: LegLicenciaProfesional) {
    const dialogRef = this.dialog.open(LicenciaProfesionalComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalMembresia($title: String, $id: number, $obj: LegMembresia) {
    const dialogRef = this.dialog.open(MembresiaComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  // EBS - 01/2026 <-----------------------

  nuevoModalExperienciaDoc($title: String, $id: number, $obj: LegDocenciaUniv) {
    const dialogRef = this.dialog.open(ExperienciadocenteComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalCategoriaDOc($title: String, $id: number, $obj: LegCategoriaDocente) {
    const dialogRef = this.dialog.open(CategoriadocenteComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  nuevoModalRegimenDed($title: String, $id: number, $obj: LegRegimenDedicacion) {
    const dialogRef = this.dialog.open(DedicacionComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  nuevoModalProfsNoDocenete($title: String, $id: number, $obj: LegProfesNoDocente, $docente: boolean) {

    const dialogRef = this.dialog.open(ExperiencianodocenteComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj, docente: $docente },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  nuevoModalIdiomaOfimatica($title: String, $id: number, $tipo: boolean, $obj: LegIdiomaOfimatica) {
    const dialogRef = this.dialog.open(IdiomaofimaticaComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, tipo: $tipo, formacion: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  nuevoModalIvestigador($title: String, $id: number, $obj: LegInvestigador, $cPerCodigo: string) {
    const dialogRef = this.dialog.open(DocenteinvestigadorComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj, Leg_cPerCodigo: $cPerCodigo },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalPrevImage($img: any) {
    if ($img.toString().trim() == environment.CERTDEFAULT || $img.toString().trim() == environment.FIRMADEFAULT || $img.toString().trim() == environment.PHOTODEFAULT) {
      this.valserv.mensaje_info("No se puede visualizar porque no se adjuntó documento.");
      return;
    }
    const dialogRef = this.dialog.open(PrevimageComponent, {
      width: '480px',
      panelClass: 'divmodalimg',
      data: { img: $img },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalTesisAsesJur($title: String, $id: number, $obj: LegTesisAseJur, $cPerCodigo: string) {
    const dialogRef = this.dialog.open(AsesorjuradotesisComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj, Leg_cPerCodigo: $cPerCodigo },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  nuevoModalProduccionCiencia($title: String, $id: number, $obj: LegProduccionCiencia, $cPerCodigo: string) {
    const dialogRef = this.dialog.open(ProduccioncienciainvestigacionComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj, Leg_cPerCodigo: $cPerCodigo },
      restoreFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  nuevoModalParticipacion($title: String, $id: number, $obj: LegParticipacionCongSem, $cPerCodigo: string) {
    const dialogRef = this.dialog.open(ParticipacioncongresosComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj, Leg_cPerCodigo: $cPerCodigo },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  nuevoModalCargaAdmin($title: String, $id: number, $obj: LegAdminitrativaCarga) {
    const dialogRef = this.dialog.open(CargaadministrativaComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  nuevoModalReconocimiento($title: String, $id: number, $obj: LegReconocimiento) {
    const dialogRef = this.dialog.open(ReconocimientosComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  nuevoModalCapacitaciones($title: String, $id: number, $obj: LegCapacitaciones, $docente: boolean, $cPerCodigo: string) {
    const dialogRef = this.dialog.open(CapacitacionesComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj, docente: $docente, Leg_cPerCodigo: $cPerCodigo },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  nuevoModalProyeccionSoc($title: String, $id: number, $obj: LegProyeccionSocial) {
    const dialogRef = this.dialog.open(ProyeccionsocialComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, formacion: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalDatosGenerales($title: String, $obj: LegDatosGenerales) {
    const dialogRef = this.dialog.open(PrevdatosComponent, {
      width: '700px',
      panelClass: 'divmodal',
      data: { title: $title, obj: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  nuevoModalCapacitacionInterna($title: String, $id: number, $obj: LegCapacitacionInterna) {
    const dialogRef = this.dialog.open(CapinternaComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, obj: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalContrato($title: String, $id: number, $obj: LegContrato) {
    const dialogRef = this.dialog.open(ContratoComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, obj: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalResolucion($title: String, $id: number, $obj: LegResolucion) {
    const dialogRef = this.dialog.open(ResolucionComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, obj: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalEvaluacionDesem($title: String, $id: number, $obj: LegEvaluacionDesemp, $admin: boolean) {
    const dialogRef = this.dialog.open(EvaluaciondesempComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, obj: $obj, admin: $admin },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalSeleccion($title: String, $id: number, $obj: LegSeleccion) {
    const dialogRef = this.dialog.open(SeleccionComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, obj: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalOrdinarizacion($title: String, $id: number, $obj: LegOrdinarizacion) {
    const dialogRef = this.dialog.open(OrdinarizacionComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, obj: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalDocumentacionInterna($title: String, $id: number, $obj: LegDocumentacionInterna) {
    const dialogRef = this.dialog.open(DocumentacioninternaComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, obj: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalCapacitacionUSS($title: String, $obj: CapacitacionesUss) {
    const dialogRef = this.dialog.open(CapacitacionussComponent, {
      width: '450px',
      panelClass: 'divmodal',
      data: { title: $title, obj: $obj },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  nuevoModalGrupoInvestigacion($title: String, $id: number, $obj: Leg_Grup_Inv_Sem, $cPerCodigo: string) {
    const dialogRef = this.dialog.open(GrupoInvestigacionSemilleroComponent, {
      width: '30%',
      panelClass: 'divmodal',
      data: { title: $title, id: $id, datos: $obj, Leg_cPerCodigo: $cPerCodigo },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  openpdf(url: string) {
    console.log(url)
    window.open(
      url
      ,
      "_blank"
    );
  }
}
