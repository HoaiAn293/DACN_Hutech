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

    $id_token = $data['id_token'] ?? '';

    if (empty($id_token)) {
        echo json_encode(["success" => false, "message" => "Token không hợp lệ"]);
        exit();
    }

    // Xác thực Google ID token
    $google_user_info = verifyGoogleToken($id_token);

    if (!$google_user_info) {
        echo json_encode(["success" => false, "message" => "Token không hợp lệ hoặc đã hết hạn"]);
        exit();
    }

    $email = $google_user_info['email'];
    $full_name = $google_user_info['name'] ?? '';
    $google_id = $google_user_info['sub'] ?? '';
    $picture = $google_user_info['picture'] ?? '';

    // Kiểm tra xem email đã tồn tại chưa
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Người dùng đã tồn tại, đăng nhập
        $user = $result->fetch_assoc();
        
        // Kiểm tra xem bảng có cột google_id không
        $columns = $conn->query("SHOW COLUMNS FROM users LIKE 'google_id'");
        $has_google_id = $columns->num_rows > 0;
        
        // Cập nhật Google ID nếu cột tồn tại và chưa có giá trị
        if ($has_google_id && empty($user['google_id']) && !empty($google_id)) {
            $update_sql = "UPDATE users SET google_id = ?";
            $params = [$google_id];
            $types = "s";
            
            // Kiểm tra và cập nhật avatar nếu có
            $avatar_columns = $conn->query("SHOW COLUMNS FROM users LIKE 'avatar'");
            if ($avatar_columns->num_rows > 0 && !empty($picture)) {
                $update_sql .= ", avatar = ?";
                $params[] = $picture;
                $types .= "s";
            }
            
            $update_sql .= " WHERE email = ?";
            $params[] = $email;
            $types .= "s";
            
            $update_stmt = $conn->prepare($update_sql);
            $update_stmt->bind_param($types, ...$params);
            $update_stmt->execute();
            $update_stmt->close();
        }

        unset($user['password']);
        
        echo json_encode([
            "success" => true,
            "message" => "Đăng nhập thành công!",
            "user" => $user
        ]);
    } else {
        // Người dùng chưa tồn tại, tạo tài khoản mới
        $phone_number = ''; // Google không cung cấp số điện thoại
        $password = ''; // Không cần mật khẩu cho Google login
        $role = 'user';

        // Kiểm tra các cột có tồn tại không
        $google_id_col = $conn->query("SHOW COLUMNS FROM users LIKE 'google_id'");
        $avatar_col = $conn->query("SHOW COLUMNS FROM users LIKE 'avatar'");
        
        $has_google_id = $google_id_col->num_rows > 0;
        $has_avatar = $avatar_col->num_rows > 0;
        
        if ($has_google_id && $has_avatar) {
            // Có cả hai cột
            $sql = "INSERT INTO users (full_name, email, phone_number, password, role, google_id, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssssss", $full_name, $email, $phone_number, $password, $role, $google_id, $picture);
        } else if ($has_google_id) {
            // Chỉ có google_id
            $sql = "INSERT INTO users (full_name, email, phone_number, password, role, google_id) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssssss", $full_name, $email, $phone_number, $password, $role, $google_id);
        } else {
            // Không có cột nào, chỉ insert các cột cơ bản
            $sql = "INSERT INTO users (full_name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssss", $full_name, $email, $phone_number, $password, $role);
        }

        if ($stmt->execute()) {
            // Lấy thông tin người dùng vừa tạo
            $user_id = $conn->insert_id;
            $select_sql = "SELECT * FROM users WHERE id = ?";
            $select_stmt = $conn->prepare($select_sql);
            $select_stmt->bind_param("i", $user_id);
            $select_stmt->execute();
            $user_result = $select_stmt->get_result();
            $new_user = $user_result->fetch_assoc();
            unset($new_user['password']);
            $select_stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Đăng ký và đăng nhập thành công!",
                "user" => $new_user
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Đã có lỗi xảy ra khi tạo tài khoản."]);
        }
    }
    $stmt->close();
}

$conn->close();

/**
 * Xác thực Google ID token
 */
function verifyGoogleToken($id_token) {
    // Google token verification endpoint
    $url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($id_token);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code !== 200) {
        return false;
    }
    
    $data = json_decode($response, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        return false;
    }
    
    // Kiểm tra các trường cần thiết
    if (!isset($data['email']) || !isset($data['sub'])) {
        return false;
    }
    
    // Kiểm tra token có phải từ Google không (issuer)
    if (!isset($data['iss']) || ($data['iss'] !== 'https://accounts.google.com' && $data['iss'] !== 'accounts.google.com')) {
        return false;
    }
    
    return $data;
}

