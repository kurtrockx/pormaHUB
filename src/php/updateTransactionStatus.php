<?php
require_once "./includes/cors.php";
require '../../vendor/autoload.php';
require_once './includes/atlas.php';

$db = $client->pormaHUB;
$collection = $db->usersCollection;

$input = json_decode(file_get_contents('php://input'), true);

$transactionId = $input['transactionId'];
$newStatus = $input['newStatus'];

if (empty($transactionId) || empty($newStatus)) {
    echo json_encode(['error' => 'Missing transactionId or newStatus']);
    exit;
}

error_log("Received transactionId: " . $transactionId);
error_log("Received newStatus: " . $newStatus);

$document = $collection->findOne(['purchaseHistory.id' => $transactionId]);

if (!$document) {
    echo json_encode(['error' => 'Transaction not found']);
    exit;
}

error_log("Matched document: " . var_export($document, true));

$updateResult = $collection->updateOne(
    ['purchaseHistory.id' => $transactionId],
    ['$set' => ['purchaseHistory.$.status' => $newStatus]]
);

// Check if the update was successful
if ($updateResult->getMatchedCount() === 0) {
    echo json_encode(['error' => 'Transaction not found or no status change']);
    exit;
}

echo json_encode(['message' => 'Transaction status updated successfully']);
