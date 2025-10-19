import React from "react";
import { Search, Edit2, Trash2, ChevronLeft, ChevronRight, Mail, Phone } from "lucide-react";

const UserRow = ({ user, onEdit, onDelete }) => {
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
  ];
  const colorIndex = user.full_name.charCodeAt(0) % colors.length;

  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center font-bold text-sm text-white shadow-md`}>
            {initials}
          </div>
          <div>
            <div className="font-semibold text-gray-800">{user.full_name}</div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
              <Mail size={13} />
              {user.email}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5 text-gray-700">
          <Phone size={14} className="text-gray-400" />
          <span className="text-sm font-medium">{user.phone_number}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Edit2 size={14} />
            <span className="hidden sm:inline">Sửa</span>
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Xoá</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

const MobileUserCard = ({ user, onEdit, onDelete }) => {
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
  ];
  const colorIndex = user.full_name.charCodeAt(0) % colors.length;

  return (
    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all mb-3">
      <div className="flex items-start gap-3">
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center font-bold text-white shadow-md flex-shrink-0`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 mb-2">{user.full_name}</div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1.5">
            <Mail size={14} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Phone size={14} className="text-gray-400 flex-shrink-0" />
            <span>{user.phone_number}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button 
          onClick={() => onEdit(user)} 
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <Edit2 size={14} />
          Sửa
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
          Xoá
        </button>
      </div>
    </div>
  );
};

const UserTable = ({
  users,
  searchTerm,
  setSearchTerm,
  handleEdit,
  handleDelete,
  currentPage,
  setCurrentPage,
  usersPerPage,
}) => {
  const employees = users.filter((u) => u.role === "employee");
  const filteredUsers = employees.filter((u) =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage)
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Danh sách nhân viên</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý thông tin nhân viên</p>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Desktop / tablet: table with fixed height + scroll */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thông tin
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="max-h-96 overflow-auto">
          <table className="w-full">
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Không tìm thấy nhân viên</p>
                      <p className="text-sm text-gray-400">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden p-4">
        {currentUsers.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Không tìm thấy nhân viên</p>
              <p className="text-sm text-gray-400">Thử tìm kiếm với từ khóa khác</p>
            </div>
          </div>
        ) : (
          currentUsers.map((user) => (
            <MobileUserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Footer with Pagination */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            Hiển thị <span className="font-semibold text-gray-800">{currentUsers.length}</span> trên{" "}
            <span className="font-semibold text-gray-800">{filteredUsers.length}</span> nhân viên
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Trước</span>
            </button>
            <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={currentPage === totalPages}
            >
              <span className="hidden sm:inline">Sau</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;