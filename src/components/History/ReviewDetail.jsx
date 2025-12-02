import React from "react";

const ReviewDetail = ({ review, order, onClose }) => {
  if (!review) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-4">
          <div className="text-lg font-bold text-green-700 mb-2">
            Đánh giá đơn #{order?.id}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-yellow-500 text-xl">
              {review.rating} ★
            </span>
            <span className="text-gray-600">
              {review.created_at && (
                <>({new Date(review.created_at).toLocaleString()})</>
              )}
            </span>
          </div>
          {review.suggestions && review.suggestions.length > 0 && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">Gợi ý: </span>
              {review.suggestions.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs mr-2"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
          <div className="mb-2">
            <span className="font-medium text-gray-700">Nhận xét:</span>
            <div className="text-gray-800 mt-1">
              {review.comment || <i>Không có</i>}
            </div>
          </div>
          {review.images && review.images.length > 0 && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">Ảnh đính kèm:</span>
              <div className="flex gap-2 mt-2 flex-wrap">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`review-img-${idx}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {order && (
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="text-sm text-gray-600 mb-1">
              <b>Khách hàng:</b> {order.sender_name}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              <b>Tài xế:</b> {order.drivers_name || "Chưa có"}
            </div>
            <div className="text-sm text-gray-600">
              <b>Ngày tạo đơn:</b> {order.created_at}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetail;
