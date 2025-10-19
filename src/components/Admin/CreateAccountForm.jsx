import React, { useState } from "react";
import { UserPlus, Mail, Phone, Lock, User, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";

const CreateAccountForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  message,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isSuccess = message && message.includes("thành công");

  return (
    <div className="lg:sticky lg:top-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <UserPlus size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Tạo tài khoản mới</h2>
            <p className="text-sm text-gray-500">Thêm nhân viên vào hệ thống</p>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-5 p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${
              isSuccess
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {isSuccess ? (
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle size={20} className="flex-shrink-0 mt-0.5" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Họ và Tên
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Nguyễn Văn A"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="0123456789"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">Tối thiểu 6 ký tự</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 mt-6"
          >
            <UserPlus size={20} />
            Tạo tài khoản
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Tài khoản sẽ được tạo với vai trò <span className="font-semibold text-gray-700">Nhân viên</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountForm