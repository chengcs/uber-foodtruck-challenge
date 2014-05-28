<?php
$lng=$_GET["lng"];
$lat=$_GET["lat"];

$limit = 10; // number of nearest food trucks to retrieve

// Connect to mongodb database
$dbname = 'test';
$collname = 'foodtrucks';
$m = new MongoClient();
$db = $m->selectDB($dbname);
$collection = new MongoCollection($db, $collname);

// Find the nearest food trucks
$collection->ensureIndex(array('loc' => '2d'));
$cursor = $collection->find(array('loc' => array('$near' => array(floatval($lng),floatval($lat)))))->limit($limit);

// Return query json information
print_r(json_encode(iterator_to_array($cursor,false)));
?>
