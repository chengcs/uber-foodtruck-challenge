<?php
$prefix = $_GET['prefix'];

// Connect to mongodb database
$dbname = 'test';
$collname = 'foodtrucks';
$m = new MongoClient();
$db = $m->selectDB($dbname);
$collection = new MongoCollection($db, $collname);

// Query database
$regex = "/^".$prefix."/i";
$collection->ensureIndex(array('applicant' => 1));
$cursor = $collection->find(array('applicant' => array('$regex' => new MongoRegex("/^".$prefix."/i"))));

// Return json information
print_r(json_encode(iterator_to_array($cursor,false)));
?>
