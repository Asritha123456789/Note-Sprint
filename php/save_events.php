<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
include 'db_config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $events = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input: ' . json_last_error_msg()]);
        exit();
    }

    // Debugging: Log the received events
    file_put_contents('php://stderr', print_r($events, true));

    $stmt = $conn->prepare("INSERT INTO events (user_id, event_title, event_date) VALUES (?, ?, ?)");
    if ($stmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'Prepare failed: ' . $conn->error]);
        exit();
    }

    foreach ($events as $event) {
        // Debugging: Log each event
        file_put_contents('php://stderr', print_r($event, true));

        if (!isset($event['date']) || !isset($event['title']) || empty($event['title'])) {
            echo json_encode(['status' => 'error', 'message' => 'Missing or invalid event data: ' . json_encode($event)]);
            exit();
        }

        $event_date = $event['date'];
        $event_title = $event['title'];

        $stmt->bind_param("iss", $user_id, $event_title, $event_date);
        if (!$stmt->execute()) {
            echo json_encode(['status' => 'error', 'message' => 'Execute failed: ' . $stmt->error]);
            $stmt->close();
            $conn->close();
            exit();
        }
    }
    $stmt->close();
    $conn->close();
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request or session']);
}
?>
