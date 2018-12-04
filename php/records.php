<?php

require "db_connect.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET') 
    
{
    ini_set('memory_limit', '-1');
    //###############################get logged records from db ###################################
    $sql1 = "SELECT * FROM Maillog ORDER BY id DESC";
    $stmt = $db->query($sql1);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
    if(count($res) != 0)
    {
        echo json_encode($res);
    }
}