<?php

require "db_connect.php";

session_start();

//#################################logout#######################################
if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    $logout_data = json_decode(file_get_contents("php://input"));
        if($logout_data)
        {
            session_unset();
            session_destroy();
        }
    echo "logged out";
}