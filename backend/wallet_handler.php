<?php
session_start();
require_once 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $userId = intval($input['user_id'] ?? 0);
    $amount = intval($input['amount'] ?? 0);
    $action = $input['action'] ?? '';

    if ($userId <= 0 || $amount <= 0 || !in_array($action, ['deposit', 'withdraw'])) {
        echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
        exit();
    }

    if ($action === 'withdraw') {
        // Kiểm tra số dư
        $check = $conn->prepare("SELECT balance FROM users WHERE id = ?");
        $check->bind_param("i", $userId);
        $check->execute();
        $balanceResult = $check->get_result()->fetch_assoc();

        if ($balanceResult['balance'] < $amount) {
            echo json_encode(["success" => false, "message" => "Số dư không đủ"]);
            exit();
        }

        // Trừ tiền
        $stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
        $stmt->bind_param("ii", $amount, $userId);
    } else {
        // Nạp tiền
        $stmt = $conn->prepare("UPDATE users SET balance = balance + ? WHERE id = ?");
        $stmt->bind_param("ii", $amount, $userId);
    }

    if ($stmt->execute()) {
        $history = $conn->prepare("INSERT INTO transaction_history (user_id, type, amount) VALUES (?, ?, ?)");
        $history->bind_param("isi", $userId, $action, $amount);
        $history->execute();

        echo json_encode(["success" => true, "message" => "Giao dịch thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Giao dịch thất bại"]);
    }

    $stmt->close();
    $history->close();
}

$conn->close();
