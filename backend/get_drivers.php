<?php
session_start();
require_once 'database.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// CẬP NHẬT: Lấy tài xế từ bảng 'users' (thay vì 'drivers')
// Chỉ lấy những tài xế đang 'active'
$sql = "SELECT id, full_name 
        FROM users 
        WHERE role = 'driver' AND status = 'active'";

$result = $conn->query($sql);

$drivers = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $drivers[] = $row;
    }
}

echo json_encode($drivers);
$conn->close();
