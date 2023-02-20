<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: *");

$_POST = json_decode(file_get_contents("php://input"), true);
$req = $_GET['req']; if (isset($req)) { $req(); }















/*


    function handleWorkTime(){

        include '../db.php';
        $_POST = json_decode(file_get_contents("php://input"), true);

        // set time zone
        date_default_timezone_set('Europe/Berlin');
        // vars
        $targetUserID = $_POST['userID'];
        $active = $_POST['state'];
        $date = date('y-m-d');
        $time = date('H:i:s');

        // get data of the current Date
        $dateData = $databaseCON->prepare("SELECT * FROM `workTimes` WHERE `targetUserID` = '$targetUserID' AND `Date` = '$date';");
        // Run the SQL Code
        $dateData->execute();
        // Fetch Data
        $rows = $dateData->fetchAll(PDO::FETCH_ASSOC);

        $userData = $databaseCON->prepare("SELECT * FROM `accounts` WHERE `id` = '$targetUserID' ");
        $userData->execute();
        $userDataRow = $userData->fetch(PDO::FETCH_ASSOC);

        $dailyHours = $userDataRow['dailyHours'];

        // If the user wants to be online
        if ($active == 1) {
            // If it was his first recording on this day
            if ($dateData->rowCount() > 0) {
                // Update user start time
                $updateStartTime = $databaseCON->prepare("UPDATE `workTimes` SET `StartTime` = '$time' , `active`='1' WHERE `targetUserID` = '$targetUserID' AND `Date` = '$date'; ");
                if($updateStartTime->execute()){print_r('online successfully');}else{print_r('Error');}
            }else {
                // insert the first recording on this day 
                $insertDateData = $databaseCON->prepare("INSERT INTO `workTimes` (`targetUserID`, `Date`, `StartTime`, `totalOfHours`, `overTime`, `active`, `overTimeDesc`) VALUES ('$targetUserID', '$date', '$time', '0', '0', '1', '');");
                if($insertDateData->execute()){print_r('online successfully');}else{print_r('Error');}
            }
        }


        // If the user wants to be offline
        if ($active == 0){
            $userStartTime = $rows[0]['StartTime'];   
            $usertotalOfHours = $rows[0]['totalOfHours'];
            $userTotalOverTime = $rows[0]['overTime'];

            $time1 = strtotime("$date $userStartTime");
            $time2 = strtotime("$date $time");
            $diff = $time2 - $time1;

            $days = floor($diff / (60 * 60 * 24));
            $hours = floor(($diff - $days * 60 * 60 * 24) / (60 * 60));
            $minutes = floor(($diff - $days * 60 * 60 * 24 - $hours * 60 * 60) / 60);
            $diffri = $hours + $minutes / 60;

            if ($diffri + $usertotalOfHours <= $dailyHours) {
                $updateWorkTime = $databaseCON->prepare("UPDATE `workTimes` SET `totalOfHours`=`totalOfHours` + $diffri , `overTime`= '0', `active`='0' WHERE `targetUserID` = 1 AND `Date` = '$date' AND `active`='1' ");
                if($updateWorkTime->execute()){print_r('offline successfully');}else{print_r('Error');}
            }else{
                // if overTime
                $over = ($diffri + $usertotalOfHours) - $dailyHours;
                $updateWorkTime = $databaseCON->prepare("UPDATE `workTimes` SET `totalOfHours`= $dailyHours, `overTime`= '$over',`active`='0' WHERE `targetUserID` = 1 AND `Date` = '$date'  AND `active`='1' ");
                if($updateWorkTime->execute()){print_r('offline successfully');}else{print_r('Error');}
            }
        }
    }



*/
