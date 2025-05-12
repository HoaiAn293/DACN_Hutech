import React, { useState } from "react";
import VehicleSelector from './VehicleSelector';
import DeliveryInfo from './DeliveryInfo';
import Sidebar from "./Sidebar";

const OrderPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedSidebarTab, setSelectedSidebarTab] = useState("order");

  return (
    <div className="flex w-full">
      <Sidebar onSelect={setSelectedSidebarTab} selectedTab={selectedSidebarTab} />
      <div className="w-full bg-gray-100 px-6 py-8">
        <h1 className="text-2xl font-bold text-[#4e7cb2] mb-6">Đặt đơn hàng mới</h1>
        <div className="w-full bg-white p-6 rounded-xl shadow-md">
          {/* Form giao hàng */}
          <div className="w-full">
            {/* Truyền hàm chọn xe xuống */}
            <VehicleSelector onSelect={setSelectedVehicle} />
            {/* Truyền xe đã chọn xuống DeliveryInfo */}
            <DeliveryInfo selectedVehicle={selectedVehicle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;