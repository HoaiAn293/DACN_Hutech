import React from "react";

const Statistics = () => {
  const stats = [
    {
      value: " 25–30 triệu",
      description: "Cá nhân/ Doanh nghiệp sử dụng dịch vụ tiềm năng",
    },
    {
      value: ">60%",
      description:
        "Nhu cầu cả nước thì TP.HCM & Hà Nội: Trung tâm đặt tài xế nhiều nhất ",
    },
    {
      value: "> 30 tỉnh",
      description: "Dự kiến hoạt động trên toàn quốc trong năm 2030",
    },
    {
      value: "Chiếm 85%",
      description: "Đặt qua ứng dụng di động khoản 9h–12h và 15h–20h mỗi ngày",
    },
  ];

  return (
    <div  className="w-full  py-20">
      <div style={{backgroundImage: "url(/img/statics.png)"}} className=" bg-cover bg-center mx-auto py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="px-10 text-center flex flex-col items-center justify-center"
          >
            <h2 className="text-[36px] font-bold text-white">
              {stat.value}
            </h2>
            <p className="text-[16px] text-white">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
