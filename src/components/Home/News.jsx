import React from "react";

const News = () => {
  const news = [
    {
      img: "/img/Tin_tuc.png",
      date: "05/05/2025",
      title: "5 mẹo giao hàng nhanh chóng và hiệu quả",
      description:
        "Tìm hiểu các mẹo giúp bạn giao hàng nhanh hơn, tiết kiệm thời gian và đảm bảo sự hài lòng của khách hàng.",
    },
    {
      img: "/img/Tin_tuc1.png",
      date: "05/05/2025",
      title: "Lợi ích của việc theo dõi đơn hàng trực tuyến",
      description:
        "Theo dõi đơn hàng trực tuyến giúp bạn kiểm soát tốt hơn và mang lại sự an tâm cho khách hàng.",
    },
    {
      img: "/img/Tin_tuc2.png",
      date: "05/05/2025",
      title: "Cộng đồng tài xế: Chia sẻ kinh nghiệm giao hàng",
      description:
        "Tham gia cộng đồng tài xế để học hỏi kinh nghiệm và cải thiện kỹ năng giao hàng mỗi ngày.",
    },
    {
      img: "/img/Tin_tuc3.png",
      date: "05/05/2025",
      title: "Tiêu chuẩn giao hàng: Điều cần biết",
      description:
        "Hiểu rõ các tiêu chuẩn giao hàng để đảm bảo chất lượng dịch vụ và sự hài lòng của khách hàng.",
    },
  ];

  return (
    <div className="w-full bg-white px-10 py-10">
      <div className=" mx-auto">
        <div className="items-center mb-6">
          <h2 className="flex justify-center text-[32px] font-bold text-[#2a629a] mb-2 transition duration-300 group-hover:text-orange-500">
            Tin tức mới nhất
          </h2>
          <a
            href="#"
            className="flex justify-end text-[#2a629a] text-[16px] font-medium hover:underline"
          >
            Xem tất cả →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {news.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 group"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-40 object-cover transition duration-300 group-hover:scale-110"
              />
              <div className="p-4">
                <p className="text-gray-500 text-sm mb-2">{item.date}</p>
                <h3 className="text-[18px] font-bold text-black mb-2 transition duration-300 group-hover:text-[#2a629a]">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
