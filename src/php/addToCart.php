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
            // Find the user
            $user = $collection->findOne(['_id' => new MongoDB\BSON\ObjectId($userId)]);

            if (!$user) {
                echo json_encode(['error' => 'User not found']);
                exit;
            }

            // Check if the cart item already exists
            $existingItemIndex = null;
            foreach ($user['cart'] as $index => $item) {
                if ($item['name'] === $cartItem['name'] && $item['size'] === $cartItem['size']) {
                    $existingItemIndex = $index;
                    break;
                }
            }

            if ($existingItemIndex !== null) {
                // Update the existing item
                $user['cart'][$existingItemIndex]['quantity'] += $cartItem['quantity'];
                $user['cart'][$existingItemIndex]['calculatedPrice'] += $cartItem['calculatedPrice'];

                // Update the user document with the new cart data
                $result = $collection->updateOne(
                    ['_id' => new MongoDB\BSON\ObjectId($userId)],
                    ['$set' => ['cart' => $user['cart']]]
                );
            } else {
                // Add a new item to the cart
                $result = $collection->updateOne(
                    ['_id' => new MongoDB\BSON\ObjectId($userId)],
                    ['$push' => ['cart' => $cartItem]]
                );
            }

            // Respond with the result
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
