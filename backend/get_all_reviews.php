<?php
require_once 'database.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$sql = "SELECT r.*, o.*, u.full_name AS user_name, d.full_name AS driver_name
        FROM reviews r
        JOIN orders o ON r.order_id = o.id
        JOIN users u ON r.user_id = u.id
        JOIN users d ON r.driver_id = d.id
        ORDER BY r.created_at DESC";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $review = [
        "id" => $row["id"],
        "order_id" => $row["order_id"],
        "user_id" => $row["user_id"],
        "driver_id" => $row["driver_id"],
        "rating" => $row["rating"],
        "comment" => $row["comment"],
        "images" => $row["images"] ? json_decode($row["images"]) : [],
        "suggestions" => $row["suggestions"] ? json_decode($row["suggestions"]) : [],
        "created_at" => $row["created_at"]
    ];
    $order = [
        "id" => $row["order_id"],
        "goods_type" => $row["goods_type"],
        "sender_name" => $row["sender_name"],
        "receiver_name" => $row["receiver_name"],
        "created_at" => $row["created_at"],
        "driver_name" => $row["driver_name"]
    ];
    $user = ["id" => $row["user_id"], "full_name" => $row["user_name"]];
    $driver = ["id" => $row["driver_id"], "full_name" => $row["driver_name"]];
    $data[] = compact("review", "order", "user", "driver");
}
echo json_encode($data);
$conn->close();
?>