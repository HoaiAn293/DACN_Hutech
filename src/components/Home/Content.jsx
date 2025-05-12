import React from "react";

const reasons = [
    {
        img: "/img/fast-delivery.png",
        title: "Giao hàng trong ngày",
        desc: "Nhanh chóng, đúng hẹn – đảm bảo giao trong vòng 24h."
    },
    {
        img: "/img/tracking.png",
        title: "Theo dõi đơn hàng",
        desc: "Xem vị trí đơn hàng trực tuyến mọi lúc, mọi nơi."
    },
    {
        img: "/img/driver.png",
        title: "Tài xế chuyên nghiệp",
        desc: "Thân thiện, đúng giờ, thông thạo đường phố."
    },
    {
        img: "/img/best-price.png",
        title: "Giá cả cạnh tranh",
        desc: "Dịch vụ chất lượng với chi phí hợp lý nhất."
    }
];

const Content = () => {
    return (
        <div className='w-full px-10 py-10 '>
            <h2 className="text-[32px] font-bold text-[#4e7cb2] flex my-10 justify-center">
                Vì sao chọn SwiftShip?
            </h2>
            <div className="mt-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                {reasons.map((item, index) => (
                    <div
                        key={index}
                        className="p-6 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
                        style={{ background: "linear-gradient(135deg, #2a629a 10%, #c5dbf7 100%)" }}
                    >
                        <img src={item.img} alt={item.title} className="w-20"/>
                        <h3 className="text-[22px] font-bold mb-2 text-white">
                            {item.title}
                        </h3>
                        <p className="text-white">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Content;
