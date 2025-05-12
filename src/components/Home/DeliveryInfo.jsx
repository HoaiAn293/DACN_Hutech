import React from "react";

const DeliveryInfo = () => {
  return (
    <div className=" flex flex-col md:flex-row items-start justify-center w-full px-6 py-16 bg-white">
      <div className="max-w-[500px] w-full md:w-1/2">
        <img
          src="/img/content.png"
          alt="Delivery Service"
          className="w-full h-full shadow-lg"
        />
      </div>
      <div className="max-w-[600px] w-full md:w-1/2 mt-8 md:mt-0 md:pl-10">
        <h2
          className="text-3xl font-bold text-gray-800 mb-6"
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: "400",
          }}
        >
          Trải nghiệm dịch vụ giao hàng hàng đầu của chúng tôi
        </h2>
        <p
          className="text-gray-600 text-lg mb-4 leading-relaxed"
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: "300",
          }}
        >
          Chúng tôi mang đến giải pháp giao hàng nhanh chóng, an toàn và đáng
          tin cậy. Với đội ngũ tài xế chuyên nghiệp và hệ thống theo dõi hiện
          đại, chúng tôi cam kết đồng hành cùng bạn trong mọi hành trình, đảm
          bảo hàng hóa được giao đến đúng nơi, đúng thời gian.
        </p>

        <ul
          className="list-disc list-inside text-gray-600 text-lg mb-6 leading-relaxed"
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: "300",
          }}
        >
          <li>Giao hàng siêu tốc trong ngày</li>
          <li>Theo dõi đơn hàng trực tuyến 24/7</li>
          <li>Chi phí hợp lý, cạnh tranh nhất</li>
        </ul>
      </div>
    </div>
  );
};

export default DeliveryInfo;
