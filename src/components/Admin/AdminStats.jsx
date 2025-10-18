import React from "react";

const StatCard = ({ title, value, icon, accent }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
    <div
      className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl ${accent}`}
    >
      {icon}
    </div>
  </div>
);

const AdminStats = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
    <StatCard
      title="Tổng nhân viên"
      value={stats.total_employees}
      icon="👥"
      accent="bg-blue-500"
    />
    <StatCard
      title="Doanh thu"
      value={Number(stats.revenue).toLocaleString() + " ₫"}
      icon="💰"
      accent="bg-green-500"
    />
    <StatCard
      title="Tổng đơn hàng"
      value={stats.total_orders}
      icon="📦"
      accent="bg-indigo-500"
    />
    <StatCard
      title="Đang chờ xử lý"
      value={stats.pending_orders}
      icon="⏳"
      accent="bg-yellow-500"
    />
  </div>
);

export default AdminStats;
