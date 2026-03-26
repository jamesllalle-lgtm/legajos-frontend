function repGenPer_LoadForm() {
    var html = `
        <div class='page-title'>
            <div class='title_left'>
                <h3>Evaluación GTH - Reporte por persona</h3>
            </div>
        </div>
        <div class='clearfix'></div>

        <div class='row'>
            <!-- Columna izquierda: buscador + tablas -->
            <div class='col-md-3 col-sm-12' id='repPer_col_izq'>
                <div class='x_panel'>
                    <div class='x_title'>
                        <h4 class='mb-0'>Buscar persona</h4>
                        <div class='clearfix'></div>
                    </div>
                    <div class='x_content'>
                        <div class='form-group'>
                            <label for='txtRepPer_BuscarPersona'>Persona</label>
                            <input type='text'
                                   id='txtRepPer_BuscarPersona'
                                   class='form-control'
                                   autocomplete='off'
                                   placeholder='Escriba nombre o DNI...' />

                            <!-- aquí guardamos el código de la persona -->
                            <input type='hidden' id='hdRepPer_cPerCodigo' />
                        </div>

                        <div id='repPer_persona_info'
                             class='mt-2 text-muted small'>
                            Empiece a escribir para buscar a la persona.
                        </div>

                        <!-- Listados debajo del buscador -->
                        <div id='repPer_listados' class='mt-3'>
                            <!-- Botón general Ver resultado -->
                            <div id='repPer_btn_resultado_wrap' class='mt-3 text-end'>
                                <!-- Se llena dinámicamente -->
                            </div>
                            <h5 class='mb-1'>Personas que evalúa</h5>
                            <div id='repPer_tab_evalua_wrap' class='mb-3 small text-muted'>
                                Seleccione una persona para ver esta lista.
                            </div>

                            <h5 class='mb-1'>Hola Personas que lo evalúan</h5>
                            <div id='repPer_tab_evaluado_wrap' class='small text-muted'>
                                Seleccione una persona para ver esta lista.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Columna derecha: detalle (por ahora placeholder) -->
            <div class='col-md-9 col-sm-12' id='repPer_col_der'>
                <div class='x_panel'>
                    <div class='x_title'>
                        <h4 class='mb-0'>Detalle del reporte</h4>
                        <div class='clearfix'></div>
                    </div>
                    <div class='x_content' id='repPer_detalle'>
                        <p>Seleccione una persona para ver el detalle del reporte.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    $("#FormContenido").html(html);

    // Luego de pintar la vista, cargamos la data y configuramos el autocomplete
    repPer_cargarDataEvaluacion();
}