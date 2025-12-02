<?php
require_once 'database.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
error_log("Received data: " . print_r($data, true));

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $order_id = intval($data['order_id']);
    $user_id = intval($data['user_id']);
    $driver_id = intval($data['driver_id']);
    $rating = intval($data['rating']);
    $comment = trim($data['comment']);

    // Kiểm tra đã có đánh giá chưa
    $check = $conn->prepare("SELECT id FROM reviews WHERE order_id = ? AND user_id = ?");
    $check->bind_param("ii", $order_id, $user_id);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Bạn đã đánh giá đơn này rồi!"]);
        $check->close();
        $conn->close();
        exit;
    }
    $check->close();

    // 1. KIỂM TRA ĐƠN HÀNG CÓ TỒN TẠI VÀ ĐÃ HOÀN TẤT
    $check_order = $conn->prepare("SELECT status, driver_id FROM orders WHERE id = ? AND user_id = ?");
    $check_order->bind_param("ii", $order_id, $user_id);
    $check_order->execute();
    $result_order = $check_order->get_result();
    $order = $result_order->fetch_assoc();
    $check_order->close();
    if (!$order || $order['status'] !== 'Hoàn tất' || !$order['driver_id']) {
        echo json_encode(["success" => false, "message" => "Đơn hàng không hợp lệ hoặc chưa hoàn tất"]);
        $conn->close();
        exit;
    }

    if ($order_id && $user_id && $driver_id && $rating >= 1 && $rating <= 5) {
        $suggestions = isset($data['suggestions']) ? json_encode($data['suggestions']) : null;
        $images = isset($data['images']) ? json_encode($data['images']) : null;

        $stmt = $conn->prepare("INSERT INTO reviews (order_id, user_id, driver_id, rating, comment, suggestions, images) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iiiisss", $order_id, $user_id, $driver_id, $rating, $comment, $suggestions, $images);
        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Lỗi khi lưu đánh giá",
                "error" => $stmt->error // Thêm dòng này
            ]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
    }
}
$conn->close();
?>