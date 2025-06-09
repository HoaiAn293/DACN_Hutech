<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Phương thức không được hỗ trợ']);
    exit();
}

// Đọc dữ liệu JSON từ request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Thiếu ID đơn hàng']);
    exit();
}

$orderId = $data['id'];

try {
    // Kiểm tra xem đơn hàng có tồn tại và có trạng thái "Đã huỷ" không
    $checkStmt = $conn->prepare("SELECT status FROM orders WHERE id = ?");
    $checkStmt->bind_param("i", $orderId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy đơn hàng']);
        exit();
    }
    
    $order = $result->fetch_assoc();
    if ($order['status'] !== 'Đã huỷ') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Chỉ có thể xóa đơn hàng đã huỷ']);
        exit();
    }
    
    // Thực hiện xóa đơn hàng
    $deleteStmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
    $deleteStmt->bind_param("i", $orderId);
    
    if ($deleteStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Đã xóa đơn hàng thành công']);
    } else {
        throw new Exception("Lỗi khi xóa đơn hàng");
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    if (isset($checkStmt)) $checkStmt->close();
    if (isset($deleteStmt)) $deleteStmt->close();
    $conn->close();
}