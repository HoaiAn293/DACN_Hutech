<?php
session_start();
require_once 'database.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$sql = "SELECT id, full_name, phone_number, cccd, license_number, vehicle_type, created_at, note, status, image_url FROM drivers";
$result = $conn->query($sql);

$drivers = [];
while ($row = $result->fetch_assoc()) {
    $drivers[] = $row;
}

echo json_encode($drivers);
$conn->close();
?>