<?php

include '../Conexion/Conexion.php';


//if (isset($_POST["pacodusu"]) && isset($_POST["facodmie"]) && isset($_POST["canomusu"])) {
    $caestapo = true;
    $cafecapo = $_POST['cafecapo'];
    $cahorapo = $_POST['cahorapo'];
    $pacodapo = $_POST['pacodapo'];
    $facodusu = $_POST['facodusu'];
    $camoning = $_POST['camoning'];
    $catiping = $_POST['catiping'];
    $cafecing = $_POST['cafecing'];
    
    $sql = "INSERT INTO `aconfin`(
        `caestapo`,
        `cafecapo`,
        `cahorapo`,
        `pacodapo`,
        `facodusu`
    )
    VALUES(
        true,
        '{$cafecapo}',
        '{$cahorapo}',
        '{$pacodapo}',
        '{$facodusu}'
    )";
    $stm = mysqli_query($conexion, $sql);
//}


if ($stm) {
    $sql="INSERT INTO `aconing`(`camoning`, `pacodeco`, `catiping`, `cafecing`)
    VALUES('{$camoning}','{$pacodapo}','{$catiping}', '{$cafecing}')";

    $stm1=mysqli_query($conexion, $sql);
    if($stm1){
        echo "registra";
    }
    else{
        echo "noRegistra";
    }
    
} else {
    echo "noRegistra";
}

mysqli_close($conexion);
?>