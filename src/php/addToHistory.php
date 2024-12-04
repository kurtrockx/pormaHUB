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

if (isset($data['action'])) {
    // Handle updating purchase history
    if ($data['action'] == 'updatePurchaseHistory') {
        if (isset($data['userId']) && isset($data['purchaseItem'])) {
            $userId = $data['userId'];
            $purchaseItem = $data['purchaseItem'];

            try {
                // Find the user
                $user = $collection->findOne(['_id' => new MongoDB\BSON\ObjectId($userId)]);

                if (!$user) {
                    echo json_encode(['error' => 'User not found']);
                    exit;
                }

                // Add a new item to the purchase history
                $result = $collection->updateOne(
                    ['_id' => new MongoDB\BSON\ObjectId($userId)],
                    ['$push' => ['purchaseHistory' => $purchaseItem]]
                );

                // Respond with the result
                echo json_encode([
                    'message' => $result->getModifiedCount() > 0
                        ? 'Purchase history updated successfully'
                        : 'No changes made',
                ]);
            } catch (Exception $e) {
                echo json_encode(['error' => 'Failed to update purchase history: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['error' => 'Missing userId or purchaseItem']);
        }
    }
    // Handle clearing the cart
    elseif ($data['action'] == 'clearCart') {
        if (isset($data['userId'])) {
            $userId = $data['userId'];

            try {
                // Find the user
                $user = $collection->findOne(['_id' => new MongoDB\BSON\ObjectId($userId)]);

                if (!$user) {
                    echo json_encode(['error' => 'User not found']);
                    exit;
                }

                // Clear the user's cart
                $result = $collection->updateOne(
                    ['_id' => new MongoDB\BSON\ObjectId($userId)],
                    ['$set' => ['cart' => []]] // Set cart to an empty array
                );

                // Respond with the result
                echo json_encode([
                    'message' => $result->getModifiedCount() > 0
                        ? 'Cart cleared successfully'
                        : 'No changes made',
                ]);
            } catch (Exception $e) {
                echo json_encode(['error' => 'Failed to clear cart: ' . $e->getMessage()]);
            }
        } else {
            echo json_encode(['error' => 'Missing userId']);
        }
    } else {
        echo json_encode(['error' => 'Invalid action']);
    }
} else {
    echo json_encode(['error' => 'Action not specified']);
}
