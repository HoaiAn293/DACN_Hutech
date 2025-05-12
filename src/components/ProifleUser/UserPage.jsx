import React, { useState, useEffect } from "react";
import Wallet from "./Wallet";
import TransactionHistory from "./TransactionHistory";
import Sidebar from "../Bill/Sidebar";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const [selectedSidebarTab, setSelectedSidebarTab] = useState("user");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy user từ localStorage (nếu chưa đăng nhập thì redirect về login)
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login'); // Nếu không có user -> về trang đăng nhập
      return;
    }

    // Gọi API để lấy thông tin chi tiết người dùng từ server
    fetch(`http://localhost/DACS_Hutech/backend/get_user.php?id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserData(data.user);
        } else {
          console.error(data.message);
        }
      })
      .catch(err => console.error('Lỗi khi lấy thông tin người dùng:', err));
  }, [navigate]);

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <Sidebar onSelect={setSelectedSidebarTab} selectedTab={selectedSidebarTab} />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Trang cá nhân</h1>

          <div className="grid grid-cols-12 gap-6">
            {/* Cột thông tin cá nhân */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl text-blue-600">
                      {userData ? userData.full_name.charAt(0) : "NA"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-700">
                      {userData ? userData.full_name : "Tên người dùng"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {userData ? userData.email : "Email"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {userData ? userData.phone_number : "Số điện thoại"}
                    </p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Chỉnh sửa hồ sơ</button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <Wallet />
              </div>
            </div>

            {/* Cột lịch sử giao dịch */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <TransactionHistory />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
