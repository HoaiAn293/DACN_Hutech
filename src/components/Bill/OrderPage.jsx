import React, { useState } from "react";
import VehicleSelector from './VehicleSelector';
import DeliveryInfo from './DeliveryInfo';
import Sidebar from "./Sidebar";
import DeliveryMap from '../Map/DeliveryMap';

const OrderPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedSidebarTab, setSelectedSidebarTab] = useState("order");
  const [showMap, setShowMap] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [distance, setDistance] = useState(0);

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const handleAddressChange = (address, isPickup) => {
      if (isPickup) {
          setPickupAddress(address);
      } else {
          setDeliveryAddress(address);
      }
  };

  const handleDistanceChange = (newDistance) => {
    setDistance(newDistance);
  };

  return (
    <div className="flex w-full">
      <Sidebar onSelect={setSelectedSidebarTab} selectedTab={selectedSidebarTab} />
      <div className="w-full bg-gray-100 px-6 py-8">
        <h1 className="text-2xl font-bold text-[#4e7cb2] mb-6">Đặt đơn hàng mới</h1>
        <div className="w-full bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleMap}
              className="bg-[#4e7cb2] hover:bg-[#3b5f8a] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition flex items-center"
            >
              <span className="mr-2">{showMap ? 'Ẩn bản đồ' : 'Hiện bản đồ'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 1.586l-4 4V18.414l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="relative w-full">
            <div className={`absolute w-full transition-all duration-500 ease-in-out ${showMap ? 'opacity-100 z-10' : 'opacity-0 -z-10'}`}>
              <div className="w-full h-[calc(100vh-100px)]">
                <DeliveryMap 
                  onAddressChange={handleAddressChange} 
                  onDistanceChange={handleDistanceChange}
                />
              </div>
            </div>
            <div className={`transition-all duration-500 ease-in-out ${showMap ? 'opacity-0' : 'opacity-100'}`}>
              <VehicleSelector onSelect={setSelectedVehicle} />
              <DeliveryInfo 
                selectedVehicle={selectedVehicle}
                pickupAddress={pickupAddress}
                deliveryAddress={deliveryAddress}
                distance={distance}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;