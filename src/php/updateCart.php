<?php
require_once "./includes/cors.php";
require '../../vendor/autoload.php';

$client = new MongoDB\Client;
$db = $client->pormaHUB;
$collection = $db->usersCollection;

$input = json_decode(file_get_contents('php://input'), true);

$userId = $input['userId'];
$cartItemId = strval($input['cartItemId']);  // Ensure it's a string
$itemSize = $input['itemSize'];  // Get item size
$newQuantity = $input['quantity'];

if (!$userId || !$cartItemId || !$itemSize || !isset($newQuantity)) {
    echo json_encode(['error' => 'Missing userId, cartItemId, itemSize, or quantity']);
    exit;
}

try {
    // Find the user in the database
    $user = $collection->findOne(['_id' => new MongoDB\BSON\ObjectId($userId)]);

    if (!$user) {
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    // Loop through the cart and find the item by matching both cartItemId and itemSize
    $updated = false;
    foreach ($user['cart'] as &$item) {
        // Check if both cartItemId and itemSize match
        if (trim($item['_id']['$oid']) === trim($cartItemId) && $item['size'] === $itemSize) {
            // Update the quantity of the matched cart item
            $item['quantity'] = (int)$newQuantity;
            $updated = true;
            break;
        }
    }

    if (!$updated) {
        error_log("Cart item not found for ID: " . $cartItemId . " with size: " . $itemSize);
    }

    // Update the cart in the database
    $collection->updateOne(
        ['_id' => new MongoDB\BSON\ObjectId($userId)],  // Use ObjectId for userId
        ['$set' => ['cart' => $user['cart']]]  // Update the cart field
    );

    echo json_encode(['message' => 'Cart updated successfully']);
} catch (Exception $e) {
    echo json_encode(['error' => 'Failed to update cart: ' . $e->getMessage()]);
}
