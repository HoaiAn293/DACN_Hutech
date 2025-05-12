import React, { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const statusList = [
    "Chờ xác nhận",
    "Đang giao",
    "Đã nhận",
    "Hoàn tất",
    "Đã huỷ"
  ];

  useEffect(() => {
    fetch("http://localhost/DACS_Hutech/backend/get_orders.php")
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch("http://localhost/DACS_Hutech/backend/update_order_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });

      const result = await res.json();
      if (result.status === "success") {
        // Cập nhật lại danh sách tại chỗ
        setOrders(prev =>
          prev.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert("Cập nhật thất bại: " + result.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (orders.length === 0) return <p>Không có đơn hàng nào.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Danh sách đơn hàng</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-4 rounded shadow flex flex-col gap-1"
        >
          <div className="text-[#4e7cb2] font-semibold">
            Đơn #{order.id} - {order.vehicle}
          </div>
          <div>Người gửi: {order.sender_name} - {order.sender_phone}</div>
          <div>Người nhận: {order.receiver_name} - {order.receiver_phone}</div>
          <div>Loại hàng: {order.goods_type} | Giá trị: {order.goods_value.toLocaleString()} VNĐ</div>
          <div>Trạng thái: 
            <select
              className="ml-2 p-1 border rounded text-sm"
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
            >
              {statusList.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500">Ngày tạo: {order.created_at}</div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
