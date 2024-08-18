<?php
session_start();
include 'db_config.php';

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT event_title, event_date FROM events WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = [
            'event_title' => $row['event_title'],
            'event_date' => $row['event_date']
        ];
    }

    $stmt->close();
    $conn->close();

    echo json_encode($events);
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not authenticated']);
}
?>
