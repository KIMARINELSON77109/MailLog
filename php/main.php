<?php
require "db_connect.php";
require "sanitize.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    $ID_num = $_POST['idnumber'];
    
    if(isset($ID_num)){
        $sql = "SELECT * FROM Person WHERE idNumber = '$ID_num'";
        $stmt = $db->query($sql);
        $res = $stmt->fetch();
        
        if($res != null)
        {
            $_SESSION["idNumber"] = $res["idNumber"];
            $_SESSION["user_id"] = $res["id"];
            $_SESSION["role"] = $res["role"];
            if($_SESSION["role"]=="admin")
            {
                $data= ['message' => 'admin'];
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
    
//#############################add a user to db and response saying user is added################################################
    if (isset($uname) && isset($empFname) && isset($empLname) && !isset($login))
    {
        $empFname = check_input($empFname);$empLname = check_input($empLname);$uname = check_input($uname);
        
        $sql = "INSERT INTO Employee(firstname, lastname, username, password_digest) VALUES('$empFname', '$empLname', '$uname', '$pword');";
        $res = $db->query($sql);
        
        if(res == true)
        {
            echo 'Successfully Added User';
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
            echo "Record successful inserted";
        }
        else{
            echo "nah work";
            echo $id;
        }
        
        
       /* $sql = "INSERT INTO Maillog (description, fromperson, logged_by, raction, rdate, sdate ) VALUES('$mailContent','$senderName',$fullname','$action', '$date_logged','$sDate');";
        $db->exec($sql);
    //echo 'Mail Logged';
    echo $emp_id;*/
    }
}