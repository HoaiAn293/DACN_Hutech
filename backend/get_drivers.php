<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = require 'database.php';

$drivers = [];

$result = $conn->query("SELECT id, full_name, phone_number, cccd, license_number, vehicle_type, created_at, note, status FROM drivers ORDER BY created_at ASC");

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $drivers[] = $row;
    }
    echo json_encode($drivers);
} else {
    echo json_encode(["error" => "Lỗi truy vấn dữ liệu"]);
}