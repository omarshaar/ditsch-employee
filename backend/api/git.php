<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: *");

include 'db.php';
$req = $_GET['req'];
if (isset($req)) {$req();}

function allArticle(){
    include '../db.php';

    // SQL Anweisungen
    $getData = $databaseCON->prepare(" SELECT * FROM `warenData` ORDER BY `warenData`.`id` ASC; ");
    // Run the SQL Code
    $getData->execute();
    // Fetch Data
    $rows = $getData->fetchAll(PDO::FETCH_ASSOC);

    $jsonData = json_encode($rows);
    print_r($jsonData);
}

function getTasks(){
    include '../db.php';
    // set time zone
    date_default_timezone_set('Europe/Berlin');

    $userID = $_GET['userID'];
    $cuurentDate = date('Y-m-d');

    // SQL Anweisungen
    $getData = $databaseCON->prepare("SELECT * FROM `userTasks` WHERE `targetUserID` = $userID AND '$cuurentDate' BETWEEN `start` AND `end` AND `completed` = 0;");
    // Run the SQL Code
    $getData->execute();
    // Fetch Data
    $rows = $getData->fetchAll(PDO::FETCH_ASSOC);

    $jsonData = json_encode($rows);
    print_r($jsonData);
}

function getAllUHRInMonth(){
    include '../db.php';
    $userID = $_GET['userID'];
    // set time zone
    date_default_timezone_set('Europe/Berlin');

    $cuurentDate = date('y-m-d');
    $cuurentDate2 = date('y-m');
    $startDate = $cuurentDate2.'-1';

    // SQL Anweisungen
    $getData = $databaseCON->prepare("SELECT SUM(`totalOfHours`) AS 'total' FROM `workTimes` WHERE `targetUserID` = $userID AND `Date` BETWEEN '$startDate' AND '$cuurentDate' ;");
    // Run the SQL Code
    $getData->execute();
    // Fetch Data
    $rows = $getData->fetch(PDO::FETCH_ASSOC);

    $jsonData = json_encode($rows);
    print_r($jsonData);
}

function getUserRoles(){
    include '../db.php';
    $userID = $_GET['userID'];

    // SQL Anweisungen
    $getData = $databaseCON->prepare("SELECT `dailyHours`, `role` FROM `accounts` WHERE `id` = $userID");
    // Run the SQL Code
    $getData->execute();
    // Fetch Data
    $rows = $getData->fetch(PDO::FETCH_ASSOC);

    $jsonData = json_encode($rows);
    print_r($jsonData);
}

function getToClean(){
    include '../db.php';
    $userID = $_GET['userID'];
    // SQL Anweisungen  
    $getData = $databaseCON->prepare("SELECT b.*,  a.* FROM `Clean` AS b, `toClean` AS a WHERE a.`targetCleanTask` = b.id AND a.targetUsers = '$userID' AND DATEDIFF(CURDATE(), a.`lastComplatedDate`) > 0;");
    // Run the SQL Code
    $getData->execute();
    // Fetch Data
    $rows = $getData->fetchAll(PDO::FETCH_ASSOC);

    $jsonData = json_encode($rows);
    print_r($jsonData);
}

function getToTheke(){
    include '../db.php';
    $userID = $_GET['userID'];
    // SQL Anweisungen  
    $getData = $databaseCON->prepare("SELECT a.*, b.* FROM `Theke` AS a, `toTheke` AS b WHERE b.`targetTask` = a.id AND b.targetUsers = 1 AND CURDATE() > b.lastComplatedDate;");
    // Run the SQL Code
    $getData->execute();
    // Fetch Data
    $rows = $getData->fetchAll(PDO::FETCH_ASSOC);

    $jsonData = json_encode($rows);
    print_r($jsonData);
}

function getUserData(){
    include '../db.php';
    $user = $_GET['user'];

    // SQL Anweisungen
    $getData = $databaseCON->prepare("SELECT `id`,`userName`,`email`,`role`, `dailyHours`, `euro_std`, `avatar` FROM `accounts` WHERE `id` = '$user'");
    // Run the SQL Code
    $getData->execute();
    $rows = $getData->fetch(PDO::FETCH_ASSOC);

    if ($getData->rowCount() > 0) {
        $jsonData = json_encode($rows);
        print_r($jsonData);
    }else{
        print_r("false");
    }
}

function getOverTime(){
    include '../db.php';
    $userID = $_GET['userID'];
    // set time zone
    date_default_timezone_set('Europe/Berlin');

    $cuurentDate = date('y-m-d');
    $cuurentDate2 = date('y-m');
    $startDate = $cuurentDate2.'-1';

    // SQL Anweisungen
    $getData = $databaseCON->prepare("SELECT SUM(`overTime`) AS 'totalOverTime' FROM `workTimes` WHERE `targetUserID` = $userID AND `Date` BETWEEN '$startDate' AND '$cuurentDate' AND `overTimeAccepted` = 1;");
    // Run the SQL Code
    $getData->execute();
    // Fetch Data
    $rows = $getData->fetch(PDO::FETCH_ASSOC);

    $jsonData = json_encode($rows);
    print_r($jsonData);
}
