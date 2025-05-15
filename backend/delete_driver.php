<?php
session_start();
require_once 'database.php';

// Thiết lập các header CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Xử lý request OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $id = $data['id'] ?? 0;

    if (empty($id)) {
        echo json_encode(["success" => false, "message" => "Thiếu ID tài xế cần xóa!"]);
        exit();
    }

    $sql = "DELETE FROM drivers WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Xóa tài xế thành công!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Đã có lỗi xảy ra khi xóa."]);
    }

    $stmt->close();
    $conn->close();
}
?>