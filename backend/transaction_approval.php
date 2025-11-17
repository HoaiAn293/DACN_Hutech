<?php
require_once 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Xử lý GET request: Lấy tất cả giao dịch đang chờ duyệt
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Chỉ lấy các giao dịch đang chờ (pending)
    $sql = "SELECT 
                th.id, 
                th.user_id, 
                th.type, 
                th.amount, 
                th.created_at, 
                u.full_name, 
                u.email
            FROM transaction_history th
            JOIN users u ON th.user_id = u.id
            WHERE th.status = 'pending'
            ORDER BY th.created_at ASC";

    $result = $conn->query($sql);

    if (!$result) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Lỗi truy vấn: " . $conn->error]);
        exit();
    }

    $pending_transactions = [];
    while ($row = $result->fetch_assoc()) {
        $row['amount'] = intval($row['amount']);
        $pending_transactions[] = $row;
    }

    echo json_encode(["success" => true, "transactions" => $pending_transactions]);
    $conn->close();
    exit();
}

// Xử lý POST request: Duyệt hoặc Từ chối giao dịch
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $transaction_id = intval($data['id'] ?? 0);
    $action = $data['action'] ?? ''; // 'approve' hoặc 'reject'

    if ($transaction_id <= 0 || !in_array($action, ['approve', 'reject'])) {
        echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ."]);
        exit();
    }

    // Lấy thông tin giao dịch đang chờ duyệt
    $stmt_fetch = $conn->prepare("SELECT user_id, type, amount FROM transaction_history WHERE id = ? AND status = 'pending'");
    $stmt_fetch->bind_param("i", $transaction_id);
    $stmt_fetch->execute();
    $result = $stmt_fetch->get_result();
    $transaction = $result->fetch_assoc();
    $stmt_fetch->close();

    if (!$transaction) {
        echo json_encode(["success" => false, "message" => "Giao dịch không tồn tại hoặc đã được xử lý."]);
        exit();
    }

    $user_id = $transaction['user_id'];
    $amount = $transaction['amount'];
    $type = $transaction['type'];
    $new_status = ($action === 'approve') ? 'approved' : 'rejected';

    // BẮT ĐẦU TRANSACTION
    $conn->begin_transaction();

    try {
        // 1. Nếu duyệt (approve), cập nhật số dư người dùng
        if ($action === 'approve') {
            $user_update_sql = ($type === 'deposit') ?
                "UPDATE users SET balance = balance + ? WHERE id = ?" :
                "UPDATE users SET balance = balance - ? WHERE id = ?";

            $update_user_stmt = $conn->prepare($user_update_sql);
            $update_user_stmt->bind_param("ii", $amount, $user_id);
            if (!$update_user_stmt->execute()) {
                throw new Exception("Lỗi khi cập nhật số dư người dùng.");
            }
            $update_user_stmt->close();
        }

        // 2. Cập nhật trạng thái giao dịch trong lịch sử
        $update_history_stmt = $conn->prepare("UPDATE transaction_history SET status = ? WHERE id = ?");
        $update_history_stmt->bind_param("si", $new_status, $transaction_id);
        if (!$update_history_stmt->execute()) {
            throw new Exception("Lỗi khi cập nhật lịch sử giao dịch.");
        }
        $update_history_stmt->close();

        // Hoàn tất transaction
        $conn->commit();
        $msg = ($action === 'approve') ? "Đã duyệt giao dịch thành công." : "Đã từ chối giao dịch thành công.";
        echo json_encode(["success" => true, "message" => $msg]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Thao tác thất bại: " . $e->getMessage()]);
    }
}

$conn->close();
