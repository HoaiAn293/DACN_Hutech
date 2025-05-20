import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderPage from './components/Bill/OrderPage';
import HomePage from './components/Home/HomePage';
import HistoryPage from './components/History/HistoryPage';
import UserPage from './components/ProifleUser/UserPage';
import StaffPage from './components/Staff/StaffPage';
import LoginPage from './components/Login/LoginPage';
import AdminPage from './components/Admin/AdminPage';
import { Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UnauthorizedMessage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Không có quyền truy cập</h1>
      <p className="text-gray-600 mb-4">Bạn không có quyền truy cập đường dẫn này.</p>
      <a href="/order" className="text-blue-500 hover:underline">Quay lại </a>
    </div>
  </div>
);

const ProtectedStaffRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/" />;
  }
  if (user.role !== 'employee' && user.role !== 'admin') {
    return <UnauthorizedMessage />;
  }
  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/" />;
  }
  if (user.role !== 'admin') {
    return <UnauthorizedMessage />;
  }
  return children;
};

function App() {
  return (
    <>
      <Router>
        <div className='w-full'>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/order" element={<OrderPage />}/>
            <Route path="/history" element={<HistoryPage />}/>
            <Route path='/user' element={<UserPage />}/>
            <Route 
              path="/staff" 
              element={
                <ProtectedStaffRoute>
                  <StaffPage />
                </ProtectedStaffRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminPage />
                </ProtectedAdminRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}
export default App
