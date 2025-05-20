<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = require 'database.php';

// Lấy tất cả đơn hàng cùng thông tin tài xế (nếu có)
$sql = "SELECT o.*, d.full_name AS driver_name, d.vehicle_type AS driver_vehicle_type
        FROM orders o
        LEFT JOIN drivers d ON o.driver_id = d.id
        ORDER BY o.created_at DESC";

$result = $conn->query($sql);

$orders = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    echo json_encode($orders);
} else {
    echo json_encode(["error" => "Lỗi truy vấn dữ liệu"]);
}