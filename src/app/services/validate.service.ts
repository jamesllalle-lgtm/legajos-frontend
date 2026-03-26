import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {
  public validaban: boolean = true;
  public validatext: string = '';
  public validatype: string = 'danger';
  constructor() { }
  cerrarmensaje() {
    setTimeout(() => {
      this.validaban = true;
      this.validatext = '';
    }, 5000);
  }
  validatelogin($usuario: string, $password: string): boolean {
    this.validaban = true;
    if ($usuario.trim() == '' && $password.trim() == '') {
      this.validaban = false;
      this.validatext = 'Ingrese sus credencales';
    } else if ($usuario.trim() == '') {
      this.validaban = false;
      this.validatext = 'Ingrese su usuario';
    } else if ($password.trim() == '') {
      this.validaban = false;
      this.validatext = 'Ingrese su contraseña';
    }
    this.cerrarmensaje()
    return this.validaban;
  }

  validatecategoria($descripcion: string): boolean {
    this.validaban = true;
    if ($descripcion.trim() == '') {
      this.validaban = false;
      this.validatext = 'Ingrese descripción';
    }
    this.cerrarmensaje()
    return this.validaban;
  }

  validatediezmoofrenda($monto: any): boolean {
    this.validaban = true;
    if (parseFloat($monto).toFixed(2) == 0.0.toFixed(2)) {
      this.validaban = false;
      this.validatext = 'El monto aportado debe ser mayor a S/ 0.00';
    }
    this.cerrarmensaje()
    return this.validaban;
  }

  validarcierregrupo($monto: any, $primertestigo: string, $segundotestigo: string, $caja: string): boolean {
    this.validaban = true;
    if ($caja == 'TODOS') {
      this.validaban = false;
      this.validatext = 'Seleccione la caja que corresponde al grupo de recaudación.';
    } else if (parseFloat($monto).toFixed(2) == 0.0.toFixed(2)) {
      this.validaban = false;
      this.validatext = 'El monto del grupo de recaudación debe ser mayor a S/ 0.00, agregue diezmos y ofrendas.';
    } else if ($primertestigo == '' && $segundotestigo == '') {
      this.validaban = false;
      this.validatext = 'Debe seleccionar al menos un testigo.';
    } else if ($primertestigo == $segundotestigo) {
      this.validaban = false;
      this.validatext = 'Los testigos no deben ser la misma persona.';
    } else if ($primertestigo == '' && $segundotestigo != '') {
      this.validaban = false;
      this.validatext = 'El segundo testigo quítelo y seleccione como primer testigo.';
    }
    this.cerrarmensaje()
    return this.validaban;
  }



  validatesubcategoria($descripcion: string, $categoria: string): boolean {
    this.validaban = true;
    if ($categoria.trim() == '') {
      this.validaban = false;
      this.validatext = 'Seleccione categoría';
    } else if ($descripcion.trim() == '') {
      this.validaban = false;
      this.validatext = 'Ingrese descripción';
    }
    this.cerrarmensaje()
    return this.validaban;
  }

  mensaje_info($txt: string) {
    this.validaban = false;
    this.validatype = "danger"
    this.validatext = $txt
    this.cerrarmensaje()
  }

  mensaje_load($txt: string) {
    this.validaban = false;
    this.validatype = "info"
    this.validatext = $txt
    this.cerrarmensaje()
  }
}
