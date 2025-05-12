import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Reviews = () => {
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
        <div className="w-full py-10 px-10">
            <h2 className="text-[32px] font-bold text-[#4e7cb2] flex justify-center">Đánh giá khách hàng</h2>
            <div className="w-full mt-10">
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
                            <div className="p-4 bg-white shadow-xl h-[180px]">
                                <div className=" flex mb-2">
                                    <img src={review.img} alt="" className="mr-4 self-center w-[32px] h-[32px] rounded-full" />
                                    <div>
                                        <p className="text-[12px] lg:text-[13px] text-[#383838]">{review.name}</p>
                                        <p className="text-[10px] lg:text-[11px] text-[#646464]">{review.location}</p>
                                    </div>
                                </div>
                                <div className="text-yellow-400 text-[14px] md:mt-0 lg:text-[13px]">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="fa-solid fa-star"></i>
                                    ))}
                                </div>
                                <p className="text-[12px] lg:text-[16px] text-[#383838]">{review.comment}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                    <div className='pt-12'>
                        <div className="z-50 arrow-prev absolute left-[43%] -bottom-[1%] text-[26px]">
                            <i className="text-[#4e7cb2] fi fi-rr-angle-circle-left rounded-full"></i>
                        </div>
                        <div className="z-50 arrow-next absolute right-[43%] -bottom-[1%] text-[26px]">
                            <i className="text-[#4e7cb2] fi fi-rr-angle-circle-right"></i>
                        </div>
                    </div>
                </Swiper>
            </div>
        </div>
    );
};

export default Reviews;
