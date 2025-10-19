<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$prompt = $input['prompt'] ?? '';

if (!$prompt) {
    http_response_code(400);
    echo json_encode(["error" => "Prompt rỗng"]);
    exit;
}

$api_key = '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';

$url = "https://openrouter.ai/api/v1/chat/completions";

$body = json_encode([
    "model" => "openai/gpt-3.5-turbo",
    "messages" => [
        [
            "role" => "system",
            "content" => "Bạn là trợ lý hỗ trợ khách hàng của trang web đặt xe giao hàng SWIFTSHIP. 
            Nhiệm vụ của bạn:
            1. Giúp người dùng đặt xe giao hàng (hỏi địa điểm nhận và giao).
            2. Hướng dẫn sử dụng trang web (cách đăng ký, đăng nhập, hủy đơn).
            3. Trả lời lịch sự, ngắn gọn, và luôn nhắc lại tính năng chính của dịch vụ.
            4. Về cách tính chi phí giao hàng lấy số km nhân cho phương tiện giao."
        ],
        ["role" => "user", "content" => $prompt]
    ]
]);

$options = [
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-type: application/json\r\n" .
                     "Authorization: Bearer $api_key\r\n" .
                     "HTTP-Referer: http://localhost:5173\r\n", // Thêm HTTP-Referer theo yêu cầu của OpenRouter
        'content' => $body,
        'ignore_errors' => true 
    ]
];

try {
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        throw new Exception("Không thể kết nối đến OpenRouter API");
    }
    
    $response_data = json_decode($response, true);
    if (isset($response_data['error'])) {
        throw new Exception($response_data['error']['message']);
    }
    
    $formatted_response = [
        "candidates" => [
            [
                "content" => [
                    "parts" => [
                        ["text" => $response_data['choices'][0]['message']['content']]
                    ]
                ]
            ]
        ]
    ];
    
    echo json_encode($formatted_response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage(),
        "candidates" => [
            [
                "content" => [
                    "parts" => [
                        ["text" => "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau."]
                    ]
                ]
            ]
        ]
    ]);
}