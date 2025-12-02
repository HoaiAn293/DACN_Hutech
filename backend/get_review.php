<?php
require_once 'database.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$order_id = intval($_GET['order_id']);
$user_id = intval($_GET['user_id']);

$stmt = $conn->prepare("SELECT * FROM reviews WHERE order_id = ? AND user_id = ?");
$stmt->bind_param("ii", $order_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    $row['images'] = $row['images'] ? json_decode($row['images']) : [];
    $row['suggestions'] = $row['suggestions'] ? json_decode($row['suggestions']) : [];
    echo json_encode($row);
} else {
    echo json_encode(null);
}
$stmt->close();
$conn->close();
?>