<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: *");

include 'DB.php';
$_POST = json_decode(file_get_contents("php://input"),true);


$file_name = $_FILES['image']['name'];
$file_tmp =$_FILES['image']['tmp_name'];
$TaskObject = $_REQUEST['TaskObject'];
$taskID = $_REQUEST['taskID'];
$targetUser = $_REQUEST['targetUser'];
// set time zone
date_default_timezone_set('Europe/Berlin');

$date = date('Y-m-d');
$time = date('H:i:s');

if(isset($_FILES['image'])){
    $path = '../../uploads/thekeImages/';
    move_uploaded_file($file_tmp , $path . $file_name );

    // insert into cleanedList
    $dateData = $databaseCON->prepare("INSERT INTO `ThekeList` (`targetUser`, `TaskObject`, `date`, `time`, `imagePath`) VALUES ('$targetUser', '$TaskObject', '$date', '$time', 'https://ditsch.oderasid.com/uploads/thekeImages/$file_name')");
    // Run the SQL Code
    if ($dateData->execute()) {
        // UPDATE toCleanLists
        $dateData = $databaseCON->prepare("UPDATE `toTheke` SET `lastComplatedDate` = '$date', `lastComplatedTime`='$time' WHERE `toTheke`.`id` = $taskID;");
        if ($dateData->execute()) {
            print_r('Successfully');
        }
    }
} 

