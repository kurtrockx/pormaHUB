<?php

// Include required files
require_once "./includes/cors.php"; // Handle CORS headers if necessary
require '../../vendor/autoload.php'; // Load Composer's autoloader for MongoDB
require_once './includes/atlas.php'; // Assuming this file connects to your MongoDB

// Database and collection initialization
$db = $client->pormaHUB; // Use the 'pormaHUB' database
$collection = $db->usersCollection; // Use the 'usersCollection' collection

// Get the raw POST data
$inputData = json_decode(file_get_contents("php://input"), true);

// Validate input data
if (isset($inputData['userId']) && isset($inputData['firstName']) && isset($inputData['lastName']) && isset($inputData['username']) && isset($inputData['email']) && isset($inputData['address']) && isset($inputData['contactNumber'])) {
    
    // Prepare the update data
    $updateData = [
        'firstName' => $inputData['firstName'],
        'lastName' => $inputData['lastName'],
        'username' => $inputData['username'],
        'email' => $inputData['email'],
        'location.address' => $inputData['address'],
        'contactNumber' => $inputData['contactNumber'],
    ];
    
    // Update the user's data in the database
    $result = $collection->updateOne(
        ['_id' => new MongoDB\BSON\ObjectId($inputData['userId'])], // Find user by ID
        ['$set' => $updateData] // Update the fields with the new data
    );

    // Check if the update was successful
    if ($result->getModifiedCount() > 0) {
        // Send a success response
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'User credentials updated successfully!']);
    } else {
        // If no records were modified (e.g., no change in data)
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Failed to update credentials. Please try again.']);
    }
} else {
    // Invalid input data, return an error message
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Invalid data. Please provide all required fields.']);
}

?>
