<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = require 'database.php';

// CẬP NHẬT: JOIN với bảng 'users' (d) thay vì 'drivers' (d)
// Thêm điều kiện d.role = 'driver' để đảm bảo chỉ join đúng tài xế
$sql = "SELECT 
    o.*, 
    i.invoice_number,
    i.amount,
    i.payment_method,
    i.status AS invoice_status,
    d.full_name AS driver_name
FROM orders o
LEFT JOIN invoices i ON o.id = i.order_id
LEFT JOIN users d ON d.id = o.driver_id AND d.role = 'driver'
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
    $row['id'] = (int)$row['id'];
    $row['user_id'] = (int)$row['user_id'];
    $row['amount'] = isset($row['amount']) ? (int)$row['amount'] : null;
    $row['driver_id'] = isset($row['driver_id']) ? (int)$row['driver_id'] : null;
    $row['driver_name'] = isset($row['driver_name']) ? $row['driver_name'] : null;

    $orders[] = $row;
}

echo json_encode($orders);

$conn->close();
