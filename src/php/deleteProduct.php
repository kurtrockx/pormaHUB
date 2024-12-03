<?php
require_once "./includes/cors.php";  // Handle CORS headers
require '../../vendor/autoload.php';  // MongoDB Client Autoload

$client = new MongoDB\Client;
$db = $client->pormaHUB;
$collection = $db->productsCollection;

// Read the JSON input from the request body
$input = json_decode(file_get_contents('php://input'), true);

// Get the productName from the request
$productName = $input['productName'];

if (!$productName) {
    echo json_encode(['error' => 'Missing productName']);
    exit;
}

try {
    // Attempt to delete the product from the collection
    $deleteResult = $collection->deleteOne(['name' => $productName]);

    // Check if a product was deleted (matched count should be 1 if deleted)
    if ($deleteResult->getDeletedCount() === 0) {
        echo json_encode(['error' => 'Product not found']);
        exit;
    }

    // Success response
    echo json_encode(['message' => 'Product deleted successfully']);
} catch (Exception $e) {
    // Catch any exceptions that occur and return an error message
    echo json_encode(['error' => 'Failed to delete product: ' . $e->getMessage()]);
}
