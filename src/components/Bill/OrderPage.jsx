import React, { useState } from "react";
import { Card, Button, Typography, Space, Divider } from 'antd';
import { Map, LayoutGrid } from 'lucide-react';
import VehicleSelector from './VehicleSelector';
import DeliveryInfo from './DeliveryInfo';
import Sidebar from "./Sidebar";
import DeliveryMap from '../Map/DeliveryMap';

const { Title } = Typography;

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
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar onSelect={setSelectedSidebarTab} selectedTab={selectedSidebarTab} />
      <div className="flex-1 p-6">
        <Space direction="vertical" size="large" className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Title level={4} className="!mb-0 !text-gray-800 !font-semibold">
              Đặt đơn hàng mới
            </Title>
            <Button
              type={showMap ? "default" : "primary"}
              onClick={toggleMap}
              size="middle"
              className="shadow-sm flex items-center gap-2"
            >
              {showMap ? (
                <>
                  <span>Ẩn bản đồ</span>
                </>
              ) : (
                <>
                  <span>Hiện bản đồ</span>
                </>
              )}
            </Button>
          </div>

          {/* Main Content */}
          <Card 
            className="shadow-sm border-0"
            bodyStyle={{ padding: '24px' }}
          >
            <div className="relative w-full">
              {/* Map View */}
              <div 
                className={`absolute w-full transition-all duration-300 ease-in-out ${
                  showMap ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 -z-10 pointer-events-none'
                }`}
              >
                <div className="w-full" style={{ minHeight: 'calc(100vh - 200px)' }}>
                  <DeliveryMap 
                    onAddressChange={handleAddressChange} 
                    onDistanceChange={handleDistanceChange}
                  />
                </div>
              </div>

              {/* Form View */}
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  showMap ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                }`}
              >
                <Space direction="vertical" size="large" className="w-full">
                  <VehicleSelector onSelect={setSelectedVehicle} />
                  <Divider className="!my-4" />
                  <DeliveryInfo 
                    selectedVehicle={selectedVehicle}
                    pickupAddress={pickupAddress}
                    deliveryAddress={deliveryAddress}
                    distance={distance}
                  />
                </Space>
              </div>
            </div>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default OrderPage;