import React from "react";

const Topbar = ({ onLogout }) => {
  return (
    <header className="w-full flex items-center justify-between bg-transparent mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold hidden md:block">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <input
            type="search"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
        >
          <span className="hidden sm:inline">Đăng xuất</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center font-semibold">
          AD
        </div>
      </div>
    </header>
  );
};

export default Topbar;
