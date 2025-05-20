<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = require 'database.php';

$sql = "SELECT 
            o.*, 
            d.full_name AS driver_name 
        FROM orders o 
        LEFT JOIN drivers d ON o.driver_id = d.id 
        ORDER BY o.created_at DESC";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Lỗi truy vấn dữ liệu: " . $conn->error
    ]);
    exit;
}

$orders = [];

while ($row = $result->fetch_assoc()) {
    // Nếu muốn ép kiểu một số trường về int
    $row['id'] = (int)$row['id'];
    $row['user_id'] = (int)$row['user_id'];
    $row['goods_value'] = isset($row['goods_value']) ? (int)$row['goods_value'] : null;
    $row['shipping_fee'] = isset($row['shipping_fee']) ? (int)$row['shipping_fee'] : null;
    $row['is_paid'] = isset($row['is_paid']) ? (int)$row['is_paid'] : null;
    $row['driver_id'] = isset($row['driver_id']) ? (int)$row['driver_id'] : null;

    $orders[] = $row;
}

echo json_encode($orders);

$conn->close();