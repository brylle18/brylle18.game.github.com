<?php
header("Access-Control-Allow-Origin: *");

define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'family_feud');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection Failed: ' . $conn->connect_error]);
    exit; // Stop further execution
}

?>