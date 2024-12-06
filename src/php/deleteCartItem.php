<?php

require_once "./includes/cors.php";
require '../../vendor/autoload.php';

// Connect to MongoDB
$uri = 'mongodb+srv://kurtrockx:databasePassword@pormahub.t3dph.mongodb.net/?retryWrites=true&w=majority&appName=pormaHUB';

$client = new MongoDB\Client($uri);
$db = $client->pormaHUB;
$collection = $db->usersCollection;


if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get the incoming data from the request body
    $input = json_decode(file_get_contents('php://input'), true);

    // Ensure userId, itemName, and itemSize are provided
    if (!isset($input['userId']) || !isset($input['itemName']) || !isset($input['itemSize'])) {
        echo json_encode(['success' => false, 'message' => 'User ID, Item Name, or Item Size missing']);
        http_response_code(400);
        exit;
    }

    // Retrieve userId, itemName, and itemSize from the request
    $userId = $input['userId'];
    $itemName = $input['itemName'];
    $itemSize = $input['itemSize'];

    // Debug logs for clarity
    error_log("User ID: " . $userId);
    error_log("Item Name: " . $itemName);
    error_log("Item Size: " . $itemSize);

    try {
        $userObjectId = new MongoDB\BSON\ObjectId($userId);

        error_log("Converted User ID: " . $userObjectId);

        $user = $collection->findOne(['_id' => $userObjectId]);

        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'User not found']);
            http_response_code(404);
            exit;
        }

        $result = $collection->updateOne(
            [
                "_id" => $userObjectId,
                "cart.name" => $itemName,
                "cart.size" => $itemSize
            ],
            [
                '$pull' => [
                    'cart' => [
                        'name' => $itemName,
                        'size' => $itemSize
                    ]
                ]
            ]
        );

        if ($result->getModifiedCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Item deleted from cart']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete item']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        http_response_code(500);
    }
}
