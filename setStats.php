<?php
require_once("db_config.php");
function ende($e){
    die(json_encode($e));
}
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');

try {
    $ap = intval($_POST['ap']);
    $nick = $_POST['player'];
    $faction  = $_POST['team'];
    $pw = $_POST['pw'];
    if($pw == "" || $nick == "" || $faction == "" || $ap <= 0){
        throw new Exception("Data error");
    }
}
catch( Exception $e ) {
    die(json_encode($e));
}
$r = array();
$qLogin = "SELECT pw FROM users WHERE nick=?";
$qCreate = "INSERT INTO users SET nick=?, pw=?";
$qUpdate = "INSERT INTO stats SET nick=?, faction=?, ap=?";


$db = new mysqli("localhost",  DBUSER, DBPASS, DB);

if ($stmt = $db->prepare($qLogin)) {
    $stmt->bind_param('s', $nick);
    $stmt->execute();
    $stmt->bind_result($db_pw);
    if($stmt->fetch()){
        # User exists
        if ( $pw ==  $db_pw) {
            # access granted
            $r['code'] = 200;
            $r['userstatus'] = "existing";
        } 
        else {
            # access denied
            ende(array('code' => 403));
        }
    }
    else {
        # User new
        $stmt2 = $db->prepare($qCreate);
        $stmt2->bind_param('ss', $nick, $pw);
        $stmt2->execute();
        $stmt2->close();

        $r['code'] = 200;   
        $r['userstatus'] = "created";
    }
    $stmt->close(); 
    # Set Stats
    $stmt3 = $db->prepare($qUpdate);
    $stmt3->bind_param('ssi', $nick, $faction, $ap);
    $stmt3->execute();

    
}

ende($r);
?>

