import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Sidebar = ({ onSelect, selectedTab }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const toggleSidebar = () => setIsOpen(!isOpen);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

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
      <div className={`flex flex-col bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#2e5daa] text-white ${isOpen ? 'w-80' : 'w-16'} transition-all duration-300 shadow-xl`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-sm bg-white/5">
          <div className="flex items-center space-x-4">
            {isOpen && (
              <>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center shadow-lg border border-white/20">
                  <span className="text-xl font-semibold text-white">
                    {user?.full_name?.charAt(0).toUpperCase() || "K"}
                  </span>
                </div>
                <span className="text-base font-medium tracking-wide">
                  Xin chào, {user?.full_name?.split(' ').pop() || "Khách"}
                </span>
              </>
            )}
          </div>
          <button onClick={toggleSidebar} className="text-[30px] text-white/90 hover:text-white transition-colors duration-200">
            {isOpen ? "×" : "≡"}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1.5">
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
          <button onClick={handleLogout} className="w-full mt-4">
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
      className={`flex items-center text-[15px] gap-3 px-4 py-3.5 text-sm cursor-pointer rounded-lg transition-all duration-200
      ${active 
        ? 'bg-white/20 shadow-lg border border-white/10' 
        : 'hover:bg-white/10 text-white/90 hover:text-white'}`}
    >
      <span>{icon}</span>
      {isOpen && <span className="font-medium">{label}</span>}
    </div>
);
  
  export default Sidebar;