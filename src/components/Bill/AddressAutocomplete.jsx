import React, { useState, useEffect, useRef } from 'react';

const AddressAutocomplete = ({ label, value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue && showSuggestions && inputValue !== value) {
        fetchAddress(inputValue);
      }
    }, 600); // Tăng delay lên 600ms để người dùng gõ xong mới tìm
    return () => clearTimeout(timer);
  }, [inputValue]);

  const fetchAddress = async (query) => {
    try {
      // --- CẤU HÌNH TỐI ƯU TÌM KIẾM ---
      // 1. viewbox: Tọa độ bao quanh TP.HCM (Left,Top,Right,Bottom)
      //    Giúp ưu tiên kết quả ở HCM. Nếu bạn ở HN, hãy đổi tọa độ này.
      const viewbox = '106.3,11.2,107.1,10.3'; 
      
      const url = `https://nominatim.openstreetmap.org/search?` + 
        `format=json&` +
        `q=${encodeURIComponent(query)}&` +
        `countrycodes=vn&` +             // Chỉ tìm ở Việt Nam
        `addressdetails=1&` +            // Lấy chi tiết đường/quận
        `limit=6&` +                     // Lấy 6 kết quả
        `viewbox=${viewbox}&` +          // Ưu tiên khu vực này
        `bounded=0&` +                   // 0: Ưu tiên, 1: Bắt buộc chỉ tìm trong viewbox
        `accept-language=vi`;            // Bắt buộc Tiếng Việt

      const response = await fetch(url);
      const data = await response.json();

      // --- LỌC KẾT QUẢ THÔNG MINH ---
      // Chỉ lấy những kết quả có đủ độ chi tiết (phải có tên đường hoặc tên địa điểm cụ thể)
      // Loại bỏ những kết quả chỉ trả về tên Quận hoặc Thành phố chung chung
      const filteredData = data.filter(item => {
        const type = item.type;
        // Loại bỏ các type quá rộng như 'administrative' (địa giới hành chính) trừ khi nó là school/university
        if (item.class === 'boundary' && type === 'administrative') return false; 
        return true;
      });

      setSuggestions(filteredData);
    } catch (error) {
      console.error("Lỗi tìm địa chỉ:", error);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setShowSuggestions(true);
    onChange(val); 
  };

  const handleSelectAddress = (address) => {
    // RÚT GỌN ĐỊA CHỈ HIỂN THỊ
    // Nominatim trả về rất dài, ta có thể format lại cho đẹp
    // Ví dụ: Lấy tên địa điểm + đường + quận
    
    setInputValue(address.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    
    onChange(address.display_name, {
        lat: address.lat,
        lon: address.lon
    });
  };

  return (
    <div className="form-group" ref={wrapperRef} style={{ position: 'relative', marginBottom: '15px' }}>
      {label && <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{label}</label>}
      <input
        type="text"
        className="rounded-lg p-3 w-full bg-gray-100 border border-gray-300 focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none transition-all"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        onFocus={() => setShowSuggestions(true)}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-xl z-[9999] max-h-[250px] overflow-y-auto mt-1">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelectAddress(item)}
              className="p-3 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-colors text-sm flex flex-col"
            >
              {/* Tên chính (VD: Đại học Hutech) */}
              <span className="font-semibold text-gray-800">
                 {item.name || item.address.road || item.address.hamlet || inputValue}
              </span>
              {/* Địa chỉ chi tiết nhỏ bên dưới */}
              <span className="text-gray-500 text-xs mt-1 truncate">
                {item.display_name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;