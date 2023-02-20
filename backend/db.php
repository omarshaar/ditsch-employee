<?php

$error = "";
$host = "localhost";
$dbname = "u771365081_ditsch";
$useru = "u771365081_ditsch"; // The User To Connect
$passwordu = "omar1998OMAR1998"; // Password Of This User

$dsn = 'mysql:host='.$host.';dbname='.$dbname.';charset=utf8'; //Data Source Name

$option = array(
    PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
);
$databaseCON = '';
try {
    $databaseCON = new PDO($dsn , $useru , $passwordu, $option);
    $databaseCON->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);  
}
catch(PDOException $e){
    $error = "ERROR!";
}

