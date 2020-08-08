<div class="container p-4">
    <div class="row">
        <!--<form id="form_user">-->
        <div class="col-md-4">
            <form id="form1">
                <div class="form-group">
                    <input type="hidden" id="txt_codMiembro" placeholder="Codigo" class="form-control"></input>
                </div>
                <div class="form-group">
                    <label>Carnet de Identidad</label>
                    <input type="number" id="txt_ci" placeholder="Carnet de Identidad" class="form-control"
                        min="0"></input>
                </div>
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" id="txt_nombre" placeholder="Nombre" class="form-control"></input>
                </div>
                <div class="form-group">
                    <label>Apellido Paterno</label>
                    <input type="text" id="txt_paterno" placeholder="Apellido Paterno" class="form-control"></input>
                </div>
                <div class="form-group">
                    <label>Apellido Materno</label>
                    <input type="text" id="txt_materno" placeholder="Apellido Materno" class="form-control"></input>
                </div>
                <div class="form-group">
                    <label>Numero de Contacto</label>
                    <input type="number" id="txt_numcontacto" placeholder="Numero de Contacto"
                        class="form-control"></input>
                </div>
                <div class="form-group">
                    <label>Fecha de Nacimiento</label>
                    <input type="date" id="txt_fecnac" min="1920-01-01" max="2020-01-01"
                        placeholder="Fecha de Nacimiento" class="form-control"></input>
                </div>
                <div class="form-group">
                    <label>Lugar de Nacimiento</label>
                    <select id="cbx_ciudad" class="form-control">

                    </select>
                </div>
                <div class="form-group">
                    <label>Estado Civil</label>
                    <select id="cbx_estadoCivil" class="form-control">
                        <option value="0" class="form-control">Estado Civil</option>
                        <option value="SOLTERO/A" class="form-control">SOLTERO/A</option>
                        <option value="CASADO/A" class="form-control">CASADO/A</option>
                        <option value="VIUDO/A" class="form-control">VIUDO/A</option>
                        <option value="DIVORCIADO/A" class="form-control">DIVORCIADO/A</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Profesion</label>
                    <select id="cbx_profesion" class="form-control">

                    </select>
                </div>

            </form>
        </div>
        <div class="col-md-4 p-3">
            <form id="form2">
                <div class="form-group">
                    <label>Direccion</label>
                    <textarea id="txt_direccion" rows="3" placeholder="Direccion de Domicilio"
                        class="form-control"></textarea>
                </div>
                <div class="form-group text-center">
                    <label>Crecimiento Espiritual</label>
                </div>
                <div class="form-group">
                    <label>Fecha de Conversion</label>
                    <input type="date" id="dat_feccon" placeholder="" class="form-control"></input>
                </div>
                <div class="form-group">
                    <label>Fecha de Bautismo</label>
                    <input type="date" id="dat_fecbau" placeholder="" class="form-control"></input>
                </div>
                <div class="form-group">
                    <label>Entrada a la Iglesia</label>
                    <input type="date" id="dat_fecentrada" placeholder="" class="form-control"></input>
                </div>
                <div class="form-group">
                    <label>Encuentro Con Dios</label>
                    <input type="date" id="dat_fecencuentro" placeholder="" class="form-control"></input>
                </div>
                <div class="form-group text-center">
                    <label>Asignar Celula</label>
                </div>
                <div class="form-group">
                    <label for="">Celula</label>
                    <select id="cbx_celula" class="form-control">Celula

                    </select>
                </div>
                <div class="form-group">
                    <label for="">Funcion en la Celula</label>
                    <select id="cbx_funcion" class="form-control btn-primary">
                        <option value="DICIPULO/A">DICIPULO/A</option>
                        <option value="ASISTENTE">ASISTENTE</option>
                        <option value="ANFITRION">ANFITRION</option>
                        <option value="LIDER">LIDER</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="col-md-4 p-3">

            <div class="video-wrap">
                <video id="video" playsinline autoplay></video>
                <!--<canvas id="canvas" width="140" height="120"></canvas>-->
            </div>
            <br>
            <!-- Trigger canvas web API -->
            <div class="controller ">
                <button id="snap" class="btn-secondary btn-block
                            text-center">Tomar Foto</button>
            </div>

            <form id="form3">
                <div class="p-3">
                    <table>
                        <tbody>
                            <tr>
                                <td><canvas id="canvas" width="140" height="120"></canvas></td>
                                <td><img id="imagen" width="140" height="120"></img></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </form>

        </div>
    </div>
</div>
<script src="/MRFIglesiaBermejo/Script/CameraApp.js"></script>