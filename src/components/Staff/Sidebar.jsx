import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Sidebar = ({ onSelect, selectedTab }) => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        Swal.fire({
            title: 'Xác nhận đăng xuất',
            text: 'Bạn có chắc chắn muốn đăng xuất?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đăng xuất',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('user');
                navigate('/login');
            }
        });
    };
  
    // ĐÃ CẬP NHẬT: Loại bỏ "Tài xế" khỏi menu của Nhân viên
    const menuItems = [
      { icon: "📄", label: "Đơn hàng", key: "orders" },
      { icon: "📊", label: "Thống kê", key: "dashboard" },
    ];
  
    return (
      <div className={`flex flex-col h-screen bg-gray-900 text-white ${isOpen ? 'w-64' : 'w-16'} transition-all`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            {isOpen && <span className="text-sm">Nhân viên</span>}
          </div>
          <button onClick={toggleSidebar} className="text-2xl text-white">{isOpen ? "×" : "≡"}</button>
        </div>
  
        {/* Menu */}
        <nav className="flex-1 p-2 space-y-2">
          {menuItems.map(item => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              isOpen={isOpen}
              active={selectedTab === item.key}
              onClick={() => onSelect(item.key)}
            />
          ))}
          <button onClick={handleLogout} className="w-full">
            <SidebarItem
              icon="🚪"
              label="Đăng xuất"
              isOpen={isOpen}
              active={false}
            />
          </button>
        </nav>
      </div>
    );
  };
  
  const SidebarItem = ({ icon, label, isOpen, onClick, active }) => (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer rounded-md transition-colors
      ${active ? 'bg-gray-700' : 'hover:bg-gray-800'}`}>
      <span>{icon}</span>
      {isOpen && <span>{label}</span>}
    </div>
  );
  
  export default Sidebar;