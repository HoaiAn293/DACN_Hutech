<?php
session_start();
require_once 'database.php';

// Thiết lập các header CORS
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Xử lý request OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $full_name = $data['full_name'] ?? '';
    $phone_number = $data['phone_number'] ?? '';
    $cccd = $data['cccd'] ?? '';
    $license_number = $data['license_number'] ?? '';
    $vehicle_type = $data['vehicle_type'] ?? '';
    $note = $data['note'] ?? '';
    $status = isset($data['status']) ? intval($data['status']) : 1;

    if (
        empty($full_name) ||
        empty($phone_number) ||
        empty($cccd) ||
        empty($license_number) ||
        empty($vehicle_type)
    ) {
        echo json_encode(["success" => false, "message" => "Vui lòng điền đầy đủ thông tin!"]);
        exit();
    }

    // Chuẩn bị câu lệnh SQL (có thêm trường status)
    $sql = "INSERT INTO drivers (full_name, phone_number, cccd, license_number, vehicle_type, note, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssi", $full_name, $phone_number, $cccd, $license_number, $vehicle_type, $note, $status);

    // Thực thi câu lệnh SQL
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Tạo tài xế thành công!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Đã có lỗi xảy ra khi lưu vào cơ sở dữ liệu."]);
    }

    // Đóng statement và connection
    $stmt->close();
    $conn->close();
}
?>