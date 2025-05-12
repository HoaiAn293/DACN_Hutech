<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$conn = require 'database.php';

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Không có dữ liệu gửi lên"]);
    exit;
}

$vehicle = $data['vehicle'] ?? '';
$pickup = $data['pickup'] ?? [];
$delivery = $data['delivery'] ?? [];
$status = "Chờ xác nhận"; // mặc định trạng thái ban đầu

if (
    !$vehicle ||
    empty($pickup['address']) || empty($pickup['senderName']) || empty($pickup['senderPhone']) ||
    empty($delivery['address']) || empty($delivery['receiverName']) || empty($delivery['receiverPhone']) ||
    empty($delivery['goodsType']) || !isset($delivery['goodsValue'])
) {
    echo json_encode(["status" => "error", "message" => "Thiếu thông tin đơn hàng"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO orders (
    vehicle,
    pickup_address, pickup_address_detail, sender_name, sender_phone,
    delivery_address, delivery_address_detail, receiver_name, receiver_phone,
    goods_type, goods_value, status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
    "ssssssssssis",
    $vehicle,
    $pickup['address'],
    $pickup['addressDetail'],
    $pickup['senderName'],
    $pickup['senderPhone'],
    $delivery['address'],
    $delivery['addressDetail'],
    $delivery['receiverName'],
    $delivery['receiverPhone'],
    $delivery['goodsType'],
    $delivery['goodsValue'],
    $status
);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Đặt đơn hàng thành công"]);
} else {
    echo json_encode(["status" => "error", "message" => "Lỗi SQL: " . $stmt->error]);
}

$stmt->close();
$conn->close();
