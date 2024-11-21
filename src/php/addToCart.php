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

if (isset($data['action']) && $data['action'] == 'updateCart') {
    if (isset($data['userId']) && isset($data['cartItem'])) {

        $userId = $data['userId'];
        $cartItem = $data['cartItem'];
        try {
            $result = $collection->updateOne(

                ['_id' => new MongoDB\BSON\ObjectId($userId)],
                ['$push' => ['cart' => $cartItem]]
            );

            // Respond with the result
            echo json_encode([
                'message' => $result->getModifiedCount() > 0
                    ? 'Item added to cart successfully'
                    : 'No changes made',
            ]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to update cart: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Missing userId or cartItem']);
    }
} else {
    echo json_encode(['error' => 'Invalid action']);
}
