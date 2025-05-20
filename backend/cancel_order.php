<?php
header("Access-Control-Allow-Origin: http://localhost:5175");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = require 'database.php';
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['order_id'])) {
    echo json_encode(['success' => false, 'message' => 'Thiếu thông tin đơn hàng']);
    exit();
}

$order_id = $data['order_id'];

// Kiểm tra trạng thái đơn hàng
$checkSql = "SELECT status FROM orders WHERE id = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("i", $order_id);
$checkStmt->execute();
$result = $checkStmt->get_result();
$order = $result->fetch_assoc();

if (!$order) {
    echo json_encode(['success' => false, 'message' => 'Không tìm thấy đơn hàng']);
    exit();
}

if ($order['status'] !== 'Chờ xác nhận') {
    echo json_encode(['success' => false, 'message' => 'Chỉ có thể hủy đơn hàng trong trạng thái chờ xác nhận']);
    exit();
}

// Cập nhật trạng thái đơn hàng
$updateSql = "UPDATE orders SET status = 'Đã huỷ' WHERE id = ?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("i", $order_id);

if ($updateStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Hủy đơn hàng thành công']);
} else {
    echo json_encode(['success' => false, 'message' => 'Có lỗi xảy ra khi hủy đơn hàng']);
}