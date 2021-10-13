$(document).ready(function () {

    ListarMiembro();
    ListarUsuario();

    let edit = false;

    let codUsuario;
    let codMiembro;

    var corre;

    DeshabilitarFormulario();

    $('#mensaje').hide();
    $('#mensaje1').hide();
    $('#formulario').hide();

    /////eventos///////////////
    ///Buscar Miembro////////
    $('#txt_buscarMiembro').keyup(function (e) {//permite hacer busqueda de miembros
        if ($('#txt_buscarMiembro').val()) {
            let buscar = $('#txt_buscarMiembro').val().toUpperCase();
            let plantilla = '';
            $.ajax({
                url: '/MRFSistem/AccesoDatos/Miembro/BuscarMiembro.php',
                type: 'POST',
                data: { buscar },
                success: function (response) {
                    if (response != "no encontrado") {
                        let miembros = JSON.parse(response);

                        miembros.forEach(miembros => {
                            plantilla +=
                                `<tr codMbr="${miembros.pacodmie}" class="table-light">
                            <td>${miembros.canommie}</td> 
                            <td>${miembros.capatmie} ${miembros.camatmie}</td>
                            <td style="width:15%"><button class="agregar-miembro btn btn-primary">
                            <i class="fas fa-user-plus"></i></button></tr>`;
                        });
                        $('#tb_miembro').html(plantilla);
                    }
                    else {
                        $('#tb_miembro').html(plantilla);
                        let mensaje = `<div class="alert alert-dismissible alert-warning">
                        <button type="button" class="close" data-dismiss="alert">&times;</button>
                        <strong>Miembro ${buscar} no se encuentra registrado en la base de datos</strong></div>`;
                        $('#mensaje1').html(mensaje);
                        $('#mensaje1').show();
                    }
                },
                error: function (xhr, status) {
                    alert('error al buscar miembro');
                }
            });
        }
        else {
            $('#mensaje1').hide();
            ListarMiembro();
        }
    });

    /////Buscar Usuarios///////////
    $('#txt_buscar').keyup(function (e) {//permite hacer busqueda de miembros
        if ($('#txt_buscar').val()) {
            let buscar = $('#txt_buscar').val().toUpperCase();
            let plantilla = '';
            $.ajax({
                url: '/MRFSistem/AccesoDatos/Usuario/BuscarUsuario.php',
                type: 'POST',
                data: { buscar },
                success: function (response) {
                    if (response != "no encontrado") {
                        let usu = JSON.parse(response);

                        usu.forEach(usu => {
                            plantilla = MostrarTabla(plantilla, usu);
                        });
                        $('#tb_usuario').html(plantilla);
                    }
                    else {
                        $('#tb_usuario').html(plantilla);
                        let mensaje = `<div class="alert alert-dismissible alert-warning">
                        <button type="button" class="close" data-dismiss="alert">&times;</button>
                        <strong>Usuario ${buscar} no se encuentra registrado en la base de datos</strong></div>`;
                        $('#mensaje').html(mensaje);
                        $('#mensaje').show();
                    }
                },
                error: function (xhr, status) {
                    alert('error al buscar miembro');
                }
            });
        }
        else {
            $('#mensaje').hide();
            ListarUsuario();
        }
    });


    //////////Guardar Usuario
    $('#btn_guardar').click(function (e) {//permiete guardar Usuario
        GuardarUsuario();

        $('#form1').trigger('reset');
        $('#form2').trigger('reset');
        DeshabilitarFormulario();
        ListarUsuario();
    });

    //////Modificar Usuario///////////
    $(document).on('click', '.modificar-usuario', function () {//modifica usuario
        $('#lista').hide();
        $('#formulario').show();
        habilitarFormulario();
        let elemento = $(this)[0].parentElement.parentElement;
        let pacodusu = $(elemento).attr('UserDocu');
        $.post('/MRFSistem/AccesoDatos/Usuario/SingleUsuario.php',
            { pacodusu }, function (responce) {
                const miembro = JSON.parse(responce);
                miembro.forEach(miembro => {
                    codMiembro = miembro.facodmie,
                        codUsuario = miembro.pacodusu,
                        $('#txt_codigo').val(miembro.facodmie),
                        $('#cbx_tipo').val(miembro.catipusu),
                        $('#txt_usuario').val(miembro.canomusu),
                        $('#txt_contrasena').val(miembro.caconusu),
                        $('#txt_miembro').val(miembro.canommie + ' ' + miembro.capatmie + ' ' + miembro.camatmie)
                });
                //contex.hide();
                edit = true;
            });
    });

    /////////Dar de Baja Usuario//////////
    $(document).on('click', '.baja-usuario', function () {//elimina usuario
        if (confirm("Seguro que desea dar de baja este Usuario")) {
            let elemento = $(this)[0].parentElement.parentElement;
            let pacodusu = $(elemento).attr('UserDocu');
            console.log('dando de baja...');
            $.post('/MRFSistem/AccesoDatos/Usuario/DarBaja.php',
                { pacodusu }, function (responce) {
                    if (responce == 'baja') {
                        ListarUsuario();
                        MostrarMensaje("Usuario dado de baja", "warning");
                    }

                });
        }
    });

    $(document).on('click', '.agregar-miembro', function () {
        let elemento = $(this)[0].parentElement.parentElement;
        let pacodmie = $(elemento).attr('codMbr');
        $.post('/MRFSistem/AccesoDatos/Miembro/SingleMiembro.php',
            { pacodmie }, function (responce) {
                console.log(responce);
                const miembro = JSON.parse(responce);
                miembro.forEach(miembro => {
                    codMiembro = miembro.pacodmie,
                        $('#txt_codigo').val(miembro.pacodmie),
                        $('#txt_miembro').val(miembro.canommie + ' ' + miembro.capatmie + ' ' + miembro.camatmie)
                });
                document.getElementById("cbx_tipo").focus();
            });

    });

    /////////Cancelar Registro de Usuario//////////////
    $('#btn_cancelar').click(function (event) {
        console.log('cancelando..');
        $('#form1').trigger('reset');
        $('#form2').trigger('reset');
        DeshabilitarFormulario();
        $('#formulario').hide();
        $('#lista').show();
    });

    //////////////Registrar Nuevo Usuario///////////
    $("#btn_nuevo").click(function (event) {
        $('#lista').hide();
        $('#formulario').show();

        habilitarFormulario();
        let num = "";
        verificarSecuencia("USU");
        if (getBan() != "true") {
            setCodigo("USU");
            setCorrelativo(1);
        }
        else {
            setCodigo("USU");
            obtenerCorrelativo("USU");
            setCorrelativo(obtenerSiguinete("USU"));
        }
        corre=getCorrelativo();
        num = ObtenerNumeroCorrelativo(getCorrelativo().toString(), num);
        codUsuario = getCodigo() + '-' + num;
        console.log(codUsuario);

    });

    ///////////////funciones//////////
    function MostrarMensaje(cadena, clase) {//mostrar mensaje de alerta
        let mensaje = `<div class="alert alert-dismissible alert-${clase}">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>${cadena}</strong>
              </div>`;
        $('#mensaje').html(mensaje);
        $('#mensaje').show();
    }

    function ObtenerNumeroCorrelativo(numero, num) {//sirve para obtener numero correlativo
        switch (numero.length) {
            case 1:
                num = "00000" + numero;
                break;
            case 2:
                num = "0000" + numero;
                break;
            case 3:
                num = "000" + numero;
                break;
            case 4:
                num = "00" + numero;
                break;
            case 5:
                num = "0" + numero;
                break;
            case 6:
                num = "" + numero;
                break;
            default:
                break;
        }
        return num;
    }

    ////////Listar Usuario////////
    function ListarMiembro() {//lista usuarios
        $.ajax({
            url: '/MRFSistem/AccesoDatos/Miembro/ListarMiembro.php',
            type: 'GET',
            success: function (response) {
                let miembros = JSON.parse(response);
                let plantilla = '';
                miembros.forEach(miembros => {
                    plantilla +=
                        `<tr codMbr="${miembros.pacodmie}" class="table-light">
                        <td>${miembros.canommie}</td> 
                        <td>${miembros.capatmie} ${miembros.camatmie}</td>
                        <td style="width:15%"><button class="agregar-miembro btn btn-primary" data-dismiss="modal">
                        <i class="fas fa-user-plus "></i></button></td>
                        </tr>`;
                });
                $('#tb_miembro').html(plantilla);
            }
        });
    }

    //////Mostrar Tabla de Usuario///////////
    function MostrarTabla(plantilla, usu) {
        plantilla +=
            `<tr UserDocu="${usu.pacodusu}" class="table-light">
                <td>${usu.canommie} ${usu.capatmie} ${usu.camatmie}</td>
                <td>${usu.catipusu}</td>
                <td>${usu.canomusu}</td>
                <td>${usu.caconusu}</td>
                <td>
                    <button class="baja-usuario btn btn-danger">
                    <i class="fas fa-user-minus"></i></button>
                </td>
                <td style="width:15%">
                    <button class="modificar-usuario btn btn-secondary">
                    <i class="fas fa-user-edit"></i></button>
                </td>
            </tr>`
        return plantilla;
    }

    ////////////Listar Usuario////////////
    function ListarUsuario() {//listar Usuario
        $.ajax({
            url: '/MRFSistem/AccesoDatos/Usuario/ListarUsuario.php',
            type: 'GET',
            success: function (response) {
                if (response != 'false') {
                    let usuario = JSON.parse(response);
                    let plantilla = '';
                    usuario.forEach(usu => {
                        //console.log(usu.canommie);
                        plantilla = MostrarTabla(plantilla, usu);
                    });
                    $('#tb_usuario').html(plantilla);
                }

            }
        });
    }

    ////////guardar Usuario///////////////
    function GuardarUsuario() {
        const postData = {
            facodmie: codMiembro,
            pacodusu: codUsuario,
            catipusu: $('#cbx_tipo').val(),
            canomusu: $('#txt_usuario').val(),
            caconusu: $('#txt_contrasena').val(),
            caestusu: true
        };
        console.log(postData);
        let url = edit === false ?
            '/MRFSistem/AccesoDatos/Usuario/AgregarUsuario.php' :
            '/MRFSistem/AccesoDatos/Usuario/ModificarUsuario.php';

        $.post(url, postData, function (response) {
            console.log(response);
            if (!edit && response == 'registra') {
                actualizarSecuencia("USU", corre);
                MostrarMensaje("Datos de usuario guardados correctamente", "success");
            }
            if (edit && response == 'modificado') {
                MostrarMensaje("Datos de usuario modificados correctamente", "success");
            }
            edit = false;
            ListarUsuario();
            $('#formulario').hide();
            $('#lista').show();
        });
    }



    //HabilitarFormulario
    function habilitarFormulario() {
        $("#txt_usuario").attr("disabled", false);
        $("#txt_contrasena").attr("disabled", false);
        $("#cbx_tipo").attr("disabled", false);
        $("#txt_buscarMiembro").attr("disabled", false);
        $("#btn_guardar").attr("disabled", false);
        $("#btn_nuevo").attr("disabled", true);
        document.getElementById("btn_miembro").focus();
    }

    ////////////DesHabilitar Formulario/////////////
    function DeshabilitarFormulario() {
        $("#txt_usuario").attr("disabled", true);
        $("#txt_contrasena").attr("disabled", true);
        $("#cbx_tipo").attr("disabled", true);
        $("#txt_buscarMiembro").attr("disabled", true);
        $("#btn_guardar").attr("disabled", true);
        $("#btn_nuevo").attr("disabled", false);
    }


});





