import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const DeliveryInfo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div 
      ref={ref}
      className="flex flex-col md:flex-row items-start justify-center w-full px-6 py-20 bg-white"
    >
      <motion.div 
        className="max-w-[500px] w-full md:w-1/2"
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src="/img/content.png"
          alt="Delivery Service"
          className="w-full h-full shadow-lg rounded-lg"
        />
        <motion.div 
          className="mt-6 bg-blue-50 p-6 rounded-lg shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-[#1d4e89] mb-3">Cam kết của chúng tôi</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Bảo hiểm hàng hóa lên đến 100%
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Hoàn tiền nếu giao hàng trễ hẹn
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Hỗ trợ khách hàng 24/7
            </li>
          </ul>
        </motion.div>
      </motion.div>
      <motion.div 
        className="max-w-[600px] w-full md:w-1/2 mt-8 md:mt-0 md:pl-10"
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: "400",
          }}
        >
          Trải nghiệm dịch vụ giao hàng hàng đầu của chúng tôi
        </motion.h2>
        <motion.p
          className="text-gray-600 text-lg mb-6 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: "300",
          }}
        >
          Chúng tôi mang đến giải pháp giao hàng nhanh chóng, an toàn và đáng
          tin cậy. Với đội ngũ tài xế chuyên nghiệp và hệ thống theo dõi hiện
          đại, chúng tôi cam kết đồng hành cùng bạn trong mọi hành trình, đảm
          bảo hàng hóa được giao đến đúng nơi, đúng thời gian.
        </motion.p>

        <motion.div 
          className="bg-gray-50 rounded-lg p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold text-[#1d4e89] mb-4">Tại sao khách hàng tin tưởng chúng tôi?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-[#1d4e89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">An toàn tuyệt đối</h4>
                <p className="text-gray-600 text-sm">Mọi đơn hàng đều được bảo hiểm và xử lý cẩn thận</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-[#1d4e89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Tốc độ vượt trội</h4>
                <p className="text-gray-600 text-sm">Tối ưu hóa lộ trình để giao hàng nhanh nhất có thể</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.ul
          className="list-disc list-inside text-gray-600 text-lg mb-6 leading-relaxed"
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: "300",
          }}
        >
          {["Giao hàng siêu tốc trong ngày", 
            "Theo dõi đơn hàng trực tuyến 24/7", 
            "Chi phí hợp lý, cạnh tranh nhất"].map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
};

export default DeliveryInfo;
