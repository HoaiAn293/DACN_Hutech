import React, { useState, useEffect } from "react";

const TransactionHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    fetch(`http://localhost/DACS_Hutech/backend/get_transaction_history.php?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHistory(data.transactions);
        }
      })
      .catch(err => console.error('Lỗi khi lấy lịch sử giao dịch:', err));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Lịch sử giao dịch</h2>
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {history.length > 0 ? (
            history.map((item) => (
              <li key={item.id} className="py-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === "deposit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {item.type === "deposit" ? "Nạp" : "Rút"}
                      </span>
                      <span className="text-gray-500 text-sm">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {item.amount.toLocaleString()} VNĐ
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Chưa có giao dịch nào</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TransactionHistory;
