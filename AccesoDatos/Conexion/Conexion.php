<?php

$host = "host=localhost";
$port = "port=5432";
$bdname = "dbname=MRFBermejoBD";
$user = "user=postgres";
$password = "password=uajms";

$conexion = pg_connect("$host $port $bdname $user $password");

if(!$conexion){
    echo 'erro al conectar base de datos postgres';
}

