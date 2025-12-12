<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);

$pickupAddress   = $input['pickupAddress']   ?? '';
$deliveryAddress = $input['deliveryAddress'] ?? '';
$distanceKm      = $input['distanceKm']      ?? null;   // số km
$etaMinutes      = $input['etaMinutes']      ?? null;   // phút ước tính
$timeLabel       = $input['timeLabel']       ?? '';     // ví dụ: "giờ cao điểm buổi sáng"

if (!$pickupAddress || !$deliveryAddress || $distanceKm === null || $etaMinutes === null) {
    http_response_code(400);
    echo json_encode([
        "ok"    => false,
        "error" => "Thiếu dữ liệu cần thiết",
    ]);
    exit;
}

$api_key = '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';

$url = "https://openrouter.ai/api/v1/chat/completions";

$systemPrompt = "Bạn là trợ lý lộ trình giao hàng cho hệ thống SWIFTSHIP.
Nhiệm vụ:
1. Giải thích ngắn gọn và dễ hiểu cho tài xế vì sao nên đi theo lộ trình đã chọn.
2. Có thể nói về: khoảng cách, thời gian ước tính, tránh kẹt xe (nếu là giờ cao điểm), cùng hướng với điểm giao.
3. Trả lời bằng TIẾNG VIỆT, xưng hô thân thiện, tối đa khoảng 4-5 câu.
4. Không bịa ra thông tin bản đồ chi tiết (tên đường cụ thể), chỉ nói ở mức khái quát.";

$userPrompt = sprintf(
    "Điểm lấy hàng: %s\nĐiểm giao hàng: %s\nQuãng đường: %.2f km\nThời gian ước tính: khoảng %d phút\nBối cảnh thời gian: %s\nHãy giải thích cho tài xế vì sao đây là lộ trình hợp lý, và đưa ra 1-2 lưu ý khi di chuyển.",
    $pickupAddress,
    $deliveryAddress,
    $distanceKm,
    $etaMinutes,
    $timeLabel ?: 'không có thông tin đặc biệt'
);

$body = json_encode([
    "model" => "openai/gpt-3.5-turbo",
    "messages" => [
        [
            "role" => "system",
            "content" => $systemPrompt
        ],
        [
            "role" => "user",
            "content" => $userPrompt
        ]
    ]
]);

$options = [
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-type: application/json\r\n" .
                     "Authorization: Bearer $api_key\r\n" .
                     "HTTP-Referer: http://localhost:5173\r\n",
        'content' => $body,
        'ignore_errors' => true
    ]
];

try {
    $context  = stream_context_create($options);
    $response = file_get_contents($url, false, $context);

    if ($response === false) {
        
        echo json_encode([
            "ok"    => false,
            "error" => "Không thể kết nối đến OpenRouter API",
            "text"  => "Xin lỗi, hiện tại hệ thống không tạo được lời giải thích lộ trình. Bạn vẫn có thể bám theo tuyến đường trên bản đồ."
        ]);
        exit;
    }

    $data = json_decode($response, true);

    if (isset($data['error'])) {
        echo json_encode([
            "ok"    => false,
            "error" => $data['error']['message'] ?? 'Lỗi từ OpenRouter',
            "text"  => "Xin lỗi, hiện tại hệ thống không tạo được lời giải thích lộ trình. Bạn vẫn có thể bám theo tuyến đường trên bản đồ."
        ]);
        exit;
    }

    $text = $data['choices'][0]['message']['content'] ?? '';

    echo json_encode([
        "ok"   => true,
        "text" => $text
    ]);
} catch (Exception $e) {
    // Giữ mã 200, chỉ trả về ok=false để frontend xử lý nhẹ nhàng
    echo json_encode([
        "ok"    => false,
        "error" => $e->getMessage(),
        "text"  => "Xin lỗi, hiện tại hệ thống không tạo được lời giải thích lộ trình. Bạn vẫn có thể bám theo tuyến đường trên bản đồ."
    ]);
}


