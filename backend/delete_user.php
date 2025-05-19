<?php
require_once 'database.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        if ($id <= 0) {
            echo json_encode(["success" => false, "message" => "ID không hợp lệ"]);
            exit();
        }
        // Chỉ xóa nếu là employee
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ? AND role = 'employee'");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Xóa thành công"]);
        } else {
            echo json_encode(["success" => false, "message" => "Lỗi khi xóa"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Thiếu ID"]);
    }
}
$conn->close();
?>