<?php
session_start();
include 'db_config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $data = json_decode(file_get_contents('php://input'), true);
    $event_title = $data['title'];
    $event_date = $data['date'];

    $stmt = $conn->prepare("DELETE FROM events WHERE user_id = ? AND event_title = ? AND event_date = ?");
    $stmt->bind_param("iss", $user_id, $event_title, $event_date);
    if (!$stmt->execute()) {
        echo json_encode(['status' => 'error', 'message' => $stmt->error]);
        $stmt->close();
        $conn->close();
        exit();
    }
    $stmt->close();
    $conn->close();

    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request or session']);
}
?>
