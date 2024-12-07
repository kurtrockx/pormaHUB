<?php

require_once "./includes/cors.php";
require '../../vendor/autoload.php';

require_once './includes/atlas.php';
$db = $client->pormaHUB;
$collection = $db->productsCollection;


$data = $collection->find()->toArray();

header('Content-Type: application/json');
echo json_encode($data);
