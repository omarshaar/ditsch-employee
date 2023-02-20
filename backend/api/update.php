<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: *");

include '../db.php';

$req = $_GET['req'];
if (isset($req)) {
    $req();
}

function AddBruch(){
    include '../db.php';
    $_POST = json_decode(file_get_contents("php://input"),true);

    $articels = $_POST['articels'];
    $length = $_POST['length'];
    $date = $_POST['date'];
    $authorID = $_POST['authorID'];

    for ($i=0; $i < $length; $i++) {
        $amount = $articels[$i]["amount"];
        $number = $articels[$i]["number"];
        
        // SQL Anweisungen
        $getData = $databaseCON->prepare("UPDATE `warenData` SET `sum` = `sum` - $amount WHERE `warenData`.`number` = $number;");
        // Run the SQL Code
        $result = $getData->execute();
        if ($result) { print_r('Updated Successfully'); }else{ print_r('false');}
    }

    $objToStr = json_encode($articels);
    // insert into bruch Table
    $getData = $databaseCON->prepare("INSERT INTO `bruch`(`authorID`, `artikelsObj`, `date`) VALUES ('$authorID','$objToStr','$date')");
    $result = $getData->execute();
    if ($result) { print_r('Updated Successfully'); }else{ print_r('false'); }
}

function AddLieferschein(){
    include '../db.php';
    $_POST = json_decode(file_get_contents("php://input"),true);

    $articels = $_POST['articels'];
    $length = $_POST['length'];
    $date = $_POST['date'];
    $authorID = $_POST['authorID'];

    for ($i=0; $i < $length; $i++) {
        $amount = $articels[$i]["amount"];
        $number = $articels[$i]["number"]; 
    
        // update sum
        $getData = $databaseCON->prepare("UPDATE `warenData` SET `sum` = `sum` + $amount WHERE `warenData`.`number` = $number;");
        $result = $getData->execute();
        if ($result) { print_r('Updated Successfully'); }else{ print_r('false'); }
    }

    $objToStr = json_encode($articels);
    // insert into lieferschein Table
    $getData = $databaseCON->prepare("INSERT INTO `lieferscheine`(`authorID`, `artikelsObj`, `date`) VALUES ('$authorID','$objToStr','$date')");
    $result = $getData->execute();
    if ($result) { print_r('Updated Successfully'); }else{ print_r('false'); }
} 

function copmlatedTask (){
    include '../db.php';
    $_POST = json_decode(file_get_contents("php://input"),true);

    $id = $_POST['taskID'];

    // SQL Anweisungen
    $getData = $databaseCON->prepare("UPDATE `userTasks` SET `completed` = '1' WHERE `userTasks`.`id` = $id;");
    // Run the SQL Code
    $result = $getData->execute();
    if ($result) {
        print_r('Updated Successfully');
    }else{
        print_r('false');
    }
}

function AddVerkauf(){
    include '../db.php';
    $_POST = json_decode(file_get_contents("php://input"),true);

    $articels = $_POST['articels'];
    $length = $_POST['length'];
    $date = $_POST['date'];
    $authorID = $_POST['authorID'];
    $totalUmsatz = $_POST['totalUmsatz'];
    $notes = $_POST['notes'];

    for ($i=0; $i < $length; $i++) {
        $amount = $articels[$i]["amount"];
        $number = $articels[$i]["number"];
        
        // SQL Anweisungen
        $getData = $databaseCON->prepare("UPDATE `warenData` SET `sum` = `sum` - $amount WHERE `warenData`.`number` = $number;");
        // Run the SQL Code
        $result = $getData->execute();
        if ($result) { print_r('Updated Successfully'); }else{ print_r('false');}
    }

    $objToStr = json_encode($articels);
    // insert into verkauf Table
    $getData = $databaseCON->prepare("INSERT INTO `verkauf`(`authorID`, `artikelsObj`, `date`, `totalUmsatz`, `notes` ) VALUES ('$authorID','$objToStr','$date','$totalUmsatz','$notes')");
    $result = $getData->execute();
    if ($result) { print_r('Updated Successfully'); }else{ print_r('false'); }
}
