import React, { useState, useEffect } from "react";

const ImageSlider = () => {
  const slides = [
    {
      image: "/img/bg.png",
      title: "Luôn sẵn sàng để phục vụ bạn nhanh nhất",
      description: "Chúng tôi cam kết mang đến dịch vụ vận chuyển nhanh chóng và tin cậy cho mọi khách hàng."
    },
    {
      image: "/img/bg3.png",
      title: "Thao tác đặt xe thông minh, nhanh chóng",
      description: "Chúng tôi cung cấp dịch vụ vận chuyển với mức giá hợp lý và nhiều ưu đãi hấp dẫn."
    },
    {
      image: "/img/bg2.png",
      title: "Giao hàng tận nơi, không cần chờ",
      description: "Không lo chuyện trễ hàng với chức năng giao hỏa tốc!"
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]); 

  return (
    <div 
      style={{
        backgroundImage: `url('${slides[currentImageIndex].image}')`,
        transition: 'background-image 0.5s ease-in-out'
      }} 
      className="relative w-full bg-cover bg-center min-h-screen bg-gradient-to-r from-white to-pink-50 flex items-center"
    >
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        {/* Left content */}
        <div className="md:w-1/2 text-left mb-16 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            {slides[currentImageIndex].title}
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            {slides[currentImageIndex].description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
