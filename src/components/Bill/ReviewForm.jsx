import React, { useState } from "react";

const SUGGESTIONS = [
  "Tài xế thân thiện",
  "Giao hàng nhanh",
  "Đóng gói cẩn thận",
  "Giá hợp lý",
  "Hỗ trợ tốt",
  "Khác",
];

const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`w-8 h-8 cursor-pointer transition-colors ${
      filled ? "text-yellow-400" : "text-gray-300"
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
  </svg>
);

const ReviewForm = ({ order, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSuggestionChange = (suggestion) => {
    setSuggestions((prev) =>
      prev.includes(suggestion)
        ? prev.filter((s) => s !== suggestion)
        : [...prev, suggestion]
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Hiển thị ảnh xem trước
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload ảnh nếu có
    let uploadedImageUrls = [];
    if (images.length > 0) {
      const formData = new FormData();
      images.forEach((img) => formData.append("images[]", img));
      const res = await fetch(
        "http://localhost/DACN_Hutech/backend/upload_review_images.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      uploadedImageUrls = data.urls || [];
    }

    await onSubmit({
      order_id: order.id,
      user_id: order.user_id,
      driver_id: order.driver_id,
      rating,
      comment,
      suggestions,
      images: uploadedImageUrls,
    });
    setSubmitted(true);
  };

  if (submitted)
    return (
      <div className="text-green-600 text-center font-semibold py-4">
        Cảm ơn bạn đã đánh giá!
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-xl border border-gray-200 shadow space-y-5"
    >
      <div className="text-lg font-semibold mb-2 text-gray-700 text-center">
        Đánh giá tài xế
      </div>
      <div className="flex justify-center mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            filled={hoverRating ? star <= hoverRating : star <= rating}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        {SUGGESTIONS.map((s) => (
          <label
            key={s}
            className={`px-3 py-1 rounded-full border cursor-pointer text-sm ${
              suggestions.includes(s)
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={suggestions.includes(s)}
              onChange={() => handleSuggestionChange(s)}
            />
            {s}
          </label>
        ))}
      </div>
      <textarea
        className="w-full border rounded p-2"
        placeholder="Nhận xét của bạn (không bắt buộc)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Gửi kèm hình ảnh (tối đa 3 ảnh):
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mb-2"
          max={3}
        />
        <div className="flex gap-2">
          {imagePreviews.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="preview"
              className="w-16 h-16 object-cover rounded border"
            />
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
      >
        Gửi đánh giá
      </button>
    </form>
  );
};

export default ReviewForm;
