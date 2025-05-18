import React, { useState } from "react";
import TabAll from "./TabAll";
import TabPending from "./TabPending";
import TabCompleted from "./TabCompleted";
import TabReceived from "./TabReceived";
import TabShippin from "./TabShippin";
import TabCancelled from "./TabCancelled";
import Sidebar from "../Bill/Sidebar";
const tabs = [
  "Tất cả",
  "Chờ xác nhận",
  "Đang giao",
  "Đã nhận",
  "Hoàn tất",
  "Đã hủy"
];

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [selectedSidebarTab, setSelectedSidebarTab] = useState("history");

  const renderTabComponent = () => {
    switch (activeTab) {
      case "Tất cả":
        return <TabAll />;
      case "Chờ xác nhận":
        return <TabPending />;
      case "Đang giao":
        return <TabShippin />;
      case "Đã nhận":
        return <TabReceived />;
      case "Hoàn tất":
        return <TabCompleted />;
      case "Đã hủy":
        return <TabCancelled />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full">
      <Sidebar onSelect={setSelectedSidebarTab} selectedTab={selectedSidebarTab} />
      <div className="flex-1 min-h-screen bg-gray-100 px-6 py-8">
        <h1 className="text-2xl font-bold text-[#4e7cb2] mb-6">Lịch sử đơn hàng</h1>
        
        <div className="flex gap-3 flex-wrap justify-start mb-6">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                activeTab === tab
                  ? "bg-[#4e7cb2] text-white shadow-md"
                  : "bg-white text-gray-700 border hover:bg-blue-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">
            Lịch sử đơn hàng - {activeTab}
          </h2>
          {renderTabComponent()}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
