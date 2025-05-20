import React, { useState, useEffect } from "react";
import ProductType from "./ProductType";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DeliveryInfo = ({
  selectedVehicle,
  pickupAddress,
  deliveryAddress,
  distance,
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [invoiceInfo, setInvoiceInfo] = useState(null);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setUserId(user.id);
    }
  }, []);

  // Pickup Info
  const [pickupAddressState, setPickupAddressState] = useState(
    pickupAddress || ""
  );
  const [pickupDetail, setPickupDetail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");

  // Delivery Info
  const [deliveryAddressState, setDeliveryAddressState] = useState(
    deliveryAddress || ""
  );
  const [deliveryDetail, setDeliveryDetail] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [goodsValue, setGoodsValue] = useState("");
  const [valueError, setValueError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (pickupAddress) {
      setPickupAddressState(pickupAddress);
    }
  }, [pickupAddress]);

  useEffect(() => {
    if (deliveryAddress) {
      setDeliveryAddressState(deliveryAddress);
    }
  }, [deliveryAddress]);

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
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {
      pickupAddress: !pickupAddressState.trim(),
      senderName: !senderName.trim(),
      senderPhone: !senderPhone.trim() || !isValidPhone(senderPhone),
      deliveryAddress: !deliveryAddressState.trim(),
      receiverName: !receiverName.trim(),
      receiverPhone: !receiverPhone.trim() || !isValidPhone(receiverPhone),
      selectedType: !selectedType,
      goodsValue: !goodsValue,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async () => {
    if (!selectedVehicle) {
      toast.error("Vui lòng chọn loại xe trước khi xác nhận!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-red-50 text-red-700",
        bodyClassName: "flex items-center gap-2",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        ),
      });
      return;
    }
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-red-50 text-red-700",
        bodyClassName: "flex items-center gap-2",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        ),
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmOrder = async () => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để đặt đơn hàng!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-red-50 text-red-700",
        bodyClassName: "flex items-center gap-2",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        ),
      });
      return;
    }

    if (paymentMethod === "balance") {
      try {
        // Kiểm tra số dư tài khoản
        const balanceResponse = await fetch(
          `http://localhost/DACS_Hutech/backend/get_balance.php?user_id=${userId}`
        );
        const balanceData = await balanceResponse.json();

        if (!balanceData.success) {
          toast.error(
            "Không thể kiểm tra số dư tài khoản. Vui lòng thử lại sau.",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              className: "bg-red-50 text-red-700",
              bodyClassName: "flex items-center gap-2",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ),
            }
          );
          return;
        }

        if (balanceData.balance < shippingFee) {
          toast.error(
            "Số dư tài khoản không đủ để thanh toán. Vui lòng nạp thêm tiền hoặc chọn phương thức thanh toán khác.",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              className: "bg-red-50 text-red-700",
              bodyClassName: "flex items-center gap-2",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ),
            }
          );
          return;
        }

        // Trừ tiền từ ví
        const deductResponse = await fetch(
          "http://localhost/DACS_Hutech/backend/wallet_handler.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              amount: shippingFee,
              action: "withdraw",
            }),
          }
        );

        const deductResult = await deductResponse.json();
        if (!deductResult.success) {
          alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại sau.");
          return;
        }
      } catch {
        toast.error("Không thể xử lý thanh toán. Vui lòng thử lại sau.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "bg-red-50 text-red-700",
          bodyClassName: "flex items-center gap-2",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ),
        });
        return;
      }
    }

    // Tạo đơn hàng sau khi xử lý thanh toán thành công hoặc khi chọn COD
    const payload = {
      user_id: userId,
      vehicle: selectedVehicle,
      pickup: {
        address: pickupAddressState,
        addressDetail: pickupDetail,
        senderName,
        senderPhone,
      },
      delivery: {
        address: deliveryAddressState,
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
        "http://localhost/DACS_Hutech/backend/order_handler.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      setShowConfirmModal(false);
      if (result.success && result.order_id) {
        // Gọi API tạo hóa đơn và lưu dữ liệu hóa đơn vào state
        const invoicePayload = {
          order_id: result.order_id,
          user_id: userId,
          amount: shippingFee,
          payment_method: paymentMethod,
        };
        const invoiceRes = await fetch(
          "http://localhost/DACS_Hutech/backend/invoice_handler.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoicePayload),
          }
        );
        const invoiceData = await invoiceRes.json();
        setInvoiceInfo(invoiceData); // Lưu dữ liệu bản hóa đơn vào state

        toast.success(
          paymentMethod === "cod"
            ? "Đặt đơn thành công! Vui lòng thanh toán khi nhận hàng."
            : "Đặt đơn và thanh toán thành công!",
          {
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
          }
        );
      } else {
        toast.success(result.message || "Có lỗi xảy ra khi đặt đơn.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "bg-red-50 text-red-700",
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
      }
    } catch {
      // Remove the unused 'error' parameter
      toast.error("Không thể gửi đơn hàng.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "bg-red-50 text-red-700",
        bodyClassName: "flex items-center gap-2",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        ),
      });
    }
  };

  const formatCurrency = (value) => {
    const numericValue = value.replace(/[^\d]/g, "");
    const number = parseInt(numericValue, 10);

    if (number > 30000000) {
      setValueError("Tối đa 30.000.000");
      return "30.000.000";
    } else {
      setValueError("");
    }

    return number ? number.toLocaleString("vi-VN") : "";
  };

  useEffect(() => {
    const calculateShippingFee = () => {
      if (selectedVehicle && distance) {
        const pricePerKm =
          selectedVehicle === "Xe Máy"
            ? 5000
            : selectedVehicle === "Xe Van"
            ? 10000
            : selectedVehicle === "Xe Bán Tải"
            ? 15000
            : selectedVehicle === "Xe Tải"
            ? 20000
            : 5000;
        const baseFee = Math.round(distance * pricePerKm);
        const maxFee = 300000;
        const finalFee = Math.min(baseFee, maxFee);

        setShippingFee(finalFee);
      }
    };

    calculateShippingFee();
  }, [selectedVehicle, distance]);
  return (
    <div className="w-full mt-10 pr-6">
      <h2 className="font-medium text-[20px] mb-6 text-[#4e7cb2]">
        Lộ trình giao hàng
      </h2>

      {/* Địa điểm lấy hàng */}
      <div className="mb-8 bg-white py-6 rounded-2xl px-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#4e7cb2]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="font-semibold text-[16px] text-[#4e7cb2]">
            Địa điểm lấy hàng
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Địa chỉ"
              value={pickupAddressState}
              onChange={(e) => {
                setPickupAddressState(e.target.value);
                setErrors((prev) => ({ ...prev, pickupAddress: false }));
              }}
              className={`rounded-lg p-3 w-full bg-gray-50 border ${
                errors.pickupAddress ? "border-red-500" : "border-gray-300"
              } focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none transition-all`}
              required
            />
            {errors.pickupAddress && (
              <p className="text-red-500 text-sm mt-1">Vui lòng nhập địa chỉ</p>
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
            <input
              type="text"
              placeholder="Số điện thoại"
              value={senderPhone}
              onChange={(e) => {
                setSenderPhone(e.target.value);
                setErrors((prev) => ({ ...prev, senderPhone: false }));
              }}
              className={`rounded-lg p-3 w-full bg-gray-50 border ${
                errors.senderPhone ? "border-red-500" : "border-gray-300"
              } focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none transition-all`}
              required
            />
            {errors.senderPhone && (
              <p className="text-red-500 text-sm mt-1">
                {!senderPhone.trim()
                  ? "Vui lòng nhập số điện thoại"
                  : "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có 10 số)"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Địa điểm giao hàng */}
      <div className="mb-8 bg-white py-6 rounded-2xl px-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#4e7cb2]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="font-semibold text-[16px] text-[#4e7cb2]">
            Bạn muốn giao hàng đến
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 relative">
          <div>
            <input
              type="text"
              placeholder="Địa chỉ"
              value={deliveryAddressState}
              onChange={(e) => {
                setDeliveryAddressState(e.target.value);
                setErrors((prev) => ({ ...prev, deliveryAddress: false }));
              }}
              className={`rounded-lg p-3 w-full bg-gray-50 border ${
                errors.deliveryAddress ? "border-red-500" : "border-gray-300"
              } focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none transition-all`}
              required
            />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-sm mt-1">Vui lòng nhập địa chỉ</p>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Chi tiết địa chỉ (không bắt buộc)"
              value={deliveryDetail}
              onChange={(e) => setDeliveryDetail(e.target.value)}
              className="rounded-lg p-3 w-full bg-gray-50 border border-gray-300 focus:border-[#4e7cb2] focus:ring-1 focus:ridivg-[#4e7cb2] outline-none transition-all text-gray-600"
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
            <input
              type="text"
              placeholder="Số điện thoại"
              value={receiverPhone}
              onChange={(e) => {
                setReceiverPhone(e.target.value);
                setErrors((prev) => ({ ...prev, receiverPhone: false }));
              }}
              className="rounded-lg p-3 w-full bg-gray-50 border border-gray-300 focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none transition-all"
            />
            {errors.receiverPhone && (
              <p className="text-red-500 text-sm mt-1">
                {!receiverPhone.trim()
                  ? "Vui lòng nhập số điện thoại"
                  : "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có 10 số)"}
              </p>
            )}
          </div>
          <ProductType value={selectedType} onChange={setSelectedType} />

          <div className="relative">
            <div>
              <input
                type="text"
                placeholder="Giá trị hàng (VNĐ)"
                value={goodsValue}
                onChange={(e) => {
                  const formattedValue = formatCurrency(e.target.value);
                  setGoodsValue(formattedValue);
                }}
                className={`rounded-lg p-3 w-full bg-gray-50 border ${
                  valueError ? "border-red-500" : "border-gray-300"
                } focus:border-[#4e7cb2] focus:ring-1 focus:ring-[#4e7cb2] outline-none transition-all`}
              />
              {errors.goodsValue && (
                <p className="text-red-500 text-sm mt-1">
                  Vui lòng nhập giá trị hàng
                </p>
              )}
            </div>
            {valueError && (
              <div className="absolute -bottom-6 right-0 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-md text-sm flex items-center gap-2 shadow-sm animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Tối đa 30.000.000 VNĐ</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Phương thức thanh toán */}
      <div className="mb-8 bg-white py-6 rounded-2xl px-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#4e7cb2]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
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
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="balance"
              checked={paymentMethod === "balance"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-radio h-5 w-5 text-[#4e7cb2]"
            />
            <span className="text-gray-700">Thanh toán bằng số dư ví</span>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">
                    Hóa đơn vận chuyển
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#4e7cb2]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
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
                        <p className="text-gray-600">{pickupAddressState}</p>
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
                        <p className="text-gray-600">{deliveryAddressState}</p>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#4e7cb2]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10l8 4"
                      />
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
                      {parseInt(goodsValue).toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>
              </div>

              {/* Chi phí & Thanh toán */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
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
                        (Tính theo: {distance.toFixed(2)} km × 20.000 VNĐ/km)
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Loại hàng</span>
                    <span className="font-medium text-gray-800">
                      {selectedType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giá trị hàng</span>
                    <span className="font-medium text-gray-800">
                      {parseInt(goodsValue).toLocaleString()} VNĐ
                    </span>
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
