<?php

require_once "./includes/cors.php";
require '../../vendor/autoload.php';

$uri = 'mongodb+srv://kurtrockx:databasePassword@pormahub.t3dph.mongodb.net/?retryWrites=true&w=majority&appName=pormaHUB';

$client = new MongoDB\Client($uri);
$db = $client->pormaHUB;
$collection = $db->productsCollection;


$data = $collection->find()->toArray();

header('Content-Type: application/json');
echo json_encode($data);
