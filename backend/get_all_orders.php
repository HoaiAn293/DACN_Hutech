<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = require 'database.php';

try {
    $sql = "SELECT * FROM orders ORDER BY created_at DESC";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Lỗi truy vấn dữ liệu");
    }

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo json_encode($orders);
} catch (Exception $e) {
    echo json_encode([
        "error" => true,
        "message" => $e->getMessage()
    ]);
}