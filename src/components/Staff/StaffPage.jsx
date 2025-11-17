import React, { useState } from "react";
import Sidebar from "./Sidebar";
import OrderList from "./OrderList";
import PerformanceChart from "./PerformanceChart";
// import DriverManager from "./DriverManager"; // <-- ĐÃ XÓA IMPORT NÀY

const StaffPage = () => {
  const [selectedTab, setSelectedTab] = useState("orders"); // Tab mặc định là "Đơn hàng"

  const renderContent = () => {
    switch (selectedTab) {
      case "orders":
        return <OrderList />;
      // case "drivers": // <-- ĐÃ XÓA CASE "drivers"
      //   return <DriverManager />;
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