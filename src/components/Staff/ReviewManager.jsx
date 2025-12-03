import React, { useEffect, useState } from "react";
import ReviewDetail from "../History/ReviewDetail";

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy tất cả đánh giá và đơn hàng liên quan
    fetch("http://localhost/DACN_Hutech/backend/get_all_reviews.php")
      .then((res) => res.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600">Đang tải đánh giá...</div>
    );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Quản lý đánh giá
      </h2>
      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Chưa có đánh giá nào
          </h3>
          <p className="text-gray-500">
            Không tìm thấy đánh giá nào trong hệ thống.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(({ review, order, user, driver }) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-semibold text-[#276749] mb-1">
                  Đơn #{order.id} - {order.goods_type}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Người gửi: {order.sender_name} | Người nhận:{" "}
                  {order.receiver_name}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Tài xế: {driver?.full_name || "Chưa có"}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-semibold text-yellow-500 text-lg">
                    {review.rating} ★
                  </span>
                  <span className="text-gray-700">
                    {review.comment?.slice(0, 40) || "Không có nhận xét"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => {
                    setSelectedReview(review);
                    setSelectedOrder({
                      ...order,
                      driver_name: driver?.full_name,
                    });
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedReview && (
        <ReviewDetail
          review={selectedReview}
          order={selectedOrder}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
};

export default ReviewManager;
