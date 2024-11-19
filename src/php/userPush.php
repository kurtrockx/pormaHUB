<?php

require_once "./includes/cors.php";
require '../../vendor/autoload.php';

$client = new MongoDB\Client;
$db = $client->pormaHUB;
$collection = $db->usersCollection;

$inputData = file_get_contents("php://input");

$data = json_decode($inputData, true);

if (!$data) {
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

if (isset($data['action']) && $data['action'] == 'add' && isset($data['user'])) {
    $newUser = $data['user'];
    $result = $collection->insertOne($newUser);

    echo json_encode([
        'message' => 'User Successfully Registered',
        'insertedId' => (string)$result->getInsertedId()
    ]);
} else {
    echo json_encode(['error' => 'No product data received']);
}
