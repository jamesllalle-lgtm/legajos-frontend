// ============================================================
//  REEMPLAZA el método guardarTodo() y agrega los métodos
//  privados debajo de él dentro de DgeneralComponent
// ============================================================

  // ─── MÉTODO PRINCIPAL ────────────────────────────────────────
  async guardarTodo() {
    const aceptado = await this.confirmarTerminos();
    if (!aceptado) return;

    if (!this.validarFormulario()) return;

    try {
      this.spinner.show();

      const formData = this.construirFormDataDatosGenerales();
      this.agregarColeccionesAlFormData(formData);

      const dataCV = await this.persistirLegajo(formData);
      const dataDJ = await this.guardarDJ();

      this.mostrarResultadoGuardado(dataCV, dataDJ);
    } catch (e) {
      console.error('Error al guardar:', e);
    } finally {
      this.spinner.hide();
    }
  }

  // ─── PASO 1: Confirmación de términos ────────────────────────
  private async confirmarTerminos(): Promise<boolean> {
    const yaAceptado = this.regLegDatosGenerales.nLegDatAceptaTerminos || false;
    if (yaAceptado) return true;

    const result = await Swal.fire({
      title: 'PROTECCIÓN DE DATOS PERSONALES',
      html: `Al hacer clic en "ENVIAR", aceptas enviar tu información a la UNIVERSIDAD SEÑOR DE SIPAN,
             que usará conforme a la LEY N°29733. Debes aceptar los términos y condiciones para continuar.<br>
             <div id="downloadLink" style="color: blue; text-decoration: underline; cursor: pointer;">
               Leer términos y condiciones
             </div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      heightAuto: false,
      input: 'checkbox',
      inputValue: 0,
      inputPlaceholder: 'Acepto los términos y condiciones',
      inputValidator: (value) => value ? null : 'Debe aceptar los términos y condiciones',
      didOpen: () => {
        const link = Swal.getHtmlContainer()?.querySelector('#downloadLink');
        link?.addEventListener('click', (e) => {
          e.preventDefault();
          this.descargarArchivo('PROTECCION_DE_DATOS_PERSONALES.pdf');
        });
      },
    });

    if (result.isConfirmed && result.value) {
      this.regLegDatosGenerales.nLegDatAceptaTerminos = true;
      return true;
    }

    return false;
  }

  // ─── PASO 2: Validaciones ─────────────────────────────────────
  private validarFormulario(): boolean {
    if (this.FormGroup1.invalid) {
      this.stepper.selectedIndex = 0;
      const campos = this.obtenerCamposInvalidos(this.FormGroup1);
      this.valserv.mensaje_info('Los siguientes campos son obligatorios:\n• ' + campos.join('\n• '));
      return false;
    }

    if (this.date.invalid) {
      this.valserv.mensaje_info('Ingrese una fecha de nacimiento válida.');
      return false;
    }

    if (this.dateCeseControl.invalid) {
      this.valserv.mensaje_info('Ingrese una fecha de Cese válida.');
      return false;
    }

    if (!this.validarDocumentosRequeridos()) return false;
    if (!this.validarColegiatura()) return false;
    if (!this.validarLugarNacimiento()) return false;

    return true;
  }

  private validarDocumentosRequeridos(): boolean {
    const tipo = this.segserv.usuarioreg.nTipo;
    if (tipo !== 1 && tipo !== 2) return true;

    const dj = this.lstserv.LegDeclaracionJurada;
    const reg = this.regLegDatosGenerales;

    if (!dj.cLegDjanexo1 && reg.nValorAfiliado === 2) {
      this.valserv.mensaje_info('Adjunte archivo de Anexo 1.\nEn: Documentos para Contratación -> Documentos para Subir');
      return false;
    }
    if (!dj.cLegDjNumCta && reg.nValorHaberes === 1) {
      this.valserv.mensaje_info('Adjunte archivo de Nº de Cuenta (voucher o captura).\nEn: Documentos para Contratación -> Documentos para Subir');
      return false;
    }
    if (!dj.cLegDjConsJubilacion && reg.nValorAfiliado === 3) {
      this.valserv.mensaje_info('Adjunte archivo de Constancia de Jubilación.\nEn: Documentos para Contratación -> Documentos para Subir');
      return false;
    }
    if (!dj.cLegDjConsAfiliacionOnpAfp && reg.nValorAfiliado === 1) {
      this.valserv.mensaje_info('Adjunte archivo de Constancia de Afiliación de ONP o AFP.\nEn: Documento para Contratación -> Documentos para Subir');
      return false;
    }

    return true;
  }

  private validarColegiatura(): boolean {
    this.regLegDatosGenerales.cLegDatColegioProf ??= '';
    if (!this.regLegDatosGenerales.cLegDatColegioProf) return true;

    if (!this.FormGroup2.get('colegionroControl')?.value || this.regLegDatosGenerales.nLegDatCondicionColeg?.toString() === '0') {
      this.stepper.selectedIndex = 2;
      this.valserv.mensaje_info('Complete los datos de colegiatura.');
      return false;
    }
    if (this.dateFEmi.invalid) {
      this.valserv.mensaje_info('Ingrese fecha de emisión válida.');
      return false;
    }
    if (this.dateFExp.invalid) {
      this.valserv.mensaje_info('Ingrese fecha de expiración válida.');
      return false;
    }
    if (this.dateFEmi.value > this.dateFExp.value) {
      this.valserv.mensaje_info('Fecha de emisión no puede ser posterior a fecha de expiración.');
      return false;
    }

    return true;
  }

  private validarLugarNacimiento(): boolean {
    const reg = this.regLegDatosGenerales;
    const esPropioCodigo = reg.cPerCodigo.toString() === this.segserv.usuarioreg.cPerCodigo;

    if (reg.nLegDatCodigo > 0 && esPropioCodigo) {
      if (!reg.nLetDatNacimiento || reg.nLetDatNacimiento === 0) {
        this.stepper.selectedIndex = 0;
        this.valserv.mensaje_info('Seleccione lugar de nacimiento.');
        return false;
      }
    }

    return true;
  }

  // ─── PASO 3a: FormData — datos generales ─────────────────────
  private construirFormDataDatosGenerales(): FormData {
    const formData = new FormData();
    const reg = this.regLegDatosGenerales;
    const fecha = this.configserv.datepipe.transform(new Date());
    const fechanac = this.configserv.datepipe.transform(reg.dLegDatFechaNacimiento, 'yyyy-MM-dd');
    const fg1 = this.FormGroup1;

    // Identificación
    formData.append('cPerCodigo',              reg.cPerCodigo.toString());
    formData.append('nLegDatCodigo',           reg.nLegDatCodigo.toString() ?? '');
    formData.append('nLegDatTipoDoc',          reg.nLegDatTipoDoc.toString() ?? '');
    formData.append('nClaseTipoDoc',           reg.nClaseTipoDoc.toString() ?? '');
    formData.append('cLegDatNroDoc',           fg1.get('nrodocumentoControl')?.value);
    formData.append('cLegDatApellidoPaterno',  fg1.get('apellidopaternoControl')?.value);
    formData.append('cLegDatApellidoMaterno',  fg1.get('apellidomaternoControl')?.value);
    formData.append('cLegDatNombres',          fg1.get('nombresControl')?.value);
    formData.append('dLegDatFechaNacimiento',  fechanac);
    formData.append('nLegDatSexo',             reg.nLegDatSexo.toString() ?? '');
    formData.append('nClaseSexo',              reg.nClaseSexo.toString() ?? '');
    formData.append('nLegDatEstadoCivil',      reg.nLegDatEstadoCivil.toString() ?? '');
    formData.append('nClaseEstadoCivil',       reg.nClaseEstadoCivil.toString() ?? '');
    formData.append('declaracionjuradaflag',   reg.declaracionjuradaflag.toString() ?? '');

    // Datos pensionarios y cuenta haberes
    formData.append('nLegDatRegPenAfiliado',        reg.nLegDatRegPenAfiliado?.toString() ?? '');
    formData.append('nValorAfiliado',               reg.nValorAfiliado?.toString() ?? '');
    formData.append('nLegDatRegPenEntidad',         reg.nLegDatRegPenEntidad?.toString() ?? '');
    formData.append('nValorEntidad',                reg.nValorEntidad?.toString() ?? '');
    formData.append('nLegDatCtaHabHaberes',         reg.nLegDatCtaHabHaberes?.toString() ?? '');
    formData.append('nValorHaberes',                reg.nValorHaberes?.toString() ?? '');
    formData.append('nLegDatCtaHabBanco',           reg.nLegDatCtaHabBanco?.toString() ?? '');
    formData.append('nValorBanco',                  reg.nValorBanco?.toString() ?? '');
    formData.append('nLegDatCtaHabBancoAperturar',  reg.nLegDatCtaHabBancoAperturar?.toString() ?? '');
    formData.append('nValorBancoAperturar',         reg.nValorBancoAperturar?.toString() ?? '');
    formData.append('cLegDatCtaHabNumCta',          fg1.get('numCuentaControl')?.value ?? '');
    formData.append('cLegDatCtaHabNumCtaCci',       fg1.get('numCuentaCciControl')?.value ?? '');

    // Grado académico e institución
    formData.append('cLegDatMencionEnMayGradAcad',      fg1.get('mencionEnMayGradAcadControl')?.value ?? '');
    formData.append('cLegDatInstitucionMayGradAcad',    reg.cLegDatInstitucionMayGradAcad ?? '');
    formData.append('nLegDatAceptaTerminos',            (reg.nLegDatAceptaTerminos ?? true).toString());

    // Archivos / firma
    formData.append('cFileFirma', this.fileDataCert);
    this.agregarArchivoSiCambio(formData, 'cFileSunedu',    reg.cLegDatSunedu,       reg.cFileSunedu);
    this.agregarArchivoSiCambio(formData, 'cFileBuenaSalud', reg.cLegDatBuenaSalud,  reg.cFileBuenaSalud);
    this.agregarArchivoSiCambio(formData, 'cFilePolicial',  reg.cLegDatPolicial,     reg.cFilePolicial);
    this.agregarArchivoSiCambio(formData, 'cFileJudicial',  reg.cLegDatJudicial,     reg.cFileJudicial);
    this.agregarArchivoSiCambio(formData, 'cFileConadis',   reg.cLegDatArchivoConadis, reg.cFileConadis);

    // Contacto y domicilio
    formData.append('cLegDatFoto',          '');
    formData.append('cLegDatEmail',         fg1.get('emailControl')?.value ?? '');
    formData.append('cLegDatTelefono',      fg1.get('telefonoControl')?.value ?? '');
    formData.append('cLegDatMovil',         fg1.get('movilControl')?.value ?? '');
    formData.append('nLegDatGradoAcad',     reg.nLegDatGradoAcad.toString() ?? '');
    formData.append('nClaseGradoAcad',      reg.nClaseGradoAcad.toString() ?? '');
    formData.append('nLegDatPais',          reg.nLegDatPais.toString() ?? '');
    formData.append('nClasePais',           reg.nClasePais.toString() ?? '');
    formData.append('cLegDatAcerca',        this.EndFormGroup.get('acercaControl')?.value ?? '');
    formData.append('nLegDatTipoDomicilio', reg.nLegDatTipoDomicilio.toString() ?? '');
    formData.append('nValorTipoDomicilio',  reg.nValorTipoDomicilio.toString() ?? '');
    formData.append('nLegDatZona',          reg.nLegDatZona.toString() ?? '');
    formData.append('nValorZona',           reg.nValorZona.toString() ?? '');
    formData.append('cLegDatCalleDomicilio', fg1.get('direccionControl')?.value ?? '');
    formData.append('cLegDatNroDomicilio',  fg1.get('numeroControl')?.value ?? '');
    formData.append('cLegDatMzaDomicilio',  fg1.get('mzaControl')?.value ?? '');
    formData.append('cLegDatLtDomicilio',   fg1.get('lteControl')?.value ?? '');
    formData.append('cLegDatDptoDomicilio', fg1.get('dptoControl')?.value ?? '');
    formData.append('cLegDatReferencia',    fg1.get('referenciaControl')?.value ?? '');
    formData.append('nLetDatUbigeo',        reg.nLetDatUbigeo.toString() ?? '');
    formData.append('nClaseUbigeo',         reg.nClaseUbigeo.toString() ?? '');
    formData.append('nLetDatNacimiento',    reg.nLetDatNacimiento.toString() ?? '');
    formData.append('nClaseNacimiento',     reg.nClaseNacimiento.toString() ?? '');

    // Otros datos
    formData.append('nLegIdiomaNativo',         reg.nLegIdiomaNativo ? reg.nLegIdiomaNativo.toString() : '0');
    formData.append('nLegDatDiscapacidad',      reg.nLegDatDiscapacidad ? reg.nLegDatDiscapacidad.toString() : '');
    formData.append('nLegDatTipoDiscapacidad',  reg.nLegDatTipoDiscapacidad ? reg.nLegDatTipoDiscapacidad.toString() : '');
    formData.append('cLegDatOtraDiscapcidad',   this.FormGroupAD.get('cLegDatOtraDiscapcidad')?.value);
    formData.append('declaracionjuradaflag',    'true');
    formData.append('CLegDatEstado',            'true');
    formData.append('dFechaRegistro',           fecha);
    formData.append('dFechaModifica',           fecha);

    // Colegiatura (solo si aplica)
    if (reg.cLegDatColegioProf) {
      formData.append('dLegDatosFechaEmisionColeg', this.configserv.datepipe.transform(this.dateFEmi.value ?? new Date(), 'yyyy-MM-dd'));
      formData.append('dLegDatosFechaExpiraColeg',  this.configserv.datepipe.transform(this.dateFExp.value ?? new Date(), 'yyyy-MM-dd'));
      formData.append('nLegDatCondicionColeg',      reg.nLegDatCondicionColeg?.toString() ?? '');
      formData.append('nValorCondicionColeg',       reg.nValorCondicionColeg?.toString() ?? '');
      formData.append('cLegDatColegioProf',         reg.cLegDatColegioProf.toString() ?? '');
      formData.append('cLegDatNroColegiatura',      this.FormGroup2.get('colegionroControl')?.value ?? '');
    }

    // Declaración Jurada (solo en nuevo registro)
    if (reg.nLegDatCodigo === 0) {
      this.agregarDeclaracionJuradaAlFormData(formData);
    }

    return formData;
  }

  private agregarArchivoSiCambio(formData: FormData, campo: string, valorActual: any, valorOriginal: any): void {
    if (valorActual !== valorOriginal) {
      formData.append(campo, valorActual);
    }
  }

  private agregarDeclaracionJuradaAlFormData(formData: FormData): void {
    const dj = this.lstserv.LegDeclaracionJurada;
    const pre = 'legDeclaracionJurada[0]';

    formData.append(`${pre}.nLegDjcodigo`,              dj.nLegDjcodigo.toString() ?? '0');
    formData.append(`${pre}.cFileDjanexo1`,             dj.cLegDjanexo1);
    formData.append(`${pre}.cFileDjanexo2_2`,           dj.cLegDjanexo2_2);
    formData.append(`${pre}.cFileDjanexo3`,             dj.cLegDjanexo3);
    formData.append(`${pre}.cFileDjanexo4`,             dj.cLegDjanexo4);
    formData.append(`${pre}.cFileDjanexo5`,             dj.cLegDjanexo5);
    formData.append(`${pre}.cFileDjanexo6_2`,           dj.cLegDjanexo6_2);
    formData.append(`${pre}.cFileDjDNI`,                dj.cLegDjDNI);
    formData.append(`${pre}.cFileDjDNI_DH`,             dj.cLegDjDNI_DH);
    formData.append(`${pre}.cFileDjFotoCarnet`,         dj.cLegDjFotoCarnet);
    formData.append(`${pre}.cFileDjNumCta`,             dj.cLegDjNumCta);
    formData.append(`${pre}.cFileDjConsJubilacion`,     dj.cLegDjConsJubilacion);
    formData.append(`${pre}.cFileDjConsAfiliacionOnpAfp`, dj.cLegDjConsAfiliacionOnpAfp);

    // Rutas vacías (las llena el servidor)
    ['cLegDjanexo1','cLegDjanexo2_2','cLegDjanexo3','cLegDjanexo4','cLegDjanexo5',
     'cLegDjanexo6_2','cLegDjDNI','cLegDjDNI_DH','cLegDjFotoCarnet',
     'cLegDjNumCta','cLegDjConsJubilacion','cLegDjConsAfiliacionOnpAfp'
    ].forEach(campo => formData.append(`${pre}.${campo}`, ''));

    formData.append(`${pre}.bLegDjestado`, 'true');
  }

  // ─── PASO 3b: FormData — colecciones ─────────────────────────
  private agregarColeccionesAlFormData(formData: FormData): void {
    // Solo se envían colecciones en nuevo registro
    if (this.regLegDatosGenerales.nLegDatCodigo !== 0) return;

    this.agregarGradoTitulo(formData);
    this.agregarDocenciaUniv(formData);
    this.agregarCategoriaDocente(formData);
    this.agregarRegimenDedicacion(formData);
    this.agregarProfesNoDocente(formData);
    this.agregarIdiomaOfimatica(formData);
    this.agregarInvestigador(formData);
    this.agregarTesisAseJur(formData);
    this.agregarProduccionCiencia(formData);
    this.agregarParticipacion(formData);
    this.agregarAdminitrativaCarga(formData);
    this.agregarReconocimiento(formData);
    this.agregarCapacitaciones(formData);
    this.agregarProyeccionSocial(formData);
    this.agregarLicenciasProfesionales(formData);
  }

  private agregarGradoTitulo(formData: FormData): void {
    this.lstserv.lLegGradoTitulo.forEach((el: LegGradoTitulo, i) => {
      const pre = `legGradoTitulo[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegGraFecha, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegGraCodigo`,       el.nLegGraCodigo.toString() ?? '0');
      formData.append(`${pre}.nLegGraGradoAcad`,    el.nLegGraGradoAcad.toString() ?? '0');
      formData.append(`${pre}.nClaseGradoAcad`,     el.nClaseGradoAcad.toString() ?? '0');
      formData.append(`${pre}.cLegGraCarreraProf`,  el.cLegGraCarreraProf.toString() ?? '');
      formData.append(`${pre}.cLegGraInstitucion`,  el.cLegGraInstitucion.toString() ?? '0');
      formData.append(`${pre}.cLegGraOtraInst`,     el.cLegGraOtraInst.toString() ?? '0');
      formData.append(`${pre}.nLegGraPais`,         el.nLegGraPais.toString() ?? '0');
      formData.append(`${pre}.nClasePais`,          el.nClasePais.toString() ?? '0');
      formData.append(`${pre}.dLegGraFecha`,        fecha);
      formData.append(`${pre}.cFile`,               el.cLegGraArchivo);
      formData.append(`${pre}.cLegGraArchivo`,      '');
      formData.append(`${pre}.cLegGraValida`,       'false');
      formData.append(`${pre}.cLegGraEstado`,       'true');
    });
  }

  private agregarDocenciaUniv(formData: FormData): void {
    this.lstserv.lLegDocenciaUniv.forEach((el: LegDocenciaUniv, i) => {
      const pre = `legDocenciaUniv[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegDocFechaInicio, 'yyyy-MM-dd');
      const fFin = this.configserv.datepipe.transform(el.dLegDocFechaFin, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegDocCodigo`,      el.nLegDocCodigo.toString() ?? '0');
      formData.append(`${pre}.nLegDocRegimen`,     el.nLegDocRegimen.toString() ?? '0');
      formData.append(`${pre}.nValorRegimen`,      el.nValorRegimen.toString() ?? '0');
      formData.append(`${pre}.nLegDocCategoria`,   el.nLegDocCategoria.toString() ?? '0');
      formData.append(`${pre}.nValorCategoria`,    el.nValorCategoria.toString() ?? '0');
      formData.append(`${pre}.cLegDocUniversidad`, el.cLegDocUniversidad.toString() ?? '');
      formData.append(`${pre}.cLegDocOtraInst`,    el.cLegDocOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegDocPais`,        el.cLegDocPais.toString() ?? '');
      formData.append(`${pre}.dLegDocFechaInicio`, fIni);
      formData.append(`${pre}.dLegDocFechaFin`,    fFin);
      formData.append(`${pre}.cFile`,              el.cLegDocArchivo);
      formData.append(`${pre}.cLegGraArchivo`,     '');
      formData.append(`${pre}.cLegDocValida`,      'false');
      formData.append(`${pre}.cLegDocEstado`,      'true');
    });
  }

  private agregarCategoriaDocente(formData: FormData): void {
    this.lstserv.lCategoriaDocente.forEach((el: LegCategoriaDocente, i) => {
      const pre = `legCategoriaDocente[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegCatFechaInicio, 'yyyy-MM-dd');
      const fFin = this.configserv.datepipe.transform(el.dLegCatFechaFin, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegCatCodigo`,     el.nLegCatCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegCatInstitucion`, el.cLegCatInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegCatOtraInst`,   el.cLegCatOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegCatPais`,       el.cLegCatPais.toString() ?? '');
      formData.append(`${pre}.nLegCatCategoria`,  el.nLegCatCategoria.toString() ?? '0');
      formData.append(`${pre}.nValorCategoria`,   el.nValorCategoria.toString() ?? '0');
      formData.append(`${pre}.dLegCatFechaInicio`, fIni);
      formData.append(`${pre}.dLegCatFechaFin`,   fFin);
      formData.append(`${pre}.cFile`,             el.cLegCatArchivo);
      formData.append(`${pre}.cLegGraArchivo`,    '');
      formData.append(`${pre}.cLegCatValida`,     'false');
      formData.append(`${pre}.cLegCatEstado`,     'true');
    });
  }

  private agregarRegimenDedicacion(formData: FormData): void {
    this.lstserv.lRegimenDedic.forEach((el: LegRegimenDedicacion, i) => {
      const pre = `legRegimenDedicacion[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegRegFechaInicio, 'yyyy-MM-dd');
      const fFin = this.configserv.datepipe.transform(el.dLegRegFechaFin, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegRegCodigo`,      el.nLegRegCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegCatInstitucion`, el.cLegCatInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegRegOtraInst`,    el.cLegRegOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegRegPais`,        el.cLegRegPais.toString() ?? '');
      formData.append(`${pre}.nLegRegDedicacion`,  el.nLegRegDedicacion.toString() ?? '0');
      formData.append(`${pre}.nValorDedicacion`,   el.nValorDedicacion.toString() ?? '0');
      formData.append(`${pre}.dLegRegFechaInicio`, fIni);
      formData.append(`${pre}.dLegRegFechaFin`,    fFin);
      formData.append(`${pre}.cFile`,              el.cLegRegArchivo);
      formData.append(`${pre}.cLegRegArchivo`,     '');
      formData.append(`${pre}.cLegRegValida`,      'false');
      formData.append(`${pre}.cLegRegEstado`,      'true');
    });
  }

  private agregarProfesNoDocente(formData: FormData): void {
    this.lstserv.lProfesNoDocente.forEach((el: LegProfesNoDocente, i) => {
      const pre = `legProfesNoDocente[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegProFechaInicio, 'yyyy-MM-dd');
      const fFin = this.configserv.datepipe.transform(el.dLegProFechaFin, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegProCodigo`,      el.nLegProCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegProInstitucion`, el.cLegProInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegProOtraInst`,    el.cLegProOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegProPais`,        el.cLegProPais.toString() ?? '');
      formData.append(`${pre}.nLegProCargo`,       el.nLegProCargo.toString() ?? '0');
      formData.append(`${pre}.cLegProCargoProf`,   el.cLegProCargoProf.toString() ?? '');
      formData.append(`${pre}.nValorCargo`,        el.nValorCargo.toString() ?? '0');
      formData.append(`${pre}.dLegProFechaInicio`, fIni);
      formData.append(`${pre}.dLegProFechaFin`,    fFin);
      formData.append(`${pre}.cFile`,              el.cLegProArchivo);
      formData.append(`${pre}.cLegProArchivo`,     '');
      formData.append(`${pre}.cLegProValida`,      'false');
      formData.append(`${pre}.cLegProEstado`,      'true');
    });
  }

  private agregarIdiomaOfimatica(formData: FormData): void {
    this.lstserv.lidiomasofimatica.forEach((el: LegIdiomaOfimatica, i) => {
      const pre = `legIdiomaOfimatica[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegIdOfFecha, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegIdOfCodigo`,      el.nLegIdOfCodigo.toString() ?? '0');
      formData.append(`${pre}.nLegIdOfCodigoDesc`,  el.nLegIdOfCodigoDesc.toString() ?? '');
      formData.append(`${pre}.nValorDesc`,          el.nValorDesc.toString() ?? '0');
      formData.append(`${pre}.nLegIdOfNivel`,       el.nLegIdOfNivel.toString() ?? '0');
      formData.append(`${pre}.nValorNivel`,         el.nValorNivel.toString() ?? '0');
      formData.append(`${pre}.cLegIdOfTipo`,        el.cLegIdOfTipo.toString() ?? '');
      formData.append(`${pre}.dLegIdOfFecha`,       fecha);
      formData.append(`${pre}.cFile`,               el.cLegIdOfArchivo);
      formData.append(`${pre}.cLegIdOfArchivo`,     '');
      formData.append(`${pre}.cLegIdOfValida`,      'false');
      formData.append(`${pre}.cLegIdOfEstado`,      'true');
    });
  }

  private agregarInvestigador(formData: FormData): void {
    this.lstserv.linvestigador.forEach((el: LegInvestigador, i) => {
      const pre = `legInvestigador[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegInvFechaInicio, 'yyyy-MM-dd');
      const fFin = this.configserv.datepipe.transform(el.dLegInvFechaFin, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegInvCodigo`,          el.nLegInvCodigo.toString() ?? '0');
      formData.append(`${pre}.nLegInvCentroRegistro`,  el.nLegInvCentroRegistro.toString() ?? '');
      formData.append(`${pre}.nValorCentroRegistro`,   el.nValorCentroRegistro.toString() ?? '0');
      formData.append(`${pre}.cLegInvNroRegistro`,     el.cLegInvNroRegistro.toString() ?? '0');
      formData.append(`${pre}.dLegInvFechaInicio`,     fIni);
      formData.append(`${pre}.dLegInvFechaFin`,        fFin);
      formData.append(`${pre}.cFile`,                  el.cLegInvArchivo);
      formData.append(`${pre}.cLegInvArchivo`,         '');
      formData.append(`${pre}.cLegInvValida`,          'false');
      formData.append(`${pre}.cLegInvEstado`,          'true');
    });
  }

  private agregarTesisAseJur(formData: FormData): void {
    this.lstserv.lTesisAsesJur.forEach((el: LegTesisAseJur, i) => {
      const pre = `legTesisAseJur[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegTesFecha, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegTesCodigo`,       el.nLegTesCodigo.toString() ?? '0');
      formData.append(`${pre}.nLegTesTipo`,         el.nLegTesTipo.toString() ?? '0');
      formData.append(`${pre}.nValorTipo`,          el.nValorTipo.toString() ?? '0');
      formData.append(`${pre}.nLegTesNivel`,        el.nLegTesNivel.toString() ?? '0');
      formData.append(`${pre}.nValorNivel`,         el.nValorNivel.toString() ?? '0');
      formData.append(`${pre}.cLegTesNroResolucion`, el.cLegTesNroResolucion.toString() ?? '');
      formData.append(`legTesis[${i}].cLegTesInstitucion`, el.cLegTesInstitucion.toString() ?? '0');
      formData.append(`legTesis[${i}].cLegTesOtraInst`,    el.cLegTesOtraInst.toString() ?? '0');
      formData.append(`legTesis[${i}].nLegTesPais`,        el.nLegTesPais.toString() ?? '0');
      formData.append(`legTesis[${i}].nClasePais`,         el.nClasePais.toString() ?? '0');
      formData.append(`${pre}.dLegTesFecha`,        fecha);
      formData.append(`${pre}.cFile`,               el.cLegTesArchivo);
      formData.append(`${pre}.cLegTesArchivo`,      '');
      formData.append(`${pre}.cLegTesValida`,       'false');
      formData.append(`${pre}.cLegTesEstado`,       'true');
    });
  }

  private agregarProduccionCiencia(formData: FormData): void {
    this.lstserv.lProduccionCiencia.forEach((el: LegProduccionCiencia, i) => {
      const pre = `legProduccionCiencia[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegProdFecha, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegProdCodigo`,        el.nLegProdCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegProdNroResolucion`, el.cLegProdNroResolucion.toString() ?? '');
      formData.append(`${pre}.cLegProdTitulo`,        el.cLegProdTitulo.toString() ?? '');
      formData.append(`${pre}.nLegProdTipo`,          el.nLegProdTipo.toString() ?? '0');
      formData.append(`${pre}.nValorTipo`,            el.nValorTipo.toString() ?? '0');
      formData.append(`${pre}.dLegProdFecha`,         fecha);
      formData.append(`${pre}.cFile`,                 el.cLegProdArchivo);
      formData.append(`${pre}.cLegProdArchivo`,       '');
      formData.append(`${pre}.cLegProdValida`,        'false');
      formData.append(`${pre}.cLegProdEstado`,        'true');
    });
  }

  private agregarParticipacion(formData: FormData): void {
    this.lstserv.lParticipacion.forEach((el: LegParticipacionCongSem, i) => {
      const pre = `legParticipacionCongSem[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegParFecha, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegParCodigo`,      el.nLegParCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegParInstitucion`, el.cLegParInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegParOtraInst`,    el.cLegParOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegParPais`,        el.cLegParPais.toString() ?? '');
      formData.append(`${pre}.cLegParNombre`,      el.cLegParNombre.toString() ?? '');
      formData.append(`${pre}.nLegParRol`,         el.nLegParRol.toString() ?? '0');
      formData.append(`${pre}.nValorRol`,          el.nValorRol.toString() ?? '0');
      formData.append(`${pre}.nLegParAmbito`,      el.nLegParAmbito.toString() ?? '0');
      formData.append(`${pre}.nValorAmbito`,       el.nValorAmbito.toString() ?? '0');
      formData.append(`${pre}.dLegParFecha`,       fecha);
      formData.append(`${pre}.cFile`,              el.cLegParArchivo);
      formData.append(`${pre}.cLegParArchivo`,     '');
      formData.append(`${pre}.cLegParValida`,      'false');
      formData.append(`${pre}.cLegParEstado`,      'true');
    });
  }

  private agregarAdminitrativaCarga(formData: FormData): void {
    this.lstserv.lAdminitrativaCarga.forEach((el: LegAdminitrativaCarga, i) => {
      const pre = `legAdminitrativaCarga[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegAdmFechaInicio, 'yyyy-MM-dd');
      const fFin = this.configserv.datepipe.transform(el.dLegAdmFechaFin, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegAdmCodigo`,      el.nLegAdmCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegAdmInstitucion`, el.cLegAdmInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegAdmOtraInst`,    el.cLegAdmOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegAdmPais`,        el.cLegAdmPais.toString() ?? '');
      formData.append(`${pre}.cLegAdmDocumento`,   el.cLegAdmDocumento.toString() ?? '');
      formData.append(`${pre}.nLegAdmCargo`,       el.nLegAdmCargo.toString() ?? '0');
      formData.append(`${pre}.nClaseCargo`,        el.nClaseCargo.toString() ?? '0');
      formData.append(`${pre}.dLegAdmFechaInicio`, fIni);
      formData.append(`${pre}.dLegAdmFechaFin`,    fFin);
      formData.append(`${pre}.cFile`,              el.cLegAdmArchivo);
      formData.append(`${pre}.cLegAdmArchivo`,     '');
      formData.append(`${pre}.cLegAdmValida`,      'false');
      formData.append(`${pre}.cLegAdmEstado`,      'true');
    });
  }

  private agregarReconocimiento(formData: FormData): void {
    this.lstserv.lReconocimiento.forEach((el: LegReconocimiento, i) => {
      const pre = `legReconocimiento[${i}]`;
      const fecha = this.configserv.datepipe.transform(el.dLegRecFecha, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegRecCodigo`,      el.nLegRecCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegRecInstitucion`, el.cLegRecInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegRecOtraInst`,    el.cLegRecOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegRecPais`,        el.cLegRecPais.toString() ?? '');
      formData.append(`${pre}.nLegRecDocumento`,   el.nLegRecDocumento.toString() ?? '0');
      formData.append(`${pre}.nValorDocumento`,    el.nValorDocumento.toString() ?? '0');
      formData.append(`${pre}.nLegRecTipo`,        el.nLegRecTipo.toString() ?? '0');
      formData.append(`${pre}.nValorTipo`,         el.nValorTipo.toString() ?? '0');
      formData.append(`${pre}.dLegRecFecha`,       fecha);
      formData.append(`${pre}.cFile`,              el.cLegRecArchivo);
      formData.append(`${pre}.cLegRecArchivo`,     '');
      formData.append(`${pre}.cLegRecValida`,      'false');
      formData.append(`${pre}.cLegRecEstado`,      'true');
    });
  }

  private agregarCapacitaciones(formData: FormData): void {
    this.lstserv.lcapacitaciones.forEach((el: LegCapacitaciones, i) => {
      const pre = `legCapacitaciones[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegCapFechaInicio, 'yyyy-MM-dd');
      const fFin = this.configserv.datepipe.transform(el.dLegCapFechaFin, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegCapCodigo`,      el.nLegCapCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegCapInstitucion`, el.cLegCapInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegCapOtraInst`,    el.cLegCapOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegCapPais`,        el.cLegCapPais.toString() ?? '');
      formData.append(`${pre}.cLegCapNombre`,      el.cLegCapNombre.toString() ?? '');
      formData.append(`${pre}.nLegCapTipo`,        el.nLegCapTipo.toString() ?? '0');
      formData.append(`${pre}.nValorTipo`,         el.nValorTipo.toString() ?? '0');
      formData.append(`${pre}.nLegCapTipoEsp`,     el.nLegCapTipoEsp.toString() ?? '0');
      formData.append(`${pre}.nValorTipoEsp`,      el.nValorTipoEsp.toString() ?? '0');
      formData.append(`${pre}.nLegCapHoras`,       el.nLegCapHoras.toString() ?? '0');
      formData.append(`${pre}.dLegCapFechaInicio`, fIni);
      formData.append(`${pre}.dLegCapFechaFin`,    fFin);
      formData.append(`${pre}.cFile`,              el.cLegCapArchivo);
      formData.append(`${pre}.cLegCapArchivo`,     '');
      formData.append(`${pre}.cLegCapValida`,      'false');
      formData.append(`${pre}.cLegCapEstado`,      'true');
    });
  }

  private agregarProyeccionSocial(formData: FormData): void {
    this.lstserv.lProyeccionSoc.forEach((el: LegProyeccionSocial, i) => {
      const pre = `legProyeccionSocial[${i}]`;
      const fIni = this.configserv.datepipe.transform(el.dLegProyFechaInicio, 'yyyy-MM-dd');
      const fFin = this.configserv.datepipe.transform(el.dLegProyFechaFin, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegProyCodigo`,      el.nLegProyCodigo.toString() ?? '0');
      formData.append(`${pre}.cLegProyInstitucion`, el.cLegProyInstitucion.toString() ?? '');
      formData.append(`${pre}.cLegProyOtraInst`,    el.cLegProyOtraInst.toString() ?? '');
      formData.append(`${pre}.cLegProyPais`,        el.cLegProyPais.toString() ?? '');
      formData.append(`${pre}.cLegProyDescripcion`, el.cLegProyDescripcion.toString() ?? '');
      formData.append(`${pre}.nLegProyTipo`,        el.nLegProyTipo.toString() ?? '0');
      formData.append(`${pre}.nValorTipo`,          el.nValorTipo.toString() ?? '0');
      formData.append(`${pre}.dLegProyFechaInicio`, fIni);
      formData.append(`${pre}.dLegProyFechaFin`,    fFin);
      formData.append(`${pre}.cFile`,               el.cLegProyArchivo);
      formData.append(`${pre}.cLegProyArchivo`,     '');
      formData.append(`${pre}.cLegProyValida`,      'false');
      formData.append(`${pre}.cLegProyEstado`,      'true');
    });
  }

  private agregarLicenciasProfesionales(formData: FormData): void {
    this.lstserv.lLegLicenciaProfesional.forEach((el: LegLicenciaProfesional, i) => {
      const pre = `legLicenciaProfesional[${i}]`;
      const fEmi = this.configserv.datepipe.transform(el.dLegLicFechaEmision, 'yyyy-MM-dd');
      const fExp = this.configserv.datepipe.transform(el.dLegLicFechaExpiracion, 'yyyy-MM-dd');
      formData.append(`${pre}.nLegLicCodigo`,        el.nLegLicCodigo?.toString() ?? '0');
      formData.append(`${pre}.nLegLicDatCodigo`,     this.regLegDatosGenerales.nLegDatCodigo.toString());
      formData.append(`${pre}.nLegLicPais`,          el.nLegLicPais?.toString() ?? '0');
      formData.append(`${pre}.nClasePais`,           el.nClasePais?.toString() ?? '0');
      formData.append(`${pre}.cLegLicInstitucion`,   el.cLegLicInstitucion ?? '');
      formData.append(`${pre}.cLegLicOtraInst`,      el.cLegLicOtraInst.toString() ?? '');
      formData.append(`${pre}.nLegLicCondicion`,     el.nLegLicCondicion?.toString() ?? '0');
      formData.append(`${pre}.nClaseCondicion`,      el.nClaseCondicion?.toString() ?? '0');
      formData.append(`${pre}.cLegLicNroRegistro`,   el.cLegLicNroRegistro.toString() ?? '');
      formData.append(`${pre}.dLegLicFechaEmision`,  fEmi);
      formData.append(`${pre}.dLegLicFechaExpiracion`, fExp);
      formData.append(`${pre}.cLegLicValida`,        'false');
      formData.append(`${pre}.cLegLicEstado`,        'true');
    });
  }

  // ─── PASO 4: Persistir (POST o PUT) ──────────────────────────
  private async persistirLegajo(formData: FormData): Promise<any> {
    const esNuevo = this.regLegDatosGenerales.nLegDatCodigo === 0;
    if (esNuevo) {
      return this.regserv.registroFile('Registro de Legajos', 'legajo', formData, false);
    }
    return this.regserv.actualizarFile('Registro de Legajos', `legajo/put/${this.regLegDatosGenerales.nLegDatCodigo}`, formData, false);
  }

  // ─── PASO 5: Mostrar resultado ───────────────────────────────
  private mostrarResultadoGuardado(dataCV: any, dataDJ: any): void {
    if (dataCV && dataDJ) {
      Swal.fire('Registro de Legajos', 'Datos guardados correctamente.', 'success');
    } else if (dataCV) {
      Swal.fire('Registro de Legajos', 'Datos Legajo guardados correctamente.', 'success');
    } else if (dataDJ) {
      Swal.fire('Registro de Legajos', 'Datos Declaraciones Juradas guardadas correctamente.', 'success');
    } else {
      Swal.fire('Advertencia', 'Algunos datos no se guardaron correctamente.', 'warning');
    }
  }