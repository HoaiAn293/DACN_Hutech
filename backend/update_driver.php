<?php
session_start();
require_once 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Nếu là FormData (có file)
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
        $imageUrl = $_POST['old_image_url'] ?? null; // giữ ảnh cũ nếu không upload mới
    }

    // Lấy dữ liệu từ form
    $id = $_POST['id'] ?? '';
    $full_name = $_POST['full_name'] ?? '';
    $phone_number = $_POST['phone_number'] ?? '';
    $cccd = $_POST['cccd'] ?? '';
    $license_number = $_POST['license_number'] ?? '';
    $vehicle_type = $_POST['vehicle_type'] ?? '';
    $note = $_POST['note'] ?? '';
    $status = isset($_POST['status']) ? intval($_POST['status']) : 1;

    if (
        empty($id) ||
        empty($full_name) ||
        empty($phone_number) ||
        empty($cccd) ||
        empty($license_number) ||
        empty($vehicle_type)
    ) {
        echo json_encode(["success" => false, "message" => "Vui lòng điền đầy đủ thông tin!"]);
        exit();
    }

    // Cập nhật thông tin tài xế
    $sql = "UPDATE drivers SET full_name=?, phone_number=?, cccd=?, license_number=?, vehicle_type=?, note=?, status=?, image_url=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssisi", $full_name, $phone_number, $cccd, $license_number, $vehicle_type, $note, $status, $imageUrl, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật tài xế thành công!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Cập nhật thất bại!"]);
    }

    $stmt->close();
    $conn->close();
    exit();
}

// Nếu là JSON (không có ảnh mới)
$data = json_decode(file_get_contents("php://input"), true);
if ($data) {
    $id = $data['id'] ?? '';
    $full_name = $data['full_name'] ?? '';
    $phone_number = $data['phone_number'] ?? '';
    $cccd = $data['cccd'] ?? '';
    $license_number = $data['license_number'] ?? '';
    $vehicle_type = $data['vehicle_type'] ?? '';
    $note = $data['note'] ?? '';
    $status = isset($data['status']) ? intval($data['status']) : 1;
    $imageUrl = $data['image_url'] ?? null;

    if (
        empty($id) ||
        empty($full_name) ||
        empty($phone_number) ||
        empty($cccd) ||
        empty($license_number) ||
        empty($vehicle_type)
    ) {
        echo json_encode(["success" => false, "message" => "Vui lòng điền đầy đủ thông tin!"]);
        exit();
    }

    $sql = "UPDATE drivers SET full_name=?, phone_number=?, cccd=?, license_number=?, vehicle_type=?, note=?, status=?, image_url=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssisi", $full_name, $phone_number, $cccd, $license_number, $vehicle_type, $note, $status, $imageUrl, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật tài xế thành công!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Cập nhật thất bại!"]);
    }

    $stmt->close();
    $conn->close();
    exit();
}

echo json_encode(["success" => false, "message" => "Yêu cầu không hợp lệ!"]);
?>