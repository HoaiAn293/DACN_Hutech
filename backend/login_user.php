<?php
require_once 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Xử lý OPTIONS request (pre-flight)
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

    $email = isset($data['email']) ? trim($data['email']) : '';
    $password = isset($data['password']) ? trim($data['password']) : '';

    // Kiểm tra các trường bắt buộc
    if (empty($email)) {
        echo json_encode(["success" => false, "message" => "Vui lòng nhập email!"]);
        exit();
    }

    if (empty($password)) {
        echo json_encode(["success" => false, "message" => "Vui lòng nhập mật khẩu!"]);
        exit();
    }

    // Kiểm tra định dạng email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Email không hợp lệ!"]);
        exit();
    }

    // Kiểm tra độ dài mật khẩu
    if (strlen($password) < 6) {
        echo json_encode(["success" => false, "message" => "Mật khẩu phải có ít nhất 6 ký tự!"]);
        exit();
    }

    // Kiểm tra email trong database
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Email không tồn tại!"]);
        exit();
    }

    $user = $result->fetch_assoc();

    // Kiểm tra mật khẩu
    if (!password_verify($password, $user['password'])) {
        echo json_encode(["success" => false, "message" => "Mật khẩu không chính xác!"]);
        exit();
    }

    unset($user['password']);

    echo json_encode([
        "success" => true,
        "message" => "Đăng nhập thành công!",
        "user" => $user
    ]);

    $stmt->close();
}

$conn->close();
