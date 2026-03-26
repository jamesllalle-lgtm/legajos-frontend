  editar_cv($objaux: DatosUsuario) {
    this.spinner.show()
    this.limpiar_controles()
    this.regLegDatosGenerales.cPerCodigo = $objaux.cPerCodigo
    this.clmdserv.objusuario = $objaux
    this.segserv.obtenerdatosusuario()
    this.ban_administrativo = $objaux.nTipo == 1 ? true : false

    this.lstserv.listado('legajoaux/', $objaux.cPerCodigo).then((data) => {
      if (JSON.stringify(data) != '[]') {
        if (data.nLegDatCodigo == 0 || data.nLegDatCodigo == null) {
          Swal.fire(
            'Control de Legajos',
            'Legajo no tiene datos generales, se cargaron datos de SEUSS, proceda a completar los datos y guardar.',
            'info',
          )
        }
        
        this.regLegDatosGenerales = data
        let $obj: LegDatosGenerales = this.regLegDatosGenerales

        this.previewUrl = environment.PHOTOSEUSS + $obj.cPerCodigo

        this.previewFirmaUrl = $obj.cLegDatFirma != null && $obj.cLegDatFirma != '' ? environment.APIFILE + $obj.cLegDatFirma : environment.FIRMADEFAULT
        this.regLegDatosGenerales.cFileSunedu = $obj.cLegDatSunedu != null && $obj.cLegDatSunedu != '' ? environment.APIFILEPDF + $obj.cLegDatSunedu : ''
        this.regLegDatosGenerales.cFilePolicial = $obj.cLegDatPolicial != null && $obj.cLegDatPolicial != '' ? environment.APIFILEPDF + $obj.cLegDatPolicial : ''
        this.regLegDatosGenerales.cFileJudicial = $obj.cLegDatJudicial != null && $obj.cLegDatJudicial != '' ? environment.APIFILEPDF + $obj.cLegDatJudicial : ''
        this.regLegDatosGenerales.cFileBuenaSalud = $obj.cLegDatBuenaSalud != null && $obj.cLegDatBuenaSalud != '' ? environment.APIFILEPDF + $obj.cLegDatBuenaSalud : ''
        this.errregsunedu = $obj.cLegDatSunedu != null && $obj.cLegDatSunedu != '' ? true : false
        this.errpolicial = $obj.cLegDatPolicial != null && $obj.cLegDatPolicial != '' ? true : false
        this.errregbuenasalud = $obj.cLegDatBuenaSalud != null && $obj.cLegDatBuenaSalud != '' ? true : false


        this.mostrarEntidad = $obj.nLegDatRegPenAfiliado != null && $obj.nValorAfiliado == 1 ? true : false
        this.mostrarBotonDescarga = $obj.nLegDatRegPenAfiliado != null && $obj.nValorAfiliado == 2 ? true : false
        this.mostrarCamposCesante = $obj.nLegDatRegPenAfiliado != null && $obj.nValorAfiliado == 3 ? true : false
        this.mostrarBanco = $obj.nLegDatCtaHabHaberes != null && $obj.nValorHaberes == 1 ? true : false
        this.mostrarBancoAperturar = $obj.nLegDatCtaHabHaberes != null && $obj.nValorHaberes == 2 ? true : false


        this.errjudicial = $obj.cLegDatJudicial != null && $obj.cLegDatJudicial != '' ? true : false
        this.errregconadis = $obj.cLegDatArchivoConadis != null && $obj.cLegDatArchivoConadis != '' ? true : false
        let nacimiento: number = 0
        let dptonacimiento: number = 0
        let provnacimiento: number = 0
        let distnacimiento: number = 0

        let dptodomic: number = 0
        let provdomic: number = 0
        let distdomic: number = 0

        if ($obj.nClaseNacimiento != null && $obj.nClaseNacimiento != 0) {//6602
          if ($obj.vNacimiento.cIntJerarquia.trim().length == 3) {
            let objnac: Interface[] = this.lstserv.lpaisNac.filter(
              (x) => x.nIntCodigo == $obj.vNacimiento.nIntCodigo,
            )
            nacimiento = objnac.length > 0 ? objnac[0].nIntCodigo : 0
          } else {
            let filter = this.lstserv.lpaisNac.filter(
              (x) => x.cIntJerarquia.trim() == 'PER',
            )
            nacimiento = filter[0].nIntCodigo
            this.ubigeoOnChange(filter[0], 0)

            filter = this.lstserv.lubigeo.filter(
              (x) =>
                x.cIntJerarquia.trim() ==
                $obj.vNacimiento.cIntJerarquia.trim().substring(0, 2),
            )
            dptonacimiento = filter[0].nIntCodigo
            this.ubigeoOnChange(filter[0], 4)

            filter = this.lstserv.lubigeo.filter(
              (x) =>
                x.cIntJerarquia.trim() ==
                $obj.vNacimiento.cIntJerarquia.trim().substring(0, 4),
            )
            provnacimiento = filter[0].nIntCodigo
            this.ubigeoOnChange(filter[0], 5)

            filter = this.lstserv.lubigeo.filter(
              (x) =>
                x.cIntJerarquia.trim() ==
                $obj.vNacimiento.cIntJerarquia.trim().substring(0, 6),
            )
            distnacimiento = filter[0].nIntCodigo
            this.ubigeoOnChange(filter[0], 6)
          }
        }
        if ($obj.nLetDatUbigeo != null && $obj.nLetDatUbigeo != 0) {
          let ubigeo = this.lstserv.lubigeo.filter(
            (x) => x.nIntCodigo == $obj.nLetDatUbigeo,
          )[0]
          let filter = this.lstserv.lubigeo.filter(
            (x) =>
              x.cIntJerarquia.trim() ==
              ubigeo.cIntJerarquia.trim().substring(0, 2),
          )
          dptodomic = filter[0].nIntCodigo
          this.ubigeoOnChange(filter[0], 1)

          filter = this.lstserv.lubigeo.filter(
            (x) =>
              x.cIntJerarquia.trim() ==
              ubigeo.cIntJerarquia.trim().substring(0, 4),
          )
          provdomic = filter[0].nIntCodigo
          this.ubigeoOnChange(filter[0], 2)

          filter = this.lstserv.lubigeo.filter(
            (x) =>
              x.cIntJerarquia.trim() ==
              ubigeo.cIntJerarquia.trim().substring(0, 6),
          )
          distdomic = filter[0].nIntCodigo
          this.ubigeoOnChange(filter[0], 3)
        }
        if ($obj.nValorCondicionColeg != null && $obj.nValorCondicionColeg != 0) {
          this.FormGroup2.setValue({
            colegioprofControl: $obj.cLegDatColegioProf,
            condicionControl: $obj.vCondicionColeg.nConValor ?? 0,
            colegionroControl: $obj.cLegDatNroColegiatura ?? ''
          })
          this.myControl.setValue($obj.cLegDatColegioProfNavigation.cPerNombre)
          this.dateFEmi =
            $obj.dLegDatosFechaEmisionColeg == new Date(this.clmdserv.fechadef)
              ? new FormControl(new Date(''))
              : new FormControl(new Date($obj.dLegDatosFechaEmisionColeg))
          this.dateFExp =
            $obj.dLegDatosFechaExpiraColeg == new Date(this.clmdserv.fechadef)
              ? new FormControl(new Date(''))
              : new FormControl(new Date($obj.dLegDatosFechaExpiraColeg))
        }
        if ($obj.vGradoAcad != null) {
          $obj.vGradoAcad.cIntDescripcion = $obj.vGradoAcad.cIntDescripcion || '';
        }


        this.FormGroup1.setValue({
          apellidopaternoControl: $obj.cLegDatApellidoPaterno == null ? '' : $obj.cLegDatApellidoPaterno.trim() ?? '',
          apellidomaternoControl: $obj.cLegDatApellidoMaterno == null ? '' : $obj.cLegDatApellidoMaterno.trim() ?? '',
          nombresControl: $obj.cLegDatNombres == null ? '' : $obj.cLegDatNombres.trim() ?? '',
          emailControl: $obj.cLegDatEmail == null ? '' : $obj.cLegDatEmail.trim() ?? '',
          telefonoControl: $obj.cLegDatTelefono == null ? '' : $obj.cLegDatTelefono.trim() ?? '',
          movilControl: $obj.cLegDatMovil == null ? '' : $obj.cLegDatMovil.trim() ?? '',
          departamentoControl: dptodomic,
          provinciaControl: provdomic,
          distritoControl: distdomic,
          paisNacControl: nacimiento,
          departamentoNacControl: dptonacimiento,
          provinciaNacControl: provnacimiento,
          distritoNacControl: distnacimiento,
          edadControl: '',
          gradoacademicoControl: $obj.vGradoAcad == null ? 0 : $obj.vGradoAcad.nIntCodigo ?? 0,
          nacionalidadControl: $obj.vPais == null ? 0 : $obj.vPais.nIntCodigo ?? 0,
          tipodocumentoControl: $obj.vTipoDoc == null ? 0 : $obj.vTipoDoc.nIntCodigo ?? 0,
          nrodocumentoControl: $obj.cLegDatNroDoc == null ? '' : $obj.cLegDatNroDoc,
          sexoControl: $obj.vSexo == null ? 0 : $obj.vSexo.nConValor,
          estadocivilControl: $obj.vEstadoCivil == null ? 0 : $obj.vEstadoCivil.nConValor ?? 0,
          tipodomicilioControl: $obj.vTipoDomicilio == null ? 0 : $obj.vTipoDomicilio.nConValor ?? 0,
          zonaControl: $obj.vZona == null ? 0 : $obj.vZona.nConValor ?? 0,
          direccionControl: $obj.cLegDatCalleDomicilio == null ? '' : $obj.cLegDatCalleDomicilio.trim() ?? '',
          numeroControl: $obj.cLegDatNroDomicilio == null ? '' : $obj.cLegDatNroDomicilio.trim() ?? '',
          dptoControl: $obj.cLegDatDptoDomicilio == null ? '' : $obj.cLegDatDptoDomicilio.trim() ?? '',
          mzaControl: $obj.cLegDatMzaDomicilio == null ? '' : $obj.cLegDatMzaDomicilio.trim() ?? '',
          lteControl: $obj.cLegDatLtDomicilio == null ? '' : $obj.cLegDatLtDomicilio.trim() ?? '',
          referenciaControl: $obj.cLegDatReferencia == null ? '' : $obj.cLegDatReferencia.trim() ?? '',
          idiomaNativoControl: $obj.nLegIdiomaNativo == null ? 0 : $obj.nLegIdiomaNativo ?? 0,

          afiliadoControl: $obj.vAfiliado == null ? "" : $obj.vAfiliado.nConValor ?? 0,
          entidadControl: $obj.vEntidad == null ? "" : $obj.vEntidad.nConValor ?? 0,
          haberesControl: $obj.vHaberes == null ? "" : $obj.vHaberes.nConValor ?? 0,
          bancoControl: $obj.vBanco == null ? "" : $obj.vBanco.nConValor ?? 0,
          bancoAperturarControl: $obj.vBancoAperturar == null ? "" : $obj.vBancoAperturar.nConValor ?? 0,
          numCuentaControl: $obj.cLegDatCtaHabNumCta == null ? "" : $obj.cLegDatCtaHabNumCta.trim() ?? "",
          numCuentaCciControl: $obj.cLegDatCtaHabNumCtaCci == null ? "" : $obj.cLegDatCtaHabNumCtaCci.trim() ?? "",

          mencionEnMayGradAcadControl: $obj.cLegDatMencionEnMayGradAcad == null ? "" : $obj.cLegDatMencionEnMayGradAcad.trim() ?? "",
          institucionMayGradAcadControl: ""
        })

        if ($obj.cLegDatInstitucionMayGradAcad) {
          const institucion = this.lstInstituciones.find(i => i.cPerCodigo === $obj.cLegDatInstitucionMayGradAcad);
          if (institucion) {
            this.institucionMayGradAcadControl.setValue(institucion.cPerNombre);
            this.institucionOnChange(institucion);
          }
        }

        this.EndFormGroup.setValue({
          acercaControl: $obj.cLegDatAcerca,
        })
        this.ctrlserv.colaboradornombre = this.FormGroup1.get('nombresControl')?.value + ' ' + this.FormGroup1.get('apellidopaternoControl')?.value + ' ' + this.FormGroup1.get('apellidomaternoControl')?.value

        this.date = $obj.dLegDatFechaNacimiento == new Date(this.clmdserv.fechadef) ? new FormControl(new Date('')) : new FormControl(new Date($obj.dLegDatFechaNacimiento))
        if ($obj.dLegDatFechaNacimiento != new Date(this.clmdserv.fechadef)) {
          this.obtener_edad(new Date($obj.dLegDatFechaNacimiento))
        }

        this.dateCeseControl = $obj.dLegDatRegPenFechaCese == new Date(this.clmdserv.fechadef) ? new FormControl(new Date("")) : new FormControl(new Date($obj.dLegDatRegPenFechaCese))

        if ($obj.legGradoTitulo.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legGradoTitulo = $obj.legGradoTitulo.filter(
              (x) => x.cLegGraValida == false,
            )
          }
          $obj.legGradoTitulo.forEach((item) => {
            if (item.cLegGraInstitucion.trim() == '') {
              item.cLegGraInstitucion = this.clmdserv.codigonoinst
              item.cLegGraInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.cLegGraInstitucionNavigation.cPerNombre = item.cLegGraInstitucionNavigation.cPerNombre ?? this.clmdserv.nombrenoinst

            item.vGradoAcad.cIntDescripcion = item.vGradoAcad.cIntDescripcion ?? ''
            item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegGraArchivo = item.cLegGraArchivo != '' ? (item.cUsuRegistro == 'pdf' ? environment.APIFILEPDF : environment.APIFILE) + item.cLegGraArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lLegGradoTitulo = $obj.legGradoTitulo
        }

        //  EBS - 01/2026 -------------------->
        // ===== LICENCIAS PROFESIONALES =====
        if ($obj.legLicenciaProfesional && $obj.legLicenciaProfesional.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legLicenciaProfesional = $obj.legLicenciaProfesional.filter(
              (x) => x.cLegLicValida == false
            );
          }
          $obj.legLicenciaProfesional.forEach((item) => {
            // Normalizar institución
            if (item.cLegLicInstitucion.trim() == '') {
              item.cLegLicInstitucion = this.clmdserv.codigonoinst;
              item.cLegLicInstitucionNavigation = this.clmdserv.empty_persona();
            }
            item.cLegLicInstitucionNavigation.cPerNombre =
              item.cLegLicInstitucionNavigation.cPerNombre ?? this.clmdserv.nombrenoinst;

            // Normalizar descripciones
            item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? '';
            item.vCondicion.cIntDescripcion = item.vCondicion.cIntDescripcion ?? '';

            // Formatear fechas para visualización
            item.dLegLicFechaEmision = new Date(item.dLegLicFechaEmision);
            item.dLegLicFechaExpiracion = new Date(item.dLegLicFechaExpiracion);

            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
          });
          this.lstserv.lLegLicenciaProfesional = $obj.legLicenciaProfesional;
        }

        // ===== MEMBRESIAS =====
        if ($obj.legMembresia && $obj.legMembresia.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legMembresia = $obj.legMembresia.filter(
              (x) => x.cLegMemValida == false
            );
          }
          $obj.legMembresia.forEach((item) => {
            // Normalizar institución
            if (item.cLegMemInstitucion.trim() == '') {
              item.cLegMemInstitucion = this.clmdserv.codigonoinst;
              item.cLegMemInstitucionNavigation = this.clmdserv.empty_persona();
            }
            item.cLegMemInstitucionNavigation.cPerNombre =
              item.cLegMemInstitucionNavigation.cPerNombre ?? this.clmdserv.nombrenoinst;

            // Normalizar descripciones
            item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? '';

            // Formatear fechas para visualización
            item.dLegMemFechaEmision = new Date(item.dLegMemFechaEmision);
            item.dLegMemFechaExpiracion = new Date(item.dLegMemFechaExpiracion);

            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
          });
          this.lstserv.lLegMembresia = $obj.legMembresia;
        }
        //  EBS - 01/2026 -------------------->

        // BUSCA ESTE BLOQUE DENTRO DE editar_cv:
        if ($obj.legDocenciaUniv.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legDocenciaUniv = $obj.legDocenciaUniv.filter(
              (x) => x.cLegDocValida == false,
            )
          }
          $obj.legDocenciaUniv.forEach((item) => {
            if (item.cLegDocUniversidad.trim() == '') {
              item.cLegDocUniversidad = this.clmdserv.codigonoinst
              item.cLegDocUniversidadNavigation = this.clmdserv.empty_persona()
            }
            item.cLegDocUniversidadNavigation.cPerNombre =
              item.cLegDocUniversidadNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.vCategoria.cConDescripcion =
              item.vCategoria.cConDescripcion ?? ''
            item.vRegimen.cConDescripcion = item.vRegimen.cConDescripcion ?? ''

            // 🔹 LÍNEA IMPORTANTE: Aseguramos que la descripción pase a la tabla
            item.cLegDocCargo = item.cLegDocCargo ?? '';

            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegDocArchivo = item.cLegDocArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegDocArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lLegDocenciaUniv = $obj.legDocenciaUniv
        }
        if ($obj.legCategoriaDocente.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legCategoriaDocente = $obj.legCategoriaDocente.filter(
              (x) => x.cLegCatValida == false,
            )
          }
          $obj.legCategoriaDocente.forEach((item) => {
            if (item.cLegCatInstitucion.trim() == '') {
              item.cLegCatInstitucion = this.clmdserv.codigonoinst
              item.cLegCatInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.cLegCatInstitucionNavigation.cPerNombre =
              item.cLegCatInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.vCategoria.cConDescripcion =
              item.vCategoria.cConDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegCatArchivo = item.cLegCatArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegCatArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lCategoriaDocente = $obj.legCategoriaDocente
        }
        if ($obj.legRegimenDedicacion.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legRegimenDedicacion = $obj.legRegimenDedicacion.filter(
              (x) => x.cLegRegValida == false,
            )
          }
          $obj.legRegimenDedicacion.forEach((item) => {
            if (item.cLegCatInstitucion.trim() == '') {
              item.cLegCatInstitucion = this.clmdserv.codigonoinst
              item.cLegCatInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.cLegCatInstitucionNavigation.cPerNombre =
              item.cLegCatInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.vDedicacion.cConDescripcion =
              item.vDedicacion.cConDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegRegArchivo = item.cLegRegArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegRegArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lRegimenDedic = $obj.legRegimenDedicacion
        }

        if ($obj.legProfesNoDocente.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legProfesNoDocente = $obj.legProfesNoDocente.filter(
              (x) => x.cLegProValida == false,
            )
          }
          // Reemplaza el bloque dentro del forEach de legProfesNoDocente
          $obj.legProfesNoDocente.forEach((item) => {
              // 1. Validar institución
              if (!item.cLegProInstitucion || item.cLegProInstitucion.trim() == '') {
                  item.cLegProInstitucion = this.clmdserv.codigonoinst;
                  item.cLegProInstitucionNavigation = this.clmdserv.empty_persona();
              }
              
              item.cLegProInstitucionNavigation.cPerNombre = 
                  item.cLegProInstitucionNavigation.cPerNombre ?? this.clmdserv.nombrenoinst;

              // 2. Validar cargo
              item.vCargo = item.vCargo == null ? this.clmdserv.empty_constante() : item.vCargo;

              // 3. 🚩 AQUÍ ESTÁ LA CORRECCIÓN CRÍTICA:
              if (item.cUsuRegistro && item.cUsuRegistro.length >= 3) {
                  item.cUsuRegistro = item.cUsuRegistro.substr(item.cUsuRegistro.length - 3, 3);
              } else {
                  item.cUsuRegistro = 'img'; // Valor por defecto si es nulo
              }

              // 4. Validar archivo
              item.cLegProArchivo = item.cLegProArchivo
                  ? (item.cUsuRegistro == 'pdf' ? environment.APIFILEPDF : environment.APIFILE) + item.cLegProArchivo
                  : environment.CERTDEFAULT;
          });
          this.lstserv.lProfesNoDocente = $obj.legProfesNoDocente
        }

        if ($obj.legIdiomaOfimatica.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legIdiomaOfimatica = $obj.legIdiomaOfimatica.filter(
              (x) => x.cLegIdOfValida == false,
            )
          }
          $obj.legIdiomaOfimatica.forEach((item) => {
            item.vCodigoDesc.cConDescripcion =
              item.vCodigoDesc.cConDescripcion ?? ''
            item.vNivel.cConDescripcion = item.vNivel.cConDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegIdOfArchivo = item.cLegIdOfArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegIdOfArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lidiomasofimatica = $obj.legIdiomaOfimatica

          this.lstserv.lofimatica = this.lstserv.lidiomasofimatica.filter(
            (x) => x.cLegIdOfTipo == true,
          )
          this.lstserv.lidioma = this.lstserv.lidiomasofimatica.filter(
            (x) => x.cLegIdOfTipo == false,
          )
        }
        if ($obj.legInvestigador.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legInvestigador = $obj.legInvestigador.filter(
              (x) => x.cLegInvValida == false,
            )
          }
          $obj.legInvestigador.forEach((item) => {
            item.vCentroRegistro.cIntDescripcion = item.vCentroRegistro.cIntDescripcion ?? ''
            item.vNivelRenacyt.cIntDescripcion = item.vNivelRenacyt.cIntDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegInvArchivo = item.cLegInvArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegInvArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.linvestigador = $obj.legInvestigador
        }
        if ($obj.legTesisAseJur.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legTesisAseJur = $obj.legTesisAseJur.filter(
              (x) => x.cLegTesValida == false,
            )
          }
          $obj.legTesisAseJur.forEach((item) => {
            if (item.cLegTesInstitucion != null) {
              if (item.cLegTesInstitucion.trim() == '') {
                item.cLegTesInstitucion = this.clmdserv.codigonoinst
                item.cLegTesInstitucionNavigation = this.clmdserv.empty_persona()
              }
            }

            if (!item.cLegTesInstitucionNavigation) {
              item.cLegTesInstitucionNavigation = this.clmdserv.empty_persona();
            }

            item.cLegTesInstitucionNavigation.cPerNombre =
              item.cLegTesInstitucionNavigation.cPerNombre ?? this.clmdserv.nombrenoinst;


            item.vNivel.cConDescripcion = item.vNivel.cConDescripcion ?? ''
            item.vTipo.cIntDescripcion = item.vTipo.cIntDescripcion ?? ''
            item.vPais.cIntDescripcion = item.vPais.cIntDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegTesArchivo = item.cLegTesArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegTesArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lTesisAsesJur = $obj.legTesisAseJur
        }
        if ($obj.legProduccionCiencia.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legProduccionCiencia = $obj.legProduccionCiencia.filter(
              (x) => x.cLegProdValida == false,
            )
          }
          $obj.legProduccionCiencia.forEach((item) => {
            item.vTipo.cIntDescripcion = item.vTipo.cIntDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegProdArchivo = item.cLegProdArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegProdArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lProduccionCiencia = $obj.legProduccionCiencia
        }
        if ($obj.legParticipacionCongSem.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legParticipacionCongSem = $obj.legParticipacionCongSem.filter(
              (x) => x.cLegParValida == false,
            )
          }
          $obj.legParticipacionCongSem.forEach((item) => {
            if (item.cLegParInstitucion.trim() == '') {
              item.cLegParInstitucion = this.clmdserv.codigonoinst
              item.cLegParInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.cLegParInstitucionNavigation.cPerNombre =
              item.cLegParInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.vRol.cIntDescripcion = item.vRol.cIntDescripcion ?? ''
            item.vAmbito.cIntDescripcion = item.vAmbito.cIntDescripcion ?? ''
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegParArchivo = item.cLegParArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegParArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lParticipacion = $obj.legParticipacionCongSem
        }
        if ($obj.legAdminitrativaCarga.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legAdminitrativaCarga = $obj.legAdminitrativaCarga.filter(
              (x) => x.cLegAdmValida == false,
            )
          }
          $obj.legAdminitrativaCarga.forEach((item) => {
            if (item.cLegAdmInstitucion.trim() == '') {
              item.cLegAdmInstitucion = this.clmdserv.codigonoinst
              item.cLegAdmInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.vCargo.cConDescripcion = item.vCargo.cConDescripcion ?? ''
            item.cLegAdmInstitucionNavigation.cPerNombre =
              item.cLegAdmInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegAdmArchivo = item.cLegAdmArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegAdmArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lAdminitrativaCarga = $obj.legAdminitrativaCarga
        }
        if ($obj.legReconocimiento.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legReconocimiento = $obj.legReconocimiento.filter(
              (x) => x.cLegRecValida == false,
            )
          }
          $obj.legReconocimiento.forEach((item) => {
            if (item.cLegRecInstitucion.trim() == '') {
              item.cLegRecInstitucion = this.clmdserv.codigonoinst
              item.cLegRecInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.vDocumento.cConDescripcion =
              item.vDocumento.cConDescripcion ?? ''
            item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
            item.cLegRecInstitucionNavigation.cPerNombre =
              item.cLegRecInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegRecArchivo = item.cLegRecArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegRecArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lReconocimiento = $obj.legReconocimiento
        }
        if ($obj.legCapacitaciones.length > 0) {
          // if (this.configserv.nTareaValidar == this.bValidar) {
          //   $obj.legCapacitaciones = $obj.legCapacitaciones.filter(
          //     (x) => x.cLegCapValida == false,
          //   )
          // }
          $obj.legCapacitaciones.forEach((item) => {
            if (item.cLegCapInstitucion.trim() == '') {
              item.cLegCapInstitucion = this.clmdserv.codigonoinst
              item.vInstitucion = this.clmdserv.empty_persona()
            }
            item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
            item.vTipoEsp.cConDescripcion = item.vTipoEsp.cConDescripcion ?? ''
            item.vInstitucion.cPerNombre =
              item.vInstitucion.cPerNombre ?? this.clmdserv.nombrenoinst
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegCapArchivo = item.cLegCapArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegCapArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lcapacitaciones = $obj.legCapacitaciones
        }
        if ($obj.legProyeccionSocial.length > 0) {
          if (this.configserv.nTareaValidar == this.bValidar) {
            $obj.legProyeccionSocial = $obj.legProyeccionSocial.filter(
              (x) => x.cLegProyValida == false,
            )
          }
          $obj.legProyeccionSocial.forEach((item) => {
            if (item.cLegProyInstitucion.trim() == '') {
              item.cLegProyInstitucion = this.clmdserv.codigonoinst
              item.cLegProyInstitucionNavigation = this.clmdserv.empty_persona()
            }
            item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
            item.cLegProyInstitucionNavigation.cPerNombre =
              item.cLegProyInstitucionNavigation.cPerNombre ??
              this.clmdserv.nombrenoinst
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegProyArchivo = item.cLegProyArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegProyArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lProyeccionSoc = $obj.legProyeccionSocial
        }
        if ($obj.legCapacitacionInternas.length > 0) {
          $obj.legCapacitacionInternas.forEach((item) => {
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.cLegCiarchivo = item.cLegCiarchivo ? (item.cUsuRegistro == 'pdf' ? environment.APIFILEPDF : environment.APIFILE) + item.cLegCiarchivo : environment.CERTDEFAULT
          })
          this.lstserv.lCapacitacionInterna = $obj.legCapacitacionInternas
        }
        if ($obj.legContratos.length > 0) {
          $obj.legContratos.forEach((item) => {
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
            item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
            item.cLegConArchivo = item.cLegConArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegConArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lContrato = $obj.legContratos
        }
        if ($obj.legResoluciones.length > 0) {
          $obj.legResoluciones.forEach((item) => {
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.vResolucion.cConDescripcion =
              item.vResolucion.cConDescripcion ?? ''
            item.cLegResArchivo = item.cLegResArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegResArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lResolucion = $obj.legResoluciones
        }
        if ($obj.legEvaluacionDesemp.length > 0) {
          $obj.legEvaluacionDesemp.forEach((item) => {
            item.cUsuRegistro = item.cUsuRegistro.substr(
              item.cUsuRegistro.length - 3,
              3,
            )
            item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
            item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
            item.vNivel.cConDescripcion = item.vNivel.cConDescripcion ?? ''
            item.cLegEvalArchivo = item.cLegEvalArchivo
              ? (item.cUsuRegistro == 'pdf'
                ? environment.APIFILEPDF
                : environment.APIFILE) + item.cLegEvalArchivo
              : environment.CERTDEFAULT
          })
          this.lstserv.lEvaluacionDesemp = $obj.legEvaluacionDesemp
        }
        if ($obj.legSeleccion.length > 0) {
          $obj.legSeleccion.forEach((item) => {
            item.cLegSelEvaluacionCv = environment.APIFILEPDF + (item.cLegSelEvaluacionCv ?? environment.CERTDEFAULT);
            item.cLegSelClaseModelo = environment.APIFILEPDF + (item.cLegSelClaseModelo ?? environment.CERTDEFAULT);
            item.cLegSelEvaluacionPsico = environment.APIFILEPDF + (item.cLegSelEvaluacionPsico ?? environment.CERTDEFAULT);
            item.cLegSelEntrevistaPers = environment.APIFILEPDF + (item.cLegSelEntrevistaPers ?? environment.CERTDEFAULT);

            item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
            item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
          })
          this.lstserv.lSeleccion = $obj.legSeleccion
        }
        if ($obj.legOrdinarizacion.length > 0) {
          $obj.legOrdinarizacion.forEach((item) => {
            item.cLegOrdFichaInscripcion = environment.APIFILEPDF + (item.cLegOrdFichaInscripcion ?? environment.CERTDEFAULT);
            item.cLegOrdEvaluacionCv = environment.APIFILEPDF + (item.cLegOrdEvaluacionCv ?? environment.CERTDEFAULT);
            item.cLegOrdClaseModelo = environment.APIFILEPDF + (item.cLegOrdClaseModelo ?? environment.CERTDEFAULT);
            item.cLegOrdEvaluacionPsico = environment.APIFILEPDF + (item.cLegOrdEvaluacionPsico ?? environment.CERTDEFAULT);
            item.cLegOrdEntrevistaPers = environment.APIFILEPDF + (item.cLegOrdEntrevistaPers ?? environment.CERTDEFAULT);
            item.vArea.cIntDescripcion = item.vArea.cIntDescripcion ?? ''
            item.vCargo.cIntDescripcion = item.vCargo.cIntDescripcion ?? ''
          })
          this.lstserv.lOrdinarizacion = $obj.legOrdinarizacion
        }
        if ($obj.legDeclaracionJurada && $obj.legDeclaracionJurada.length > 0) {
          const legDJ = $obj.legDeclaracionJurada[0];

          this.nLegDjcodigo = legDJ.nLegDjcodigo
          this.lstserv.LegDeclaracionJurada.cFileDjanexo1 = legDJ.cLegDjanexo1
          this.lstserv.LegDeclaracionJurada.cFileDjanexo2_2 = legDJ.cLegDjanexo2_2
          this.lstserv.LegDeclaracionJurada.cFileDjanexo3 = legDJ.cLegDjanexo3
          this.lstserv.LegDeclaracionJurada.cFileDjanexo4 = legDJ.cLegDjanexo4
          this.lstserv.LegDeclaracionJurada.cFileDjanexo5 = legDJ.cLegDjanexo5
          this.lstserv.LegDeclaracionJurada.cFileDjanexo6_2 = legDJ.cLegDjanexo6_2
          this.lstserv.LegDeclaracionJurada.cFileDjDNI = legDJ.cLegDjDNI
          this.lstserv.LegDeclaracionJurada.cFileDjDNI_DH = legDJ.cLegDjDNI_DH
          this.lstserv.LegDeclaracionJurada.cFileDjFotoCarnet = legDJ.cLegDjFotoCarnet
          this.lstserv.LegDeclaracionJurada.cFileDjNumCta = legDJ.cLegDjNumCta
          this.lstserv.LegDeclaracionJurada.cFileDjConsJubilacion = legDJ.cLegDjConsJubilacion
          this.lstserv.LegDeclaracionJurada.cFileDjConsAfiliacionOnpAfp = legDJ.cLegDjConsAfiliacionOnpAfp


          this.lstserv.LegDeclaracionJurada.cLegDjanexo1 = legDJ.cLegDjanexo1 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo1}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo2_2 = legDJ.cLegDjanexo2_2 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo2_2}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo3 = legDJ.cLegDjanexo3 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo3}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo4 = legDJ.cLegDjanexo4 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo4}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo5 = legDJ.cLegDjanexo5 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo5}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjanexo6_2 = legDJ.cLegDjanexo6_2 ? `${environment.APIFILEPDF}${legDJ.cLegDjanexo6_2}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjDNI = legDJ.cLegDjDNI ? `${environment.APIFILEPDF}${legDJ.cLegDjDNI}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjDNI_DH = legDJ.cLegDjDNI_DH ? `${environment.APIFILEPDF}${legDJ.cLegDjDNI_DH}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjFotoCarnet = legDJ.cLegDjFotoCarnet ? `${environment.APIFILEPDF}${legDJ.cLegDjFotoCarnet}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjNumCta = legDJ.cLegDjNumCta ? `${environment.APIFILEPDF}${legDJ.cLegDjNumCta}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjConsJubilacion = legDJ.cLegDjConsJubilacion ? `${environment.APIFILEPDF}${legDJ.cLegDjConsJubilacion}` : "";
          this.lstserv.LegDeclaracionJurada.cLegDjConsAfiliacionOnpAfp = legDJ.cLegDjConsAfiliacionOnpAfp ? `${environment.APIFILEPDF}${legDJ.cLegDjConsAfiliacionOnpAfp}` : "";

          this.erranexo1 = legDJ.cLegDjanexo1 ? true : false;
          this.erranexo2_2 = legDJ.cLegDjanexo2_2 ? true : false;
          this.erranexo3 = legDJ.cLegDjanexo3 ? true : false;
          this.erranexo4 = legDJ.cLegDjanexo4 ? true : false;
          this.erranexo5 = legDJ.cLegDjanexo5 ? true : false;
          this.erranexo6_2 = legDJ.cLegDjanexo6_2 ? true : false;
          this.errdjDNI = legDJ.cLegDjDNI ? true : false;
          this.errdjDNI_DH = legDJ.cLegDjDNI_DH ? true : false;
          this.errdjFotoCarnet = legDJ.cLegDjFotoCarnet ? true : false;
          this.errdjNumCta = legDJ.cLegDjNumCta ? true : false;
          this.errdjConsJubilacion = legDJ.cLegDjConsJubilacion ? true : false;
          this.errdjConsAfiliacionOnpAfp = legDJ.cLegDjConsAfiliacionOnpAfp ? true : false;
        }
        if ($obj.legDocumentacionInterna.length > 0) {
          $obj.legDocumentacionInterna.forEach((item) => {
            item.cLegDiarchivo = environment.APIFILEPDF + (item.cLegDiarchivo ?? environment.CERTDEFAULT)
            item.vTipo.cConDescripcion = item.vTipo.cConDescripcion ?? ''
          })
          this.lstserv.lDocumentacionInterna = $obj.legDocumentacionInterna
        }

        this.FormGroupAD.setValue({
          nLegDatDiscapacidad: $obj.nLegDatDiscapacidad == null ? 0 : $obj.nLegDatDiscapacidad ?? 0,
          nLegDatTipoDiscapacidad: $obj.nLegDatTipoDiscapacidad == null ? 0 : $obj.nLegDatTipoDiscapacidad ?? 0,
          cLegDatOtraDiscapcidad: $obj.cLegDatOtraDiscapcidad == null ? '' : $obj.cLegDatOtraDiscapcidad ?? '',
          cLegDatArchivoConadis: $obj.cLegDatArchivoConadis == null ? 0 : $obj.cLegDatArchivoConadis ?? '',
        })

        if ($obj.nLegDatDiscapacidad) {
          this.comboOnChangeTieneDiscacidad($obj.nLegDatDiscapacidad)
        }
        if ($obj.nLegDatTipoDiscapacidad) {
          this.comboOnChangeTipoDiscapacidad($obj.nLegDatTipoDiscapacidad)
        }

        this.spinner.hide()
      }
      else {
        this.limpiar_controles()
        this.regLegDatosGenerales.cPerCodigo = $objaux.cPerCodigo
        this.spinner.hide()
        Swal.fire('Control de Legajos', 'No se ha encontrado datos, proceda a completar los datos solicitados.', 'info')
      }
    })

    if (this.configserv.nTareaValidar == this.bValidar)
      this.lstserv._banvalidar = true
    else this.lstserv._banvalidar = false

    this.ctrlserv._banregister = true
  }