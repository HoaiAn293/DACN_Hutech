<?php
// Lấy TẤT CẢ các đơn hàng đã được gán cho tài xế
require_once 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $driver_id = isset($_GET['driver_id']) ? intval($_GET['driver_id']) : 0;

    if ($driver_id <= 0) {
        echo json_encode(["error" => true, "message" => "Missing Driver ID"]);
        exit;
    }

    // --- ĐÃ CẬP NHẬT SQL ---
    // 1. JOIN 'users' (với alias 'd') thay vì 'drivers'
    // 2. Lấy 'd.full_name' AS driver_name
    // 3. ĐÃ XÓA: điều kiện 'AND o.status NOT IN ('Hoàn tất', 'Đã huỷ')'
    $sql = "SELECT 
                o.*, 
                u.full_name AS user_name,
                i.invoice_number,
                i.amount AS shipping_fee,
                d.full_name AS driver_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN invoices i ON o.id = i.order_id
            LEFT JOIN users d ON o.driver_id = d.id AND d.role = 'driver'
            WHERE o.driver_id = ?
            ORDER BY o.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $driver_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $row['id'] = intval($row['id']);
        $row['shipping_fee'] = isset($row['shipping_fee']) ? intval($row['shipping_fee']) : (int)$row['shipping_fee']; // Giữ lại logic xử lý shipping_fee
        $orders[] = $row;
    }

    echo json_encode($orders);
    $stmt->close();
}

$conn->close();
