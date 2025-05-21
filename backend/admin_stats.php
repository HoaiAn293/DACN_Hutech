<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = require 'database.php';

// tổng số nhân viên
$res1 = $conn->query("SELECT COUNT(*) as total FROM users WHERE role = 'employee'");
$total_employees = $res1 ? (int)$res1->fetch_assoc()['total'] : 0;

// tổng doanh thu 
$res2 = $conn->query("SELECT SUM(amount) as revenue FROM invoices");
$row2 = $res2 ? $res2->fetch_assoc() : null;
$revenue = $row2 && $row2['revenue'] !== null ? (float)$row2['revenue'] : 0;

// tổng số đơn hàng
$res3 = $conn->query("SELECT COUNT(*) as total FROM orders");
$total_orders = $res3 ? (int)$res3->fetch_assoc()['total'] : 0;

// đơn hàng đang chờ xử lý
$res4 = $conn->query("SELECT COUNT(*) as total FROM orders WHERE status = 'Chờ xác nhận'");
$pending_orders = $res4 ? (int)$res4->fetch_assoc()['total'] : 0;

echo json_encode([
    "total_employees" => $total_employees,
    "revenue" => $revenue,
    "total_orders" => $total_orders,
    "pending_orders" => $pending_orders
]);