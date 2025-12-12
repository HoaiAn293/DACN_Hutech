import React, { useState } from "react";
import { Search, Edit2, Trash2, Save, X, User, Phone, Mail, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

const UserTable = ({
  users,
  searchTerm,
  setSearchTerm,
  handleEdit,
  handleDelete,
  currentPage,
  setCurrentPage,
  usersPerPage,
  editingUser,
  setEditingUser,
  handleUpdateUser,
}) => {
  const manageableUsers = users.filter((u) => u.role === "employee" || u.role === "driver");
  
  const filteredUsers = manageableUsers.filter((u) =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Danh sách Nhân viên & Tài xế</h2>
            <p className="text-xs text-gray-500 mt-0.5">{filteredUsers.length} nhân sự</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tên</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">SDT</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Vai trò</span>
              </th>
              <th className="px-6 py-3 text-center">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Hành động</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Không tìm thấy dữ liệu</p>
                    <p className="text-xs text-gray-500 mt-1">Thử tìm kiếm với từ khóa khác</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentUsers.map((user) =>
                editingUser && editingUser.id === user.id ? (
                  // Edit Mode Row
                  <tr key={user.id} className="bg-blue-50/50">
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        name="full_name"
                        value={editingUser.full_name}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="email"
                        name="email"
                        value={editingUser.email}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        name="phone_number"
                        value={editingUser.phone_number}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <select
                        name="role"
                        value={editingUser.role}
                        onChange={handleChange}
                        className="w-full px-3 py-1.5 text-sm border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="employee">Nhân viên</option>
                        <option value="driver">Tài xế</option>
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={handleUpdateUser}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded-md transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Hủy
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // View Mode Row
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-gray-600">{user.email}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-gray-600">{user.phone_number}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === "employee"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {user.role === "employee" ? "Nhân viên" : "Tài xế"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              Hiển thị {indexOfFirst + 1}-{Math.min(indexOfLast, filteredUsers.length)} trong tổng {filteredUsers.length}
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-md transition-colors ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex gap-0.5">
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrentPage = currentPage === pageNum;
                  const showPage =
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                  if (!showPage) {
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return (
                        <span key={idx} className="px-2 py-1 text-xs text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[32px] px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        isCurrentPage
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-md transition-colors ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;