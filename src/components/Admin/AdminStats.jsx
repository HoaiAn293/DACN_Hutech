import React from "react";
import { TrendingUp, Users, DollarSign, Package, Clock } from "lucide-react";

const AdminStats = ({ stats }) => {
  const iconMap = {
    "👥": Users,
    "💰": DollarSign,
    "📦": Package,
    "⏳": Clock,
  };

  const colorMap = {
    "👥": "from-blue-500 to-blue-600",
    "💰": "from-green-500 to-green-600",
    "📦": "from-purple-500 to-purple-600",
    "⏳": "from-orange-500 to-orange-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => {
        const Icon = iconMap[s.icon] || TrendingUp;
        const gradient = colorMap[s.icon] || "from-gray-500 to-gray-600";
        
        return (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {s.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;
