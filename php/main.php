<?php
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
            $_SESSION["idNumber"] = $res["idNumber"];
            $_SESSION["user_id"] = $res["id"];
            $_SESSION["role"] = $res["role"];
            $_SESSION["fullName"] = $res["fullName"];
            if($_SESSION["role"]=="admin")
            {
                $data= ['message' => 'admin', 'User' => $_SESSION["fullName"]];
            }
            else
            {
                $data= ['message' => 'other'];
            }
          echo json_encode($data);
        }
        else
        {
            $data= ['message' => 'No User Found'];
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
        $emp_id = $_SESSION["user_id"];
        
        //echo $emp_id;
        
//###################get current date and time##################################
        $date_logged = date("Y-m-d h:i:s");
        
        //get name of Employee
        $stmt_2 = $db->query("SELECT * FROM Person WHERE id = '$emp_id'");
        $res_ = $stmt_2->fetch();
        $fullname = $res_["fullName"];
        if($res_ != null)
        {
            $sql = "INSERT INTO Maillog (description, fromperson, loggedby, raction, rdate, sdate ) VALUES('$mailContent','$senderName','$fullname','$action', '$date_logged','$sDate');";
            $db->exec($sql);
            
            $data = ['message' => "success"];
        }
        else
        {
            $data = ['message' => "fail"];
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
}