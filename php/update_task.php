<?php
session_start();
include 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $completed = $_POST['completed'] == 'true' ? 1 : 0;

    $stmt = $conn->prepare("UPDATE tasks SET completed = ? WHERE id = ?");
    $stmt->bind_param("ii", $completed, $id);
    
    if ($stmt->execute()) {
        echo "Task updated successfully";
    } else {
        echo "Failed to update task";
    }
    $stmt->close();
    $conn->close();
}
?>
