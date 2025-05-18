<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Thêm các headers CORS cần thiết
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Xử lý preflight request OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Chỉ tiếp tục xử lý nếu là POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Phương thức không được hỗ trợ']);
    exit();
}

$conn = require 'database.php';

$data = json_decode(file_get_contents('php://input'), true);

// Kiểm tra và lấy user_id
if (!isset($data['user_id']) || empty($data['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Không tìm thấy thông tin người dùng'
    ]);
    exit;
}

$user_id = intval($data['user_id']);

// Chuẩn bị câu lệnh SQL với user_id
$sql = "INSERT INTO orders (user_id, vehicle, pickup_address, pickup_address_detail, sender_name, sender_phone, 
        delivery_address, delivery_address_detail, receiver_name, receiver_phone, goods_type, goods_value, 
        payment_method, shipping_fee, is_paid, status, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Chờ xác nhận', NOW())";

$stmt = $conn->prepare($sql);

$payment_method = $data['payment_method'] ?? 'COD';
$shipping_fee = floatval($data['shipping_fee'] ?? 0);
$is_paid = $data['is_paid'] ?? '0';

$stmt->bind_param("issssssssssdiss",
    $user_id,
    $data['vehicle'],
    $data['pickup']['address'],
    $data['pickup']['addressDetail'],
    $data['pickup']['senderName'],
    $data['pickup']['senderPhone'],
    $data['delivery']['address'],
    $data['delivery']['addressDetail'],
    $data['delivery']['receiverName'],
    $data['delivery']['receiverPhone'],
    $data['delivery']['goodsType'],
    $data['delivery']['goodsValue'],
    $payment_method,
    $shipping_fee,
    $is_paid
);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Đặt đơn hàng thành công"]);
} else {
    echo json_encode(["status" => "error", "message" => "Lỗi SQL: " . $stmt->error]);
}

$stmt->close();
$conn->close();
