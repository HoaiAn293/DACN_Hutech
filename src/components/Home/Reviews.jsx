import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Reviews = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    
    const reviews = [
        {
            img: 'https://admin.vov.gov.vn/UploadFolder/KhoTin/Images/UploadFolder/VOVVN/Images/sites/default/files/styles/large/public/2020-10/phu-nu-co-khi-chat-5.jpg',
            name: 'Nguyễn Chi',
            location: 'Thủ Đức, Tp.HCM',
            comment: 'Nhân viên tư vấn nhiệt tình, thủ tục không rườm rà nhanh gọn, giá cả hợp lý.',
        },
        {
            img: 'https://www.bonboncar.vn/_next/image?url=%2Favatar%2F9.jpeg&w=32&q=75',
            name: 'Anh Thái',
            location: 'Thủ Đức, Tp.HCM',
            comment: 'Nhân viên tư vấn nhiệt tình, thủ tục không rườm rà nhanh gọn, giá cả hợp lý.',
        },
        {
            img: 'https://www.bonboncar.vn/_next/image?url=%2Favatar%2F8.jpeg&w=32&q=75',
            name: 'Thanh Tùng',
            location: 'Cư dân Park 7, Vinhomes Central Park, Tp.HCM',
            comment: 'thời gian đặt xe linh động và không ràng buộc nhiều vấn đề khi đặt xe.',
        },
        {
            img: 'https://www.bonboncar.vn/_next/image?url=%2Favatar%2F1.jpeg&w=32&q=75',
            name: 'Hải',
            location: 'Cư dân Sala, Q2, Tp.HCM',
            comment: 'Anh thấy, sòng phẳng nữa. Về mặt giao tiếp các em thật tuyệt: nhẹ nhàng, lễ phép, kịp thời…',
        },
        {
            img: 'https://www.bonboncar.vn/_next/image?url=%2Favatar%2F2.jpeg&w=32&q=75',
            name: 'Hưng',
            location: 'Cư dân Sala, Q2, Tp.HCM',
            comment: 'Dịch vụ tốt. Hỗ trợ khách hàng tốt, thời gian đặt xe linh động và không ràng buộc nhiều vấn đề khi đặt xe.',
        },
        {
            img: 'https://www.bonboncar.vn/_next/image?url=%2Favatar%2F3.jpeg&w=32&q=75',
            name: 'Lê Nguyên',
            location: 'Thủ Đức, Tp.HCM',
            comment: 'Dịch vụ tốt. Hỗ trợ khách hàng tốt, thời gian đặt xe linh động và không ràng buộc nhiều vấn đề khi đặt xe.',
        },
    ];

    return (
        <div ref={ref} className="w-full py-20 px-16">
            <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-[32px] font-bold text-[#4e7cb2] flex justify-center"
            >
                Đánh giá khách hàng
            </motion.h2>
            <motion.div 
                className="w-full mt-10"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={3}
                    navigation={{
                        nextEl: '.arrow-next',
                        prevEl: '.arrow-prev',
                    }}
                    pagination={{ clickable: true }}
                    loop={true}
                    className="mySwiper"
                >
                    {reviews.map((review, index) => (
                        <SwiperSlide key={index}>
                            <motion.div 
                                className="p-4 bg-white shadow-xl h-[180px]"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            >
                                <div className="flex mb-2">
                                    <motion.img 
                                        src={review.img} 
                                        alt="" 
                                        className="mr-4 self-center w-[32px] h-[32px] rounded-full"
                                        initial={{ scale: 0 }}
                                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                    />
                                    <div>
                                        <motion.p 
                                            className="text-[12px] lg:text-[13px] text-[#383838]"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                        >
                                            {review.name}
                                        </motion.p>
                                        <motion.p 
                                            className="text-[10px] lg:text-[11px] text-[#646464]"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                                        >
                                            {review.location}
                                        </motion.p>
                                    </div>
                                </div>
                                <motion.div 
                                    className="text-yellow-400 text-[14px] md:mt-0 lg:text-[13px]"
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="fa-solid fa-star"></i>
                                    ))}
                                </motion.div>
                                <motion.p 
                                    className="text-[12px] lg:text-[16px] text-[#383838]"
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                                >
                                    {review.comment}
                                </motion.p>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                    <motion.div 
                        className='pt-12'
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                    >
                        <div className="z-50 arrow-prev absolute left-[43%] -bottom-[1%] text-[26px]">
                            <i className="text-[#4e7cb2] fi fi-rr-angle-circle-left rounded-full"></i>
                        </div>
                        <div className="z-50 arrow-next absolute right-[43%] -bottom-[1%] text-[26px]">
                            <i className="text-[#4e7cb2] fi fi-rr-angle-circle-right"></i>
                        </div>
                    </motion.div>
                </Swiper>
            </motion.div>
        </div>
    );
};

export default Reviews;
