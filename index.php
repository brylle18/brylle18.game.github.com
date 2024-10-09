<?php 
include 'game.php'; // Include your database connection file

// Set the default timezone
date_default_timezone_set("Asia/Manila");

// Get the JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Check if 'scores' is set and is an array
if (isset($data['scores']) && is_array($data['scores'])) {
    // Prepare the statement
    $stmt = $conn->prepare("INSERT INTO scores (team_name, score, game_date) VALUES (?, ?, ?)");

    // Check for errors in preparation
    if (!$stmt) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }

    // Get the current date
    $currentdate = date('Y-m-d');

    foreach ($data['scores'] as $score) {
        // Check if teamName is null or empty and set a default value
        $teamName = !empty($score['teamName']) ? $score['teamName'] : 'Unknown Team';
        $scored = !empty($score['score']) ? $score['score'] : 0; // Default score if empty

        // Bind parameters
        $stmt->bind_param("sis", $teamName, $scored, $currentdate);

        // Execute statement
        if (!$stmt->execute()) {
            echo json_encode(['error' => 'Execution failed: ' . $stmt->error]);
            exit;
        }
    }

    // Close the statement
    $stmt->close();

    // Return success message
    echo json_encode(['message' => 'Scores recorded successfully']);
} else {
    echo json_encode(['error' => 'Invalid data received']);
}
?>
    
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Player Scores</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
<header>
        <h1>Family Feud Game</h1>
    </header>

        <p>Welcome to Family Feud! Two families compete to guess popular survey answers, racking up points while avoiding strikes. The top-scoring family plays for the grand prize in the Fast Money round. Let the feud begin!</p>
        

    <section>
<div class="wrapper">
    <div class="game-container">
        <h2>Game Setup</h2>
    <div class="team1">
    <label for="team-name">Team A Name:
            <input type="text" id="team-name1" name="team-name">
        </label>
    </div>
    <div class="team2">
        <label for="team-name">Team B Name:
            <input type="text" id="team-name2" name="team-name">
        </label>
    </div>
    <button id="start">Start Game</button>
</div>

    <div class="container">
        <h2>Leaderboards</h2>
        <div class="player-info">
        </div>
        <table>
        <?php
            
                    $sql =  "SELECT player_name, score, game_date FROM scores";
                    $result = mysqli_query($conn, $sql);
                    if($result){
                    if(mysqli_num_rows($result)>0){
                        echo '<thead>
                        <th>Player name</th>
                        <th>Score</th>
                        <th>Date</th>
                        <tr>
                        </thead>';
                        while($row=mysqli_fetch_assoc($result)){
                        echo '<tbody>
                        <tr>
                        <td>'.$row['player_name'].'</td>
                        <td>'.$row['score'].'</td>
                        <td>'.$row['game_date'].'</td>
                        </tr>
                        </tbody>';
                        }
                    } else {
                        echo '<h2>No Scores</h2>';
                    }
                }
                ?>
        </table>
    </div>
</div>
</section>

<section>
<div class="container">
        <header>
            <h1>Family Feud</h1>
        </header>
        
        <div class="scoreboard">
            <div class="team">
                <h2>Team A</h2>
                <p>Score: <span id="scoreA">0</span></p>
                <button id="buzzTeamA">Buzz In</button>
            </div>

            <div class="team">
                <h2>Team B</h2>
                <p>Score: <span id="scoreB">0</span></p>
                <button id="buzzTeamB">Buzz In</button>
            </div>
        </div>

        <div class="question">
            <h2 id="currentQuestion">Question will appear here.</h2>
        </div>

        <div class="input-area">
            <input type="text" id="answerInput" placeholder="Type your answer here..." disabled>
            <button id="submitAnswer" disabled>Submit</button>
        </div>
        
        <div class="timer">
            <p>Time left: <span id="timeLeft">30</span> seconds</p>
        </div>

        <div class="answers">
            <!-- Answers will be populated dynamically -->
        </div>
        
        <footer>
            <p>&copy; 2024 Family Feud Game</p>
        </footer>
    </div>

        
</section>

    <script src="index.js"></script>
</body>
</html>
