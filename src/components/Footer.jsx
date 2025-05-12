import React from "react";

const Footer = () => {
    return (
        <footer className="bg-[#4e7cb2] text-[#f8f4f3]">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">SwiftShip</h2>
                    <p className="text-sm">Dịch vụ giao hàng nhanh, an toàn và tiện lợi. Đồng hành cùng mọi bước chuyển động
                        của bạn.</p>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2">Dịch vụ</h3>
                    <ul className="space-y-1 text-sm">
                        <li><a href="#" className="hover:underline">Giao hàng trong ngày</a></li>
                        <li><a href="#" className="hover:underline">Theo dõi đơn hàng</a></li>
                        <li><a href="#" className="hover:underline">Tài xế chuyên nghiệp</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2">Liên hệ</h3>
                    <ul className="text-sm space-y-1">
                        <li><i className="text-gray-300 fa-solid fa-phone"></i> 1900 123 456</li>
                        <li><i className="text-gray-300 fa-solid fa-envelope"></i> support@swiftship.vn</li>
                        <li><i className="text-gray-300 fa-solid fa-house"></i> 123 Nguyễn Văn Cừ, Quận 5, TP.HCM</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2">Kết nối với chúng tôi</h3>
                    <div className="flex space-x-2 text-xl">
                        <i className="text-gray-300 fa-brands fa-facebook"></i>
                        <i className="text-gray-300 fa-brands fa-twitter"></i>
                        <i className="text-gray-300 fa-brands fa-square-google-plus"></i>
                        <i className="text-gray-300 fa-brands fa-square-threads"></i>

                    </div>
                </div>

            </div>
            <div className="bg-[#3a6390] text-center text-sm py-4">
                © 2025 SwiftShip. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;