import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const statusList = [
    "Chờ xác nhận",
    "Đang giao",
    "Đã nhận",
    "Hoàn tất",
    "Đã huỷ"
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-gradient-to-r from-[#1a365d] to-[#2d5a9e]";
      case "Đang giao":
        return "bg-gradient-to-r from-[#b27229] to-[#fc9c02]";
      case "Đã nhận":
      case "Hoàn tất":
        return "bg-gradient-to-r from-[#276749] to-[#38a169]";
      case "Đã huỷ":
        return "bg-gradient-to-r from-[#9b2c2c] to-[#e53e3e]";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-blue-100 text-blue-800";
      case "Đang giao":
        return "bg-orange-100 text-orange-800";
      case "Đã nhận":
      case "Hoàn tất":
        return "bg-green-100 text-green-800";
      case "Đã huỷ":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost/DACN_Hutech/backend/get_all_orders.php');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        
        if (text.includes('Fatal error') || text.includes('<br />')) {
          console.error('PHP Error:', text);
          toast.error('Lỗi server: Vui lòng kiểm tra logs');
          return [];
        }
        
        try {
          const data = JSON.parse(text);
          if (data.error) {
            toast.error(data.message || 'Có lỗi xảy ra');
            return [];
          }
          return Array.isArray(data) ? data : [];
        } catch (error) {
          console.error('Invalid JSON response:', text, '\nError:', error);
          toast.error('Lỗi khi xử lý dữ liệu từ server');
          return [];
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Không thể tải dữ liệu đơn hàng');
        return [];
      }
    };
  
    const fetchDrivers = fetch("http://localhost/DACN_Hutech/backend/get_drivers.php")
      .then(res => res.json())
      .catch(err => {
        console.error("Lỗi khi tải tài xế:", err);
        toast.error("Không thể tải danh sách tài xế");
        return [];
      });
  
    Promise.all([fetchOrders(), fetchDrivers])
      .then(([ordersData, driversData]) => {
        setOrders(ordersData);
        setDrivers(Array.isArray(driversData) ? driversData : []);
      })
      .catch(err => {
        console.error("Lỗi tải dữ liệu:", err);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
        setOrders([]);
        setDrivers([]);
      })
      .finally(() => setLoading(false));
  }, []);
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch("http://localhost/DACN_Hutech/backend/update_order_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      const result = await res.json();
      if (result.status === "success") {
        const response = await fetch('http://localhost/DACN_Hutech/backend/get_all_orders.php');
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
        toast.success(`Cập nhật trạng thái đơn #${id} thành công.`);
      } else {
        toast.error("Cập nhật thất bại: " + (result.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  // LOGIC PHÂN CÔNG TÀI XẾ (ĐÃ CHỈNH SỬA)
  const handleDriverChange = async (id, newDriverId) => {
    const isAssigning = newDriverId !== "" && newDriverId !== null;
    
    try {
      // 1. Kiểm tra tài xế có đơn đang hoạt động không (chỉ check nếu gán tài xế mới)
      if (isAssigning) {
        const hasActiveOrder = orders.some(order => 
          order.driver_id === parseInt(newDriverId) && 
          (order.status === "Đang giao" || order.status === "Đã nhận")
        );

        if (hasActiveOrder) {
          toast.error("Tài xế này đang có đơn hàng chưa hoàn thành. Vui lòng chọn tài xế khác.");
          return;
        }
      }

      // 2. Chuẩn bị dữ liệu cập nhật
      let updatePayload = { 
        id, 
        driver_id: newDriverId ? parseInt(newDriverId) : null
      };

      // 3. Nếu gán tài xế thành công, ĐỒNG THỜI chuyển trạng thái sang "Đang giao" (Shipping)
      let newStatus = null;
      if (isAssigning) {
          // Chỉ chuyển trạng thái nếu đơn hàng đang ở "Chờ xác nhận"
          const currentOrder = orders.find(o => o.id === id);
          if (currentOrder && currentOrder.status === 'Chờ xác nhận') {
              newStatus = 'Đang giao';
              updatePayload.status = newStatus;
          }
      }
      
      // 4. Gọi API cập nhật
      const res = await fetch("http://localhost/DACN_Hutech/backend/update_order_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });
      
      const result = await res.json();
      if (result.status === "success") {
        const driverName = drivers.find(d => d.id === parseInt(newDriverId))?.full_name || null;
        setOrders(prev =>
          prev.map(order =>
            order.id === id ? { 
              ...order, 
              driver_id: newDriverId ? parseInt(newDriverId) : null, 
              driver_name: driverName,
              status: newStatus || order.status // Cập nhật trạng thái nếu có
            } : order
          )
        );
        toast.success(newStatus ? `Đã phân công tài xế và chuyển trạng thái sang "${newStatus}".` : `Cập nhật tài xế cho đơn #${id} thành công.`);
      } else {
        toast.error("Cập nhật thất bại: " + (result.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật tài xế:", error);
      toast.error("Có lỗi xảy ra khi cập nhật tài xế.");
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const res = await fetch("http://localhost/DACN_Hutech/backend/delete_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      if (result.status === "success") {
        setOrders(prev => prev.filter(order => order.id !== id));
        toast.success(`Đã xóa đơn hàng #${id} thành công.`);
      } else {
        toast.error("Xóa thất bại: " + (result.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi xóa đơn hàng.");
    }
  };

  // Filter and search logic
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      order.id.toString().includes(searchTerm) ||
      order.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a365d] to-[#2d5a9e] rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Quản lý đơn hàng</h2>
        <p className="text-blue-100">Tổng cộng {orders.length} đơn hàng</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tìm kiếm đơn hàng
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm theo ID, tên người gửi/nhận..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Lọc theo trạng thái
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">Tất cả trạng thái</option>
              {statusList.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Không có đơn hàng</h3>
          <p className="text-gray-500">Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Header */}
              <div className={`${getStatusColor(order.status)} px-6 py-4 flex justify-between items-center`}>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-white">#{order.id}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm bg-white/20 px-4 py-1.5 rounded-full text-white font-medium">
                      {order.vehicle}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/80">
                    Người đặt: <span className="font-semibold">{order.sender_name}</span>
                  </span>
                 
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Customer Information */}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="text-sm text-gray-600 font-medium mb-3">
                      Người gửi
                    </div>
                    <div className="font-semibold text-[#1a365d] mb-2">
                      {order.sender_name}
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
                    <div className="text-gray-600">
                      {order.receiver_phone}
                    </div>
                  </div>
                </div>

                {/* Goods Information */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {Number(order.goods_value).toLocaleString()} VNĐ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Cập nhật trạng thái
                    </label>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                      </span>
                      <select
                        className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                      >
                        {statusList.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Phân công tài xế
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                        {order.driver_name || "Chưa có"}
                      </span>
                      <select
                        className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                        value={order.driver_id || ""}
                        onChange={e => handleDriverChange(order.id, e.target.value)}
                      >
                        <option value="">Chưa có tài xế</option>
                        {drivers.map(driver => (
                          <option key={driver.id} value={driver.id}>
                            {driver.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-gray-200 flex justify-between">
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
                    Ngày tạo: {new Date(order.created_at).toLocaleString('vi-VN')}
                  </div>
                  {order.status === "Đã huỷ" && (
                    <button
                      onClick={() => {
                        toast.info(
                          <div className="flex flex-col gap-4">
                            <p>Bạn có chắc chắn muốn xóa đơn hàng #{order.id}?</p>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  toast.dismiss();
                                  handleDeleteOrder(order.id);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Xóa
                              </button>
                              <button
                                onClick={() => toast.dismiss()}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                Hủy
                              </button>
                            </div>
                          </div>,
                          {
                            autoClose: false,
                            closeButton: false,
                            closeOnClick: false,
                            draggable: false
                          }
                        );
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Xóa đơn
                    </button>
                  )}
                </div>
                {order.status === "Đã huỷ" && order.cancel_reason && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                    <span className="font-semibold">Lý do hủy đơn: </span>
                    {order.cancel_reason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;