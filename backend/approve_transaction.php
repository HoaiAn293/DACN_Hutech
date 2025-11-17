<?php
require_once 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $transaction_id = intval($data['id'] ?? 0);
    $action = $data['action'] ?? ''; // 'approve' hoặc 'reject'

    if ($transaction_id <= 0 || !in_array($action, ['approve', 'reject'])) {
        echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
        exit();
    }

    // 1. Lấy thông tin giao dịch đang chờ duyệt
    $stmt = $conn->prepare("SELECT user_id, type, amount, status FROM transaction_history WHERE id = ? AND status = 'pending'");
    $stmt->bind_param("i", $transaction_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $transaction = $result->fetch_assoc();
    $stmt->close();

    if (!$transaction) {
        echo json_encode(["success" => false, "message" => "Không tìm thấy giao dịch chờ duyệt hoặc đã được xử lý"]);
        exit();
    }

    $user_id = $transaction['user_id'];
    $amount = $transaction['amount'];
    $type = $transaction['type'];
    $status = ($action === 'approve') ? 'approved' : 'rejected';
    $message = ($action === 'approve') ? 'Duyệt thành công' : 'Từ chối thành công';

    // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
    $conn->begin_transaction();

    try {
        // 2. Cập nhật số dư nếu là Duyệt
        if ($action === 'approve') {
            $user_update_sql = ($type === 'deposit') ?
                "UPDATE users SET balance = balance + ? WHERE id = ?" :
                "UPDATE users SET balance = balance - ? WHERE id = ?";

            $update_user_stmt = $conn->prepare($user_update_sql);
            $update_user_stmt->bind_param("ii", $amount, $user_id);
            if (!$update_user_stmt->execute()) {
                throw new Exception("Lỗi khi cập nhật số dư user");
            }
            $update_user_stmt->close();
        }

        // 3. Cập nhật trạng thái giao dịch
        $update_history_stmt = $conn->prepare("UPDATE transaction_history SET status = ? WHERE id = ?");
        $update_history_stmt->bind_param("si", $status, $transaction_id);
        if (!$update_history_stmt->execute()) {
            throw new Exception("Lỗi khi cập nhật lịch sử giao dịch");
        }
        $update_history_stmt->close();

        $conn->commit();
        echo json_encode(["success" => true, "message" => $message]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["success" => false, "message" => "Thao tác thất bại: " . $e->getMessage()]);
    }
}

$conn->close();
