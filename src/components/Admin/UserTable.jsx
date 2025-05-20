import React, { useState } from "react";

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
  const employees = users.filter((u) => u.role === "employee");
  const filteredUsers = employees.filter((u) =>
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
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Danh sách nhân viên</h2>
      <input
        type="text"
        placeholder="Tìm kiếm theo tên..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Tên</th>
            <th>Email</th>
            <th>SDT</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) =>
            editingUser && editingUser.id === user.id ? (
              <tr key={user.id} className="border-b bg-yellow-50">
                <td>
                  <input
                    type="text"
                    name="full_name"
                    value={editingUser.full_name}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                  />
                </td>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={editingUser.email}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="phone_number"
                    value={editingUser.phone_number}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                  />
                </td>
                <td className="space-x-2">
                  <button
                    onClick={handleUpdateUser}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Hủy
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={user.id} className="border-b">
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone_number}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-500 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:underline"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === idx + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
