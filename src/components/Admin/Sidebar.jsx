import React, { useState } from "react";
import { LayoutDashboard, Car, ShoppingCart, FileText, Settings, LogOut } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "car", label: "Loại xe", icon: Car },
    { id: "orders", label: "Đơn hàng", icon: ShoppingCart },
    { id: "invoices", label: "Hoá đơn", icon: FileText },
    { id: "settings", label: "Cài đặt", icon: Settings },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Xác nhận đăng xuất",
      text: "Bạn có chắc chắn muốn đăng xuất?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("admin");
        navigate("/login");
      }
    });
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl rounded-r-2xl p-5 hidden lg:flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3 pb-6 border-b border-slate-700">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
          DH
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">DACN Admin</h3>
          <p className="text-xs text-slate-400">Quản trị hệ thống</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveItem(item.id);
              }}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }
              `}
            >
              <Icon
                size={20}
                className={`transition-transform duration-200 ${
                  isActive ? "" : "group-hover:scale-110"
                }`}
              />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </a>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="pt-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full text-left"
        >
          <LogOut
            size={20}
            className="transition-transform duration-200 group-hover:scale-110"
          />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
