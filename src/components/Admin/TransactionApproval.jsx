import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Check, X, Clock } from 'lucide-react';

const TransactionApproval = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchTransactions = () => {
        setLoading(true);
        fetch('http://localhost/DACN_Hutech/backend/transaction_approval.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTransactions(data.transactions);
                } else {
                    toast.error(data.message || "Lỗi khi tải giao dịch.");
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                toast.error("Không thể kết nối đến server để tải giao dịch.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleApproval = async (id, action) => {
        setProcessingId(id);
        
        try {
            const res = await fetch('http://localhost/DACN_Hutech/backend/transaction_approval.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action })
            });

            const data = await res.json();
            
            if (data.success) {
                toast.success(data.message);
                // Xóa giao dịch khỏi danh sách sau khi xử lý
                setTransactions(prev => prev.filter(t => t.id !== id));
            } else {
                toast.error(data.message || "Thao tác thất bại.");
            }
        } catch (error) {
            console.error("Transaction error:", error);
            toast.error("Lỗi kết nối server khi xử lý giao dịch.");
        } finally {
            setProcessingId(null);
        }
    };

    const getTransactionType = (type) => {
        return type === 'deposit' 
            ? <span className="text-green-600 font-semibold">Nạp tiền (+)</span> 
            : <span className="text-red-600 font-semibold">Rút tiền (-)</span>;
    };

    const getActionType = (type) => {
        return type === 'deposit' ? 'Nạp' : 'Rút';
    };

    if (loading) return <div className="text-center py-8 text-gray-500">Đang tải danh sách chờ...</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-orange-500" />
                Giao dịch đang chờ duyệt ({transactions.length})
            </h2>
            
            {transactions.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">🎉 Hiện không có giao dịch nào đang chờ duyệt.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map(t => (
                                <tr key={t.id} className="hover:bg-yellow-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="font-semibold">{t.full_name}</div>
                                        <div className="text-xs text-gray-500">{t.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {getTransactionType(t.type)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                        {t.amount.toLocaleString()} VNĐ
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(t.created_at).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => handleApproval(t.id, 'approve')}
                                                disabled={processingId === t.id}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50"
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                {processingId === t.id ? `Đang ${getActionType(t.type)}...` : 'Duyệt'}
                                            </button>
                                            <button
                                                onClick={() => handleApproval(t.id, 'reject')}
                                                disabled={processingId === t.id}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Từ chối
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TransactionApproval;