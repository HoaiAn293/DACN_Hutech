<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

$conn = require 'database.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$status = $data['status'] ?? null;
$driver_id = isset($data['driver_id']) ? intval($data['driver_id']) : null;

if (!$id) {
    echo json_encode(["status" => "error", "message" => "Thiếu ID đơn hàng"]);
    exit;
}

$fields = [];
$params = [];
$types = '';

if ($status !== null) {
    $fields[] = "status = ?";
    $params[] = $status;
    $types .= 's';
}

if ($driver_id !== null) {
    $fields[] = "driver_id = ?";
    $params[] = $driver_id;
    $types .= 'i';
}

if (count($fields) === 0) {
    echo json_encode(["status" => "error", "message" => "Không có dữ liệu cập nhật"]);
    exit;
}

$sql = "UPDATE orders SET " . implode(", ", $fields) . " WHERE id = ?";
$params[] = $id;
$types .= 'i';

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Cập nhật thành công"]);
} else {
    echo json_encode(["status" => "error", "message" => "Lỗi SQL: " . $stmt->error]);
}

$stmt->close();
$conn->close();