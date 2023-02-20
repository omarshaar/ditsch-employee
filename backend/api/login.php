<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: *");



function validateUser(){
    include 'DB.php';
    $_POST = json_decode(file_get_contents("php://input"),true);
    $user = $_POST['user'];
    $pass = $_POST['pass'];
    $ip = $_POST['ip'];

    // SQL Anweisungen
    $getData = $databaseCON->prepare("SELECT `id`,`userName`,`email`,`role`, `dailyHours` FROM `accounts` WHERE `userName` = '$user' AND `password` = '$pass' AND `ip` = '$ip' AND `verified` = '1';");
    // Run the SQL Code
    $getData->execute();
    $rows = $getData->fetchAll(PDO::FETCH_ASSOC);

    if ($getData->rowCount() > 0) {
        $jsonData = json_encode($rows);
        print_r($jsonData);
    }else{
        print_r("false");
    }
}
validateUser();


