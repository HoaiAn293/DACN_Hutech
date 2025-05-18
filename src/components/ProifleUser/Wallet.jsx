import React, { useState, useEffect } from "react";

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('bank'); 
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bank: 'VCB',
    accountNumber: '1234567890',
    accountName: 'CONG TY VAN TAI'
  });

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
  }, [user]); 

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

  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ!');
      return;
    }

    const formattedAmount = parseInt(amount).toLocaleString();
    let message = `Vui lòng chuyển khoản ${formattedAmount} VNĐ với nội dung: NAP ${user.id}\n\n`;
    
    if (paymentMethod === 'bank') {
      message += `Thông tin chuyển khoản:\nNgân hàng: ${bankInfo.bank}\nSố tài khoản: ${bankInfo.accountNumber}\nTên tài khoản: ${bankInfo.accountName}`;
    } else if (paymentMethod === 'momo') {
      message += `Số MoMo: ${bankInfo.accountNumber}\nTên tài khoản: ${bankInfo.accountName}`;
    }

    alert(message);
    setAmount("");
  };

  // Add this function to handle bank info updates
  const handleBankInfoUpdate = () => {
    setIsEditingBank(false);
    // Here you could also add an API call to save the bank info
  };

  // In the return statement, update the bank info display section:
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

        {/* Thêm lựa chọn phương thức thanh toán */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setPaymentMethod('bank')}
            className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
              paymentMethod === 'bank'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            Ngân hàng
          </button>
          <button
            onClick={() => setPaymentMethod('momo')}
            className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
              paymentMethod === 'momo'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 7h-2v2h2V7z" />
              <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            MoMo
          </button>
        </div>

        {/* Hiển thị thông tin thanh toán */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Thông tin thanh toán:</h3>
            {paymentMethod === 'bank' && (
              <button
                onClick={() => setIsEditingBank(!isEditingBank)}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                {isEditingBank ? 'Hủy' : 'Chỉnh sửa'}
              </button>
            )}
          </div>
          {paymentMethod === 'bank' ? (
            <div className="space-y-1">
              {isEditingBank ? (
                <>
                  <input
                    type="text"
                    value={bankInfo.bank}
                    onChange={(e) => setBankInfo({...bankInfo, bank: e.target.value})}
                    placeholder="Tên ngân hàng"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    value={bankInfo.accountNumber}
                    onChange={(e) => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                    placeholder="Số tài khoản"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="text"
                    value={bankInfo.accountName}
                    onChange={(e) => setBankInfo({...bankInfo, accountName: e.target.value})}
                    placeholder="Tên tài khoản"
                    className="w-full p-2 border rounded mb-2"
                  />
                  <button
                    onClick={handleBankInfoUpdate}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Lưu thay đổi
                  </button>
                </>
              ) : (
                <>
                  <p>Ngân hàng: {bankInfo.bank}</p>
                  <p>Số tài khoản: {bankInfo.accountNumber}</p>
                  <p>Tên tài khoản: {bankInfo.accountName}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Nội dung chuyển khoản: NAP {user?.id}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <p>Số MoMo: {bankInfo.accountNumber}</p>
              <p>Tên tài khoản: {bankInfo.accountName}</p>
              <p className="text-sm text-gray-500 mt-2">
                Nội dung chuyển khoản: NAP {user?.id}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleDeposit}
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
