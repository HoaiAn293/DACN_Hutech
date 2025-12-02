<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uploadDir = __DIR__ . '/review_images/';
if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

$urls = [];
if (isset($_FILES['images']) && is_array($_FILES['images']['tmp_name'])) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    $maxFileSize = 5 * 1024 * 1024; // 5MB
    foreach ($_FILES['images']['tmp_name'] as $i => $tmpName) {
        $fileType = mime_content_type($tmpName);
        $fileSize = $_FILES['images']['size'][$i];
        if (!in_array($fileType, $allowedTypes) || $fileSize > $maxFileSize) continue;
        $name = uniqid('review_') . '_' . basename($_FILES['images']['name'][$i]);
        $target = $uploadDir . $name;
        if (move_uploaded_file($tmpName, $target)) {
            $urls[] = "http://localhost/DACN_Hutech/backend/review_images/$name";
        }
    }
}
echo json_encode(['urls' => $urls]);
?>