import React, { useState, useEffect } from "react";
import ProductType from "./ProductType";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import component gợi ý địa chỉ
import AddressAutocomplete from './AddressAutocomplete';

const DeliveryInfo = ({
  selectedVehicle,
  pickupAddress,
  setPickupAddress, // PROP MỚI: Để cập nhật text địa chỉ lấy
  deliveryAddress,
  setDeliveryAddress, // PROP MỚI: Để cập nhật text địa chỉ giao
  onPickupLocationChange, // PROP MỚI: Để cập nhật tọa độ lên Map (nếu có)
  onDeliveryLocationChange, // PROP MỚI: Để cập nhật tọa độ lên Map (nếu có)
  distance,
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [_invoiceInfo, setInvoiceInfo] = useState(null);

  const [userId, setUserId] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setUserId(user.id);
    }
  }, []);

  // HIỆU ỨNG: GỌI API LẤY SỐ DƯ KHI userId THAY ĐỔI
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost/DACN_Hutech/backend/get_balance.php?user_id=${userId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setCurrentBalance(data.balance);
            }
        })
        .catch(err => console.error('Lỗi khi lấy số dư:', err));
  }, [userId]); 
  
  const [pickupDetail, setPickupDetail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");

  const [deliveryDetail, setDeliveryDetail] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [goodsValue, setGoodsValue] = useState("");
  const [valueError, setValueError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [errors, setErrors] = useState({
    pickupAddress: false,
    senderName: false,
    senderPhone: false,
    deliveryAddress: false,
    receiverName: false,
    receiverPhone: false,
    selectedType: false,
    goodsValue: false,
  });

  const isValidPhone = (phone) => {
    const phoneRegex = /^0\d{9}$/; 
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {
      pickupAddress: !pickupAddress?.trim(),
      senderName: !senderName.trim(),
      senderPhone: !senderName.trim() || !isValidPhone(senderPhone),
      deliveryAddress: !deliveryAddress?.trim(),
      receiverName: !receiverName.trim(),
      receiverPhone: !receiverName.trim() || !isValidPhone(receiverPhone),
      selectedType: !selectedType,
      goodsValue: !goodsValue || parseInt(goodsValue) > 30000000,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // --- HÀM XỬ LÝ KHI CHỌN ĐỊA CHỈ TỪ AUTOCOMPLETE ---
  const handlePickupSelect = (address, coordinates) => {
    if (setPickupAddress) setPickupAddress(address);
    // Nếu cha có truyền hàm xử lý tọa độ (để update Map) thì gọi
    if (onPickupLocationChange && coordinates) {
      onPickupLocationChange({ lat: parseFloat(coordinates.lat), lng: parseFloat(coordinates.lon) });
    }
  };

  const handleDeliverySelect = (address, coordinates) => {
    if (setDeliveryAddress) setDeliveryAddress(address);
    // Nếu cha có truyền hàm xử lý tọa độ (để update Map) thì gọi
    if (onDeliveryLocationChange && coordinates) {
      onDeliveryLocationChange({ lat: parseFloat(coordinates.lat), lng: parseFloat(coordinates.lon) });
    }
  };
  // ----------------------------------------------------

  const handleSubmit = async () => {
    const isBalanceInsufficient = paymentMethod === 'balance' && shippingFee > currentBalance;
    
    if (!selectedVehicle) {
      toast.error("Vui lòng chọn loại xe trước khi xác nhận!", {
        position: "top-right",
        autoClose: 3000,
        className: "bg-red-50 text-red-700",
      });
      return;
    }
    
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!", {
        position: "top-right",
        autoClose: 3000,
        className: "bg-red-50 text-red-700",
      });
      return;
    }
    
    if (isBalanceInsufficient) {
      toast.error(
        "Số dư ví không đủ. Vui lòng chọn COD hoặc nạp thêm tiền.",
        { position: "top-right", autoClose: 5000, className: "bg-red-50 text-red-700" }
      );
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmOrder = async () => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để đặt đơn hàng!", {
        position: "top-right",
        autoClose: 3000,
        className: "bg-red-50 text-red-700",
      });
      return;
    }

    if (paymentMethod === "balance") {
      try {
        const deductResponse = await fetch(
          "http://localhost/DACN_Hutech/backend/instant_withdraw.php", 
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              amount: shippingFee,
            }),
          }
        );

        const deductResult = await deductResponse.json();
        if (!deductResult.success) {
          toast.error(deductResult.message || "Thanh toán ví thất bại.");
          setShowConfirmModal(false);
          return;
        }
        
        const balanceResponse = await fetch(`http://localhost/DACN_Hutech/backend/get_balance.php?user_id=${userId}`);
        const balanceData = await balanceResponse.json();
        if (balanceData.success) {
            setCurrentBalance(balanceData.balance);
        }

      } catch {
        toast.error("Lỗi kết nối API thanh toán ví.");
        return;
      }
    }

    const payload = {
      user_id: userId,
      vehicle: selectedVehicle,
      pickup: {
        address: pickupAddress, 
        addressDetail: pickupDetail,
        senderName,
        senderPhone,
      },
      delivery: {
        address: deliveryAddress, 
        addressDetail: deliveryDetail,
        receiverName,
        receiverPhone,
        goodsType: selectedType,
        goodsValue: parseInt(goodsValue),
      },
      paymentMethod: paymentMethod,
      shippingFee: shippingFee,
      isPaid: paymentMethod === "balance",
    };

    try {
      const response = await fetch(
        "http://localhost/DACN_Hutech/backend/order_handler.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      setShowConfirmModal(false);
      if (result.success && result.order_id) {
        const invoicePayload = {
          order_id: result.order_id,
          user_id: userId,
          amount: shippingFee,
          payment_method: paymentMethod,
        };
        const invoiceRes = await fetch(
          "http://localhost/DACN_Hutech/backend/invoice_handler.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoicePayload),
          }
        );
        const invoiceData = await invoiceRes.json();
        setInvoiceInfo(invoiceData); 

        toast.success(
          paymentMethod === "cod"
            ? "Đặt đơn thành công!"
            : "Đặt đơn và thanh toán thành công!",
          {
            position: "top-right",
            autoClose: 3000,
            className: "bg-green-50 text-green-700",
          }
        );
      } else {
        toast.error(result.message || "Có lỗi xảy ra khi đặt đơn.");
      }
    } catch {
      toast.error("Không thể gửi đơn hàng.");
    }
  };

  const handleGoodsValueChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
      setGoodsValue('');
      setValueError('');
      return;
    }
    const numericValue = parseInt(value);
    if (numericValue > 30000000) {
      setValueError('Tối đa 30.000.000 VNĐ');
    } else {
      setValueError('');
    }
    setGoodsValue(numericValue);
  };

  useEffect(() => {
    const calculateShippingFee = () => {
      if (selectedVehicle && distance) {
        const pricePerKm =
          selectedVehicle === "Xe Máy" ? 5000
            : selectedVehicle === "Xe Van" ? 10000
            : selectedVehicle === "Xe Bán Tải" ? 15000
            : selectedVehicle === "Xe Tải" ? 20000
            : 5000;
        const baseFee = Math.round(distance * pricePerKm);
        const maxFee = 300000;
        setShippingFee(Math.min(baseFee, maxFee));
      }
    };

    calculateShippingFee();
  }, [selectedVehicle, distance]);
  
  const isBalanceInsufficient = shippingFee > currentBalance;
  
  return (
    <div className="w-full mt-10 pr-6">
      <h2 className="font-medium text-[20px] mb-6 text-[#4e7cb2]">
        Lộ trình giao hàng
      </h2>

      {/* Địa điểm lấy hàng */}
      <div className="mb-8 bg-white py-6 rounded-2xl px-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4e7cb2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="font-semibold text-[16px] text-[#4e7cb2]">
            Địa điểm lấy hàng
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            {/* THAY THẾ INPUT CŨ BẰNG AUTOCOMPLETE */}
            <AddressAutocomplete 
              label=""
              placeholder="Nhập địa chỉ lấy hàng..."
              value={pickupAddress} 
              onChange={handlePickupSelect} 
            />
            {errors.pickupAddress && (
              <p className="text-red-500 text-sm mt-1">Vui lòng nhập hoặc chọn địa chỉ</p>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Chi tiết địa chỉ (không bắt buộc)"
              value={pickupDetail}
              onChange={(e) => setPickupDetail(e.target.value)}
              className="rounded-lg p-3 w-full bg-gray-50 border border-gray-300 focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none transition-all text-gray-600"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Tên người gửi"
              value={senderName}
              onChange={(e) => {
                setSenderName(e.target.value);
                setErrors((prev) => ({ ...prev, senderName: false }));
              }}
              className={`rounded-lg p-3 w-full bg-gray-50 border ${
                errors.senderName ? "border-red-500" : "border-gray-300"
              } focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none transition-all`}
              required
            />
            {errors.senderName && (
              <p className="text-red-500 text-sm mt-1">
                Vui lòng nhập tên người gửi
              </p>
            )}
          </div>
          <div>
            <div className={`flex rounded-lg overflow-hidden border ${
                errors.senderPhone ? "border-red-500" : "border-gray-300"
              } focus-within:ring-2 focus-within:ring-[#4e7cb2] focus-within:border-[#4e7cb2] transition-all`}>
              <div className="flex items-center px-3 bg-gray-200 text-gray-700 font-medium border-r border-gray-300">
                +84
              </div>
              <input
                type="text"
                placeholder="Số điện thoại"
                value={senderPhone}
                onChange={(e) => {
                  setSenderPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, senderPhone: false }));
                }}
                className="flex-1 p-3 bg-gray-50 focus:outline-none"
                required
              />
            </div>
            {errors.senderPhone && (
              <p className="text-red-500 text-sm mt-1">
                Số điện thoại không hợp lệ
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Địa điểm giao hàng */}
      <div className="mb-8 bg-white py-6 rounded-2xl px-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4e7cb2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="font-semibold text-[16px] text-[#4e7cb2]">
            Bạn muốn giao hàng đến
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 relative">
          <div>
            {/* THAY THẾ INPUT CŨ BẰNG AUTOCOMPLETE */}
             <AddressAutocomplete 
              label=""
              placeholder="Nhập địa chỉ giao hàng..."
              value={deliveryAddress} 
              onChange={handleDeliverySelect} 
            />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-sm mt-1">Vui lòng nhập hoặc chọn địa chỉ</p>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Chi tiết địa chỉ (không bắt buộc)"
              value={deliveryDetail}
              onChange={(e) => setDeliveryDetail(e.target.value)}
              className="rounded-lg p-3 w-full bg-gray-50 border border-gray-300 focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none transition-all text-gray-600"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Tên người nhận"
              value={receiverName}
              onChange={(e) => {
                setReceiverName(e.target.value);
                setErrors((prev) => ({ ...prev, receiverName: false }));
              }}
              className="rounded-lg p-3 w-full bg-gray-50 border border-gray-300 focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none transition-all"
            />
            {errors.receiverName && (
              <p className="text-red-500 text-sm mt-1">
                Vui lòng nhập tên người nhận
              </p>
            )}
          </div>
          <div>
            <div className={`flex rounded-lg overflow-hidden border ${
                errors.receiverPhone ? "border-red-500" : "border-gray-300"
              } focus-within:ring-2 focus-within:ring-[#4e7cb2] focus-within:border-[#4e7cb2] transition-all`}>
              <div className="flex items-center px-3 bg-gray-200 text-gray-700 font-medium border-r border-gray-300">
                +84
              </div>
              <input
                type="text"
                placeholder="Số điện thoại"
                value={receiverPhone}
                onChange={(e) => {
                  setReceiverPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, receiverPhone: false }));
                }}
                className="flex-1 p-3 bg-gray-50 focus:outline-none"
              />
            </div>
            {errors.receiverPhone && (
              <p className="text-red-500 text-sm mt-1">
                Số điện thoại không hợp lệ
              </p>
            )}
          </div>
          
          <ProductType value={selectedType} onChange={setSelectedType} />

          <div className="relative">
            <div>
              <input
                  type="text"
                  placeholder="Nhập giá trị hàng"
                  value={goodsValue === '' ? '' : goodsValue.toLocaleString()}
                  onChange={handleGoodsValueChange}
                  className="rounded-lg p-3 w-full bg-gray-50 border border-gray-300 focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none transition-all"
                />
              {errors.goodsValue && (
                <p className="text-red-500 text-sm mt-1">
                  Vui lòng nhập giá trị hàng
                </p>
              )}
            </div>
            {valueError && (
              <div className="absolute -bottom-6 right-0 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-md text-sm flex items-center gap-2 shadow-sm ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Tối đa 30.000.000 VNĐ</span>
              </div>
            )}
            <p className="text-gray-500 text-xs mt-1">Giá trị hàng hóa tối đa được bảo hiểm là 30.000.000 VNĐ</p>
          </div>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mb-8 bg-white py-6 rounded-2xl px-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4e7cb2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="font-semibold text-[16px] text-[#4e7cb2]">
            Phương thức thanh toán
          </p>
        </div>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-5 w-5 text-[#4e7cb2]"
            />
            <span className="text-gray-700">
              Thanh toán khi nhận hàng (COD)
            </span>
          </label>
          
          <label 
            className={`flex items-center space-x-3 ${isBalanceInsufficient ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="balance"
              checked={paymentMethod === "balance"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={isBalanceInsufficient && paymentMethod !== "cod"}
              className="form-radio h-5 w-5 text-[#4e7cb2]"
            />
            <div className="flex flex-col">
              <span className={`font-medium ${isBalanceInsufficient ? 'text-red-500' : 'text-gray-700'}`}>
                Thanh toán bằng số dư ví ({currentBalance.toLocaleString()} VNĐ)
              </span>
              {isBalanceInsufficient && (
                <span className="text-xs text-red-500 font-semibold mt-1">
                  Số dư không đủ để thanh toán ({shippingFee.toLocaleString()} VNĐ)
                </span>
              )}
            </div>
          </label>
        </div>
      </div>
      <button
        className="bg-[#4e7cb2] hover:bg-[#3b5f8a] text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
        onClick={handleSubmit}
      >
        Xác nhận
      </button>

      {/* Modal xác nhận thông tin */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="bg-[#4e7cb2] px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">
                    Hóa đơn vận chuyển
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-white/80 text-sm mt-2">
                Mã đơn: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Thông tin vận chuyển */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4e7cb2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-gray-800">
                      Chi tiết vận chuyển
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {selectedVehicle}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-600 font-medium">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Điểm lấy hàng
                        </p>
                        <p className="text-gray-600">{pickupAddress}</p>
                        {pickupDetail && (
                          <p className="text-sm text-gray-500">
                            {pickupDetail}
                          </p>
                        )}
                        <div className="mt-2 text-sm">
                          <p className="font-medium text-gray-700">
                            {senderName}
                          </p>
                          <p className="text-gray-600">{senderPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-10 border-l-2 border-dashed border-gray-300 ml-4"></div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-green-600 font-medium">B</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Điểm giao hàng
                        </p>
                        <p className="text-gray-600">{deliveryAddress}</p>
                        {deliveryDetail && (
                          <p className="text-sm text-gray-500">
                            {deliveryDetail}
                          </p>
                        )}
                        <div className="mt-2 text-sm">
                          <p className="font-medium text-gray-700">
                            {receiverName}
                          </p>
                          <p className="text-gray-600">{receiverPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin hàng hóa */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4e7cb2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10l8 4" />
                    </svg>
                    <span className="font-medium text-gray-800">
                      Thông tin hàng hóa
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Loại hàng</span>
                    <span className="font-medium text-gray-800">
                      {selectedType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giá trị hàng</span>
                    <span className="font-medium text-gray-800">
                      {goodsValue === '' ? '0' : goodsValue.toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>
              </div>

              {/* Chi phí & Thanh toán */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium text-gray-800">
                      Chi phí & Thanh toán
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <div className="text-right">
                      <span className="font-medium text-gray-800">
                        {shippingFee.toLocaleString()} VNĐ
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        (Tính theo: {distance.toFixed(2)} km)
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600">
                      Phương thức thanh toán
                    </span>
                    <span className="font-medium text-gray-800">
                      {paymentMethod === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : "Thanh toán qua ví"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Tổng thanh toán</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#4e7cb2]">
                    {shippingFee.toLocaleString()} VNĐ
                  </span>
                  <p className="text-sm text-gray-500">Đã bao gồm VAT</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={confirmOrder}
                  className="flex-1 bg-[#4e7cb2] text-white py-3 rounded-lg hover:bg-[#3d6291] transition-colors font-medium"
                >
                  Xác nhận đơn hàng
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryInfo;