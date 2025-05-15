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

  const handleAddDriver = (e) => {
    e.preventDefault();
    setAdding(true);
    setError("");
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
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td className="px-4 py-2 border">{driver.id}</td>
                  <td className="px-4 py-2 border">{driver.full_name}</td>
                  <td className="px-4 py-2 border">{driver.phone_number}</td>
                  <td className="px-4 py-2 border">{driver.cccd}</td>
                  <td className="px-4 py-2 border">{driver.license_number}</td>
                  <td className="px-4 py-2 border">{driver.vehicle_type}</td>
                  <td className="px-4 py-2 border">{driver.created_at}</td>
                  <td className="px-4 py-2 border">{driver.note}</td>
                  <td className="px-4 py-2 border">
                    {driver.status === "1" || driver.status === 1
                      ? "Hoạt động"
                      : "Không hoạt động"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DriverManager;
