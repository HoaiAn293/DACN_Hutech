import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost/DACS_Hutech/backend/login_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'employee') {
          navigate('/staff');
        } else if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/order');
        }
      } else {
        if (data.message.toLowerCase().includes('mật khẩu')) {
          setErrors({
            email: '',
            password: data.message || 'Mật khẩu không chính xác'
          });
        } else {
          setErrors({
            email: data.message || 'Email không tồn tại',
            password: ''
          });
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors({
        email: '',
        password: `Đã có lỗi xảy ra khi đăng nhập: ${err.message}`
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.password.trim()) newErrors.password = 'Vui lòng nhập mật khẩu';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Email không hợp lệ';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ (phải có 10 chữ số)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost/DACS_Hutech/backend/register_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Lỗi kết nối đến server');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server không trả về dữ liệu JSON hợp lệ');
      }

      const data = await response.json();
      if (data.success) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        localStorage.removeItem('user');
        setFormData({
          username: '',
          email: '',
          phone: '',
          password: '',
          role: 'user'
        });
        setIsLogin(true);
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          email: data.message || 'Đã có lỗi xảy ra khi đăng ký'
        }));
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors(prevErrors => ({
        ...prevErrors,
        email: `Lỗi: ${err.message || 'Đã có lỗi xảy ra khi đăng ký'}`
      }));
    }
};

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      phone: '',
      password: '',
      role: 'user'
    });
    setErrors({
      username: '',
      email: '',
      phone: '',
      password: ''
    });
  };

  return (
    <div className="w-full min-h-screen bg-cover bg-center flex items-center justify-center bg-gradient-to-br from-blue-500/40 to-white-600/40"
         style={{ backgroundImage: "url('/img/login.png')" }}>
      <div className="w-[400px] backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20">
        <style jsx>{`
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-background-clip: text;
            -webkit-text-fill-color: black;
            transition: background-color 5000s ease-in-out 0s;
            box-shadow: inset 0 0 20px 20px rgba(255, 255, 255, 0.2);
          }

        `}</style>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </h2>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          
          {!isLogin && (
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">Họ Tên</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm  rounded-md focus:outline-none focus:ring-2 focus:ring-white-500/50 focus:border-transparent"
                required
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm  rounded-md focus:outline-none focus:ring-2 focus:ring-white-500/50 focus:border-transparent"
              required
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">Số điện thoại</label>
              <div className="flex">
                <div className="flex items-center px-4 bg-white/20 backdrop-blur-sm border border-r-0 border-white/30 rounded-l-md">
                  <img src="/img/vietnam.png" alt="VN flag" className="w-6 h-6" />
                  <span className="text-black mr-1 self-center">+84</span>
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm  rounded-r-md focus:outline-none focus:ring-2 focus:ring-white-500/50 focus:border-transparent  placeholder-white/70"
                  required
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm  rounded-md focus:outline-none focus:ring-2 focus:ring-white-500/50 focus:border-transparent text-black placeholder-white/70"
              required
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-yellow-500 transition duration-300"
          >
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={toggleForm}
            className="text-white hover:text-yellow-300 transition duration-300"
          >
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  
  );
}

export default LoginPage;