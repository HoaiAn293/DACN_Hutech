import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TabPending = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Thêm state cho modal nhập lý do hủy
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    fetch(`http://localhost/DACN_Hutech/backend/get_orders.php?status=Chờ xác nhận&user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Lỗi khi tải đơn hàng. Vui lòng thử lại sau.", {
          position: "top-right",
          autoClose: 3000,
          className: 'bg-red-50 text-red-700',
        });
        setLoading(false);
      });
  }, []);

  // Khi nhấn nút hủy
  const handleCancelClick = (orderId) => {
    setCancelOrderId(orderId);
    setShowCancelModal(true);
    setCancelReason("");
    setCancelError("");
  };

  // Khi xác nhận hủy
  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      setCancelError("Vui lòng nhập lý do hủy đơn hàng!");
      return;
    }
    try {
      const response = await fetch('http://localhost/DACS_Hutech/backend/cancel_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order_id: cancelOrderId, reason: cancelReason })
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Hủy đơn hàng thành công', {
          position: "top-right",
          autoClose: 3000,
          className: 'bg-green-50 text-green-700',
        });
        setOrders(orders.filter(order => order.id !== cancelOrderId));
        setShowCancelModal(false);
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi hủy đơn hàng', {
          position: "top-right",
          autoClose: 3000,
          className: 'bg-red-50 text-red-700',
        });
      }
    } catch {
      toast.error('Có lỗi xảy ra khi hủy đơn hàng', {
        position: "top-right",
        autoClose: 3000,
        className: 'bg-red-50 text-red-700',
      });
    }
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (orders.length === 0) return <p>Hiện chưa có đơn hàng trong mục "Chờ xác nhận".</p>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        >
          <div className="bg-gradient-to-r from-[#1a365d] to-[#2d5a9e] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-white">#{order.id}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm bg-white/20 px-4 py-1.5 rounded-full text-white font-medium">
                  {order.vehicle}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-1.5 rounded-full text-sm bg-white/20 text-white font-medium">
                {order.status}
              </div>
            </div>
          </div>

          <div className="p-8">
            {order.invoice_number && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-2">
                      Mã hóa đơn
                    </div>
                    <div className="font-semibold text-[#1a365d] text-lg">
                      {order.invoice_number}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-2">
                      Số tiền
                    </div>
                    <div className="font-semibold text-[#1a365d] text-lg">
                      {order.invoice_amount?.toLocaleString()} VNĐ
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-2">
                      Phương thức thanh toán
                    </div>
                    <div className="font-semibold text-[#1a365d]">
                      {order.invoice_payment_method === 'cod'
                        ? 'Thanh toán khi nhận hàng'
                        : order.invoice_payment_method === 'balance'
                        ? 'Thanh toán bằng ví điện tử'
                        : order.invoice_payment_method
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 font-medium mb-2">
                      Tài xế
                    </div>
                    <div className={order.drivers_name ? "font-semibold text-[#1a365d]" : "font-semibold text-[#e53e3e]"}>
                      {order.drivers_name || "Đang chờ tài xế..."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="text-sm text-gray-600 font-medium mb-3">
                  Người gửi
                </div>
                <div className="font-semibold text-[#1a365d] mb-2">
                  {order.sender_name}
                </div>
                 <div className="text-sm text-gray-600 font-medium mb-3">
                  Số điện thoại
                </div>
                <div className="text-gray-600">
                  {order.sender_phone}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="text-sm text-gray-600 font-medium mb-3">
                  Người nhận
                </div>
                <div className="font-semibold text-[#1a365d] mb-2">
                  {order.receiver_name}
                </div>
                 <div className="text-sm text-gray-600 font-medium mb-3">
                  Số điện thoại
                </div>
                <div className="text-gray-600">
                  {order.receiver_phone}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 font-medium mb-2">
                    Loại hàng
                  </div>
                  <div className="font-semibold text-[#1a365d]">
                    {order.goods_type}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-medium mb-2">
                    Giá trị hàng
                  </div>
                  <div className="font-semibold text-[#1a365d]">
                    {order.goods_value?.toLocaleString()} VNĐ
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mt-8">
              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1d4e89]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 font-medium">Địa điểm lấy hàng</div>
                  <div className="font-semibold text-[#1a365d] mt-2">{order.pickup_address}</div>
                  {order.pickup_detail && (
                    <div className="text-sm text-gray-600 mt-1">{order.pickup_detail}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1d4e89]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 font-medium">Địa điểm giao hàng</div>
                  <div className="font-semibold text-[#1a365d] mt-2">{order.delivery_address}</div>
                  {order.delivery_detail && (
                    <div className="text-sm text-gray-600 mt-1">{order.delivery_detail}</div>
                  )}
                </div>
              </div>
            </div>

         
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => handleCancelClick(order.id)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Hủy đơn hàng
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modal nhập lý do hủy */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-3 text-[#1a365d]">Nhập lý do hủy đơn hàng</h3>
            <textarea
              className="w-full border rounded-lg p-2 focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none"
              rows={3}
              value={cancelReason}
              onChange={e => {
                setCancelReason(e.target.value);
                setCancelError("");
              }}
              placeholder="Nhập lý do hủy đơn..."
            />
            {cancelError && (
              <p className="text-red-500 text-sm mt-1">{cancelError}</p>
            )}
            <div className="flex gap-2 mt-4 justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleConfirmCancel}
              >
                Xác nhận hủy
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowCancelModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabPending;
