import React from "react";

const CreateAccountForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  message,
}) => (
  <div className="lg:sticky lg:top-6">
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-md w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Tạo tài khoản mới</h2>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            message && message.includes("thành công")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ Tên
          </label>
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Tạo tài khoản
        </button>
      </form>
    </div>
  </div>
);

export default CreateAccountForm;
