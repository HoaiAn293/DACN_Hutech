<?php
require_once 'database.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$order_id = intval($data['order_id']);
$user_id = intval($data['user_id']);

$stmt = $conn->prepare("DELETE FROM reviews WHERE order_id = ? AND user_id = ?");
$stmt->bind_param("ii", $order_id, $user_id);
if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi xóa đánh giá"]);
}
$stmt->close();
$conn->close();
?>