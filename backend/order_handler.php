<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    if (!(error_reporting() & $errno)) {
        return false;
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi hệ thống: ' . $errstr
    ]);
    exit;
});

set_exception_handler(function($exception) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi hệ thống: ' . $exception->getMessage()
    ]);
    exit;
});

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
    exit();
}

try {
    $conn = require 'database.php';
    
    if (!$conn) {
        throw new Exception('Không thể kết nối đến cơ sở dữ liệu');
    }

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Dữ liệu JSON không hợp lệ: ' . json_last_error_msg());
    }

    if (!isset($data['user_id']) || empty($data['user_id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Không tìm thấy thông tin người dùng'
        ]);
        exit;
    }

    $user_id = intval($data['user_id']);
    
    // 验证用户是否存在
    $check_user_sql = "SELECT id FROM users WHERE id = ?";
    $check_user_stmt = $conn->prepare($check_user_sql);
    if (!$check_user_stmt) {
        throw new Exception('Lỗi chuẩn bị SQL kiểm tra người dùng: ' . $conn->error);
    }
    $check_user_stmt->bind_param("i", $user_id);
    $check_user_stmt->execute();
    $user_result = $check_user_stmt->get_result();
    
    if ($user_result->num_rows === 0) {
        $check_user_stmt->close();
        echo json_encode([
            'success' => false,
            'message' => 'Người dùng không tồn tại trong hệ thống. Vui lòng đăng nhập lại.'
        ]);
        exit;
    }
    $check_user_stmt->close();
    
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

    // 验证必需字段
    if (empty($pickup_address) || empty($delivery_address) || empty($sender_name) || 
        empty($sender_phone) || empty($receiver_name) || empty($receiver_phone)) {
        echo json_encode([
            'success' => false,
            'message' => 'Thiếu thông tin bắt buộc'
        ]);
        exit;
    }

    $sql = "INSERT INTO orders (
        user_id, vehicle, pickup_address, pickup_address_detail, sender_name, sender_phone, 
        delivery_address, delivery_address_detail, receiver_name, receiver_phone, goods_type, goods_value, 
        payment_method, shipping_fee, is_paid, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Chờ xác nhận', NOW())";

    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Lỗi chuẩn bị SQL: ' . $conn->error);
    }

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
        // 检查是否是外键约束错误
        $error_message = $stmt->error;
        if (strpos($error_message, 'foreign key constraint') !== false) {
            $error_message = 'Người dùng không tồn tại trong hệ thống. Vui lòng đăng nhập lại.';
        }
        echo json_encode([
            "success" => false,
            "message" => "Lỗi SQL: " . $error_message
        ]);
    }

    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi hệ thống: ' . $e->getMessage()
    ]);
    exit;
}
?>