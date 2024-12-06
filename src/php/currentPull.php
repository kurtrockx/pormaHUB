<?php

require_once "./includes/cors.php";
require '../../vendor/autoload.php';

use MongoDB\BSON\ObjectId;

$uri = 'mongodb+srv://kurtrockx:databasePassword@pormahub.t3dph.mongodb.net/?retryWrites=true&w=majority&appName=pormaHUB';

$client = new MongoDB\Client($uri);
$db = $client->pormaHUB;
$collection = $db->usersCollection;

// Get the raw POST data
$postData = file_get_contents("php://input");

// Decode JSON to PHP array
$request = json_decode($postData, true);

if (isset($request['userId'])) {
    $userId = $request['userId'];

    try {
        // Attempt to convert userId to ObjectId
        $objectId = new ObjectId($userId);

        // Query by _id
        $filter = ['_id' => $objectId];
        $data = $collection->findOne($filter); // Fetch a single document

        // Check if data was found
        if ($data === null) {
            echo json_encode(['message' => 'No user found']);
        } else {
            echo json_encode($data); // Return the single document directly
        }
    } catch (Exception $e) {
        // Handle invalid ObjectId or other errors
        echo json_encode(['message' => 'Invalid userId format', 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['message' => 'userId not provided']);
}
