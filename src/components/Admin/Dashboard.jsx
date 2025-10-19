import React, { useState } from "react";
import { Search, Bell, Menu, ChevronDown } from "lucide-react";

const Topbar = ({ onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, text: "Đơn hàng mới #1234", time: "5 phút trước", unread: true },
    { id: 2, text: "Thanh toán thành công", time: "1 giờ trước", unread: true },
    { id: 3, text: "Nhân viên mới đã đăng ký", time: "2 giờ trước", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="w-full bg-white shadow-sm rounded-2xl px-6 py-4 mb-6 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
            />
          </div>

          {/* Search Icon for Mobile */}
          <button className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
            <Search size={20} className="text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Thông báo</h3>
                  <span className="text-xs text-blue-600 font-medium">{unreadCount} mới</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${
                        notif.unread ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 font-medium">{notif.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-gray-50 text-center">
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                    Xem tất cả
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                AD
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-800">Admin</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
              <ChevronDown size={16} className="text-gray-400 hidden lg:block" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">admin@dacn.com</p>
                </div>
                <div className="py-2">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    👤 Hồ sơ cá nhân
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    ⚙️ Cài đặt
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    ❓ Trợ giúp
                  </a>
                </div>
                <div className="border-t border-gray-100">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        ></div>
      )}
    </header>
  );
};

export default Topbar;