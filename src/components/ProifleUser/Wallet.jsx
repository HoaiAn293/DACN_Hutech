import React, { useState, useEffect } from "react";

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost/DACS_Hutech/backend/get_balance.php?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBalance(data.balance);
        }
      })
      .catch(err => console.error('Lỗi khi lấy số dư:', err));
  }, []);

  const handleTransaction = async (action) => {
    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ!');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn ${action === 'deposit' ? 'nạp' : 'rút'} ${parseInt(amount).toLocaleString()} VNĐ không?`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost/DACS_Hutech/backend/wallet_handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          amount: parseInt(amount),
          action: action
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`${action === 'deposit' ? 'Nạp' : 'Rút'} tiền thành công!`);
        setAmount("");

        // Cập nhật lại số dư
        fetch(`http://localhost/DACS_Hutech/backend/get_balance.php?user_id=${user.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setBalance(data.balance);
            }
          });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Đã có lỗi xảy ra');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Nạp / Rút tiền</h2>

      <div className="text-lg font-bold text-green-600">
        Số dư hiện tại: {balance.toLocaleString()} VNĐ
      </div>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Nhập số tiền"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleTransaction('deposit')} 
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
          >
            Nạp tiền
          </button>
          <button 
            onClick={() => handleTransaction('withdraw')} 
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            Rút tiền
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
