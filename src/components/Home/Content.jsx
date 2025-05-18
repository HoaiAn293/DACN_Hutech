import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <div 
            ref={ref}
            className='w-full px-16 py-20'
        >
            <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[32px] font-bold text-[#4e7cb2] flex my-10 justify-center"
            >
                Vì sao chọn SwiftShip?
            </motion.h2>
            <div className="mt-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reasons.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                        className="p-6 rounded-xl shadow-xl"
                        style={{ background: "linear-gradient(135deg, #2a629a 10%, #c5dbf7 100%)" }}
                    >
                        <motion.img 
                            src={item.img} 
                            alt={item.title} 
                            className="w-20"
                            initial={{ rotate: -180 }}
                            animate={isInView ? { rotate: 0 } : { rotate: -180 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                        <motion.h3 
                            className="text-[22px] font-bold mb-2 text-white"
                            initial={{ x: -20 }}
                            animate={isInView ? { x: 0 } : { x: -20 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                        >
                            {item.title}
                        </motion.h3>
                        <motion.p 
                            className="text-white"
                            initial={{ x: -20 }}
                            animate={isInView ? { x: 0 } : { x: -20 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        >
                            {item.desc}
                        </motion.p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Content;
