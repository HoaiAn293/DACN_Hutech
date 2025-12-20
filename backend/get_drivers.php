<?php
session_start();
require_once 'database.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// --- CẤU HÌNH GIẢ LẬP DI CHUYỂN ---
// Hàm tạo độ lệch ngẫu nhiên (tương đương xe di chuyển khoảng 10-50m)
function getRandomOffset()
{
    return (rand(-100, 100)) / 40000;
}

// 1. Lấy các tài xế đang active và ĐÃ CÓ VỊ TRÍ
$sql = "SELECT id, full_name, phone_number, current_lat, current_lng 
        FROM users 
        WHERE role = 'driver' 
        AND status = 'active' 
        AND current_lat IS NOT NULL 
        AND current_lng IS NOT NULL";

$result = $conn->query($sql);
$drivers = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $driverId = $row['id'];
        $currentLat = (float)$row['current_lat'];
        $currentLng = (float)$row['current_lng'];

        // 2. TÍNH TOÁN VỊ TRÍ MỚI (Giả lập di chuyển)
        // Cộng thêm một khoảng nhỏ vào vĩ độ/kinh độ
        $newLat = $currentLat + getRandomOffset();
        $newLng = $currentLng + getRandomOffset();

        // 3. Cập nhật ngay vào Database (để hiển thị realtime)
        $updateSql = "UPDATE users SET current_lat = $newLat, current_lng = $newLng WHERE id = $driverId";
        $conn->query($updateSql);

        // 4. Lấy thông tin đánh giá (Rating)
        $ratingSql = "SELECT IFNULL(AVG(rating), 5) as avg_rating, COUNT(id) as total_reviews FROM reviews WHERE driver_id = $driverId";
        $ratingRes = $conn->query($ratingSql);
        $ratingData = $ratingRes->fetch_assoc();

        // 5. Chuẩn bị dữ liệu trả về
        $row['current_lat'] = $newLat;
        $row['current_lng'] = $newLng;
        $row['avg_rating'] = number_format((float)$ratingData['avg_rating'], 1);
        $row['total_reviews'] = $ratingData['total_reviews'];
        $drivers[] = $row;
    }
}

echo json_encode($drivers);
$conn->close();
