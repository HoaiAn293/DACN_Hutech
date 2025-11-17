<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require_once 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
        exit();
    }

    $full_name = $data['username'] ?? '';
    $email = $data['email'] ?? '';
    $phone_number = $data['phone'] ?? '';
    $password = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : '';
    $role = 'user';

    if (empty($full_name) || empty($email) || empty($phone_number) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Vui lòng điền đầy đủ thông tin!"]);
        exit();
    }

    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email đã được đăng ký!"]);
    } else {
        $sql = "INSERT INTO users (full_name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssss", $full_name, $email, $phone_number, $password, $role);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Đăng ký người dùng thành công!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Đã có lỗi xảy ra khi lưu vào cơ sở dữ liệu."]);
        }
    }
    $stmt->close();
}

$conn->close();
