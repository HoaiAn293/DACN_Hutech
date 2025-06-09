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
    // Kiểm tra nếu là multipart/form-data (có file)
    if (isset($_FILES['image'])) {
        $uploadDir = __DIR__ . '/../uploads/drivers/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $imageName = uniqid('driver_') . '_' . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $imageName;
        $imageUrl = 'uploads/drivers/' . $imageName; 

        if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            echo json_encode(["success" => false, "message" => "Tải ảnh lên thất bại!"]);
            exit();
        }
    } else {
        $imageUrl = null;
    }

    // Lấy dữ liệu từ form
    $full_name = $_POST['full_name'] ?? '';
    $phone_number = $_POST['phone_number'] ?? '';
    $cccd = $_POST['cccd'] ?? '';
    $license_number = $_POST['license_number'] ?? '';
    $vehicle_type = $_POST['vehicle_type'] ?? '';
    $note = $_POST['note'] ?? '';
    $status = isset($_POST['status']) ? intval($_POST['status']) : 1;

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

    // Thêm ảnh vào SQL nếu có
    $sql = "INSERT INTO drivers (full_name, phone_number, cccd, license_number, vehicle_type, note, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssis", $full_name, $phone_number, $cccd, $license_number, $vehicle_type, $note, $status, $imageUrl);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Tạo tài xế thành công!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Đã có lỗi xảy ra khi lưu vào cơ sở dữ liệu."]);
    }

    $stmt->close();
    $conn->close();
}
?>