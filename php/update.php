<?php

require "db_connect.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    $Name = $_POST["sender"];
    $content = $_POST["content"];
    $raction = $_POST["action"];
    $Date = $_POST["sdate"];
    $ID = $_POST['id'];
    
    if (isset($Name) && isset($content) && isset($raction) && isset($Date))
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
            
            $sql = "UPDATE Maillog SET description = '$content', fromperson= '$Name', loggedby = '$fullname', raction = '$raction', rdate = '$date_logged', sdate='$Date' WHERE id = '$ID';";
            $rec = $db->exec($sql);
            
            if(rec==true)
            {
                $data = ['message' => "updated"];
            }
            
        }
        else
        {
            $data = ['message' => "fail"];
        }
        echo json_encode($data);
    }
}