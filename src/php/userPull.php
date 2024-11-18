<?php

require_once "includes/cors.php";
require '../../vendor/autoload.php';

$client = new MongoDB\Client;
$db = $client->pormaHUB;
$collection = $db->usersCollection;


$data = $collection->find()->toArray();

header('Content-Type: application/json');
echo json_encode($data);
