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

VỀ ĐƠN HÀNG CỦA NGƯỜI DÙNG:
- Hệ thống sẽ tự động cung cấp thông tin đơn hàng của người dùng trong phần \"THÔNG TIN ĐƠN HÀNG CỦA NGƯỜI DÙNG\".
- Khi người dùng hỏi về đơn hàng (ví dụ: \"Tôi đã đặt bao nhiêu đơn?\", \"Đơn hàng của tôi đang ở trạng thái gì?\", \"Đơn #123 của tôi như thế nào?\"), bạn PHẢI sử dụng thông tin được cung cấp để trả lời.
- Trả lời một cách tự nhiên, thân thiện bằng tiếng Việt, không cần lặp lại toàn bộ thông tin, chỉ trả lời những gì người dùng hỏi.
- Nếu người dùng hỏi về một đơn cụ thể (có mã đơn hàng), hãy tìm đơn đó trong danh sách và cung cấp thông tin chi tiết.
- Nếu người dùng hỏi về trạng thái đơn hàng, hãy liệt kê các đơn theo trạng thái tương ứng.

Các thông tin cần thu thập (theo thứ tự ưu tiên):
1. Địa chỉ lấy hàng (bắt buộc)
2. Địa chỉ giao hàng (bắt buộc)
3. Tên và số điện thoại người gửi (bắt buộc)
4. Tên và số điện thoại người nhận (bắt buộc)
5. Loại phương tiện: \"Xe Máy\", \"Xe Van\", \"Xe Bán Tải\", hoặc \"Xe Tải\" (mặc định: \"Xe Máy\")
6. Loại hàng hoá: \"Tài liệu / Giấy tờ\", \"Đồ điện tử\", \"Quần áo\", \"Thực phẩm\", \"Đồ dễ vỡ\", hoặc \"Khác\"
7. Giá trị hàng hoá: số nguyên VNĐ (không có dấu phẩy, không có chữ VNĐ, ví dụ: 500000)

CÁCH HỎI:
- Lần đầu tiên người dùng nói muốn đặt đơn: Chào hỏi thân thiện, sau đó chỉ hỏi câu đầu tiên (ví dụ: \"Bạn muốn lấy hàng ở đâu vậy?\")
- Sau khi người dùng trả lời: Xác nhận lại thông tin vừa nhận được, rồi hỏi câu tiếp theo.
- Ví dụ: \"Cảm ơn bạn! Địa chỉ lấy hàng là Q12. Vậy địa chỉ giao hàng ở đâu vậy?\"
- Tiếp tục như vậy cho đến khi có đủ tất cả thông tin.

KHI ĐÃ CÓ ĐỦ THÔNG TIN (địa chỉ lấy, địa chỉ giao, tên và SĐT người gửi, tên và SĐT người nhận):
1. Xác nhận lại toàn bộ thông tin đơn hàng một cách tự nhiên bằng tiếng Việt.
2. Sau đó, BẮT BUỘC phải xuất một dòng riêng với format chính xác (KHÔNG có xuống dòng, KHÔNG có khoảng trắng thừa):
ORDER_JSON:
{\"vehicle\":\"Xe Máy\",\"pickup\":{\"address\":\"địa chỉ lấy hàng\",\"addressDetail\":\"\",\"senderName\":\"tên người gửi\",\"senderPhone\":\"số điện thoại người gửi\"},\"delivery\":{\"address\":\"địa chỉ giao hàng\",\"addressDetail\":\"\",\"receiverName\":\"tên người nhận\",\"receiverPhone\":\"số điện thoại người nhận\"},\"goodsType\":\"loại hàng hoá\",\"goodsValue\":số_nguyên,\"paymentMethod\":\"cod\"}

VÍ DỤ ORDER_JSON:
ORDER_JSON:
{\"vehicle\":\"Xe Máy\",\"pickup\":{\"address\":\"123 Đường ABC, Quận 1, TP.HCM\",\"addressDetail\":\"\",\"senderName\":\"Nguyễn Văn A\",\"senderPhone\":\"0123456789\"},\"delivery\":{\"address\":\"456 Đường XYZ, Quận 2, TP.HCM\",\"addressDetail\":\"\",\"receiverName\":\"Trần Thị B\",\"receiverPhone\":\"0987654321\"},\"goodsType\":\"Tài liệu / Giấy tờ\",\"goodsValue\":500000,\"paymentMethod\":\"cod\"}

LƯU Ý QUAN TRỌNG:
- JSON phải là một dòng duy nhất, không có xuống dòng giữa các trường.
- goodsValue phải là số nguyên (ví dụ: 500000, không phải \"500000\" hoặc \"500.000\").
- vehicle phải là một trong: \"Xe Máy\", \"Xe Van\", \"Xe Bán Tải\", \"Xe Tải\".
- Nếu thiếu thông tin nào, sử dụng giá trị mặc định: vehicle=\"Xe Máy\", goodsType=\"Khác\", goodsValue=0, paymentMethod=\"cod\".
- Nếu người dùng chỉ hỏi thông tin chung (không muốn đặt đơn) thì trả lời bình thường, KHÔNG in ORDER_JSON."
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