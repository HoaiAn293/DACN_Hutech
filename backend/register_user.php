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

    $full_name = isset($data['username']) ? trim($data['username']) : '';
    $email = isset($data['email']) ? trim($data['email']) : '';
    $phone_number = isset($data['phone']) ? trim($data['phone']) : '';
    $password_raw = isset($data['password']) ? trim($data['password']) : '';
    $role = 'user';

    // Kiểm tra các trường bắt buộc
    $errors = [];

    if (empty($full_name)) {
        $errors[] = "Họ tên";
    } elseif (strlen($full_name) < 2) {
        $errors[] = "Họ tên phải có ít nhất 2 ký tự";
    } elseif (strlen($full_name) > 100) {
        $errors[] = "Họ tên không được vượt quá 100 ký tự";
    }

    if (empty($email)) {
        $errors[] = "Email";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Email không hợp lệ";
    } elseif (strlen($email) > 255) {
        $errors[] = "Email không được vượt quá 255 ký tự";
    }

    if (empty($phone_number)) {
        $errors[] = "Số điện thoại";
    } else {
        // Loại bỏ khoảng trắng và ký tự đặc biệt
        $phone_number = preg_replace('/[^0-9]/', '', $phone_number);
        // Kiểm tra số điện thoại Việt Nam (10 hoặc 11 chữ số, bắt đầu bằng 0 hoặc +84)
        if (!preg_match('/^(0|\+84)[0-9]{9,10}$/', $phone_number)) {
            $errors[] = "Số điện thoại không hợp lệ (phải là số điện thoại Việt Nam)";
        }
        // Chuyển về định dạng chuẩn (bỏ +84, giữ lại 0)
        if (strpos($phone_number, '+84') === 0) {
            $phone_number = '0' . substr($phone_number, 3);
        }
    }

    if (empty($password_raw)) {
        $errors[] = "Mật khẩu";
    } elseif (strlen($password_raw) < 6) {
        $errors[] = "Mật khẩu phải có ít nhất 6 ký tự";
    } elseif (strlen($password_raw) > 100) {
        $errors[] = "Mật khẩu không được vượt quá 100 ký tự";
    }

    // Trả về lỗi nếu có
    if (!empty($errors)) {
        $message = count($errors) === 1 
            ? "Vui lòng nhập " . $errors[0] 
            : "Vui lòng điền đầy đủ và đúng thông tin: " . implode(", ", $errors);
        echo json_encode(["success" => false, "message" => $message]);
        exit();
    }

    // Hash mật khẩu sau khi đã validate
    $password = password_hash($password_raw, PASSWORD_DEFAULT);

    // Kiểm tra email đã tồn tại chưa
    $sql = "SELECT id FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Lỗi kết nối cơ sở dữ liệu."]);
        exit();
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $stmt->close();
        echo json_encode(["success" => false, "message" => "Email đã được đăng ký!"]);
        exit();
    }
    $stmt->close();

    // Kiểm tra số điện thoại đã tồn tại chưa
    $sql = "SELECT id FROM users WHERE phone_number = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Lỗi kết nối cơ sở dữ liệu."]);
        exit();
    }
    $stmt->bind_param("s", $phone_number);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $stmt->close();
        echo json_encode(["success" => false, "message" => "Số điện thoại đã được đăng ký!"]);
        exit();
    }
    $stmt->close();

    // Thêm người dùng mới
    $sql = "INSERT INTO users (full_name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Lỗi chuẩn bị câu lệnh SQL."]);
        exit();
    }
    $stmt->bind_param("sssss", $full_name, $email, $phone_number, $password, $role);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Đăng ký người dùng thành công!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Đã có lỗi xảy ra khi lưu vào cơ sở dữ liệu: " . $stmt->error]);
    }
    $stmt->close();
}

$conn->close();
