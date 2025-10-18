import React, { useState, useEffect } from "react";
import AdminStats from "./AdminStats";
import UserTable from "./UserTable";
import CreateAccountForm from "./CreateAccountForm";

const AdminPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "employee",
  });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [stats, setStats] = useState({
    total_employees: 0,
    revenue: 0,
    total_orders: 0,
    pending_orders: 0,
  });
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "http://localhost/DACN_Hutech/backend/get_user.php"
      );
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Lỗi khi lấy users:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(
        "http://localhost/DACN_Hutech/backend/admin_stats.php"
      );
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Lỗi khi lấy thống kê:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost/DACN_Hutech/backend/create_admin.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        setFormData({
          full_name: "",
          email: "",
          phone_number: "",
          password: "",
          role: "employee",
        });
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      setMessage("Lỗi khi tạo tài khoản!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá?")) return;
    try {
      await fetch(
        `http://localhost/DACN_Hutech/backend/delete_user.php?id=${id}`,
        { method: "DELETE" }
      );
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    try {
      await fetch("http://localhost/DACN_Hutech/backend/update_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
    }
  };

  const statsArr = [
    { title: "Tổng nhân viên", value: stats.total_employees, icon: "👥" },
    {
      title: "Doanh thu",
      value: stats.revenue.toLocaleString() + " ₫",
      icon: "💰",
    },
    { title: "Đơn hàng mới", value: stats.total_orders, icon: "📦" },
    { title: "Đang chờ xử lý", value: stats.pending_orders, icon: "⏳" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
        >
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
          Đăng xuất
        </button>
      </div>

      <AdminStats stats={statsArr} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserTable
          users={users}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          usersPerPage={usersPerPage}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          handleUpdateUser={handleUpdateUser}
        />
        <CreateAccountForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          message={message}
        />
      </div>
    </div>
  );
};

export default AdminPage;
