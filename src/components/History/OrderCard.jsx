import React, { useState } from 'react';

const OrderCard = ({ order, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        pickup: {
            address: order.pickup_address || '',
            addressDetail: order.pickup_address_detail || '',
            senderName: order.sender_name || '',
            senderPhone: order.sender_phone || ''
        },
        delivery: {
            address: order.delivery_address || '',
            addressDetail: order.delivery_address_detail || '',
            receiverName: order.receiver_name || '',
            receiverPhone: order.receiver_phone || '',
            goodsType: order.goods_type || '',
            goodsValue: order.goods_value || ''
        }
    });

    const handleCancel = async () => {
        if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
            try {
                const response = await fetch('http://localhost/DACS_Hutech/backend/cancel_order.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ order_id: order.id })
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('Hủy đơn hàng thành công');
                    onRefresh(); // Cập nhật lại danh sách đơn hàng
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Lỗi khi hủy đơn:', error);
                alert('Có lỗi xảy ra khi hủy đơn hàng');
            }
        }
    };

    const handleUpdate = async (updatedData) => {
        try {
            const response = await fetch('http://localhost/DACS_Hutech/backend/update_order_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: order.id,
                    status: updatedData.status
                })
            });
            
            const result = await response.json();
            if (result.status === "success") {
                alert('Cập nhật đơn hàng thành công');
                onRefresh();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật đơn:', error);
            alert('Có lỗi xảy ra khi cập nhật đơn hàng');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            {!isEditing ? (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Thông tin lấy hàng</h3>
                            <p>Địa chỉ: {order.pickup_address}</p>
                            <p>Chi tiết: {order.pickup_address_detail}</p>
                            <p>Người gửi: {order.sender_name}</p>
                            <p>SĐT: {order.sender_phone}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Thông tin giao hàng</h3>
                            <p>Địa chỉ: {order.delivery_address}</p>
                            <p>Chi tiết: {order.delivery_address_detail}</p>
                            <p>Người nhận: {order.receiver_name}</p>
                            <p>SĐT: {order.receiver_phone}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p>Loại hàng: {order.goods_type}</p>
                        <p>Giá trị: {order.goods_value.toLocaleString('vi-VN')}đ</p>
                        <p>Trạng thái: {order.status}</p>
                    </div>
                    {order.status === 'Chờ xác nhận' && (
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Hủy đơn
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate(editData);
                }}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Thông tin lấy hàng</h3>
                            <input
                                type="text"
                                value={editData.pickup.address}
                                onChange={(e) => setEditData({
                                    ...editData,
                                    pickup: { ...editData.pickup, address: e.target.value }
                                })}
                                className="w-full p-2 border rounded mb-2"
                                placeholder="Địa chỉ lấy hàng"
                            />
                            {/* Add similar inputs for other pickup fields */}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Thông tin giao hàng</h3>
                            <input
                                type="text"
                                value={editData.delivery.address}
                                onChange={(e) => setEditData({
                                    ...editData,
                                    delivery: { ...editData.delivery, address: e.target.value }
                                })}
                                className="w-full p-2 border rounded mb-2"
                                placeholder="Địa chỉ giao hàng"
                            />
                            {/* Add similar inputs for other delivery fields */}
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Lưu thay đổi
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default OrderCard;