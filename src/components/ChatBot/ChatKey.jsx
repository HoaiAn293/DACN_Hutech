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

  // 获取用户订单信息
  const getUserOrders = async (userId) => {
    try {
      const response = await fetch(`http://localhost/DACN_Hutech/backend/get_orders.php?user_id=${userId}`);
      const data = await response.json();
      if (data.error) {
        console.error('❌ Lỗi khi lấy đơn hàng:', data.message);
        return [];
      }
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('❌ Lỗi khi fetch đơn hàng:', err);
      return [];
    }
  };

  const isOrderQuery = (text) => {
    const lowerText = text.toLowerCase();
    const orderKeywords = [
      'đơn hàng', 'đơn của tôi', 'đơn đã đặt', 'đã đặt bao nhiêu',
      'tình trạng đơn', 'trạng thái đơn', 'đơn hàng của tôi',
      'số đơn', 'bao nhiêu đơn', 'đơn hàng nào', 'danh sách đơn',
      'đơn nào', 'đơn gì', 'lịch sử đơn', 'đơn đang', 'đơn chờ',
      'đơn đã giao', 'đơn đã nhận', 'đơn hủy', 'đơn của em',
      'tôi có', 'mình có', 'em có', 'bạn có', 'có đơn'
    ];
    return orderKeywords.some(keyword => lowerText.includes(keyword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 如果用户询问订单信息，先获取订单数据
      let orderContext = '';
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user.id) {
            // 如果用户询问订单或首次对话，加载订单信息
            if (isOrderQuery(inputMessage) || messages.length === 0) {
              const orders = await getUserOrders(user.id);
              if (orders.length > 0) {
                // 统计订单状态
                const statusCount = {};
                orders.forEach(order => {
                  const status = order.status || 'Không xác định';
                  statusCount[status] = (statusCount[status] || 0) + 1;
                });

                // 格式化订单信息，让 AI 更容易理解
                orderContext = `\n\n=== THÔNG TIN ĐƠN HÀNG CỦA NGƯỜI DÙNG ===\n`;
                orderContext += `Tổng số đơn hàng: ${orders.length} đơn\n\n`;
                
                // 按状态分组显示
                orderContext += `Chi tiết theo trạng thái:\n`;
                Object.entries(statusCount).forEach(([status, count]) => {
                  orderContext += `- ${status}: ${count} đơn\n`;
                });
                
                orderContext += `\nDanh sách đơn hàng gần đây (tối đa 10 đơn):\n`;
                orders.slice(0, 10).forEach((order, index) => {
                  const createdDate = order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : 'N/A';
                  orderContext += `${index + 1}. Đơn hàng #${order.id}\n`;
                  orderContext += `   - Trạng thái: ${order.status || 'Không xác định'}\n`;
                  orderContext += `   - Địa chỉ lấy: ${order.pickup_address || 'N/A'}\n`;
                  orderContext += `   - Địa chỉ giao: ${order.delivery_address || 'N/A'}\n`;
                  orderContext += `   - Phương tiện: ${order.vehicle || 'N/A'}\n`;
                  orderContext += `   - Loại hàng: ${order.goods_type || 'N/A'}\n`;
                  orderContext += `   - Giá trị: ${order.goods_value ? order.goods_value.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}\n`;
                  orderContext += `   - Phí vận chuyển: ${order.shipping_fee ? order.shipping_fee.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}\n`;
                  orderContext += `   - Ngày tạo: ${createdDate}\n`;
                  if (order.drivers_name) {
                    orderContext += `   - Tài xế: ${order.drivers_name}\n`;
                  }
                  orderContext += `\n`;
                });
                
                // 添加提示给 AI
                orderContext += `\nLƯU Ý: Khi người dùng hỏi về đơn hàng, bạn có thể tham khảo thông tin trên để trả lời. Nếu người dùng hỏi về một đơn cụ thể, hãy sử dụng mã đơn hàng (#ID) để xác định.`;
              } else {
                orderContext = `\n\n=== THÔNG TIN ĐƠN HÀNG CỦA NGƯỜI DÙNG ===\nNgười dùng hiện chưa có đơn hàng nào trong hệ thống.`;
              }
            }
          }
        } catch (err) {
          console.error('❌ Lỗi khi parse user:', err);
        }
      }

      const historyText = updatedMessages
        .map(m => `${m.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${m.content}`)
        .join('\n');

      const response = await fetch('http://localhost/DACN_Hutech/backend/openRouter.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputMessage + orderContext,
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
      
      console.log('🔍 Tìm ORDER_JSON marker:', markerIndex !== -1 ? 'Tìm thấy' : 'Không tìm thấy');

      if (markerIndex !== -1) {
        displayText = fullText.substring(0, markerIndex).trim();
        let jsonPart = fullText.substring(markerIndex + marker.length).trim();
        
        // 清理 JSON：移除可能的换行和多余空格
        jsonPart = jsonPart.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        
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
        
        console.log('🔍 Raw JSON string:', jsonPart);
        
        try {
          orderPayload = JSON.parse(jsonPart);
          console.log('✅ Đã parse được ORDER_JSON:', orderPayload);
          
          // 验证必需字段
          if (!orderPayload.pickup?.address || !orderPayload.delivery?.address) {
            console.warn('⚠️ ORDER_JSON thiếu địa chỉ bắt buộc');
            orderPayload = null;
          }
        } catch (err) {
          console.error('❌ Không parse được ORDER_JSON từ AI:', err);
          console.error('Raw JSON string:', jsonPart);
          
          // 尝试修复常见的 JSON 错误
          try {
            // 修复单引号、缺少引号等问题
            let fixedJson = jsonPart
              .replace(/'/g, '"')  // 单引号转双引号
              .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')  // 键加引号
              .replace(/:\s*([^",\[\]{}]+?)(\s*[,}\]])/g, (match, value, suffix) => {
                // 如果值不是数字、布尔值或null，加引号
                if (!/^(true|false|null|\d+)$/.test(value.trim())) {
                  return `: "${value.trim()}"${suffix}`;
                }
                return match;
              });
            
            orderPayload = JSON.parse(fixedJson);
            console.log('✅ Đã sửa và parse được ORDER_JSON:', orderPayload);
          } catch (fixErr) {
            console.error('❌ Vẫn không parse được sau khi sửa:', fixErr);
            const parseErrorMsg = {
              role: 'assistant',
              content: 'Mình đã nhận được thông tin đơn hàng nhưng có lỗi khi xử lý. Bạn vui lòng thử lại hoặc đặt đơn trực tiếp trên trang Đặt đơn nhé.'
            };
            setMessages(prev => [...prev, parseErrorMsg]);
          }
        }
      } else {
        console.log('ℹ️ Không tìm thấy ORDER_JSON trong phản hồi của AI');
        console.log('📝 Full text:', fullText);
      }

      const botMessage = {
        role: 'assistant',
        content: displayText || fullText
      };

      setMessages(prev => [...prev, botMessage]);

      // Nếu AI đã cung cấp ORDER_JSON và người dùng đã đăng nhập -> tự động tạo đơn
      if (orderPayload) {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          const needLoginMsg = {
            role: 'assistant',
            content: 'Để SWIFTSHIP giúp bạn đặt đơn tự động, vui lòng đăng nhập trước nhé.'
          };
          setMessages(prev => [...prev, needLoginMsg]);
          setIsLoading(false);
          return;
        }
        
        let user;
        try {
          user = JSON.parse(userStr);
        } catch (parseErr) {
          console.error('❌ Lỗi parse user từ localStorage:', parseErr);
          const parseErrorMsg = {
            role: 'assistant',
            content: 'Có lỗi xảy ra khi đọc thông tin người dùng. Vui lòng đăng nhập lại.'
          };
          setMessages(prev => [...prev, parseErrorMsg]);
          setIsLoading(false);
          return;
        }
        
        if (!user || !user.id) {
          console.error('❌ User không hợp lệ:', user);
          const invalidUserMsg = {
            role: 'assistant',
            content: 'Thông tin người dùng không hợp lệ. Vui lòng đăng nhập lại.'
          };
          setMessages(prev => [...prev, invalidUserMsg]);
          setIsLoading(false);
          return;
        }
        
        console.log('👤 User info:', { id: user.id, name: user.full_name });
        
        // Hiển thị thông báo đang tạo đơn
        const processingMsg = {
          role: 'assistant',
          content: '⏳ Đang tạo đơn hàng cho bạn, vui lòng đợi một chút...'
        };
        setMessages(prev => [...prev, processingMsg]);
        
        try {
            // 计算运费函数
            const calculateShippingFee = async (vehicle, pickupAddress, deliveryAddress) => {
              // 如果已经有运费，直接返回
              if (orderPayload.shippingFee && orderPayload.shippingFee > 0) {
                return orderPayload.shippingFee;
              }
              
              // 尝试从地址计算距离
              try {
                const pickupRes = await fetch(
                  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickupAddress)}&limit=1`
                );
                const pickupData = await pickupRes.json();
                
                const deliveryRes = await fetch(
                  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(deliveryAddress)}&limit=1`
                );
                const deliveryData = await deliveryRes.json();

                if (pickupData.length > 0 && deliveryData.length > 0) {
                  const lat1 = parseFloat(pickupData[0].lat);
                  const lon1 = parseFloat(pickupData[0].lon);
                  const lat2 = parseFloat(deliveryData[0].lat);
                  const lon2 = parseFloat(deliveryData[0].lon);
                  
                  // 使用 Haversine 公式计算距离
                  const R = 6371; // 地球半径（km）
                  const dLat = (lat2 - lat1) * Math.PI / 180;
                  const dLon = (lon2 - lon1) * Math.PI / 180;
                  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                            Math.sin(dLon/2) * Math.sin(dLon/2);
                  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                  const distance = R * c;
                  
                  // 根据车辆类型计算运费
                  const pricePerKm = {
                    'Xe máy': 5000,
                    'Xe Máy': 5000,
                    'Xe van': 10000,
                    'Xe Van': 10000,
                    'Xe bán tải': 15000,
                    'Xe Bán Tải': 15000,
                    'Xe tải': 20000,
                    'Xe Tải': 20000,
                  };
                  
                  const vehicleType = vehicle || 'Xe máy';
                  const basePrice = pricePerKm[vehicleType] || 5000;
                  const fee = Math.round(distance * basePrice);
                  return Math.min(fee, 300000); // 最大 300,000 VNĐ
                }
              } catch (err) {
                console.warn('⚠️ Không thể tính khoảng cách:', err);
              }
              
              // 默认运费（基于默认距离 5km）
              const defaultPrice = 5000;
              return 5 * defaultPrice; // 25,000 VNĐ
            };

            // 标准化车辆类型
            const vehicle = orderPayload.vehicle || 'Xe máy';
            const normalizedVehicle = vehicle.includes('Máy') || vehicle.includes('máy') ? 'Xe Máy' :
                                     vehicle.includes('Van') || vehicle.includes('van') ? 'Xe Van' :
                                     vehicle.includes('Bán') || vehicle.includes('bán') ? 'Xe Bán Tải' :
                                     vehicle.includes('Tải') || vehicle.includes('tải') ? 'Xe Tải' : 'Xe Máy';

            // 处理 goodsValue
            let goodsValue = 0;
            if (orderPayload.goodsValue || orderPayload.goods_value) {
              const value = orderPayload.goodsValue || orderPayload.goods_value;
              goodsValue = typeof value === 'string' 
                ? parseInt(value.replace(/[^0-9]/g, '')) || 0 
                : parseInt(value) || 0;
            }

            // 验证必需字段
            const pickupAddress = orderPayload.pickup?.address || '';
            const deliveryAddress = orderPayload.delivery?.address || '';
            const senderName = orderPayload.pickup?.senderName || user.full_name || '';
            const senderPhone = orderPayload.pickup?.senderPhone || user.phone_number || '';
            const receiverName = orderPayload.delivery?.receiverName || '';
            const receiverPhone = orderPayload.delivery?.receiverPhone || '';

            console.log('📋 Thông tin đơn hàng:', {
              pickupAddress,
              deliveryAddress,
              senderName,
              senderPhone,
              receiverName,
              receiverPhone,
              vehicle: normalizedVehicle,
              goodsType: orderPayload.goodsType || orderPayload.goods_type,
              goodsValue
            });

            const missingFields = [];
            if (!pickupAddress) missingFields.push('Địa chỉ lấy hàng');
            if (!deliveryAddress) missingFields.push('Địa chỉ giao hàng');
            if (!senderName) missingFields.push('Tên người gửi');
            if (!senderPhone) missingFields.push('Số điện thoại người gửi');
            if (!receiverName) missingFields.push('Tên người nhận');
            if (!receiverPhone) missingFields.push('Số điện thoại người nhận');

            if (missingFields.length > 0) {
              console.warn('⚠️ Thiếu các trường bắt buộc:', missingFields);
              const missingMsg = {
                role: 'assistant',
                content: `Mình thấy thiếu một số thông tin cần thiết: ${missingFields.join(', ')}. Bạn vui lòng cung cấp đầy đủ thông tin để mình có thể tạo đơn hàng nhé.`
              };
              setMessages(prev => [...prev, missingMsg]);
              setIsLoading(false);
              return;
            }

            // 计算运费
            const shippingFee = await calculateShippingFee(normalizedVehicle, pickupAddress, deliveryAddress);
            console.log('💰 Phí vận chuyển tính được:', shippingFee);

            const orderBody = {
              user_id: user.id,
              vehicle: normalizedVehicle,
              pickup: {
                address: pickupAddress,
                addressDetail: orderPayload.pickup?.addressDetail || '',
                senderName: senderName,
                senderPhone: senderPhone,
              },
              delivery: {
                address: deliveryAddress,
                addressDetail: orderPayload.delivery?.addressDetail || '',
                receiverName: receiverName,
                receiverPhone: receiverPhone,
                goodsType: orderPayload.goodsType || orderPayload.goods_type || 'Khác',
                goodsValue: goodsValue,
              },
              paymentMethod: orderPayload.paymentMethod || 'cod',
              shippingFee: shippingFee,
              isPaid: 0,
            };

            console.log('📦 Đang tạo đơn hàng với dữ liệu:', JSON.stringify(orderBody, null, 2));

            const orderRes = await fetch('http://localhost/DACN_Hutech/backend/order_handler.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderBody),
            });

            const responseText = await orderRes.text();
            console.log('📥 Raw response:', responseText.substring(0, 200));

            let orderData;
            try {
              orderData = JSON.parse(responseText);
            } catch (parseErr) {
              console.error('❌ Không thể parse JSON từ response:', parseErr);
              console.error('📄 Response content:', responseText);
              throw new Error('Server trả về dữ liệu không hợp lệ. Có thể có lỗi PHP.');
            }

            if (!orderRes.ok) {
              console.error('❌ HTTP Error:', orderRes.status, orderData);
              throw new Error(orderData.message || `HTTP ${orderRes.status}`);
            }
            console.log('📦 Phản hồi từ order_handler:', orderData);

            if (orderData.success && orderData.order_id) {
              const successMsg = {
                role: 'assistant',
                content: `✅ Mình đã giúp bạn tạo đơn hàng thành công! Mã đơn của bạn là #${orderData.order_id}. Bạn có thể xem chi tiết trong [LINK:/history|mục lịch sử đơn hàng].`
              };
              setMessages(prev => [...prev, successMsg]);
            } else {
              console.error('❌ Tạo đơn thất bại:', orderData);
              const failMsg = {
                role: 'assistant',
                content: `😥 Xin lỗi, hệ thống không thể tạo đơn tự động lúc này. ${orderData.message ? `Lý do: ${orderData.message}` : 'Vui lòng thử lại sau hoặc đặt đơn trực tiếp trên trang Đặt đơn.'}`
              };
              setMessages(prev => [...prev, failMsg]);
            }
          } catch (err) {
            console.error('❌ Lỗi khi tạo đơn tự động từ ChatBot:', err);
            const errorMsg = {
              role: 'assistant',
              content: `Có lỗi xảy ra khi kết nối đến hệ thống đặt đơn: ${err.message}. Bạn vui lòng thử lại sau hoặc tự đặt đơn trên trang Đặt đơn nhé.`
            };
            setMessages(prev => [...prev, errorMsg]);
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