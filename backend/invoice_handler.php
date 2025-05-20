<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');
$conn = require 'database.php';

$data = json_decode(file_get_contents("php://input"), true);
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
if (
    isset($data['order_id']) &&
    isset($data['user_id']) &&
    isset($data['amount']) &&
    isset($data['payment_method'])
) {
    $order_id = intval($data['order_id']);
    $user_id = intval($data['user_id']);
    $amount = intval($data['amount']);
    $payment_method = $data['payment_method'];

    // Sinh số hóa đơn tự động
    $invoice_number = 'INV-' . str_pad($order_id, 6, '0', STR_PAD_LEFT);
    $status = ($payment_method === 'balance') ? 'paid' : 'pending';

    $stmt = $conn->prepare("INSERT INTO invoices (order_id, invoice_number, user_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isisss", $order_id, $invoice_number, $user_id, $amount, $payment_method, $status);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'invoice_number' => $invoice_number,
            'amount' => $amount,
            'status' => $status,
            'payment_method' => $payment_method
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Tạo hóa đơn thất bại',
            'error' => $stmt->error // Thêm dòng này để debug nếu cần
        ]);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Thiếu dữ liệu']);
}
?>