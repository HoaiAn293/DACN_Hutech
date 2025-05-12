<?php
session_start();
require_once 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $userId = intval($_GET['user_id'] ?? 0);

    if ($userId <= 0) {
        echo json_encode(["success" => false, "message" => "ID không hợp lệ"]);
        exit();
    }

    $stmt = $conn->prepare("SELECT balance FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();

    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        echo json_encode(["success" => true, "balance" => $row['balance']]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy user"]);
    }

    $stmt->close();
}

$conn->close();
