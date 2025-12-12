import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  CreditCard, 
  UserPlus, 
  LogOut, 
  Menu,
  X 
} from "lucide-react";
import AdminStats from "./AdminStats";
import UserTable from "./UserTable";
import CreateAccountForm from "./CreateAccountForm";
import TransactionApproval from "./TransactionApproval";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
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

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Quản lý người dùng", icon: Users },
    { id: "create-user", label: "Tạo tài khoản", icon: UserPlus },
    { id: "orders", label: "Quản lý đơn hàng", icon: Package },
    { id: "transactions", label: "Duyệt giao dịch", icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <AdminStats stats={statsArr} />
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
          </div>
        );
      case "users":
        return (
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
        );
      case "create-user":
        return (
          <CreateAccountForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            message={message}
          />
        );
      case "transactions":
        return <TransactionApproval />;
      case "orders":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quản lý đơn hàng</h2>
            <p className="text-gray-500">Tính năng đang phát triển...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 fixed h-full z-50 shadow-2xl`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {sidebarOpen && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin CRM
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 border-r-4 border-yellow-400 shadow-lg"
                    : "hover:bg-slate-700/50"
                }`}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-600/80 rounded-lg transition-colors"
            title={!sidebarOpen ? "Đăng xuất" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Quản lý hệ thống và người dùng
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {JSON.parse(localStorage.getItem("user"))?.full_name || "Admin"}
                </p>
                <p className="text-xs text-gray-400">Quản trị viên</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                {JSON.parse(localStorage.getItem("user"))?.full_name?.charAt(0) || "A"}
              </div>
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;