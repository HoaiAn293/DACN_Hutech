import React, { useEffect, useState } from "react";

const TabAll = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("Vui lòng đăng nhập để xem đơn hàng");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost/DACS_Hutech/backend/get_orders.php?user_id=${user.id}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.error) {
          setError(data.message);
          setOrders([]);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Không thể tải đơn hàng. Vui lòng thử lại sau.");
        setOrders([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (orders.length === 0) return <p>Hiện chưa có đơn hàng nào.</p>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* Header */}
          <div
            className={`text-white px-6 py-4 flex justify-between items-center ${
              order.status === "Chờ xác nhận"
                ? "bg-[#1d4e89]"
                : order.status === "Đang giao"
                ? "bg-yellow-500"
                : order.status === "Đã nhận" || order.status === "Hoàn tất"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold">#{order.id}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {order.vehicle}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full text-sm bg-white/20">
                {order.status}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Thông tin hóa đơn (nếu có) */}
            {order.invoice_number && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 font-medium">
                      Mã hóa đơn
                    </div>
                    <div className="font-semibold text-[#1d4e89]">
                      {order.invoice_number}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">
                      Số tiền
                    </div>
                    <div className="font-semibold text-[#1d4e89]">
                      {order.invoice_amount?.toLocaleString()} VNĐ
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">
                      Phương thức thanh toán
                    </div>
                    <div className="font-semibold text-[#1d4e89]">
                      {order.invoice_payment_method}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">
                      Trạng thái hóa đơn
                    </div>
                    <div className="font-semibold text-[#1d4e89]">
                      {order.invoice_status}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Thông tin người gửi/nhận */}
            <div className="grid grid-cols-2 gap-6 mb-6 bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500 font-medium">
                  Người gửi
                </div>
                <div className="font-semibold text-[#1d4e89]">
                  {order.sender_name}
                </div>
                <div className="text-sm text-gray-600">
                  {order.sender_phone}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500 font-medium">
                  Người nhận
                </div>
                <div className="font-semibold text-[#1d4e89]">
                  {order.receiver_name}
                </div>
                <div className="text-sm text-gray-600">
                  {order.receiver_phone}
                </div>
              </div>
            </div>

            {/* Thông tin hàng hóa */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500 font-medium">
                    Loại hàng
                  </div>
                  <div className="font-semibold text-[#1d4e89]">
                    {order.goods_type}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500 font-medium">
                    Giá trị hàng
                  </div>
                  <div className="font-semibold text-[#1d4e89]">
                    {order.goods_value?.toLocaleString()} VNĐ
                  </div>
                </div>
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="space-y-4 border-t-[1px] border-[#1d4e89] ">
              <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 mt-6">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#1d4e89]"
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
                  <div className="text-sm text-gray-500 font-medium">
                    Địa điểm lấy hàng
                  </div>
                  <div className="font-semibold text-[#1d4e89] mt-1">
                    {order.pickup_address}
                  </div>
                  {order.pickup_address_detail && (
                    <div className="text-sm text-gray-600 mt-1">
                      {order.pickup_address_detail}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#1d4e89]"
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
                  <div className="text-sm text-gray-500 font-medium">
                    Địa điểm giao hàng
                  </div>
                  <div className="font-semibold text-[#1d4e89] mt-1">
                    {order.delivery_address}
                  </div>
                  {order.delivery_address_detail && (
                    <div className="text-sm text-gray-600 mt-1">
                      {order.delivery_address_detail}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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

export default TabAll;
