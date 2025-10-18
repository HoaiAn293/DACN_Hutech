import React, { useEffect, useState } from "react";

const TabReceived = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    fetch(`http://localhost/DACN_Hutech/backend/get_orders.php?status=Đã nhận&user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải đơn hàng:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (orders.length === 0) return <p>Hiện chưa có đơn hàng trong mục "Đã nhận".</p>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#276749] to-[#38a169] px-6 py-4 flex justify-between items-center">
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

          {/* Content */}
          <div className="p-8">
            {/* Invoice Information - if available */}
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
                      {order.drivers_name ? order.drivers_name : "Đang chờ tài xế..."}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Thông tin người gửi/nhận */}
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

            {/* Thông tin hàng hóa */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
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

            {/* Địa chỉ */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="p-3 bg-blue-100 rounded-xl shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#1a365d]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 font-medium mb-2">
                    Địa điểm lấy hàng
                  </div>
                  <div className="font-semibold text-[#1a365d] mb-1">
                    {order.pickup_address}
                  </div>
                  {order.pickup_detail && (
                    <div className="text-gray-600">
                      {order.pickup_detail}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="p-3 bg-blue-100 rounded-xl shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#1a365d]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 font-medium mb-2">
                    Địa điểm giao hàng
                  </div>
                  <div className="font-semibold text-[#1a365d] mb-1">
                    {order.delivery_address}
                  </div>
                  {order.delivery_detail && (
                    <div className="text-gray-600">
                      {order.delivery_detail}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Ngày tạo: {order.created_at}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabReceived;