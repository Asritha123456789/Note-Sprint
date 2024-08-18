<?php
session_start();
include 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $task = $_POST['task'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("INSERT INTO tasks (user_id, task, date, time) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $user_id, $task, $date, $time);
    
    if ($stmt->execute()) {
        echo "Task added successfully";
    } else {
        echo "Failed to add task";
    }
    $stmt->close();
    $conn->close();
}
?>
