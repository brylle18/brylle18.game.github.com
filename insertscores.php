<?php include 'game.php';

date_default_timezone_set("Asia/Manila");
    $currentdate = date('y-m-d');
    
    // Get the raw POST data
$data = file_get_contents('php://input');

// Decode the JSON data
$scores = json_decode($data, true);

if ($scores && isset($scores['scores'])) {
    foreach ($scores['scores'] as $score) {
        $teamName = $conn->real_escape_string($score['teamName']); // Escape special characters
        $scoreValue = (int)$score['score']; // Cast to integer for safety

        // Insert into database
        $sql = "INSERT INTO scores (team_name, score, date) VALUES ('$teamName', $scoreValue, '$currentdate')";

        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully for Team: $teamName with Score: $scoreValue<br>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }

    // Respond back with success
    echo json_encode(['status' => 'success', 'message' => 'Scores recorded successfully']);
} else {
    // Handle error if input is invalid
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
}

// Close connection
$conn->close();
?>