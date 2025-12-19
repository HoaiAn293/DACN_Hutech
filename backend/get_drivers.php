<?php
session_start();
require_once 'database.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// CẬP NHẬT: Lấy thêm current_lat, current_lng
// Chỉ lấy tài xế đang active và ĐÃ CÓ VỊ TRÍ (lat/lng không null)
$sql = "SELECT id, full_name, phone_number, current_lat, current_lng 
        FROM users 
        WHERE role = 'driver' 
        AND status = 'active' 
        AND current_lat IS NOT NULL 
        AND current_lng IS NOT NULL";

$result = $conn->query($sql);

$drivers = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Ép kiểu dữ liệu về float để React sử dụng được
        $row['current_lat'] = (float)$row['current_lat'];
        $row['current_lng'] = (float)$row['current_lng'];
        $drivers[] = $row;
    }
}

echo json_encode($drivers);
$conn->close();
