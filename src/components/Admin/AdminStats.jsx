import React from "react";
import { Users, DollarSign, ShoppingCart, Clock, TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, accent, trend, trendValue }) => (
  <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent relative overflow-hidden">
    {/* Gradient Background Effect */}
    <div className={`absolute inset-0 ${accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
    
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
        
        {/* Trend Indicator */}
        {trend && (
          <div className={`flex items-center gap-1.5 text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{trendValue}</span>
            <span className="text-gray-400 text-xs">so với tháng trước</span>
          </div>
        )}
      </div>
      
      {/* Icon Container */}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${accent} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
        <Icon size={26} strokeWidth={2.5} />
      </div>
    </div>

    {/* Bottom Accent Line */}
    <div className={`absolute bottom-0 left-0 right-0 h-1 ${accent} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
  </div>
);

const AdminStats = ({ stats }) => {
  // Sample trend data (you can pass this from props)
  const statsWithTrends = [
    {
      title: "Tổng nhân viên",
      value: stats.total_employees,
      icon: Users,
      accent: "bg-gradient-to-br from-blue-500 to-blue-600",
      trend: "up",
      trendValue: "+12%"
    },
    {
      title: "Doanh thu",
      value: Number(stats.revenue).toLocaleString() + " ₫",
      icon: DollarSign,
      accent: "bg-gradient-to-br from-green-500 to-green-600",
      trend: "up",
      trendValue: "+23.5%"
    },
    {
      title: "Tổng đơn hàng",
      value: stats.total_orders,
      icon: ShoppingCart,
      accent: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      trend: "up",
      trendValue: "+8.2%"
    },
    {
      title: "Đang chờ xử lý",
      value: stats.pending_orders,
      icon: Clock,
      accent: "bg-gradient-to-br from-amber-500 to-amber-600",
      trend: "down",
      trendValue: "-5%"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsWithTrends.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          accent={stat.accent}
          trend={stat.trend}
          trendValue={stat.trendValue}
        />
      ))}
    </div>
  );
};

export default AdminStats;