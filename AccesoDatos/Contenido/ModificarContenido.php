<?php

include '../Conexion/Conexion.php';


//if (isset($_POST["pacodusu"]) && isset($_POST["facodmie"]) && isset($_POST["canomusu"])) {
    $caestcon = true;
    $canommat = $_POST['canommat'];
    $pacodcon = $_POST['pacodcon'];
    $cadescon = $_POST['cadescon'];

    $sql = "UPDATE aconido SET 
	    cadescon='{$cadescon}', 
        caestcon='{$caestcon}', 
        canommat='{$canommat}'
    WHERE pacodcon='{$pacodcon}'";
    
    $stm = pg_query($conexion, $sql);
//}
if ($stm) {
    echo "modificado";
} else {
    echo "noRegistra";
}

pg_close($conexion);
?>