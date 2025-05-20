<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");    
header("Access-Control-Allow-Headers: Content-Type");

try {
    $conn = require 'database.php';
    
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
    $status = $_GET['status'] ?? null;

    if (!$user_id) {
        echo json_encode([
            "error" => true,
            "message" => "Không tìm thấy thông tin người dùng"
        ]);
        exit;
    }

    $sql = "SELECT * FROM orders WHERE 1=1";
    $params = [];
    $types = "";

    if ($status) {
        $sql .= " AND status = ?";
        $params[] = $status;
        $types .= "s";
    }

    if ($user_id > 0) {
        $sql .= " AND user_id = ?";
        $params[] = $user_id;
        $types .= "i";
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $conn->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo json_encode($orders);
} catch (Exception $e) {
    echo json_encode([
        "error" => true,
        "message" => "Có lỗi xảy ra khi tải đơn hàng: " . $e->getMessage()
    ]);
}
