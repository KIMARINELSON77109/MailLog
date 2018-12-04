<?php

    $servername ='us-cdbr-iron-east-01.cleardb.net';
    $username = 'bbb4d56dd55010';
    $password = 'dff94c8c';
    $database = 'heroku_5fd5d61803a08c2';
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
