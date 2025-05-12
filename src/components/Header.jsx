import React from "react";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white py-6 px-6 fixed w-full top-0 left-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center w-20 h-10">
            <img src="/img/logo.png" alt="SwiftShip" className="" />
            <span className="ml-2 text-xl font-bold text-[#3a6390]">SWIFTSHIP</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-lg">
          <Link to="/" className="text-[#3a6390]">Trang chủ</Link>
          <Link to="/about-us" className="hover:text-[#3a6390]">Về chúng tôi</Link>
          <Link to="/services" className="hover:text-[#3a6390]">Dịch vụ</Link>
          <Link to="/drivers" className="hover:text-[#3a6390]">Tài xế</Link>
          <Link to="/contacts" className="hover:text-[#3a6390]">Liên hệ</Link>
        </nav>

        <div className="flex items-center space-x-4">
         <Link to="/login"> 
          <button className="bg-yellow-400 text-white px-6 py-2 rounded-full hover:bg-yellow-500 transition-colors">
              ĐẶT XE NGAY
            </button>
        </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
