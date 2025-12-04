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
$history = $input['history'] ?? ''; // lịch sử hội thoại dạng text (optional)

if (!$prompt && !$history) {
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

QUY TẮC QUAN TRỌNG:
- Bạn PHẢI hỏi TỪNG BƯỚC, mỗi lần chỉ hỏi 1-2 câu hỏi, KHÔNG được liệt kê tất cả câu hỏi cùng lúc.
- Đọc kỹ lịch sử hội thoại để biết người dùng đã cung cấp thông tin gì rồi.
- Chỉ hỏi những thông tin CÒN THIẾU, không hỏi lại thông tin đã có.

Các thông tin cần thu thập (theo thứ tự ưu tiên):
1. Địa chỉ lấy hàng
2. Địa chỉ giao hàng  
3. Tên và số điện thoại người gửi
4. Tên và số điện thoại người nhận
5. Loại phương tiện (Xe máy / Xe bán tải / Xe van)
6. Loại hàng hoá và giá trị ước tính (số VNĐ, không có dấu phẩy)

CÁCH HỎI:
- Lần đầu tiên người dùng nói muốn đặt đơn: Chào hỏi thân thiện, sau đó chỉ hỏi câu đầu tiên (ví dụ: \"Bạn muốn lấy hàng ở đâu vậy?\")
- Sau khi người dùng trả lời: Xác nhận lại thông tin vừa nhận được, rồi hỏi câu tiếp theo.
- Ví dụ: \"Cảm ơn bạn! Địa chỉ lấy hàng là Q12. Vậy địa chỉ giao hàng ở đâu vậy?\"
- Tiếp tục như vậy cho đến khi có đủ 6 thông tin.

KHI ĐÃ CÓ ĐỦ THÔNG TIN:
1. Xác nhận lại toàn bộ thông tin đơn hàng một cách tự nhiên bằng tiếng Việt.
2. Sau đó, BẮT BUỘC phải xuất một dòng riêng với format chính xác:
   ORDER_JSON:
   {\"vehicle\":\"Xe máy\",\"pickup\":{\"address\":\"...\",\"addressDetail\":\"\",\"senderName\":\"...\",\"senderPhone\":\"...\"},\"delivery\":{\"address\":\"...\",\"addressDetail\":\"\",\"receiverName\":\"...\",\"receiverPhone\":\"...\"},\"goodsType\":\"...\",\"goodsValue\":123000,\"paymentMethod\":\"cod\"}
3. JSON phải là một dòng duy nhất, không có xuống dòng, không có khoảng trắng thừa.
4. goodsValue phải là số nguyên (không có dấu phẩy, không có chữ VNĐ).

Nếu người dùng chỉ hỏi thông tin chung (không muốn đặt đơn) thì trả lời bình thường, KHÔNG in ORDER_JSON."
        ],
        [
            "role" => "user",
            "content" => "Lịch sử hội thoại (nếu có):\n" . $history . "\n\nNgười dùng vừa nói: " . $prompt
        ]
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