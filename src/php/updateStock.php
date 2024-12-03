<?php
require_once "./includes/cors.php";
require '../../vendor/autoload.php';

$client = new MongoDB\Client;
$db = $client->pormaHUB;
$collection = $db->productsCollection;

$input = json_decode(file_get_contents('php://input'), true);

$productName = $input['productName'];
$newStock = $input['stock'];

if (!$productName || !isset($newStock)) {
    echo json_encode(['error' => 'Missing productName, or stock']);
    exit;
}

try {
    $updateResult = $collection->updateOne(
        ['name' => $productName],
        ['$set' => ['stock' => (int) $newStock]]
    );

    if ($updateResult->getMatchedCount() === 0) {
        echo json_encode(['error' => 'Product not found']);
        exit;
    }

    echo json_encode(['message' => 'Product updated successfully']);
} catch (Exception $e) {
    echo json_encode(['error' => 'Failed to update cart: ' . $e->getMessage()]);
}