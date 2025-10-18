import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md rounded-r-lg p-4 hidden lg:block">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-blue-600 text-white rounded-md w-12 h-12 flex items-center justify-center font-bold">
          DH
        </div>
        <div>
          <h3 className="text-lg font-semibold">DACN Admin</h3>
          <p className="text-sm text-gray-500">Quản trị hệ thống</p>
        </div>
      </div>

      <nav className="space-y-1">
        <a
          className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-600"
          href="#"
        >
          Dashboard
        </a>
        <a
          className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-600"
          href="#"
        >
          Nhân viên
        </a>
        <a
          className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-600"
          href="#"
        >
          Đơn hàng
        </a>
        <a
          className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-600"
          href="#"
        >
          Hoá đơn
        </a>
        <a
          className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-blue-50 hover:text-blue-600"
          href="#"
        >
          Cài đặt
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
