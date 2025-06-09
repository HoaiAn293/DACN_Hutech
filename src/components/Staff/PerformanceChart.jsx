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
    totalOrders: 0,
    ordersByStatus: {
      'Chờ xác nhận': 0,
      'Đang giao': 0,
      'Đã nhận': 0,
      'Hoàn tất': 0,
      'Đã huỷ': 0
    }
  });
  const [userStats, setUserStats] = useState({
    users: 0,
    drivers: 0
  });

  useEffect(() => {
    // Fetch orders data
    fetch('http://localhost/DACS_Hutech/backend/get_all_orders.php')
      .then(res => res.json())
      .then(orders => {
        if (Array.isArray(orders)) {
          const statusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {
            'Chờ xác nhận': 0,
            'Đang giao': 0,
            'Đã nhận': 0,
            'Hoàn tất': 0,
            'Đã huỷ': 0
          });

          setOrderStats({
            totalOrders: orders.length,
            ordersByStatus: statusCounts
          });
        }
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setOrderStats({
          totalOrders: 0,
          ordersByStatus: {
            'Chờ xác nhận': 0,
            'Đang giao': 0,
            'Đã nhận': 0,
            'Hoàn tất': 0,
            'Đã huỷ': 0
          }
        });
      });

    // Fetch users data
    Promise.all([
      fetch('http://localhost/DACS_Hutech/backend/get_user.php').then(res => res.json()),
      fetch('http://localhost/DACS_Hutech/backend/get_drivers.php').then(res => res.json())
    ])
      .then(([users, drivers]) => {
        // Lọc user có role là "user"
        const normalUsers = Array.isArray(users)
          ? users.filter(u => u.role === "user").length
          : 0;
        setUserStats({
          users: normalUsers,
          drivers: Array.isArray(drivers) ? drivers.length : 0
        });
      })
      .catch(err => {
        console.error('Error fetching user stats:', err);
        setUserStats({ users: 0, drivers: 0 });
      });
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

  const userChartData = {
    labels: ['Người dùng', 'Tài xế'],
    datasets: [
      {
        data: [userStats.users, userStats.drivers],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
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
          <h3 className="text-lg font-semibold">Thống kê người dùng và tài xế</h3>
          <div className="flex flex-col items-center justify-center h-full">
            <Pie
              data={userChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
  