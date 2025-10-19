import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from "../../hook/UseQuery";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', phone: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.password.trim()) newErrors.password = 'Vui lòng nhập mật khẩu';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email.trim())) newErrors.email = 'Email không hợp lệ';

    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.trim())) newErrors.phone = 'Số điện thoại không hợp lệ (10 chữ số)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      const data = await loginMutation.mutateAsync({ email: formData.email, password: formData.password });

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        // toast thành công từ backend
        toast.success(data.message || 'Đăng nhập thành công!');

        if (data.user.role === 'employee') navigate('/staff');
        else if (data.user.role === 'admin') navigate('/admin');
        else navigate('/order');
      } else {
        const newErrors = {};
        if (data.message.toLowerCase().includes('email')) newErrors.email = data.message;
        if (data.message.toLowerCase().includes('mật khẩu') || data.message.toLowerCase().includes('password')) newErrors.password = data.message;
        setErrors(newErrors);

        // toast lỗi backend
        toast.error(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      toast.error(`Lỗi khi đăng nhập: ${err.message}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    try {
      const data = await registerMutation.mutateAsync({
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password.trim()
      });

      if (data.success) {
        toast.success(data.message || 'Đăng ký thành công! Vui lòng đăng nhập.');
        setFormData({ username:'', email:'', phone:'', password:'', role:'user' });
        setIsLogin(true);
      } else {
        const newErrors = {};
        if (data.message.toLowerCase().includes('email')) newErrors.email = data.message;
        if (data.message.toLowerCase().includes('password') || data.message.toLowerCase().includes('mật khẩu')) newErrors.password = data.message;
        if (data.message.toLowerCase().includes('username')) newErrors.username = data.message;
        if (data.message.toLowerCase().includes('phone') || data.message.toLowerCase().includes('số điện thoại')) newErrors.phone = data.message;
        setErrors(newErrors);

        toast.error(data.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      toast.error(`Lỗi khi đăng ký: ${err.message}`);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ username:'', email:'', phone:'', password:'', role:'user' });
    setErrors({});
  };

  return (
    <div className="w-full min-h-screen bg-cover flex items-center justify-center bg-gradient-to-br from-blue-500/40 to-white-600/40" style={{ backgroundImage: "url('/img/login.png')" }}>
      <div className="w-[400px] backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-8">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">Họ Tên</label>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange}
                     className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none" />
              {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                   className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none" />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">Số điện thoại</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                     className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none" />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">Mật khẩu</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                   className="w-full px-3 py-2 bg-white/20 rounded-md focus:outline-none" />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <button type="submit" className="w-full bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-yellow-500 transition duration-300">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={toggleForm} className="text-white hover:text-yellow-300 transition duration-300">
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
