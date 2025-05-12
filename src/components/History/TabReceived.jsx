import React, { useEffect, useState } from "react";

const TabReceived = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/DACS_Hutech/backend/get_orders.php?status=Đã nhận")
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
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="p-4 border rounded-lg shadow-sm bg-green-50"
        >
          <div className="font-medium text-green-700">
            Đơn #{order.id} - {order.vehicle}
          </div>
          <div>Người gửi: {order.sender_name} ({order.sender_phone})</div>
          <div>Người nhận: {order.receiver_name} ({order.receiver_phone})</div>
          <div>Loại hàng: {order.goods_type} - Giá trị: {order.goods_value.toLocaleString()} VNĐ</div>
          <div>Trạng thái: <span className="font-semibold">{order.status}</span></div>
          <div className="text-sm text-gray-500">Ngày tạo: {order.created_at}</div>
        </div>
      ))}
    </div>
  );
};

export default TabReceived;
