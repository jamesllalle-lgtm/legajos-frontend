import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { LoginComponent } from './components/home/login/login.component';
import { ButtonComponent } from './template/button/button.component';
import { LegajoComponent } from './components/legajo/legajo/legajo.component';
import { EvaluacionpsicologicaComponent } from './components/evaluacionpsicologica/evaluacionpsicologica.component';
import { RepCapacitacionesComponent } from './components/reportes/rep-capacitaciones/rep-capacitaciones.component';
import { RepLegajosComponent } from './components/reportes/rep-legajos/rep-legajos.component';

import { DgeneralComponent } from './components/legajo/dgeneral/dgeneral.component';
import { DcapacitacionesComponent } from './components/legajo/dcapacitaciones/dcapacitaciones.component';
import { DinvestigacionComponent } from './components/legajo/dinvestigacion/dinvestigacion.component';

import { RepEvaluaciondComponent } from './components/reportes/rep-evaluaciond/rep-evaluaciond.component';
import { RepCapacinvesComponent } from './components/reportes/rep-capacinves/rep-capacinves.component';
import { RepRankinguniComponent } from './components/reportes/rep-rankinguni/rep-rankinguni.component';
import { CargamasivaComponent } from './components/legajo/cargamasiva/cargamasiva.component';
import { RolloginComponent } from './components/home/rollogin/rollogin.component';
import { ProcesoConvocatoriaComponent } from './components/legajo/proceso-convocatoria/proceso-convocatoria.component';
import { CargaMasivaCapacitacionesComponent } from './components/legajo/carga-masiva-capacitaciones/carga-masiva-capacitaciones.component';
import { UsuariopermisoComponent } from './components/seguridad/usuariopermiso/usuariopermiso.component';
import { AccionesComponent } from './components/seguridad/acciones/acciones.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'rolxusuario', component: RolloginComponent },
  { path: '', component: LoginComponent },

  { path: 'legajo', component: LegajoComponent, runGuardsAndResolvers: 'always' },
  { path: 'repcapacitaciones', component: RepCapacitacionesComponent, runGuardsAndResolvers: 'always' },
  { path: 'replegajos', component: RepLegajosComponent, runGuardsAndResolvers: 'always' },

  { path: 'dgeneral', component: DgeneralComponent, runGuardsAndResolvers: 'always' },
  { path: 'dcapacitaciones', component: DcapacitacionesComponent, runGuardsAndResolvers: 'always' },
  { path: 'dinvestigacion', component: DinvestigacionComponent, runGuardsAndResolvers: 'always' },
  { path: 'dcargamasiva', component: CargamasivaComponent, runGuardsAndResolvers: 'always' },
  { path: 'carga_masiva_capacitacion', component: CargaMasivaCapacitacionesComponent, runGuardsAndResolvers: 'always' },

  { path: 'repevaluaciond', component: RepEvaluaciondComponent, runGuardsAndResolvers: 'always' },
  { path: 'repcapacinves', component: RepCapacinvesComponent, runGuardsAndResolvers: 'always' },
  { path: 'reprankinguni', component: RepRankinguniComponent, runGuardsAndResolvers: 'always' },
  { path: 'procesoConvocatoria', component: ProcesoConvocatoriaComponent, runGuardsAndResolvers: 'always' },
  { path: 'dpermisos', component: UsuariopermisoComponent, runGuardsAndResolvers: 'always' },
  { path: 'daccciones', component: AccionesComponent, runGuardsAndResolvers: 'always' },

  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
