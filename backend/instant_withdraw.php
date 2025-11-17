<?php
// Tên file: backend/instant_withdraw.php
session_start();
require_once 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $userId = intval($input['user_id'] ?? 0);
    $amount = intval($input['amount'] ?? 0);

    if ($userId <= 0 || $amount <= 0) {
        echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
        $conn->close();
        exit();
    }

    // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
    $conn->begin_transaction();

    try {
        // 1. Kiểm tra số dư (SELECT FOR UPDATE để khóa hàng)
        $check = $conn->prepare("SELECT balance FROM users WHERE id = ? FOR UPDATE");
        $check->bind_param("i", $userId);
        $check->execute();
        $balanceResult = $check->get_result()->fetch_assoc();
        $check->close();

        if (!$balanceResult || $balanceResult['balance'] < $amount) {
            $conn->rollback();
            echo json_encode(["success" => false, "message" => "Số dư không đủ để thanh toán"]);
            $conn->close();
            exit();
        }

        // 2. Trừ tiền (Instant Deduction)
        $stmt_update = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
        $stmt_update->bind_param("ii", $amount, $userId);
        if (!$stmt_update->execute()) {
            throw new Exception("Lỗi khi trừ tiền");
        }
        $stmt_update->close();

        // 3. Ghi lịch sử giao dịch với trạng thái Đã duyệt (approved)
        $status = 'approved';
        $type = 'withdraw';
        $history = $conn->prepare("INSERT INTO transaction_history (user_id, type, amount, status) VALUES (?, ?, ?, ?)");
        $history->bind_param("isis", $userId, $type, $amount, $status);
        if (!$history->execute()) {
            throw new Exception("Lỗi khi ghi lịch sử giao dịch");
        }
        $history->close();

        $conn->commit();
        echo json_encode(["success" => true, "message" => "Thanh toán thành công"]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Lỗi hệ thống khi thanh toán: " . $e->getMessage()]);
    }
}

$conn->close();
