<?php

require_once "./includes/cors.php";
require '../../vendor/autoload.php';


require_once './includes/atlas.php';
$db = $client->pormaHUB;
$collection = $db->usersCollection;

$inputData = file_get_contents("php://input");
$data = json_decode($inputData, true);

if (!$data) {
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

if (isset($data['action']) && $data['action'] == 'sendMessage') {
    if (isset($data['userId']) && isset($data['chatMessage'])) {
        $userId = $data['userId'];
        $chatMessage = $data['chatMessage'];

        try {
            // Find the user
            $user = $collection->findOne(['_id' => new MongoDB\BSON\ObjectId($userId)]);

            if (!$user) {
                echo json_encode(['error' => 'User not found']);
                exit;
            }
            $result = $collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($userId)],
                ['$push' => ['chat' => $chatMessage]]
            );

            echo json_encode([
                'message' => $result->getModifiedCount() > 0
                    ? 'Cart updated successfully'
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
