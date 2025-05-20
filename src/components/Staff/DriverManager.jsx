import React, { useEffect, useState } from "react";

const initialForm = {
  full_name: "",
  phone_number: "",
  cccd: "",
  license_number: "",
  vehicle_type: "Xe bán tải",
  note: "",
  status: 1,
};

const vehicleOptions = ["Xe bán tải", "Xe van", "Xe máy"];

const statusOptions = [
  { value: 1, label: "Hoạt động" },
  { value: 0, label: "Không hoạt động" },
];

const DriverManager = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);

  const fetchDrivers = () => {
    setLoading(true);
    fetch("http://localhost/DACS_Hutech/backend/get_drivers.php")
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "status" ? Number(value) : value });
  };

  const phoneRegex = /^0\d{9}$/;

  // Mở rộng regex số bằng lái cho phép chữ, số và dấu gạch ngang, tối thiểu 8 ký tự
  const licenseRegex = /^[A-Za-z0-9\-]{8,}$/;

  const handleAddDriver = (e) => {
    e.preventDefault();
    setAdding(true);
    setError("");

    if (!phoneRegex.test(form.phone_number)) {
      setError("Số điện thoại phải bắt đầu bằng 0 và đủ 10 số.");
      setAdding(false);
      return;
    }

    // Loại bỏ dấu cách và gạch ngang trước khi kiểm tra
    const cleanedLicense = form.license_number.replace(/[\s\-]/g, "");
    if (!licenseRegex.test(cleanedLicense)) {
      setError(
        "Số bằng lái phải có ít nhất 8 ký tự, chỉ gồm chữ, số và dấu gạch ngang."
      );
      setAdding(false);
      return;
    }

    fetch("http://localhost/DACS_Hutech/backend/add_driver.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        setAdding(false);
        if (data.success) {
          setForm(initialForm);
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

    if (!phoneRegex.test(editForm.phone_number)) {
      setError("Số điện thoại phải bắt đầu bằng 0 và đủ 10 số.");
      setAdding(false);
      return;
    }

    const cleanedLicense = editForm.license_number.replace(/[\s\-]/g, "");
    if (!licenseRegex.test(cleanedLicense)) {
      setError(
        "Số bằng lái phải có ít nhất 8 ký tự, chỉ gồm chữ, số và dấu gạch ngang."
      );
      setAdding(false);
      return;
    }

    fetch("http://localhost/DACS_Hutech/backend/update_driver.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
      .then((res) => res.json())
      .then((data) => {
        setAdding(false);
        if (data.success) {
          setEditingId(null);
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
    fetch("http://localhost/DACS_Hutech/backend/delete_driver.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAdding(false);
        if (data.success) {
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Quản lý tài xế</h2>

      <form
        onSubmit={handleAddDriver}
        className="bg-white p-4 rounded shadow space-y-2"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            placeholder="Tên tài xế"
            className="border p-2 rounded"
          />
          <input
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            required
            placeholder="Số điện thoại"
            className="border p-2 rounded"
            pattern="^0\d{9}$"
            title="Số điện thoại phải bắt đầu bằng 0 và đủ 10 số."
          />
          <input
            name="cccd"
            value={form.cccd}
            onChange={handleChange}
            required
            placeholder="CCCD"
            className="border p-2 rounded"
          />
          <input
            name="license_number"
            value={form.license_number}
            onChange={handleChange}
            required
            placeholder="Số bằng lái"
            className="border p-2 rounded"
            pattern="^[A-Za-z0-9\-]{8,}$"
            title="Số bằng lái phải có ít nhất 8 ký tự, chỉ gồm chữ, số và dấu gạch ngang."
          />
          <select
            name="vehicle_type"
            value={form.vehicle_type}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            {vehicleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Ghi chú"
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={adding}
        >
          {adding ? "Đang thêm..." : "Thêm tài xế"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      <div className="bg-white shadow-md rounded p-4">
        {loading ? (
          <p>Đang tải danh sách tài xế...</p>
        ) : drivers.length === 0 ? (
          <p>Hiện chưa có tài xế nào trong hệ thống.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Tên tài xế</th>
                <th className="px-4 py-2 border">Số điện thoại</th>
                <th className="px-4 py-2 border">CCCD</th>
                <th className="px-4 py-2 border">Số bằng lái</th>
                <th className="px-4 py-2 border">Loại xe</th>
                <th className="px-4 py-2 border">Ngày tạo</th>
                <th className="px-4 py-2 border">Ghi chú</th>
                <th className="px-4 py-2 border">Trạng thái</th>
                <th className="px-4 py-2 border">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) =>
                editingId === driver.id ? (
                  <tr key={driver.id} className="bg-yellow-50">
                    <td className="px-4 py-2 border">{driver.id}</td>
                    <td className="px-4 py-2 border">
                      <input
                        name="full_name"
                        value={editForm.full_name}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        name="phone_number"
                        value={editForm.phone_number}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        name="cccd"
                        value={editForm.cccd}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        name="license_number"
                        value={editForm.license_number}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        name="vehicle_type"
                        value={editForm.vehicle_type}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      >
                        {vehicleOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 border">{driver.created_at}</td>
                    <td className="px-4 py-2 border">
                      <input
                        name="note"
                        value={editForm.note}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={handleUpdateDriver}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        disabled={adding}
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Hủy
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={driver.id}>
                    <td className="px-4 py-2 border">{driver.id}</td>
                    <td
                      className="px-4 py-2 border"
                      onClick={() => handleEditClick(driver)}
                      style={{ cursor: "pointer" }}
                    >
                      {driver.full_name}
                    </td>
                    <td
                      className="px-4 py-2 border"
                      onClick={() => handleEditClick(driver)}
                      style={{ cursor: "pointer" }}
                    >
                      {driver.phone_number}
                    </td>
                    <td
                      className="px-4 py-2 border"
                      onClick={() => handleEditClick(driver)}
                      style={{ cursor: "pointer" }}
                    >
                      {driver.cccd}
                    </td>
                    <td
                      className="px-4 py-2 border"
                      onClick={() => handleEditClick(driver)}
                      style={{ cursor: "pointer" }}
                    >
                      {driver.license_number}
                    </td>
                    <td
                      className="px-4 py-2 border"
                      onClick={() => handleEditClick(driver)}
                      style={{ cursor: "pointer" }}
                    >
                      {driver.vehicle_type}
                    </td>
                    <td className="px-4 py-2 border">{driver.created_at}</td>
                    <td
                      className="px-4 py-2 border"
                      onClick={() => handleEditClick(driver)}
                      style={{ cursor: "pointer" }}
                    >
                      {driver.note}
                    </td>
                    <td
                      className="px-4 py-2 border"
                      onClick={() => handleEditClick(driver)}
                      style={{ cursor: "pointer" }}
                    >
                      {driver.status === "1" || driver.status === 1
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleEditClick(driver)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteDriver(driver.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        disabled={adding}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DriverManager;
