import React, { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  const statusList = [
    "Chờ xác nhận",
    "Đang giao",
    "Đã nhận",
    "Hoàn tất",
    "Đã huỷ"
  ];

  useEffect(() => {
    const fetchOrders = fetch("http://localhost/DACS_Hutech/backend/get_all_orders.php")
      .then(res => res.json());

    const fetchDrivers = fetch("http://localhost/DACS_Hutech/backend/get_drivers.php")
      .then(res => res.json());

    Promise.all([fetchOrders, fetchDrivers])
      .then(([ordersData, driversData]) => {
        if (ordersData.error) {
          console.error("Lỗi khi tải đơn hàng:", ordersData.message);
          setOrders([]);
        } else {
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }

        if (driversData.error) {
          console.error("Lỗi khi tải tài xế:", driversData.error);
          setDrivers([]);
        } else {
          setDrivers(Array.isArray(driversData) ? driversData : []);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải dữ liệu:", err);
        setOrders([]);
        setDrivers([]);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setStatusMessage(null);
    try {
      const res = await fetch("http://localhost/DACS_Hutech/backend/update_order_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      const result = await res.json();
      if (result.status === "success") {
        setOrders(prev =>
          prev.map(order =>
            order.id === id ? { ...order, status: newStatus } : order
          )
        );
        setStatusMessage(`Cập nhật trạng thái đơn #${id} thành công.`);
      } else {
        alert("Cập nhật thất bại: " + (result.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Danh sách đơn hàng</h2>

      {statusMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {statusMessage}
        </div>
      )}

      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        orders.map(order => {
          // Hiển thị tên tài xế nếu có, hoặc 'Chưa có tài xế'
          const driverName = order.driver_name || "Chưa có tài xế";

          return (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="text-[#4e7cb2] font-semibold mb-2">
                Đơn #{order.id} - {order.vehicle}
              </div>
              <div>Người gửi: {order.sender_name} - {order.sender_phone}</div>
              <div>Người nhận: {order.receiver_name} - {order.receiver_phone}</div>
              <div>Loại hàng: {order.goods_type} | Giá trị: {Number(order.goods_value).toLocaleString()} VNĐ</div>

              <div className="mt-2">
                Trạng thái:
                <select
                  className="ml-2 p-1 border rounded text-sm"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  {statusList.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="mt-2">
                Tài xế: <span className="font-medium">{driverName}</span>
              </div>

              <div className="text-sm text-gray-500 mt-1">
                Ngày tạo: {new Date(order.created_at).toLocaleString()}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrderList;
