import { Injectable } from '@angular/core';
import { ValidateService } from './validate.service';
import Swal from 'sweetalert2';
import axios from "axios";
import { environment } from "./../../environments/environment";
import { HeaderautorizaService } from './headerautoriza.service';
import { ListService } from './list.service';
import { ConfiguracionService } from './configuracion.service';
import { DatosUsuario } from '../models/usuario';
import { SeguridadService } from './seguridad.service';
import { SesionService } from './sesion.service';
import { Curriculo } from '../models/curriculo';
import { Formacion } from '../models/formacion';
import { Institucion } from '../models/institucion';
import { GradoAcademico } from '../models/gradoacademico';
import { CarreraProfesional } from '../models/carreraprofesional';
import { Ubigeo } from '../models/ubigeo';
import { async } from '@angular/core/testing';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  public curriculo_reg: Curriculo = this.empty_curriculo()

  empty_curriculo(): Curriculo {
    return {
      nCurId: 0,
      cCurDni: '',
      cCurApellidPaterno: '',
      cCurApellidMaterno: '',
      cCurNombres: '',
      dCurFechaNacimiento: new Date(''),
      cCurEmail: '',
      cCurMovil: '',
      cCurTelefono: '',
      cCurFoto: null,
      cCurAcerca: '',
      nCarId: 0,
      nGacId: 0,
      cUbiId: '',
      nEstado: true,
      lFormacion: [],
      gradoAcademico: this.empty_gradoacademico(),
      ubigeo: this.empty_ubigeo(),
      carreraProfesional: this.empty_carreraprofesional()
    }
  }

  empty_formacion(): Formacion {
    return {
      nForId: 0,
      dForFechaObtencion: new Date(''),
      nForInstitucionId: 0,
      institucion: this.empty_institucion(),
      nForCarreraProfesionalId: 0,
      carreraProfesional: this.empty_carreraprofesional(),
      nForGradoAcademicoId: 0,
      gradoAcademico: this.empty_gradoacademico(),
      fForDiploma: null,
      cForDiplomaUrl: '',
    }
  }

  empty_institucion(): Institucion {
    return {
      nInsId: 0,
      cInsNombre: '',
      cInsAcronimo: '',
      cInsFundacion: 0,
      cInsSede: '',
    }
  }

  empty_gradoacademico(): GradoAcademico {
    return {
      id: 0,
      cGacNombre: ''
    }
  }

  empty_carreraprofesional(): CarreraProfesional {
    return {
      nCarId: 0,
      cCarNombre: '',
    }
  }

  empty_ubigeo(): Ubigeo {
    return {
      id: '',
      cUbiDepartamento: '',
      cUbiProvincia: '',
      cUbiDistrito: ''
    }
  }

  empty_usuario(): DatosUsuario {
    return {
      cPerCodigo: '',
      cPerApellido: '',
      cPerNombre: '',
      cPerUsuCodigo: '',
      cPerEmail: '',
      cPerTipoDoc: '',
      cPerNroDoc: '',
      nTipo: 0,
      cTipoDesc: '',
      cCargo: '',
      nRol: 1,
      cToken: '',
      bLegajo: false,
      //declaracionjuradaflag: false,
    }
  }



  constructor(public valserv: ValidateService,
    public hautserv: HeaderautorizaService,
    public listserv: ListService,
    public configservc: ConfiguracionService,
    public sserv: SesionService) { }

  public registro = async ($title: string, $route: string, $request: any) => {

    let $dataret: boolean = true;
    await axios.post(environment.URLAPI + $route, $request
    )
      .then((response) => {
        if (response.data.cstate) {
          $dataret = true;
          Swal.fire($title, response.data.cmessage, response.data.ncode == 200 ? "success" : "info");
        } else {
          this.valserv.validaban = false
          this.valserv.validatext = response.data.mensaje;
          $dataret = false;
        }
      })
      .catch((error) => {
        $dataret = false;
        this.valserv.validaban = false
        this.valserv.validatext = error;
      });
    this.valserv.cerrarmensaje()
    return $dataret;
  }

 public registroFile = async ($title: string, $route: string, $request: any, showAlert: boolean = true) => {
    let $dataret: boolean = true;
    await axios.post(environment.URLAPI + $route, $request
      , {
        headers: {
          'Authorization': 'Bearer ' + this.sserv.gettoken(sessionStorage.getItem('token') ?? "").toString(),
          'Content-Type': 'multipart/form-data',
        }
      }
    )
      .then((response) => {
        
        if (response.data.cstate) {
          $dataret = true;
          if (showAlert) {  // 🔹 Si showAlert es true, muestra el mensaje
            // 🚩 CAMBIO AQUÍ: Formato de objeto para agregar heightAuto
            Swal.fire({
              title: $title,
              text: response.data.cmessage,
              icon: response.data.ncode == 200 ? "success" : "info",
              heightAuto: false // <--- ESTO EVITA QUE LA PANTALLA SALTE
            });
          }
        } else {
          this.valserv.validaban = false
          this.valserv.validatext = response.data.cmessage;
          $dataret = false;
        }
      })
      .catch((error) => {
        $dataret = false;
        this.valserv.validaban = false
        this.valserv.validatext = error;
        // console.log(error);
      });
    this.valserv.cerrarmensaje()
    return $dataret;
  }

  public actualizar = async ($title: string, $route: string, $request: any) => {

    let $dataret: boolean = true;
    $request.token = this.sserv.gettoken.toString()
    await axios.post(environment.URLAPI + $route, $request, {
      headers: {
        'Authorization': 'Bearer ' + this.sserv.gettoken(sessionStorage.getItem('token') ?? "").toString()
      }
    })
      .then((response) => {
        if (response.data.estado) {
          $dataret = true;
          Swal.fire($title, response.data.mensaje, response.data.codigo == 1 ? "success" : "info");
        } else {
          this.valserv.validaban = false
          this.valserv.validatext = response.data.mensaje;
          $dataret = false;
        }
      })
      .catch((error) => {
        $dataret = false;
        this.valserv.validaban = false
        this.valserv.validatext = error;
        console.log(error);
      });
    this.valserv.cerrarmensaje()
    return $dataret;
  }

  public actualizarcampo = async ($title: string, $route: string, $request: any) => {

    let $dataret: boolean = true;
    $request.token = this.sserv.gettoken.toString()
    await axios.patch(environment.URLAPI + $route, $request, {
      headers: {
        'Authorization': 'Bearer ' + this.sserv.gettoken(sessionStorage.getItem('token') ?? "").toString()
      }
    })
      .then((response) => {

        if (response.data.cstate) {
          $dataret = true;
          Swal.fire({
            title: $title,
            text: response.data.cmessage,
            icon: response.data.ncode == 200 ? "success" : "info",
            heightAuto: false
          });
        } else {

          this.valserv.validaban = false
          this.valserv.validatext = response.data.cmessage;
          $dataret = false;
        }
      })
      .catch((error) => {
        $dataret = false;
        this.valserv.validaban = false
        this.valserv.validatext = error;
        console.log(error);
      });
    this.valserv.cerrarmensaje()
    return $dataret;
  }

  public actualizarFile = async ($title: string, $route: string, $request: any, showAlert: boolean = true) => {

    let $dataret: boolean = true;
    // $request.token = this.sserv.gettoken.toString()
    await axios.post(environment.URLAPI + $route, $request, {
      headers: {
        'Authorization': 'Bearer ' + this.sserv.gettoken(sessionStorage.getItem('token') ?? "").toString()
      }
    })
      .then((response) => {
        // console.log(response.data)
        if (response.data.cstate) {
          $dataret = true;
          if (showAlert) {  // 🔹 Si showAlert es true, muestra el mensaje
            Swal.fire($title, response.data.cmessage, response.data.ncode == 200 ? "success" : "info");
          }
        } else {
          this.valserv.validaban = false
          this.valserv.validatext = response.data.cmessage;
          $dataret = false;
        }
      })
      .catch((error) => {
        $dataret = false;
        this.valserv.validaban = false
        this.valserv.validatext = error;
        console.log(error);
      });
    this.valserv.cerrarmensaje()
    return $dataret;
  }
  
  public registarCargaMasiva = async ($title: string, $route: string, $request: any) => {

    let $dataret: boolean = true;
    // $request.token = this.sserv.gettoken.toString()
    await axios.patch(environment.URLAPI + $route, $request, {
      headers: {
        'Authorization': 'Bearer ' + this.sserv.gettoken(sessionStorage.getItem('token') ?? "").toString(),
        'Content-Type': 'multipart/form-data',
      }
    })
      .then((response) => {
        // console.log(response.data)
        if (response.data.cstate) {
          $dataret = true;
          Swal.fire($title, response.data.cmessage, response.data.ncode == 200 ? "success" : "info");
        } else {
          this.valserv.validaban = false
          this.valserv.validatext = response.data.cmessage;
          $dataret = false;
        }
      })
      .catch((error) => {
        $dataret = false;
        this.valserv.validaban = false
        this.valserv.validatext = error;
        console.log(error);
      });
    this.valserv.cerrarmensaje()
    return $dataret;
  }

  public ActualizarDatos = async ($title: string, $route: string, $request: any) => {
    let $dataret: boolean = true;
    await axios.post(environment.URLAPI + $route, $request, {
      headers: {
        'Authorization': 'Bearer ' + this.sserv.gettoken(sessionStorage.getItem('token') ?? "").toString()
      }
    })
      .then((response) => {
        // console.log(response.data)
        if (response.data.cstate) {
          $dataret = true;
          Swal.fire($title, response.data.cmessage, response.data.ncode == 200 ? "success" : "info");
        } else {
          this.valserv.validaban = false
          this.valserv.validatext = response.data.cmessage;
          $dataret = false;
        }
      })
      .catch((error) => {
        $dataret = false;
        this.valserv.validaban = false
        this.valserv.validatext = error;
        console.log(error);
      });
    this.valserv.cerrarmensaje()
    return $dataret;
  }

  // Eliminación de documentos - EBS 11/2025   ------------>
  public eliminarDocumento = async ($title: string, $route: string, $request: any): Promise<boolean> => {
  let $dataret: boolean = true;
  await axios.post(environment.URLAPI + $route, $request, {
    headers: {
      'Authorization': 'Bearer ' + this.sserv.gettoken(sessionStorage.getItem('token') ?? "").toString()
    }
  })
    .then((response) => {
      if (response.data.cstate) {
        $dataret = true;
        Swal.fire($title, response.data.cmessage, response.data.ncode == 200 ? "success" : "info");
      } else {
        this.valserv.validaban = false
        this.valserv.validatext = response.data.cmessage;
        $dataret = false;
      }
    })
    .catch((error) => {
      $dataret = false;
      this.valserv.validaban = false
      this.valserv.validatext = error;
      console.error('Error al eliminar documento:', error);
    });
  this.valserv.cerrarmensaje()
  return $dataret;
}
  // Eliminación de documentos - EBS 11/2025   ------------>
}
