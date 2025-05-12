<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

$conn = require 'database.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$status = $data['status'] ?? null;

// Kiểm tra dữ liệu
if (!$id || !$status) {
    echo json_encode(["status" => "error", "message" => "Thiếu ID hoặc trạng thái"]);
    exit;
}

$stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Cập nhật trạng thái thành công"]);
} else {
    echo json_encode(["status" => "error", "message" => "Lỗi SQL: " . $stmt->error]);
}

$stmt->close();
$conn->close();
