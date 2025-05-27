import React, { useState, useEffect } from "react";

const TransactionHistory = () => {
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

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

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Lịch sử giao dịch</h2>
        <div className="text-sm text-gray-500">
          Tổng số giao dịch: {history.length}
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {history.length > 0 ? (
            history.map((item) => (
              <li key={item.id} className="transition-all duration-200">
                <div className="p-3 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.type === "deposit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {item.type === "deposit" ? "Nạp tiền" : "Thanh toán"}
                        </span>
                        <span className="text-gray-500 text-xs">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-base font-semibold text-gray-900">
                        {item.amount.toLocaleString()} VNĐ
                      </p>
                    </div>
                    <button
                      onClick={() => toggleDetails(item.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <span>Chi tiết</span>
                      <svg
                        className={`w-3 h-3 transform transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {expandedId === item.id && (
                  <div className="px-3 pb-3 bg-gray-50 border-t border-gray-100">
                    <div className="space-y-2 py-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-gray-500">Mã giao dịch</div>
                        <div className="text-gray-900 font-medium">{item.id}</div>
                        
                        <div className="text-gray-500">Thời gian</div>
                        <div className="text-gray-900">{new Date(item.created_at).toLocaleString()}</div>
                        
                        <div className="text-gray-500">Loại giao dịch</div>
                        <div className="text-gray-900">
                          {item.type === "deposit" ? "Nạp tiền" : "Thanh toán"}
                        </div>
                        
                        <div className="text-gray-500">Số tiền</div>
                        <div className="text-gray-900 font-medium">
                          {item.amount.toLocaleString()} VNĐ
                        </div>
                        
                        <div className="text-gray-500">Trạng thái</div>
                        <div className="text-green-600 font-medium">Thành công</div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : (
            <div className="p-4 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Chưa có giao dịch nào</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TransactionHistory;
