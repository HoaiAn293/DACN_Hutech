<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = require 'database.php';

$result = $conn->query("SELECT id, full_name, phone_number, cccd, created_at FROM users WHERE role = 'employee' ORDER BY created_at ASC");

$drivers = [];

while ($row = $result->fetch_assoc()) {
    $drivers[] = $row;
}

echo json_encode($drivers);
