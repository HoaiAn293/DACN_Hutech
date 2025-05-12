<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
$conn = require 'database.php';

$status = $_GET['status'] ?? null;

if ($status) {
    $stmt = $conn->prepare("SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC");
    $stmt->bind_param("s", $status);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query("SELECT * FROM orders ORDER BY created_at DESC");
}

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode($orders);
