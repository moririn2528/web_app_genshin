<?php

try{
    $mysql=new mysqli("localhost", "user_from_php_bmuF7Vtci7Qm", "PMyqccG3HR2g", "genshin1");
    
    if($mysql->connect_error){
        die("MySQL connect error: ".$mysql->connect_error);
    }
    
    if(!isset($_GET["get_respawn_time"])){
        $data=$mysql->query("select id,name,during_time from respawn_time");
        if($mysql->error){
            echo("Error: ".$mysql->error);
        }
        print(json_encode($data->fetch_all(MYSQLI_ASSOC)));
    }


    $mysql->close();

}catch(Exception $e){
    die("Error".$e->getMessage());
}

?>