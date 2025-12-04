import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatStyle.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Chuẩn bị history dạng text để gửi cho backend (giúp AI nhớ ngữ cảnh)
      const historyText = [...messages, userMessage]
        .map(m => `${m.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${m.content}`)
        .join('\n');

      const response = await fetch('http://localhost/DACN_Hutech/backend/openRouter.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputMessage,
          history: historyText
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const fullText = data.candidates[0].content.parts[0].text;

      // Tách phần ORDER_JSON (nếu có) ra khỏi nội dung trả lời
      let displayText = fullText;
      let orderPayload = null;
      const marker = 'ORDER_JSON:';
      const markerIndex = fullText.indexOf(marker);

      if (markerIndex !== -1) {
        displayText = fullText.substring(0, markerIndex).trim();
        let jsonPart = fullText.substring(markerIndex + marker.length).trim();
        
        // Tìm JSON object đầu tiên (từ { đến } tương ứng)
        const firstBrace = jsonPart.indexOf('{');
        if (firstBrace !== -1) {
          let braceCount = 0;
          let lastBrace = -1;
          for (let i = firstBrace; i < jsonPart.length; i++) {
            if (jsonPart[i] === '{') braceCount++;
            if (jsonPart[i] === '}') {
              braceCount--;
              if (braceCount === 0) {
                lastBrace = i;
                break;
              }
            }
          }
          if (lastBrace !== -1) {
            jsonPart = jsonPart.substring(firstBrace, lastBrace + 1);
          }
        }
        
        try {
          orderPayload = JSON.parse(jsonPart);
          console.log('✅ Đã parse được ORDER_JSON:', orderPayload);
        } catch (err) {
          console.error('❌ Không parse được ORDER_JSON từ AI:', err);
          console.error('Raw JSON string:', jsonPart);
          // Thông báo cho người dùng biết có lỗi parse
          const parseErrorMsg = {
            role: 'assistant',
            content: 'Mình đã nhận được thông tin đơn hàng nhưng có lỗi khi xử lý. Bạn vui lòng thử lại hoặc đặt đơn trực tiếp trên trang Đặt đơn nhé.'
          };
          setMessages(prev => [...prev, parseErrorMsg]);
        }
      } else {
        console.log('ℹ️ Không tìm thấy ORDER_JSON trong phản hồi của AI');
      }

      const botMessage = {
        role: 'assistant',
        content: displayText || fullText
      };

      setMessages(prev => [...prev, botMessage]);

      // Nếu AI đã cung cấp ORDER_JSON và người dùng đã đăng nhập -> tự động tạo đơn
      if (orderPayload) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          const needLoginMsg = {
            role: 'assistant',
            content: 'Để SWIFTSHIP giúp bạn đặt đơn tự động, vui lòng đăng nhập trước nhé.'
          };
          setMessages(prev => [...prev, needLoginMsg]);
        } else {
          // Hiển thị thông báo đang tạo đơn
          const processingMsg = {
            role: 'assistant',
            content: '⏳ Đang tạo đơn hàng cho bạn, vui lòng đợi một chút...'
          };
          setMessages(prev => [...prev, processingMsg]);
          
          try {
            const orderBody = {
              user_id: user.id,
              vehicle: orderPayload.vehicle || 'Xe máy',
              pickup: {
                address: orderPayload.pickup?.address || '',
                addressDetail: orderPayload.pickup?.addressDetail || '',
                senderName: orderPayload.pickup?.senderName || user.full_name || '',
                senderPhone: orderPayload.pickup?.senderPhone || user.phone_number || '',
              },
              delivery: {
                address: orderPayload.delivery?.address || '',
                addressDetail: orderPayload.delivery?.addressDetail || '',
                receiverName: orderPayload.delivery?.receiverName || '',
                receiverPhone: orderPayload.delivery?.receiverPhone || '',
                goodsType: orderPayload.goodsType || orderPayload.goods_type || '',
                goodsValue: orderPayload.goodsValue || orderPayload.goods_value || 0,
              },
              paymentMethod: orderPayload.paymentMethod || 'cod',
              shippingFee: orderPayload.shippingFee || 0,
              isPaid: 0,
            };

            const orderRes = await fetch('http://localhost/DACN_Hutech/backend/order_handler.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderBody),
            });

            const orderData = await orderRes.json();

            if (orderData.success) {
              const successMsg = {
                role: 'assistant',
                content: `✅ Mình đã giúp bạn tạo đơn hàng thành công! Mã đơn của bạn là #${orderData.order_id}. Bạn có thể xem chi tiết trong [LINK:/history|mục lịch sử đơn hàng].`
              };
              setMessages(prev => [...prev, successMsg]);
            } else {
              const failMsg = {
                role: 'assistant',
                content: `😥 Xin lỗi, hệ thống không thể tạo đơn tự động lúc này. Lý do: ${orderData.message || 'Không rõ nguyên nhân.'}`
              };
              setMessages(prev => [...prev, failMsg]);
            }
          } catch (err) {
            console.error('Lỗi khi tạo đơn tự động từ ChatBot:', err);
            const errorMsg = {
              role: 'assistant',
              content: 'Có lỗi xảy ra khi kết nối đến hệ thống đặt đơn. Bạn vui lòng thử lại sau hoặc tự đặt đơn trên trang Đặt đơn nhé.'
            };
            setMessages(prev => [...prev, errorMsg]);
          }
        }
      } else {
        // Nếu AI xác nhận đơn nhưng không có ORDER_JSON, có thể AI chưa đủ thông tin hoặc format sai
        // Kiểm tra xem AI có nói về "xác nhận" hoặc "đơn hàng" không
        const lowerText = displayText.toLowerCase();
        if (lowerText.includes('xác nhận') || lowerText.includes('đơn hàng') || lowerText.includes('thông tin')) {
          console.log('⚠️ AI đã xác nhận nhưng không có ORDER_JSON. Có thể thiếu thông tin hoặc format sai.');
          // Không hiển thị thông báo lỗi cho người dùng, để AI tự xử lý trong lần tiếp theo
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="chatbot-toggle-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
          </svg>
        </button>
      )}
      
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>Chat Bot</h3>
            <button onClick={toggleChat} className="close-button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message, index) => {
              // Hàm render message với link support
              const renderMessage = (text) => {
                // Tìm pattern [LINK:/path|text] và thay thế bằng link
                const linkPattern = /\[LINK:([^\|]+)\|([^\]]+)\]/g;
                const parts = [];
                let lastIndex = 0;
                let match;

                while ((match = linkPattern.exec(text)) !== null) {
                  // Thêm text trước link
                  if (match.index > lastIndex) {
                    parts.push(text.substring(lastIndex, match.index));
                  }
                  // Thêm link
                  const path = match[1];
                  const linkText = match[2];
                  parts.push(
                    <a
                      key={match.index}
                      href={path}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(path);
                        setIsOpen(false); // Đóng chat khi chuyển trang
                      }}
                    >
                      {linkText}
                    </a>
                  );
                  lastIndex = match.index + match[0].length;
                }
                // Thêm text còn lại
                if (lastIndex < text.length) {
                  parts.push(text.substring(lastIndex));
                }
                return parts.length > 0 ? parts : text;
              };

              return (
                <div
                  key={index}
                  className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  {renderMessage(message.content)}
                </div>
              );
            })}
            {isLoading && (
              <div className="message bot-message loading">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chatbot-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send-button" disabled={isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;