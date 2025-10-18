import React, { useState, useEffect } from "react";
import AdminStats from "./AdminStats";
import UserTable from "./UserTable";
import CreateAccountForm from "./CreateAccountForm";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

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
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error(err);
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
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost/DACN_Hutech/backend/create_admin.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        fetchStats();
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
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    // optional: open side panel or modal later
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
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Topbar onLogout={handleLogout} />
          <AdminStats stats={stats} />

          {/* use 12-col grid so right column can be narrower and sticky */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <UserTable
                users={users}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                usersPerPage={usersPerPage}
              />
            </div>

            <div className="lg:col-span-4">
              <CreateAccountForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                message={message}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
