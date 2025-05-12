<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "swiftship";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Kết nối cơ sở dữ liệu thất bại: " . $conn->connect_error);
}

$conn->set_charset("utf8");

return $conn;
