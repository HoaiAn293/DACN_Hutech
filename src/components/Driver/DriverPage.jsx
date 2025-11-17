import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Truck, CheckCircle, Clock } from 'lucide-react';

const DriverPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDriver, setCurrentDriver] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    // Xác thực role và tải đơn hàng
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        // Đảm bảo chỉ driver có thể truy cập
        if (!user || user.role !== 'driver') {
            window.location.href = '/login'; 
            return;
        }
        setCurrentDriver(user);
        fetchDriverOrders(user.id);
    }, []);

    const fetchDriverOrders = (driverId) => {
        setLoading(true);
        // Gọi API mới: get_orders_by_driver.php
        fetch(`http://localhost/DACN_Hutech/backend/get_orders_by_driver.php?driver_id=${driverId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Sắp xếp đơn hàng theo trạng thái ưu tiên: Đang giao -> Đã nhận -> Chờ xác nhận
                    const sortedOrders = data.sort((a, b) => {
                        const statusOrder = { 'Đang giao': 1, 'Đã nhận': 2, 'Chờ xác nhận': 3, 'Hoàn tất': 4, 'Đã huỷ': 5 };
                        return statusOrder[a.status] - statusOrder[b.status];
                    });
                    setOrders(sortedOrders);
                } else {
                    setOrders([]);
                }
            })
            .catch(err => {
                console.error("Lỗi khi tải đơn hàng tài xế:", err);
                toast.error("Không thể tải danh sách đơn hàng được gán.");
            })
            .finally(() => setLoading(false));
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setProcessingId(orderId);
        
        try {
            const res = await fetch('http://localhost/DACN_Hutech/backend/update_order_status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: orderId, 
                    status: newStatus,
                })
            });

            const result = await res.json();
            
            if (result.status === "success") {
                toast.success(`Cập nhật trạng thái thành "${newStatus}" thành công!`);
                fetchDriverOrders(currentDriver.id); // Tải lại danh sách
            } else {
                toast.error(result.message || "Cập nhật trạng thái thất bại.");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Lỗi kết nối server khi cập nhật trạng thái.");
        } finally {
            setProcessingId(null);
        }
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case "Đang giao": return "bg-orange-100 text-orange-800 border-orange-200";
            case "Đã nhận": return "bg-blue-100 text-blue-800 border-blue-200";
            case "Hoàn tất": return "bg-green-100 text-green-800 border-green-200";
            case "Chờ xác nhận": return "bg-gray-200 text-gray-800 border-gray-300";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };
    
    // Hàm hiển thị nút hành động
    const renderActionButtons = (order) => {
        // Driver chỉ có thể đánh dấu Đã nhận hoặc Hoàn tất.
        
        if (order.status === 'Đang giao') {
            return (
                <button
                    onClick={() => handleStatusUpdate(order.id, 'Đã nhận')}
                    disabled={processingId === order.id}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <CheckCircle className="w-4 h-4" />
                    {processingId === order.id ? 'Đang nhận...' : 'Xác nhận Đã nhận'}
                </button>
            );
        }
        
        if (order.status === 'Đã nhận') {
            return (
                <button
                    onClick={() => handleStatusUpdate(order.id, 'Hoàn tất')}
                    disabled={processingId === order.id}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    <CheckCircle className="w-4 h-4" />
                    {processingId === order.id ? 'Đang hoàn tất...' : 'Hoàn tất Đơn hàng'}
                </button>
            );
        }
        
        // Nếu là Chờ xác nhận, driver không làm gì (chờ Staff chuyển sang Đang giao)
        if (order.status === 'Chờ xác nhận') {
             return (
                <span className="text-sm text-gray-500 italic">Chờ nhân viên phân công</span>
            );
        }
        
        return null;
    };


    if (loading) return <div className="text-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-300 border-t-blue-600 mx-auto mb-3"></div>
        <p>Đang tải đơn hàng...</p>
    </div>;
    
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <Truck className="w-8 h-8 text-orange-600" />
                        Đơn hàng được gán ({orders.length})
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 font-medium">Xin chào, {currentDriver?.full_name?.split(' ').pop()}</span>
                        <button
                            onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="p-12 text-center bg-white rounded-xl shadow-md border border-gray-200">
                            <Clock className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">🎉 Tuyệt vời! Hiện tại bạn không có đơn hàng nào đang chờ xử lý.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4 border-b pb-3 border-dashed">
                                        <h3 className="text-2xl font-bold text-blue-700">Đơn hàng #{order.id}</h3>
                                        <span className={`px-4 py-1 text-sm font-bold rounded-full border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700 mb-6">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="font-semibold mb-1 text-gray-800 flex items-center gap-1">
                                                <Truck className="w-4 h-4 text-orange-500" /> Phương tiện:
                                            </p>
                                            <p className="text-base text-blue-600 font-bold">{order.vehicle}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="font-semibold mb-1 text-gray-800 flex items-center gap-1">
                                                <span className="text-green-500">₫</span> Phí vận chuyển:
                                            </p>
                                            <p className="text-base text-green-600 font-bold">{order.shipping_fee.toLocaleString()} VNĐ</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="font-semibold mb-1 text-gray-800 flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-gray-500" /> Ngày tạo:
                                            </p>
                                            <p className="text-sm">{new Date(order.created_at).toLocaleString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Thông tin Địa chỉ */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
                                            <p className="font-bold text-gray-800 mb-1">Điểm Lấy hàng</p>
                                            <p className="text-sm">{order.pickup_address}</p>
                                            <p className="text-xs text-gray-500 mt-2">Người gửi: {order.sender_name} | SĐT: {order.sender_phone}</p>
                                        </div>
                                        <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
                                            <p className="font-bold text-gray-800 mb-1">Điểm Giao hàng</p>
                                            <p className="text-sm">{order.delivery_address}</p>
                                            <p className="text-xs text-gray-500 mt-2">Người nhận: {order.receiver_name} | SĐT: {order.receiver_phone}</p>
                                        </div>
                                    </div>

                                    {/* Nút hành động */}
                                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                                        {renderActionButtons(order)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverPage;