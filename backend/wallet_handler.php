<?php
session_start();
require_once 'database.php'; // Đảm bảo kết nối database

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $userId = intval($input['user_id'] ?? 0);
    $amount = intval($input['amount'] ?? 0);
    $action = $input['action'] ?? ''; // 'deposit' hoặc 'withdraw'

    if ($userId <= 0 || $amount <= 0 || !in_array($action, ['deposit', 'withdraw'])) {
        echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
        exit();
    }

    // --- BƯỚC 1: KIỂM TRA SỐ DƯ CHO YÊU CẦU RÚT TIỀN (WITHDRAW) ---
    if ($action === 'withdraw') {
        $check = $conn->prepare("SELECT balance FROM users WHERE id = ?");
        $check->bind_param("i", $userId);
        $check->execute();
        $balanceResult = $check->get_result()->fetch_assoc();
        $check->close();

        // Kiểm tra số dư trước khi cho phép tạo yêu cầu rút tiền
        if ($balanceResult['balance'] < $amount) {
            echo json_encode(["success" => false, "message" => "Số dư không đủ để tạo yêu cầu rút tiền"]);
            exit();
        }
    }

    // --- BƯỚC 2: TẠO GIAO DỊCH VỚI TRẠNG THÁI CHỜ DUYỆT (PENDING) ---
    // Bỏ qua việc cập nhật số dư users tại đây
    $status = 'pending';

    $history = $conn->prepare("INSERT INTO transaction_history (user_id, type, amount, status) VALUES (?, ?, ?, ?)");

    if (!$history) {
        echo json_encode(["success" => false, "message" => "Lỗi chuẩn bị truy vấn: " . $conn->error]);
        exit();
    }

    // Yêu cầu cột status trong transaction_history phải là ENUM('pending', 'approved', 'rejected')
    $history->bind_param("isis", $userId, $action, $amount, $status);

    if ($history->execute()) {
        $history->close();
        echo json_encode([
            "success" => true,
            "message" => "Yêu cầu " . ($action === 'deposit' ? 'nạp tiền' : 'rút tiền') . " đã được gửi và đang chờ Admin duyệt."
        ]);
    } else {
        $history->close();
        echo json_encode(["success" => false, "message" => "Tạo yêu cầu giao dịch thất bại"]);
    }
}

$conn->close();
