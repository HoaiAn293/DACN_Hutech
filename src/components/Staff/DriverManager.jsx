import React, { useEffect, useState } from "react";
import { UserPlus, Edit2, Trash2, Save, X, Search, Filter } from "lucide-react";

const initialForm = {
  full_name: "",
  phone_number: "",
  cccd: "",
  license_number: "",
  vehicle_type: "Xe bán tải",
  note: "",
  status: 1,
  image: null,
};

const vehicleOptions = ["Xe bán tải", "Xe van", "Xe máy", "Xe tải"];

const statusOptions = [
  { value: 1, label: "Hoạt động", color: "green" },
  { value: 0, label: "Không hoạt động", color: "red" },
];

const DriverManager = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchDrivers = () => {
    setLoading(true);
    fetch("http://localhost/DACN_Hutech/backend/get_drivers.php")
      .then((res) => res.json())
      .then((data) => {
        setDrivers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "status" ? Number(value) : value });
  };

  const phoneRegex = /^0\d{9}$/;
  const licenseRegex = /^[A-Za-z0-9-]{8,}$/;

  const handleAddDriver = (e) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    setSuccess("");

    if (!phoneRegex.test(form.phone_number)) {
      setError("Số điện thoại phải bắt đầu bằng 0 và đủ 10 số.");
      setAdding(false);
      return;
    }

    const cleanedLicense = form.license_number.replace(/[\s-]/g, "");
    if (!licenseRegex.test(cleanedLicense)) {
      setError("Số bằng lái phải có ít nhất 8 ký tự, chỉ gồm chữ, số và dấu gạch ngang.");
      setAdding(false);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "image" && value) {
        formData.append("image", value);
      } else {
        formData.append(key, value);
      }
    });

    fetch("http://localhost/DACN_Hutech/backend/add_driver.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setAdding(false);
        if (data.success) {
          setForm(initialForm);
          setShowAddForm(false);
          setSuccess("Thêm tài xế thành công!");
          fetchDrivers();
        } else {
          setError(data.error || "Thêm tài xế thất bại");
        }
      })
      .catch(() => {
        setAdding(false);
        setError("Lỗi kết nối server");
      });
  };

  const handleEditClick = (driver) => {
    setEditingId(driver.id);
    setEditForm({
      ...driver,
      status: Number(driver.status),
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: name === "status" ? Number(value) : value,
    });
  };

  const handleUpdateDriver = (e) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    setSuccess("");

    if (!phoneRegex.test(editForm.phone_number)) {
      setError("Số điện thoại phải bắt đầu bằng 0 và đủ 10 số.");
      setAdding(false);
      return;
    }

    const cleanedLicense = editForm.license_number.replace(/[\s-]/g, "");
    if (!licenseRegex.test(cleanedLicense)) {
      setError("Số bằng lái phải có ít nhất 8 ký tự, chỉ gồm chữ, số và dấu gạch ngang.");
      setAdding(false);
      return;
    }

    let body;
    let url = "http://localhost/DACN_Hutech/backend/update_driver.php";
    let options = {};

    if (editForm.image) {
      body = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (key === "image" && value) {
          body.append("image", value);
        } else {
          body.append(key, value);
        }
      });
      options = { method: "POST", body };
    } else {
      body = JSON.stringify(editForm);
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      };
    }

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        setAdding(false);
        if (data.success) {
          setEditingId(null);
          setSuccess("Cập nhật tài xế thành công!");
          fetchDrivers();
        } else {
          setError(data.message || data.error || "Cập nhật tài xế thất bại");
        }
      })
      .catch(() => {
        setAdding(false);
        setError("Lỗi kết nối server");
      });
  };

  const handleDeleteDriver = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài xế này?")) return;
    setAdding(true);
    setError("");
    setSuccess("");
    fetch("http://localhost/DACN_Hutech/backend/delete_driver.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAdding(false);
        if (data.success) {
          setSuccess("Xóa tài xế thành công!");
          fetchDrivers();
        } else {
          setError(data.error || "Xóa tài xế thất bại");
        }
      })
      .catch(() => {
        setAdding(false);
        setError("Lỗi kết nối server");
      });
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone_number.includes(searchTerm) ||
      driver.license_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" || 
      driver.status.toString() === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Tài xế</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin tài xế và phương tiện</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-1 gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, SĐT, bằng lái..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="1">Hoạt động</option>
                  <option value="0">Không hoạt động</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Thêm tài xế mới
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thêm tài xế mới</h2>
            <form onSubmit={handleAddDriver}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ tên đầy đủ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                    placeholder="0xxxxxxxxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    pattern="^0\d{9}$"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CCCD <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="cccd"
                    value={form.cccd}
                    onChange={handleChange}
                    required
                    placeholder="Số CCCD"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số bằng lái <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="license_number"
                    value={form.license_number}
                    onChange={handleChange}
                    required
                    placeholder="Số bằng lái xe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    pattern="^[A-Za-z0-9\-]{8,}$"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại xe <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vehicle_type"
                    value={form.vehicle_type}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {vehicleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh tài xế
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <input
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Ghi chú thêm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={adding}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  {adding ? "Đang xử lý..." : "Lưu thông tin"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setForm(initialForm);
                  }}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Drivers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="text-gray-600 mt-2">Đang tải danh sách tài xế...</p>
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== "all" 
                    ? "Không tìm thấy tài xế nào phù hợp" 
                    : "Hiện chưa có tài xế nào trong hệ thống"}
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CCCD</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bằng lái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại xe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDrivers.map((driver) =>
                    editingId === driver.id ? (
                      <tr key={driver.id} className="bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })}
                            className="text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            name="full_name"
                            value={editForm.full_name}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            name="phone_number"
                            value={editForm.phone_number}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            name="cccd"
                            value={editForm.cccd}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            name="license_number"
                            value={editForm.license_number}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            name="vehicle_type"
                            value={editForm.vehicle_type}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          >
                            {vehicleOptions.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            name="status"
                            value={editForm.status}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            name="note"
                            value={editForm.note}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={handleUpdateDriver}
                              disabled={adding}
                              className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors disabled:bg-gray-400"
                            >
                              <Save className="w-4 h-4" />
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="inline-flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Hủy
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={
                              driver.image_url
                                ? driver.image_url.startsWith("http")
                                  ? driver.image_url
                                  : `http://localhost/DACN_Hutech/${driver.image_url.replace(/^\/+/, "")}`
                                : "https://ui-avatars.com/api/?name=TX&background=3b82f6&color=fff"
                            }
                            alt={driver.full_name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              e.target.src = "https://ui-avatars.com/api/?name=TX&background=3b82f6&color=fff";
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{driver.full_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{driver.phone_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{driver.cccd}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{driver.license_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {driver.vehicle_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              driver.status === "1" || driver.status === 1
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {driver.status === "1" || driver.status === 1 ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">{driver.note || "—"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(driver)}
                              className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteDriver(driver.id)}
                              disabled={adding}
                              className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors disabled:bg-gray-400"
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Footer with count */}
          {!loading && filteredDrivers.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{filteredDrivers.length}</span> tài xế
                {(searchTerm || filterStatus !== "all") && ` (từ tổng số ${drivers.length})`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverManager;