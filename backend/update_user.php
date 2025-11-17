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
        // 1. Kiểm tra role hiện tại của user trong database
        $stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->bind_param("i", $data->id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        // 2. Cho phép sửa nếu user đó là 'employee' HOẶC 'driver'
        if ($user && ($user['role'] === 'employee' || $user['role'] === 'driver')) {

            // Lấy role mới từ dữ liệu gửi lên (nếu admin đổi role), nếu không có thì giữ nguyên role cũ
            $newRole = isset($data->role) ? $data->role : $user['role'];

            // Đảm bảo role mới hợp lệ (chỉ được set thành employee hoặc driver, không được set thành admin/user thường qua API này)
            if (!in_array($newRole, ['employee', 'driver'])) {
                $newRole = $user['role'];
            }

            // 3. Cập nhật thông tin bao gồm cả ROLE
            $stmt2 = $conn->prepare("UPDATE users SET full_name = ?, email = ?, phone_number = ?, role = ? WHERE id = ?");
            $stmt2->bind_param("ssssi", $data->full_name, $data->email, $data->phone_number, $newRole, $data->id);

            if ($stmt2->execute()) {
                echo json_encode(["success" => true, "message" => "Cập nhật thành công"]);
            } else {
                echo json_encode(["success" => false, "message" => "Lỗi khi cập nhật: " . $stmt2->error]);
            }
            $stmt2->close();
        } else {
            // Nếu user không tồn tại hoặc là admin/user thường
            echo json_encode(["success" => false, "message" => "Không có quyền sửa người dùng này"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
    }
}
$conn->close();
