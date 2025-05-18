import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const vehicles = [
  {
    label: "Xe Máy",
    image: "/img/xe-may.jpg",
    maxWeight: 30,
    pricePerKm: 5000,
    baseFee: 15000,
    description: "Phù hợp cho hàng hóa nhỏ gọn"
  },
  {
    label: "Xe Van", 
    image: "/img/xe-van.jpg",
    maxWeight: 500,
    pricePerKm: 10000,
    baseFee: 25000,
    description: "Thích hợp cho hàng hóa cỡ vừa, nội thành"
  },
  {
    label: "Xe Bán Tải",
    image: "/img/xe-ban-tai.jpg", 
    maxWeight: 1000,
    pricePerKm: 15000,
    baseFee: 35000,
    description: "Phù hợp cho hàng hóa số lượng lớn"
  },
  {
    label: "Xe Tải",
    image: "/img/xe-tai.png",
    maxWeight: 2000,
    pricePerKm: 20000,
    baseFee: 50000,
    description: "Phù hợp cho hàng hóa siêu trọng"
  }
];

const VehicleSelector = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (label) => {
    setSelected(label);
    if (onSelect) {
      onSelect(label);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-6">
      <h1 className="font-semibold text-[24px] text-[#4e7cb2] mb-8">Chọn xe phù hợp</h1>
      <div className="mt-6">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          pagination={{ 
            clickable: true,
            el: '.swiper-pagination',
            type: 'bullets',
          }}
          className="vehicle-swiper pb-12 px-10"
          loop={true}
        >
          {vehicles.map((vehicle, index) => (
            <SwiperSlide key={index}>
              <div
                className={`rounded-2xl border-2 p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selected === vehicle.label
                    ? "border-[#1d4e89] bg-blue-200 shadow-lg"
                    : "border-[#4e7cb2] hover:border-[#1d4e89]"
                }`}
                onClick={() => handleSelect(vehicle.label)}
              >
                <div className="flex justify-center items-center h-40 mb-4 overflow-hidden rounded-xl">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.label} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                  />
                </div>
                <div className="text-[#4e7cb2] font-bold text-lg mb-2">{vehicle.label}</div>
                <div className="text-gray-600 text-sm">
                  <p>Tải trọng: {vehicle.maxWeight}kg</p>
                  <p>Giá: {vehicle.pricePerKm.toLocaleString('vi-VN')}đ/km</p>
                  <p className="text-xs mt-1 italic">{vehicle.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
};

export default VehicleSelector;
