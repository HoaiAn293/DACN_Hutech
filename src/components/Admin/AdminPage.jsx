import React, { useState, useEffect } from 'react';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'employee'
  });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost/DACS_Hutech/backend/get_user.php');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Lỗi khi lấy users:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost/DACS_Hutech/backend/create_admin.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        setFormData({
          full_name: '',
          email: '',
          phone_number: '',
          password: '',
          role: 'employee'
        });
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
      setMessage('Lỗi khi tạo tài khoản!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá?')) return;
    try {
      await fetch(`http://localhost/DACS_Hutech/backend/delete_user.php?id=${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      console.error('Lỗi khi xoá:', err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    try {
      await fetch('http://localhost/DACS_Hutech/backend/update_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
    }
  };

  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const stats = [
    { title: 'Tổng khách hàng', value: users.length, icon: '👥' },
    { title: 'Doanh thu', value: '46,760.89 ₫', icon: '💰' },
    { title: 'Đơn hàng mới', value: '376', icon: '📦' },
    { title: 'Đang chờ xử lý', value: '35', icon: '⏳' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">{s.title}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              <div className="text-3xl">{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Table */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>

          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Tên</th>
                <th>Vai trò</th>
                <th>Email</th>
                <th>SDT</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="py-2">{user.full_name}</td>
                  <td>{user.role === 'user' ? 'Người dùng' : user.role === 'employee' ? 'Nhân viên' : user.role}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number}</td>
                  <td className="space-x-2">
                    <button onClick={() => handleEdit(user)} className="text-blue-500 hover:underline">Sửa</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline">Xoá</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Create Account Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Tạo tài khoản mới</h2>
          {message && (
            <div className={`mb-4 p-4 rounded-lg ${message.includes('thành công') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'}`}>
              <p className="flex items-center">
                {message.includes('thành công') ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                )}
                {message}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ Tên</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Nhập họ tên"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="0123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật Khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai Trò</label>
              <input
                type="text"
                value="Nhân viên"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Tạo Tài Khoản
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;