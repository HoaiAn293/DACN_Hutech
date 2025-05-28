<?php
session_start();

$allowed_origins = ['http://localhost:5173'];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
} else {
    http_response_code(403);
    echo json_encode(["error" => true, "message" => "Origin not allowed"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

try {
    $conn = require 'database.php';

    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
    $status = isset($_GET['status']) ? $_GET['status'] : null;

    if (!$user_id) {
        echo json_encode([
            "error" => true,
            "message" => "Không tìm thấy thông tin người dùng"
        ]);
        exit;
    }

    $sql = "SELECT 
                o.*, 
                i.invoice_number, 
                i.amount AS invoice_amount, 
                i.payment_method AS invoice_payment_method, 
                i.status AS invoice_status, 
                i.created_at AS invoice_created_at,
                d.full_name AS drivers_name
            FROM orders o
            LEFT JOIN invoices i ON o.id = i.order_id
            LEFT JOIN drivers d ON d.id = o.driver_id
            WHERE o.user_id = ?";
    $params = [$user_id];
    $types = "i";

    if ($status !== null && $status !== "") {
        $sql .= " AND o.status = ?";
        $params[] = $status;
        $types .= "s";
    }

    $sql .= " ORDER BY o.created_at DESC";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode([
            "error" => true,
            "message" => "Lỗi prepare: " . $conn->error
        ]);
        exit;
    }

    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        if (isset($row['goods_value'])) $row['goods_value'] = (int)$row['goods_value'];
        if (isset($row['shipping_fee'])) $row['shipping_fee'] = (int)$row['shipping_fee'];
        if (isset($row['invoice_amount'])) $row['invoice_amount'] = $row['invoice_amount'] !== null ? (int)$row['invoice_amount'] : null;
        $orders[] = $row;
    }

    echo json_encode($orders);
} catch (Exception $e) {
    echo json_encode([
        "error" => true,
        "message" => "Có lỗi xảy ra khi tải đơn hàng: " . $e->getMessage()
    ]);
}