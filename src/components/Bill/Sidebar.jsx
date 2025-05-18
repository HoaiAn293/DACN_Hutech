import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  
    const menuItems = [
      { label: "Đặt đơn hàng", key: "order", path: "/order" },
      { label: "Lịch sử đơn hàng", key: "history", path: "/history" },
      { label: "Tài khoản của tôi", key: "user", path: "/user" },
    ];

    return (
      <div className={`flex flex-col bg-[#4e7cb2] text-white ${isOpen ? 'w-70' : 'w-16'} transition-all`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center space-x-2">
            {isOpen && <span className="text-sm font-semibold">Menu</span>}
          </div>
          <button onClick={toggleSidebar} className="text-2xl text-white hover:text-gray-200">
            {isOpen ? "×" : "≡"}
          </button>
        </div>
  
        {/* Menu */}
        <nav className="flex-1 p-2 space-y-2">
          {menuItems.map(item => (
            <Link to={item.path} key={item.key} onClick={() => onSelect(item.key)}>
              <SidebarItem
                icon={item.icon}
                label={item.label}
                isOpen={isOpen}
                active={selectedTab === item.key}
              />
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full">
            <SidebarItem
              label="Đăng xuất"
              isOpen={isOpen}
              active={false}
            />
          </button>
        </nav>
      </div>
    );
  };
  
  const SidebarItem = ({ icon, label, isOpen, active }) => (
    <div
      className={`flex items-center text-[16px] gap-3 px-4 py-4 text-sm cursor-pointer rounded-md transition-colors
      ${active ? 'bg-white/20' : 'hover:bg-white/10'}`}>
      <span>{icon}</span>
      {isOpen && <span>{label}</span>}
    </div>
  );
  
  export default Sidebar;