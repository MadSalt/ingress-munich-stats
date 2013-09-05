<?php
require_once("db_config.php");

header('Content-type: text/plain');

$levels = array(0,1E4,3E4,7E4,15E4,3E5,6E5,12E5,24E5,48E5,96E5,192E5,384E5,768E5);
$qGet = "SELECT s.nick,s.faction,s.ap,UNIX_TIMESTAMP(s.updated)
FROM `stats` as s

WHERE s.updated = (SELECT MAX(updated) FROM stats as t WHERE t.nick=s.nick)
group by nick 
ORDER BY s.ap DESC, s.updated ASC
";


$db = new mysqli("localhost", DBUSER, DBPASS, DB);
$i = 0;
if ($stmt = $db->prepare($qGet)) {
    #$stmt->bind_param('s', $nick);
    $stmt->execute();
    $stmt->bind_result($nick,$faction,$ap,$ts);
    printf("%4s %20s %20s   %5s %12s %20s\n","Rang","Nickname","Faction","Level","AP","Update");
    while($stmt->fetch()){
        $i++;
        for ($level = 0;$ap > $levels[$level]; $level++);
        
        printf("%4d %20s %20s   %5s %12s %20s\n",$i ,$nick ,$faction, $level, number_format($ap,0,",",".") ,date("d.m.Y - H:i",$ts));
    }
}


printf("\n\n\nSeite wird noch überarbeitet\nGeplant:\n- HTML\n- Farben\n- Sortierung\n- Summen");
printf("\nPlugin gibts hier: http://ingress-munich.de/stats/plugin/send-ap-munich.user.js\n");
printf("Erklärung im Post: https://plus.google.com/u/0/107503155199666511551/posts/8ZVRhYqDZvw \n");
printf("Contact: https://plus.google.com/u/0/107503155199666511551/posts");
?>
