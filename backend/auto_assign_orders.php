<?php
require_once 'database.php';

// 1. Lấy các đơn "Chờ xác nhận" đã tạo hơn 2 phút
$sql = "SELECT * FROM orders WHERE status = 'Chờ xác nhận' AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 2 AND driver_id IS NULL";
$result = $conn->query($sql);

while ($order = $result->fetch_assoc()) {
    // 2. Tìm tài xế rảnh (không có đơn đang giao hoặc đã nhận)
    $driverSql = "SELECT id FROM users WHERE role = 'driver' AND id NOT IN (
        SELECT driver_id FROM orders WHERE status IN ('Đang giao', 'Đã nhận') AND driver_id IS NOT NULL
    ) LIMIT 1";
    $driverRes = $conn->query($driverSql);
    if ($driver = $driverRes->fetch_assoc()) {
        // 3. Gán tài xế và cập nhật trạng thái
        $update = $conn->prepare("UPDATE orders SET driver_id = ?, status = 'Đang giao' WHERE id = ?");
        $update->bind_param("ii", $driver['id'], $order['id']);
        $update->execute();
    }
}

$conn->close();
echo json_encode(["success" => true]);
?>