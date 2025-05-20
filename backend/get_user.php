<?php
require_once 'database.php';

header("Access-Control-Allow-Origin: http://localhost:5175");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        if ($id <= 0) {
            echo json_encode(["success" => false, "message" => "ID không hợp lệ"]);
            exit();
        }

        $stmt = $conn->prepare("SELECT id, full_name, email, phone_number, role, created_at FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            echo json_encode(["success" => true, "user" => $user]);
        } else {
            echo json_encode(["success" => false, "message" => "Không tìm thấy người dùng"]);
        }

        $stmt->close();
    } else {
        // Nếu không có ID => lấy tất cả employee
        $sql = "SELECT id, full_name, email, phone_number, role, created_at FROM users WHERE role IN ('employee')";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            echo json_encode(["success" => true, "users" => $users]);
        } else {
            echo json_encode(["success" => false, "message" => "Không tìm thấy người dùng"]);
        }
    }
}

$conn->close();