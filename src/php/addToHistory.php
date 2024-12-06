<?php

require_once "./includes/cors.php";
require '../../vendor/autoload.php';

$uri = 'mongodb+srv://kurtrockx:databasePassword@pormahub.t3dph.mongodb.net/?retryWrites=true&w=majority&appName=pormaHUB';

$client = new MongoDB\Client($uri);
$db = $client->pormaHUB;
$collection = $db->usersCollection; // User collection
$productsCollection = $db->productsCollection; // Product collection

$inputData = file_get_contents("php://input");
$data = json_decode($inputData, true);

if (!$data) {
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

if (isset($data['action'])) {
    // Handle updating purchase history and reducing stock
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
    // Handle clearing the cart and reducing stock
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

                // Loop through each item in the user's cart and reduce stock in the products collection
                foreach ($user['cart'] as $cartItem) {
                    $productName = $cartItem['name'];
                    $quantityToReduce = $cartItem['quantity'];

                    // Find the product in the products collection
                    $product = $productsCollection->findOne(['name' => $productName]);

                    if ($product) {
                        // Reduce the stock by the quantity of the item being purchased
                        $newStock = $product['stock'] - $quantityToReduce;

                        // Ensure stock doesn't go negative
                        if ($newStock < 0) {
                            echo json_encode(['error' => 'Not enough stock for ' . $productName]);
                            exit;
                        }

                        // Update the stock in the products collection
                        $productsCollection->updateOne(
                            ['name' => $productName],
                            ['$set' => ['stock' => $newStock]]
                        );
                    } else {
                        echo json_encode(['error' => 'Product ' . $productName . ' not found']);
                        exit;
                    }
                }

                // Now, clear the user's cart
                $result = $collection->updateOne(
                    ['_id' => new MongoDB\BSON\ObjectId($userId)],
                    ['$set' => ['cart' => []]] // Set cart to an empty array
                );

                // Respond with the result
                echo json_encode([
                    'message' => $result->getModifiedCount() > 0
                        ? 'Cart cleared successfully, and stock updated'
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
