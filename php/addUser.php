<?php
require "db_connect.php";
require "sanitize.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    //#############################add a user to db and response saying user is added################################################
    $idNumber = $_POST["idnumber"];
    $empFname = $_POST["firstname"];
    $empLname = $_POST["lastname"];
    $email = $_POST["email"];
    $department =$_POST["department"];
    $role = $_POST["role"];
    
    
    if (isset($idNumber) && isset($empFname) && isset($empLname) && isset($role) &&
    isset($email) && isset($department))
    {
        $stmt = $db->query("SELECT * FROM Person WHERE idNumber = '$idNumber'");
        $res = $stmt->fetch();
        
        if($res == null)
        {
            $sql1 = "INSERT INTO Person(accountType,department,emailAddress,firstName,fullName,idNumber,lastName, password, photoURL, role) VALUES('activeDirectory','$department','$email', '$empFname', '$empFname' '$empLname','$idNumber','$empLname', '','','$role');";
            $res_ = $db->query($sql);
            
            if($res_ == true)
            {
                $data= ['message' => true];
            }
            else
            {
                $data= ['message' => 'Something went Wrong'];
            }
        }
        else
        {
            $data= ['message' => "duplicate"];
        }
        echo json_encode($data);
    }
}    