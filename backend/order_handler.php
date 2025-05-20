<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
    exit();
}

$conn = require 'database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['user_id']) || empty($data['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Không tìm thấy thông tin người dùng'
    ]);
    exit;
}

$user_id = intval($data['user_id']);
$vehicle = $data['vehicle'] ?? '';
$pickup_address = $data['pickup']['address'] ?? '';
$pickup_address_detail = $data['pickup']['addressDetail'] ?? '';
$sender_name = $data['pickup']['senderName'] ?? '';
$sender_phone = $data['pickup']['senderPhone'] ?? '';
$delivery_address = $data['delivery']['address'] ?? '';
$delivery_address_detail = $data['delivery']['addressDetail'] ?? '';
$receiver_name = $data['delivery']['receiverName'] ?? '';
$receiver_phone = $data['delivery']['receiverPhone'] ?? '';
$goods_type = $data['delivery']['goodsType'] ?? '';
$goods_value = intval($data['delivery']['goodsValue'] ?? 0);
$payment_method = $data['paymentMethod'] ?? 'cod';
$shipping_fee = intval($data['shippingFee'] ?? 0);
$is_paid = intval($data['isPaid'] ?? 0);

$sql = "INSERT INTO orders (
    user_id, vehicle, pickup_address, pickup_address_detail, sender_name, sender_phone, 
    delivery_address, delivery_address_detail, receiver_name, receiver_phone, goods_type, goods_value, 
    payment_method, shipping_fee, is_paid, status, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Chờ xác nhận', NOW())";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "issssssssssisii",
    $user_id,
    $vehicle,
    $pickup_address,
    $pickup_address_detail,
    $sender_name,
    $sender_phone,
    $delivery_address,
    $delivery_address_detail,
    $receiver_name,
    $receiver_phone,
    $goods_type,
    $goods_value,
    $payment_method,
    $shipping_fee,
    $is_paid
);

if ($stmt->execute()) {
    $order_id = $stmt->insert_id;
    echo json_encode([
        "success" => true,
        "message" => "Đặt đơn hàng thành công",
        "order_id" => $order_id
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi SQL: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>