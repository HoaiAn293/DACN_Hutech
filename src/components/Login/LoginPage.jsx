import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GOOGLE_CLIENT_ID } from '../../config/googleAuth';

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
  const googleButtonRef = useRef(null);

  const handleGoogleSignIn = useCallback(async (response) => {
    try {
      const res = await fetch('http://localhost/DACN_Hutech/backend/google_auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: response.credential
        })
      });

      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(data.message || "Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 3000,
        });

        // Điều hướng theo role
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'employee') {
          navigate('/staff');
        } else if (data.user.role === 'driver') {
          navigate('/driver');
        } else {
          navigate('/order');
        }
      } else {
        toast.error(data.message || "Đăng nhập thất bại!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error('Google login error:', err);
      toast.error("Đã có lỗi xảy ra khi đăng nhập với Google!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [navigate]);

  useEffect(() => {
    // Khởi tạo Google Sign-In khi component mount
    const initGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        // Kiểm tra Client ID đã được cấu hình chưa
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
          console.error('Google Client ID chưa được cấu hình! Vui lòng cập nhật trong src/config/googleAuth.js');
          toast.error('Google Client ID chưa được cấu hình! Vui lòng kiểm tra cấu hình.', {
            position: "top-right",
            autoClose: 5000,
          });
          return;
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            locale: 'vi'
          }
        );
      }
    };

    // Đợi Google script load xong
    if (window.google) {
      initGoogleSignIn();
    } else {
      // Nếu script chưa load, đợi một chút
      const checkGoogle = setInterval(() => {
        if (window.google) {
          initGoogleSignIn();
          clearInterval(checkGoogle);
        }
      }, 100);

      // Timeout sau 5 giây
      setTimeout(() => {
        clearInterval(checkGoogle);
      }, 5000);
    }
  }, [handleGoogleSignIn]);

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
    
    // Kiểm tra email
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      newErrors.email = 'Vui lòng nhập email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    // Kiểm tra mật khẩu
    const passwordTrimmed = formData.password.trim();
    if (!passwordTrimmed) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (passwordTrimmed.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost/DACN_Hutech/backend/login_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // --- LOGIC ĐIỀU HƯỚNG MỚI THEO ROLE ---
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'employee') {
          navigate('/staff');
        } else if (data.user.role === 'driver') { // THÊM ĐIỀU KIỆN DRIVER
          navigate('/driver');
        } else {
          navigate('/order');
        }
        // --- END LOGIC ĐIỀU HƯỚNG MỚI ---
        
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
    
    // Kiểm tra họ tên
    const usernameTrimmed = formData.username.trim();
    if (!usernameTrimmed) {
      newErrors.username = 'Vui lòng nhập họ tên';
    } else if (usernameTrimmed.length < 2) {
      newErrors.username = 'Họ tên phải có ít nhất 2 ký tự';
    } else if (usernameTrimmed.length > 100) {
      newErrors.username = 'Họ tên không được vượt quá 100 ký tự';
    }

    // Kiểm tra email
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      newErrors.email = 'Vui lòng nhập email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        newErrors.email = 'Email không hợp lệ';
      } else if (emailTrimmed.length > 255) {
        newErrors.email = 'Email không được vượt quá 255 ký tự';
      }
    }

    // Kiểm tra số điện thoại
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else {
      // Loại bỏ khoảng trắng và ký tự đặc biệt (giữ lại số và +)
      const phoneCleaned = phoneTrimmed.replace(/[^0-9+]/g, '');
      
      // Kiểm tra số điện thoại Việt Nam
      // Chấp nhận: 0123456789, 0912345678, +84123456789, +84912345678
      let isValid = false;
      
      if (phoneCleaned.startsWith('+84')) {
        // Format +84xxxxxxxxx (10 hoặc 11 chữ số sau +84)
        const after84 = phoneCleaned.substring(3);
        isValid = /^[0-9]{9,10}$/.test(after84);
      } else if (phoneCleaned.startsWith('0')) {
        // Format 0xxxxxxxxx (10 hoặc 11 chữ số)
        isValid = /^0[0-9]{9,10}$/.test(phoneCleaned);
      } else if (/^[0-9]{9,10}$/.test(phoneCleaned)) {
        // Chỉ có số, không có 0 đầu (sẽ tự động thêm 0)
        isValid = true;
      }
      
      if (!isValid) {
        newErrors.phone = 'Số điện thoại không hợp lệ (phải là số điện thoại Việt Nam, ví dụ: 0123456789 hoặc +84123456789)';
      }
    }

    // Kiểm tra mật khẩu
    const passwordTrimmed = formData.password.trim();
    if (!passwordTrimmed) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (passwordTrimmed.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (passwordTrimmed.length > 100) {
      newErrors.password = 'Mật khẩu không được vượt quá 100 ký tự';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Chuẩn hóa số điện thoại
      let phoneNormalized = formData.phone.trim().replace(/[^0-9+]/g, '');
      
      // Xử lý các trường hợp:
      if (phoneNormalized.startsWith('+84')) {
        // Format +84xxxxxxxxx -> 0xxxxxxxxx
        phoneNormalized = '0' + phoneNormalized.substring(3);
      } else if (!phoneNormalized.startsWith('0') && /^[0-9]{9,10}$/.test(phoneNormalized)) {
        // Chỉ có số, không có 0 đầu -> thêm 0
        phoneNormalized = '0' + phoneNormalized;
      }
      
      // Đảm bảo định dạng cuối cùng là 0xxxxxxxxx (10 hoặc 11 chữ số)
      if (!/^0[0-9]{9,10}$/.test(phoneNormalized)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          phone: 'Số điện thoại không hợp lệ'
        }));
        return;
      }

      const response = await fetch('http://localhost/DACN_Hutech/backend/register_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          phone: phoneNormalized,
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
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "bg-green-50 text-green-700",
          bodyClassName: "flex items-center gap-2",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ),
        });

        localStorage.removeItem("user");
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
          role: "user",
        });
        setIsLogin(true);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: data.message || "Đã có lỗi xảy ra khi đăng ký",
        }));
      }
    }catch (err) {
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
  <div className="w-full min-h-screen bg-cover bg-center flex items-center justify-center bg-gradient-to-br from-blue-500/40 to-white-600/40" style={{ backgroundImage: "url('/img/login.png')" }}>
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

        <form onSubmit={isLogin ? handleLogin : handleRegister} noValidate>
          
          {!isLogin && (
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">Họ Tên</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm  rounded-md focus:outline-none focus:border-transparent"
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm  rounded-md focus:outline-none focus:border-transparent"
              autoComplete="email"
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
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm  rounded-r-md focus:outline-none focus:border-transparent  placeholder-white/70"
                  autoComplete="tel"
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
              className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm  rounded-md focus:outline-none focus:border-transparent text-black placeholder-white/70"
              autoComplete={isLogin ? "current-password" : "new-password"}
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

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/70">Hoặc</span>
            </div>
          </div>
          
          <div className="mt-4" ref={googleButtonRef}></div>
        </div>

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