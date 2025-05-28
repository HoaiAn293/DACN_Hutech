import React, { useState } from "react";
import Sidebar from "./Sidebar";
import OrderList from "./OrderList";
import PerformanceChart from "./PerformanceChart";
import DriverManager from "./DriverManager";

const StaffPage = () => {
  const [selectedTab, setSelectedTab] = useState("orders");

  const renderContent = () => {
    switch (selectedTab) {
      case "orders":
        return <OrderList />;
      case "drivers":
        return <DriverManager />;
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
