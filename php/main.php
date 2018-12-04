<?php
header("Access-Control-Allow-Origin: *");
require "db_connect.php";
require "sanitize.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    $ID_num = $_POST['idnumber'];
    
    if(isset($ID_num) && !isset($role)){
        $sql = "SELECT * FROM Person WHERE idNumber = '$ID_num'";
        $stmt = $db->query($sql);
        $res = $stmt->fetch();
        
        if($res != null)
        {
            $_SESSION["idNumber"] = $res["idnumber"];
            $_SESSION["role"] = $res["role"];
            $_SESSION["fullName"] = $res["fullName"];
            $_SESSION['status'] = 'loggedin';
            if($_SESSION["role"]=="admin")
            {
                $data= array('message' => 'admin', 'User' => $_SESSION["fullName"], 'Status'=>$_SESSION['status']);
            }
            else
            {
                $data= array ('message' => 'other','User' => $_SESSION["fullName"], 'Status'=>$_SESSION['status']);
            }
          echo json_encode($data);
        }
        else
        {
            $data= array('message' => 'No User Found');
            echo json_encode($data);
        }
    }
    
//#########################add a Record to db ################################################
    $senderName = $_POST["sender"];
    $mailContent = $_POST["content"];
    $action = $_POST["action"];
    $sDate = $_POST["sdate"];
    
    
    if (isset($senderName) && isset($mailContent) && isset($action) && isset($sDate))
    {
//##############################get id of sender################################
        $emp_id = $_SESSION["idnumber"];
        $senderName = ucwords($senderName);
        $mailContent = sentence_case($mailContent);
        $action = sentence_case($action);
        
        
//###################get current date and time##################################
        $date_logged = date("Y-m-d h:i:s");
        
        $fullname = $_SESSION["fullName"];
        if($fullname != null)
        {
            $sql = "INSERT INTO Maillog (description, fromperson, loggedby, raction, rdate, sdate ) VALUES('$mailContent','$senderName','$fullname','$action', '$date_logged','$sDate');";
            $db->exec($sql);
            
            $data = array('message' => "success");
        }
        else
        {
            $data = array('message' => "fail");
        }
        echo json_encode($data);
    }
    
    $rec_id = $_POST['id'];
    $request_type = $_POST['request_type'];
    
    if($request_type == 3 && isset($rec_id))
    {
        echo $rec_id;
        $sql = "delete from Maillog where id='$rec_id'";
        $rec = $db->exec($sql);
        
        if($rec == true)
        {
            echo "delected";
        }
    }
    
    $rec_id = $_POST['id'];
    $request_type = $_POST['request_type'];
    
    if($request_type == 2 && isset($rec_id))
    {
        echo $rec_id;
        $sql = "delete from Person where id='$rec_id'";
        $rec = $db->exec($sql);
        
        if($rec == true)
        {
            echo "delected";
        }
    }
}