import React, { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const statusList = [
    "Chờ xác nhận",
    "Đang giao", 
    "Đã nhận",
    "Hoàn tất",
    "Đã huỷ"
  ];

  useEffect(() => {
    // Fetch users
    fetch("http://localhost/DACS_Hutech/backend/get_user.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const userAccounts = data.users.filter(user => user.role === 'user');
          setUsers(userAccounts || []);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách người dùng:", err);
        setUsers([]);
      });

    // Fetch orders
    fetch("http://localhost/DACS_Hutech/backend/get_orders.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("Lỗi:", data.message);
          setOrders([]);
        } else {
          setOrders(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải đơn hàng:", err);
        setOrders([]);
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

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Danh sách khách hàng và đơn hàng</h2>

      {users.length === 0 ? (
        <p>Không có tài khoản khách hàng nào.</p>
      ) : (
        users.map((user) => {
          const userOrders = orders.filter(order => order.user_id === user.id);
          
          return (
            <div key={user.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-semibold text-[#4e7cb2]">
                  Khách hàng: {user.full_name}
                </h3>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">SĐT: {user.phone}</p>
              </div>

              {userOrders.length === 0 ? (
                <p className="text-gray-500 italic">Chưa có đơn hàng nào</p>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-medium">Danh sách đơn hàng ({userOrders.length})</h4>
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-gray-50 p-4 rounded border"
                    >
                      <div className="text-[#4e7cb2] font-semibold">
                        Đơn #{order.id} - {order.vehicle}
                      </div>
                      <div>Người gửi: {order.sender_name} - {order.sender_phone}</div>
                      <div>Người nhận: {order.receiver_name} - {order.receiver_phone}</div>
                      <div>Loại hàng: {order.goods_type} | Giá trị: {order.goods_value.toLocaleString()} VNĐ</div>
                      <div>
                        Trạng thái: 
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
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrderList;
