import React, { useState, useEffect, useRef } from "react";

const ProductType = ({ value, onChange }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const goodsTypes = [
        "Tài liệu / Giấy tờ",
        "Đồ điện tử",
        "Quần áo",
        "Thực phẩm",
        "Đồ dễ vỡ",
        "Khác"
    ];

    const handleSelect = (type) => {
        onChange(type);
        setShowDropdown(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div className="relative w-full">
            <input
                ref={inputRef}
                type="text"
                readOnly
                value={value}
                placeholder="Loại hàng hóa"
                onClick={() => setShowDropdown(true)}
                className="rounded-xl p-3 w-full bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4e7cb2] transition-all duration-300 cursor-pointer border border-gray-300 hover:border-[#4e7cb2]"
            />

            {showDropdown && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
                    <div 
                        ref={dropdownRef} 
                        className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl transform transition-all duration-300 scale-100 opacity-100"
                    >
                        <h3 className="text-xl font-semibold mb-6 text-center text-[#4e7cb2]">Chọn loại hàng hóa</h3>
                        <ul className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                            {goodsTypes.map((type, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(type)}
                                    className={`px-4 py-3 cursor-pointer rounded-xl transition-all duration-200 ${
                                        type === value 
                                            ? "bg-[#4e7cb2] text-white font-bold shadow-md" 
                                            : "hover:bg-gray-100"
                                    }`}
                                >
                                    {type}
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm font-medium transition-colors duration-200"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4e7cb2;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #1d4e89;
                }
            `}</style>
        </div>
    );
};

export default ProductType;
