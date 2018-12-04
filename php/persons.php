<?php

require "db_connect.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET') 
{
    
    //###############################get logged records from db ###################################
            $sql1 = "SELECT * FROM Person ORDER BY id desc";
            $stmt = $db->query($sql1);
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if(count($res) == 0)
                {
                    echo "<h2>No record Found</h2>";
                }
            else
                {
                    echo json_encode($res);
                }
}