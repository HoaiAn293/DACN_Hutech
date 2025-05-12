import React, { useState } from "react";
import ProductType from "./ProductType";

const DeliveryInfo = ({ selectedVehicle }) => {
    const [selectedType, setSelectedType] = useState("");

    // Pickup Info
    const [pickupAddress, setPickupAddress] = useState("");
    const [pickupDetail, setPickupDetail] = useState("");
    const [senderName, setSenderName] = useState("");
    const [senderPhone, setSenderPhone] = useState("");

    // Delivery Info
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryDetail, setDeliveryDetail] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [goodsValue, setGoodsValue] = useState("");

    const handleSubmit = async () => {
        if (!selectedVehicle) {
            alert("Vui lòng chọn loại xe trước khi xác nhận!");
            return;
        }

        const payload = {
            vehicle: selectedVehicle,
            pickup: {
                address: pickupAddress,
                addressDetail: pickupDetail,
                senderName,
                senderPhone
            },
            delivery: {
                address: deliveryAddress,
                addressDetail: deliveryDetail,
                receiverName,
                receiverPhone,
                goodsType: selectedType,
                goodsValue: parseInt(goodsValue)
            }
        };

        try {
            const response = await fetch("http://localhost/DACS_Hutech/backend/order_handler.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Lỗi khi gửi đơn hàng:", error);
            alert("Không thể gửi đơn hàng.");
        }
    };

    return (
        <div className="w-full mt-10 pr-6">
            <h2 className="font-medium text-[20px] mb-6 text-[#4e7cb2]">Lộ trình giao hàng</h2>

            {/* Địa điểm lấy hàng */}
            <div className="mb-8 bg-[#89b2e1cc] py-6 rounded-2xl px-4 shadow-xl">
                <p className="font-semibold text-[16px] mb-6">Địa điểm lấy hàng</p>
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Địa chỉ" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} className="rounded-[8px] p-2 w-full bg-white" />
                    <input type="text" placeholder="Chi tiết địa chỉ" value={pickupDetail} onChange={e => setPickupDetail(e.target.value)} className="rounded-[8px] p-2 w-full bg-white" />
                    <input type="text" placeholder="Tên người gửi" value={senderName} onChange={e => setSenderName(e.target.value)} className="rounded-[8px] p-2 w-full bg-white" />
                    <input type="text" placeholder="Số điện thoại" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} className="rounded-[8px] p-2 w-full bg-white" />
                </div>
            </div>

            {/* Địa điểm giao hàng */}
            <div className="mb-8 bg-[#89b2e1cc] py-6 rounded-2xl px-4 shadow-xl">
                <p className="font-semibold text-[16px] mb-6">Bạn muốn giao hàng đến</p>
                <div className="grid grid-cols-2 gap-4 relative">
                    <input type="text" placeholder="Địa chỉ" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className="rounded-[8px] p-2 w-full bg-white" />
                    <input type="text" placeholder="Chi tiết địa chỉ" value={deliveryDetail} onChange={e => setDeliveryDetail(e.target.value)} className="rounded-[8px] p-2 w-full bg-white" />
                    <input type="text" placeholder="Tên người nhận" value={receiverName} onChange={e => setReceiverName(e.target.value)} className="rounded-[8px] p-2 w-full bg-white" />
                    <input type="text" placeholder="Số điện thoại" value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} className="rounded-[8px] p-2 w-full bg-white" />

                    <ProductType value={selectedType} onChange={setSelectedType} />

                    <input type="text" placeholder="Giá trị hàng (VNĐ)" value={goodsValue} onChange={e => setGoodsValue(e.target.value)} className="rounded-[8px] p-2 w-full bg-white" />
                </div>
            </div>

            <button
                className="bg-[#4e7cb2] hover:bg-[#3b5f8a] text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
                onClick={handleSubmit}
            >
                Xác nhận
            </button>
        </div>
    );
};

export default DeliveryInfo;
