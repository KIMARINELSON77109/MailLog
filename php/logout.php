<?php

require "db_connect.php";

session_start();

//#################################logout#######################################
if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    $logout_data = $_POST["logout"];
        if($logout_data)
        {
            //session_unset();
            session_destroy();
        }
    echo "logged out";
}