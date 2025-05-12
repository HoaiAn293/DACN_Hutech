import React, { useEffect, useState } from "react";

const TabCancelled = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/DACS_Hutech/backend/get_orders.php?status=Đã huỷ")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải đơn huỷ:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải đơn hàng đã huỷ...</p>;
  if (orders.length === 0) return <p>Hiện chưa có đơn hàng trong mục "Đã huỷ".</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-red-50 p-4 rounded shadow border border-red-200"
        >
          <div className="text-red-700 font-semibold">
            Đơn #{order.id} - {order.vehicle}
          </div>
          <div>Người gửi: {order.sender_name}</div>
          <div>Người nhận: {order.receiver_name}</div>
          <div>Loại hàng: {order.goods_type} | Giá trị: {order.goods_value.toLocaleString()} VNĐ</div>
          <div className="text-sm text-gray-500">Ngày tạo: {order.created_at}</div>
        </div>
      ))}
    </div>
  );
};

export default TabCancelled;
