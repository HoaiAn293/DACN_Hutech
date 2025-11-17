<?php
session_start();
require_once 'database.php';

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Đọc dữ liệu JSON từ request body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $full_name = $data['full_name'] ?? '';
    $email = $data['email'] ?? '';
    $phone_number = $data['phone_number'] ?? '';
    $password = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : '';
    $role = $data['role'] ?? 'employee'; // Lấy role từ form, mặc định là employee

    if (empty($full_name) || empty($email) || empty($phone_number) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Vui lòng điền đầy đủ thông tin!"]);
        exit();
    }

    // CẬP NHẬT: Chấp nhận 'driver' là role hợp lệ
    if (!in_array($role, ['admin', 'employee', 'driver'])) {
        echo json_encode(["success" => false, "message" => "Vai trò không hợp lệ!"]);
        exit();
    }

    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email đã được đăng ký!"]);
        exit();
    } else {
        $sql = "INSERT INTO users (full_name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssss", $full_name, $email, $phone_number, $password, $role);

        if ($stmt->execute()) {
            // CẬP NHẬT: Tin nhắn thành công động
            $successMessage = "Tạo tài khoản thành công!";
            if ($role === 'admin') $successMessage = "Tạo tài khoản Admin thành công!";
            if ($role === 'employee') $successMessage = "Tạo tài khoản Nhân viên thành công!";
            if ($role === 'driver') $successMessage = "Tạo tài khoản Tài xế thành công!";

            echo json_encode(["success" => true, "message" => $successMessage]);
        } else {
            echo json_encode(["success" => false, "message" => "Đã có lỗi xảy ra khi lưu vào cơ sở dữ liệu."]);
        }
    }
    $stmt->close();
    $conn->close();
}
