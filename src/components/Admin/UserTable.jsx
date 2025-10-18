import React from "react";

const UserRow = ({ user, onEdit, onDelete }) => {
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-sm">
            {initials}
          </div>
          <div>
            <div className="font-medium">{user.full_name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-2 text-sm">{user.phone_number}</td>
      <td className="py-3 px-2">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            className="text-blue-600 hover:underline text-sm"
          >
            Sửa
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="text-red-600 hover:underline text-sm"
          >
            Xoá
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-sm">
          {initials}
        </div>
        <div>
          <div className="font-medium">{user.full_name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="text-sm text-gray-500 mt-1">
            SĐT: {user.phone_number}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button onClick={() => onEdit(user)} className="text-blue-600 text-sm">
          Sửa
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="text-red-600 text-sm"
        >
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
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Danh sách nhân viên</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-lg w-64"
          />
        </div>
      </div>

      {/* Desktop / tablet: table with fixed height + scroll */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="py-2 px-2">Tên / Email</th>
                <th className="py-2 px-2">SĐT</th>
                <th className="py-2 px-2">Hành động</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="max-h-72 overflow-auto">
          <table className="w-full text-left">
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-gray-500">
                    Không có nhân viên phù hợp
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
      <div className="md:hidden">
        {currentUsers.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            Không có nhân viên phù hợp
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

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">{`Hiển thị ${currentUsers.length} trên ${filteredUsers.length}`}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-md border"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <div className="px-3 py-1 text-sm">
            {currentPage} / {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded-md border"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
