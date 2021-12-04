
$(document).ready(function () {

    var contenedor = document.getElementById('contenedor_carga');
    //Declaracion de Variables///
    var edit = false;
    var codProfesion, codCiudad, codCelula, codMieCel;
    var codMiembro;
    var funMiembro;
    var corre1;
    var corre2;

    //fecha actual
    var hoy = new Date().format('Y-m-d');
    Fecha();

    function Fecha() {
        $('#dat_fecbau').val(hoy);
        $('#dat_feccon').val(hoy);
        $('#dat_fecenc').val(hoy);
        $('#dat_fecigl').val(hoy);
    }


    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    const snap = document.getElementById("snap");
    const errorMsgElement = document.querySelector('span#errorMsg');
    var imagen = document.getElementById('imagen');

    const constraints = {
        audio: false,
        video: {
            width: 140, height: 120
        }
    };

    $('#mensaje').hide();
    $('#profile').hide();

    ListarMiembro();
    ListarProfesion();
    ListarCiudad();
    ListarCelula();

    ImagenCanvas();

    DeshabilitarFormulario();

    // Access webcam
    async function init() {
        //function init(){
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        } catch (e) {
            errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
        }
    }

    // Success
    function handleSuccess(stream) {
        window.stream = stream;
        video.srcObject = stream;
    }

    //Load init
    $('#encender').click(function (event) {
        init();
        video.play();
    });

    $('#apagar').click(function (event) {
        Apagar();
    })

    //Apagar camara//
    function Apagar() {
        stream = video.srcObject;
        if (stream != null) {
            tracks = stream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
            video.srcObject = null;
            video.setAttribute('poster', "/MRFSistem/img/photo.svg");
        }
    }

    // Draw image
    snap.addEventListener("click", function () {
        let context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, 140, 120);
        imagen.setAttribute('src', canvas.toDataURL('image/jpeg', 1.0));
        //console.log(imagen.src);
    });

    $('#buscarMiembro').keyup(function (e) {//permite hacer busqueda de miembros
        $('#profile').hide();
        $('#home').show();
        if ($('#buscarMiembro').val()) {
            let buscar = $('#buscarMiembro').val().toUpperCase();
            let plantilla = '';
            $.ajax({
                url: '/MRFSistem/AccesoDatos/Miembro/BuscarMiembro.php',
                type: 'POST',
                data: { buscar },
                success: function (response) {
                    if (response != "no encontrado") {
                        let usuario = JSON.parse(response);

                        usuario.forEach(usuario => {
                            plantilla = MostrarTabla(plantilla, usuario);
                        });
                        $('#tb_miembro').html(plantilla);
                    }
                    else {
                        $('#tb_miembro').html(plantilla);
                        let mensaje = `<div class="alert alert-dismissible alert-danger">
                        <button type="button" class="close" data-dismiss="alert">&times;</button>
                        <strong>Miembro ${buscar} no se encuentra registrado en la base de datos</strong></div>`;
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
            ListarMiembro();
        }

    });

    $('#btn_guardarMiembro').click(function (e) {//permiete guardar Usuario
        /*CapturarCrecimiento();
        if (banPro) {
            agregarProfesion();
        }
        else {
            GuardarMiembro();
        }

        //GuardarMiembroCelula(GuardarMiembro());
        //limpiar();
        Apagar();
        ListarMiembro();
        DeshabilitarFormulario();
        $('#profile').hide();
        $('#home').show();
        banPro = false;*/
    });

    function limpiar() {
        $('#form1').trigger('reset');
        $('#form2').trigger('reset');
        $('#form3').trigger('reset');
        Fecha();
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        ImagenCanvas();
        //DeshabilitarFormulario();
        //$('#profile').hide();
        //$('#home').show();
    }

    function ListarMiembro() {//lista usuarios
        $.ajax({
            url: '/MRFSistem/AccesoDatos/Miembro/ListarMiembro.php',
            type: 'GET',
            success: function (response) {
                //console.log(response);
                if (response != 'false') {
                    let miembros = JSON.parse(response);
                    let plantilla = '';
                    miembros.forEach(miembros => {
                        plantilla = MostrarTabla(plantilla, miembros);
                    });
                    $('#tb_miembro').html(plantilla);
                }

            }
        });
    }


    function MostrarTabla(plantilla, miembros) {
        plantilla +=
            `<tr UserDocu="${miembros.pacodmie}" class="table-light">
                <td>${miembros.cacidmie}</td>
                <td>${miembros.canommie}</td>
                <td>${miembros.capatmie} ${miembros.camatmie}</td>
                <td>${miembros.cafecnac}</td>
                <td>${miembros.cacelmie}</td>
                <td>${miembros.canompro}</td>
                <td>${miembros.cadirmie}</td>
                <td>
                    <button class="baja-miembro btn btn-danger">
                        <i class="fas fa-trash-alt "></i>
                    </button>
                </td>
                <td>
                    <button class="modificar-miembro btn btn-secondary">
                        <i class="far fa-edit "></i>
                    </button>
                </td>
            </tr>`
        return plantilla;
    }

    $(document).on('click', '.baja-miembro', function () {//elimina miembros

        if (confirm("Seguro que desea dar de baja este Miembro de la iglesia")) {
            let elemento = $(this)[0].parentElement.parentElement;
            let pacodmie = $(elemento).attr('UserDocu');
            console.log('dando de baja...');
            $.post('/MRFSistem/AccesoDatos/Miembro/DarBaja.php',
                { pacodmie }, function (responce) {
                    if (responce == 'baja') {
                        ListarMiembro();
                        MostrarMensaje("Miembro dado de baja", 'warning');
                    }

                });
        }
    });

    $(document).on('click', '.modificar-miembro', function () {//modifica miembros

        document.getElementById("txt_ci").focus();
        habilitarFormulario();
        let elemento = $(this)[0].parentElement.parentElement;
        let pacodmie = $(elemento).attr('UserDocu');
        $.ajax({
            url: '/MRFSistem/AccesoDatos/Miembro/SingleMiembro.php',
            type: 'POST',
            data: { pacodmie },
            beforeSend: function () {
                
            },
            complete: function () {
                
            },
            success: function (responce) {
                //console.log(responce);
                $('#home').hide();
                $('#profile').show();
                const miembro = JSON.parse(responce);
                let foto;
                miembro.forEach(miembro => {
                    codMiembro = miembro.pacodmie,
                        $('#txt_ci').val(miembro.cacidmie),
                        $('#txt_nombre').val(miembro.canommie),
                        $('#txt_paterno').val(miembro.capatmie),
                        $('#txt_materno').val(miembro.camatmie),
                        $('#txt_numcontacto').val(miembro.cacelmie),
                        $('#txt_fecnac').val(miembro.cafecnac),
                        $('#cbx_estadoCivil').val(miembro.caestciv),
                        $('#txt_direccion').val(miembro.cadirmie),
                        codProfesion = miembro.facodpro,
                        codCiudad = miembro.facodciu,
                        $('#inp_profesion').val(miembro.canompro),
                        $('#cbx_ciudad').val(miembro.pacodciu),
                        $('#cbx_celula').val(miembro.pacodcel),
                        $('#cbx_funcion').val(miembro.cafunmie),
                        //foto = decodeURIComponent(miembro.cafotmie),
                        foto = miembro.caurlfot,
                        $('#dat_fecbau').val(miembro.cafecbau),
                        $('#dat_feccon').val(miembro.cafeccon),
                        $('#dat_fecenc').val(miembro.cafecenc),
                        $('#dat_fecigl').val(miembro.cafecigl),
                        setPacodcre(miembro.pacodcre)
                });
                //canvas = document.getElementById('canvas');
                let context = canvas.getContext('2d');
                imagen.setAttribute('src', foto);
                imagen.onload = function () {
                    context.drawImage(imagen, 0, 0, 140, 120);
                }

                edit = true;
            }
        });
    });
    function MostrarMensaje(cadena, clase) {
        let mensaje = `<div class="alert alert-dismissible alert-${clase}">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>${cadena}</strong>
              </div>`;
        $('#mensaje').html(mensaje);
        $('#mensaje').show();
    }

    function ImagenCanvas() {
        //const canvas = document.getElementById('canvas');
        let contex = canvas.getContext('2d');
        imagenes = document.getElementById('imagen');
        imagenes.setAttribute('src', "/MRFSistem/img/user.svg");
        contex.drawImage(imagenes, 0, 0, 120, 120);
    }

    function ListarProfesion() {//listar profesion
        $.ajax({
            url: '/MRFSistem/AccesoDatos/Profesion/ListarProfesion.php',
            type: 'GET',
            success: function (response) {
                let profesion = JSON.parse(response);
                let i = 0;
                plantilla = '';
                profesion.forEach(profesion => {
                    plantilla += `<option data-codigo="${profesion.pacodpro}" data-nombre="${profesion.canompro}" value="${profesion.canompro}"></option>`;
                });
                $('#dat_profesion').html(plantilla);
            }
        });


    }

    var banPro = false; //boolean para agregar nueva profesion
    var nomPro = '';

    $('#inp_profesion').on('input', function () {//asigar codigo profesion
        var val = $('#inp_profesion').val().toUpperCase();
        var ejemplo = $('#dat_profesion').find('option[value="' + val + '"]').data('codigo');
        var ejemplo1 = $('#dat_profesion').find('option[value="' + val + '"]').data('nombre');

        if (ejemplo === undefined) {
            console.log("EmpName no está definido");
            banPro = true;
            nuevaProfesion();
            nomPro = val;
        } else {
            codProfesion = ejemplo;
            nomPro = ejemplo1;
            banPro = false;
            console.log("EmpName está definido");
        }
    });

    function agregarProfesion() {
        const postData = {
            pacodpro: codProfesion,
            canompro: nomPro
        }
        let url = '/MRFSistem/AccesoDatos/Profesion/AgregarProfesion.php';

        console.log(codProfesion, $('#inp_profesion').val().toUpperCase());
        $.post(url, postData, function (response) {
            if (response == "AgregaProfesion") {
                GuardarMiembro();
                actualizarSecuencia("PRO", correPro);
            }
        });
    }

    function ListarCelula() {//listar celula
        $.ajax({
            url: '/MRFSistem/AccesoDatos/Celula/ListarCelula.php',
            type: 'GET',
            success: function (response) {
                let celula = JSON.parse(response);
                let plantilla = '<option value=0>Eligir Celula</option>';
                celula.forEach(cel => {
                    plantilla += `<option value="${cel.pacodcel}" class="cod-profesion">${cel.canomcel}</option>`;
                });
                $('#cbx_celula').html(plantilla);
            }
        });

    }

    $('#cbx_celula').change(function (e) {//asigar codigo profesion
        codCelula = $('#cbx_celula').val();
        console.log("codigo celula: " + codCelula);
        e.preventDefault();

    });

    function ListarCiudad() {//listar ciudad
        $.ajax({
            url: '/MRFSistem/AccesoDatos/Ciudad/ListarCiudad.php',
            type: 'GET',
            success: function (response) {
                let ciudad = JSON.parse(response);
                let plantilla = '<option value=0>Eligir Ciudad</option>';
                ciudad.forEach(ciudad => {
                    plantilla += `<option value="${ciudad.pacodciu}" class="ciudad">${ciudad.canomciu}</option>`;
                });
                $('#cbx_ciudad').html(plantilla);
            }
        });
    }

    function GuardarMiembroCelula() {
        const postData = {
            pacodmcl: codMieCel,
            cafunmie: funMiembro,
            caestmcl: true,
            facodcel: codCelula,
            facodmie: codMiembro
        };

        let url = '/MRFSistem/AccesoDatos/MieCel/AgregarMieCel.php';
        $.post(url, postData, function (response) {
            console.log(response);
            if (!edit && response == 'registra') {
                actualizarSecuencia("MCL", corre2);
            }
            if (edit && response == 'modificado') {

            }
            edit = false;
            //ListarMiembro();
        });
        console.log('completado..');
    }

    function GuardarMiembro() {

        //const canvas = document.getElementById('canvas');
        let foto = canvas.toDataURL('image/jpeg', 1.0);
        //console.log(foto);
        const postData = {
            pacodmie: codMiembro,
            cacidmie: $('#txt_ci').val(),
            canommie: $('#txt_nombre').val().toUpperCase(),
            capatmie: $('#txt_paterno').val().toUpperCase(),
            camatmie: $('#txt_materno').val().toUpperCase(),
            cacelmie: $('#txt_numcontacto').val(),
            cafecnac: $('#txt_fecnac').val(),
            caestciv: $('#cbx_estadoCivil').val(),
            cadirmie: $('#txt_direccion').val().toUpperCase(),
            caestmie: true,
            facodpro: codProfesion,
            facodciu: codCiudad,
            cafotmie: encodeURIComponent(foto),
            cafecbau: getCafecbau(),
            cafeccon: getCafeccon(),
            cafecigl: getCafecigl(),
            cafecenc: getCafecenc(),
            pacodcre: codMiembro
        };
        console.log(postData);
        let URL = edit === false ?
            '/MRFSistem/AccesoDatos/Miembro/AgregarMiembro.php' :
            '/MRFSistem/AccesoDatos/Miembro/ModificarMiembro.php';

        $.ajax({
            url: URL,
            type: 'POST',
            data: postData,
            beforeSend: function () {
                $("#btn_guardarMiembro").text("Guardando...");
                $("#btn_guardarMiembro").attr("disabled", true);
            },
            complete: function () {
                $("#btn_guardarMiembro").text("Guardar");
                $("#btn_guardarMiembro").attr("disabled", false);
            },
            success: function (response) {
                console.log(response);
                if (!edit && response == 'registra') {
                    actualizarSecuencia("MBR", corre1);
                    GuardarMiembroCelula();
                    MostrarMensaje("Datos de Miembro guardado correctamente", "success");
                }
                if (edit && response == 'modificado') {
                    MostrarMensaje("Datos de Miembro modificados correctamente", "success");

                }
                edit = false;
                ListarMiembro();
            }

        });

    }

    function CapturarCrecimiento() {
        setCafecbau($('#dat_fecbau').val());
        setCafeccon($('#dat_feccon').val());
        setCafecenc($('#dat_fecenc').val());
        setCafecigl($('#dat_fecigl').val());
        setPacodcre(codMiembro);
    }

    $('#cbx_ciudad').change(function (e) {//asignar codigo de cuidad
        codCiudad = $('#cbx_ciudad').val();
        console.log("codigo ciudad " + codCiudad);
        e.preventDefault();

    });

    $('#cbx_funcion').change(function (e) {//asignar codigo de cuidad
        funMiembro = $('#cbx_funcion').val();
        console.log("funcion " + funMiembro);

        e.preventDefault();

    });

    $('#btn_cancelar').click(function (event) {
        Apagar();
        edit = false;
        $('#profile').hide();
        $('#home').show();
        limpiar();
        DeshabilitarFormulario();
    });

    $("#btn_nuevo").click(function (event) {
        $('#home').hide();
        $('#profile').show();
        limpiar();
        ImagenCanvas();
        habilitarFormulario();
        document.getElementById("txt_ci").focus();
        let num = "";
        verificarSecuencia("MBR");
        if (getBan() != "true") {
            setCodigo("MBR");
            setCorrelativo(1);
        }
        else {
            setCodigo("MBR");
            obtenerCorrelativo("MBR");
            setCorrelativo(obtenerSiguinete("MBR"));
        }
        corre1 = getCorrelativo();
        num = ObtenerNumeroCorrelativo(getCorrelativo().toString(), num);
        codMiembro = getCodigo() + '-' + num;
        //console.log(codMiembro+' correlativo '+corre1);
        let num1 = "";
        verificarSecuencia("MCL");
        if (getBan() != "true") {
            setCodigo("MCL");
            setCorrelativo(1);
        }
        else {
            setCodigo("MCL");
            obtenerCorrelativo("MCL");
            setCorrelativo(obtenerSiguinete("MCL"));
        }
        corre2 = getCorrelativo();
        num1 = ObtenerNumeroCorrelativo(getCorrelativo().toString(), num1);
        codMieCel = getCodigo() + '-' + num1;
        console.log(codMieCel + ' correlativo ' + corre2);
    });

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


    //habilitarFormulario
    function habilitarFormulario() {
        $("#txt_nombre").attr("disabled", false);
        $("#txt_codMiembro").attr("disabled", false);
        $("#txt_ci").attr("disabled", false);
        $("#txt_paterno").attr("disabled", false);
        $("#txt_materno").attr("disabled", false);
        $("#txt_numcontacto").attr("disabled", false);
        $("#txt_fecnac").attr("disabled", false);
        $("#cbx_ciudad").attr("disabled", false);
        $("#cbx_estadoCivil").attr("disabled", false);
        $("#cbx_profesion").attr("disabled", false);
        $("#txt_direccion").attr("disabled", false);
        $("#snap").attr("disabled", false);
        $("#dat_feccon").attr("disabled", false);
        $("#dat_fecbau").attr("disabled", false);
        $("#dat_fecigl").attr("disabled", false);
        $("#dat_fecenc").attr("disabled", false);
        $("#cbx_celula").attr("disabled", false);
        $("#cbx_funcion").attr("disabled", false);
        $("#btn_guardarMiembro").attr("disabled", false);
        $("#btn_nuevo").attr("disabled", true);
        document.getElementById("txt_ci").focus();
    }

    function DeshabilitarFormulario() {
        $("#txt_nombre").attr("disabled", true);
        $("#txt_codMiembro").attr("disabled", true);
        $("#txt_ci").attr("disabled", true);
        $("#txt_paterno").attr("disabled", true);
        $("#txt_materno").attr("disabled", true);
        $("#txt_numcontacto").attr("disabled", true);
        $("#txt_fecnac").attr("disabled", true);
        $("#cbx_ciudad").attr("disabled", true);
        $("#cbx_estadoCivil").attr("disabled", true);
        $("#cbx_profesion").attr("disabled", true);
        $("#txt_direccion").attr("disabled", true);
        $("#snap").attr("disabled", true);
        $("#dat_feccon").attr("disabled", true);
        $("#dat_fecbau").attr("disabled", true);
        $("#dat_fecigl").attr("disabled", true);
        $("#dat_fecenc").attr("disabled", true);
        $("#btn_guardarMiembro").attr("disabled", true);
        $("#cbx_celula").attr("disabled", true);
        $("#cbx_funcion").attr("disabled", true);
        $("#btn_nuevo").attr("disabled", false);
    }

    //funcion para crear nueva profesion
    var correPro;

    function nuevaProfesion() {
        let num = "";
        verificarSecuencia("PRO");
        if (getBan() != "true") {
            setCodigo("PRO");
            setCorrelativo(1);
        }
        else {
            setCodigo("PRO");
            obtenerCorrelativo("PRO");
            setCorrelativo(obtenerSiguinete("PRO"));
        }
        correPro = getCorrelativo();
        num = ObtenerNumeroCorrelativo(getCorrelativo().toString(), num);
        codProfesion = getCodigo() + '-' + num;
        console.log(codProfesion);

    }


});
