import React, { useState } from "react";
import Sidebar from "./Sidebar";
import OrderList from "./OrderList";
import PerformanceChart from "./PerformanceChart";
import ReviewManager from "./ReviewManager"; // Thêm dòng này

const StaffPage = () => {
  const [selectedTab, setSelectedTab] = useState("orders"); // Tab mặc định là "Đơn hàng"

  const renderContent = () => {
    switch (selectedTab) {
      case "orders":
        return <OrderList />;
      case "reviews":
        return <ReviewManager />; // Thêm dòng này
      case "dashboard":
      default:
        return <PerformanceChart />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={setSelectedTab} selectedTab={selectedTab} />
      <main className="flex-1 p-6 overflow-auto bg-gray-100">
        {renderContent()}
      </main>
    </div>
  );
};

export default StaffPage;
