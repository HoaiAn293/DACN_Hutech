<?php
require_once 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $userId = intval($_GET['user_id'] ?? 0);

    if ($userId <= 0) {
        echo json_encode(["success" => false, "message" => "ID người dùng không hợp lệ"]);
        exit();
    }

    $stmt = $conn->prepare("SELECT id, type, amount, created_at FROM transaction_history WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $userId);
    $stmt->execute();

    $result = $stmt->get_result();
    $transactions = [];

    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }

    echo json_encode([
        "success" => true,
        "transactions" => $transactions
    ]);

    $stmt->close();
}

$conn->close();
