<?php
require_once 'database.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (
        isset($data->id) && isset($data->full_name) && isset($data->email) &&
        isset($data->phone_number)
    ) {
        // Chỉ cho phép update nếu là employee
        $stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->bind_param("i", $data->id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        if ($user && $user['role'] === 'employee') {
            $stmt2 = $conn->prepare("UPDATE users SET full_name = ?, email = ?, phone_number = ? WHERE id = ?");
            $stmt2->bind_param("sssi", $data->full_name, $data->email, $data->phone_number, $data->id);
            if ($stmt2->execute()) {
                echo json_encode(["success" => true, "message" => "Cập nhật thành công"]);
            } else {
                echo json_encode(["success" => false, "message" => "Lỗi khi cập nhật"]);
            }
            $stmt2->close();
        } else {
            echo json_encode(["success" => false, "message" => "Chỉ được sửa nhân viên"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
    }
}
$conn->close();
?>