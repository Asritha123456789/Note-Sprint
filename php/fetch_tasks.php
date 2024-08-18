<?php
session_start();
include 'db_config.php';

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT id, task, date, time, completed FROM tasks WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$tasks = array();
while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

echo json_encode($tasks);

$stmt->close();
$conn->close();
?>
