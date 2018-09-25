<?php

    $servername =getenv('IP');
    $username = 'mlUser';
    $password = "";
    $database = "c9";
    $dbport =3306;

//###########################Create connection##################################
try
{
    $db= new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    
}
catch(PDOException $e)
{
    echo $e;
    echo $servername;
}
