<?php

require "db_connect.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
    
    //###############################get logged records from db ###################################
    $numOfRecord = $_POST["numRec"];
    if(isset($numOfRecord))
    {
            $sql1 = "SELECT * FROM Maillog ORDER BY id desc LIMIT 100";
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
}