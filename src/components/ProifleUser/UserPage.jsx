import React, { useState, useEffect } from "react";
import Wallet from "./Wallet";
import TransactionHistory from "./TransactionHistory";
import Sidebar from "../Bill/Sidebar";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const [selectedSidebarTab, setSelectedSidebarTab] = useState("user");
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    phone_number: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy user từ localStorage (nếu chưa đăng nhập thì redirect về login)
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }
    fetch(`http://localhost/DACN_Hutech/backend/get_user.php?id=${user.id}`)
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

  useEffect(() => {
    if (userData) {
      setEditForm({
        full_name: userData.full_name,
        email: userData.email,
        phone_number: userData.phone_number
      });
    }
  }, [userData]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!editForm.full_name.trim()) {
      setError('Vui lòng nhập họ và tên');
      return false;
    }
    if (!editForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setError('Email không hợp lệ');
      return false;
    }
    if (!editForm.phone_number.trim() || !/^[0-9]{10}$/.test(editForm.phone_number)) {
      setError('Số điện thoại không hợp lệ (phải có 10 chữ số)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
      const response = await fetch('http://localhost/DACN_Hutech/backend/update_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: user.id,
          ...editForm
        })
      });

      const data = await response.json();
      if (data.success) {
        setUserData({...userData, ...editForm});
        setIsEditing(false);
        setError('');
      } else {
        setError(data.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <Sidebar onSelect={setSelectedSidebarTab} selectedTab={selectedSidebarTab} />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Trang cá nhân</h1>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                {!isEditing ? (
                  <>
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
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Chỉnh sửa hồ sơ
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={editForm.full_name}
                        onChange={(e) => {
                          setEditForm({...editForm, full_name: e.target.value});
                          setError('');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone_number}
                        onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2
                          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Đang lưu...
                          </>
                        ) : 'Lưu thay đổi'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            full_name: userData.full_name,
                            email: userData.email,
                            phone_number: userData.phone_number
                          });
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                )}
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
