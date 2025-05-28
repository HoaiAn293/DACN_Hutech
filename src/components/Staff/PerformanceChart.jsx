import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PerformanceChart = () => {
  const [orderStats, setOrderStats] = useState({
    totalOrders: 90,
    ordersByStatus: {
      'Chờ xác nhận':10,
      'Đang giao': 20,
      'Đã nhận': 30,
      'Hoàn tất': 20,
      'Đã huỷ': 2
    }
  });
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost/DACS_Hutech/backend/admin_stats.php')
      .then(res => res.json())
      .then(data => {
        if (data.orders) {
          setOrderStats({
            totalOrders: data.orders.total,
            ordersByStatus: data.orders.byStatus
          });
        }
        if (data.users) {
          setUserCount(data.users.total);
        }
      })
      .catch(err => console.error('Error fetching statistics:', err));
  }, []);

  const orderChartData = {
    labels: Object.keys(orderStats.ordersByStatus),
    datasets: [
      {
        label: 'Số đơn hàng theo trạng thái',
        data: Object.values(orderStats.ordersByStatus),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Thống kê đơn hàng</h3>
          <Bar
            data={orderChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: `Tổng số đơn hàng: ${orderStats.totalOrders}`
                }
              }
            }}
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Thống kê người dùng</h3>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl font-bold text-blue-600">{userCount}</div>
            <div className="text-gray-600 mt-2">Tổng số tài khoản người dùng</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
  