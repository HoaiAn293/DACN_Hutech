import React, { useEffect, useState } from "react";

const DriverManager = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/DACS_Hutech/backend/get_drivers.php")
      .then((res) => res.json())
      .then((data) => {
        setDrivers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách tài xế:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải danh sách tài xế...</p>;
  if (drivers.length === 0) return <p>Hiện chưa có tài xế nào trong hệ thống.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Quản lý tài xế</h2>

      <div className="bg-white shadow-md rounded p-4">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Tên tài xế</th>
              <th className="px-4 py-2 border">Số điện thoại</th>
              <th className="px-4 py-2 border">CCCD</th>
              <th className="px-4 py-2 border">Ngày tạo</th>
              <th className="px-4 py-2 border">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td className="px-4 py-2 border">{driver.id}</td>
                <td className="px-4 py-2 border">{driver.full_name}</td>
                <td className="px-4 py-2 border">{driver.phone_number}</td>
                <td className="px-4 py-2 border">{driver.cccd}</td>
                <td className="px-4 py-2 border">{driver.created_at}</td>
                <td className="px-4 py-2 border">
                  <button className="text-blue-500 hover:underline">Chỉnh sửa</button>
                  <button className="text-red-500 hover:underline ml-2">Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverManager;
