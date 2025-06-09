-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 09, 2025 lúc 05:51 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `swiftship`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `drivers`
--

CREATE TABLE `drivers` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `cccd` varchar(20) DEFAULT NULL,
  `license_number` varchar(50) DEFAULT NULL,
  `vehicle_type` enum('Xe bán tải','Xe van','Xe máy') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `note` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1: Hoạt động, 0: Không hoạt động',
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `drivers`
--

INSERT INTO `drivers` (`id`, `full_name`, `phone_number`, `cccd`, `license_number`, `vehicle_type`, `created_at`, `note`, `status`, `image_url`) VALUES
(1, 'Nguyễn Văn Tài', '0912345678', '123456789012', 'B2-123456', 'Xe máy', '2025-05-27 10:41:20', 'Chuyên giao nội thành', 1, 'uploads/drivers/driver_684338a4872a1_540-5400315_facebook-teerasej-profile-ball-circle-circular-profile-picture.png'),
(2, 'Trần Thị Lái', '0987654321', '987654321098', 'C-6543212', 'Xe bán tải', '2025-05-27 10:41:20', 'Có kinh nghiệm 5 năm', 1, 'uploads/drivers/driver_68432bc6edd0a_473-4739617_transparent-face-profile-png-round-profile-picture-png.png'),
(3, 'Lê Thị Thư', '0912312312', '808123123123', 'BC-654512', 'Xe van', '2025-05-28 06:10:25', 'Có kinh nghiệm 2 năm', 1, 'uploads/drivers/driver_684338d57f6d0_540-5400315_facebook-teerasej-profile-ball-circle-circular-profile-picture.png'),
(4, 'Bùi Minh Kim', '0912312312', '808123123234', 'A-9123122', 'Xe bán tải', '2025-05-28 06:15:27', 'Chuyên xe bán tải', 1, 'uploads/drivers/driver_68433a62da60c_473-4739617_transparent-face-profile-png-round-profile-picture-png.png'),
(5, 'Đặng Bình An', '0912736127', '821231238912', 'A-9123122', 'Xe bán tải', '2025-05-28 06:24:32', 'Có kinh nghiệm 5 năm', 1, 'uploads/drivers/driver_684338d022380_cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA4L2pvYjEwMzQtZWxlbWVudC0wNS0zODUucG5n.png'),
(6, 'Huỳnh Gia Bảo', '0987654321', '808123123234', 'C-1239123', 'Xe van', '2025-05-29 08:12:36', 'Có kinh nghiệm 15 năm', 1, 'uploads/drivers/driver_684338db6c51b_355-3555383_circle-profile-picture-clipart.png'),
(7, 'Ngô Gia Nam', '0912312312', '808112321312', 'BC-654512', 'Xe van', '2025-05-29 08:14:05', 'Chuyên xe van', 1, 'uploads/drivers/driver_68433a68e9e49_pc_gundam_build_f202973fae2e4e5e9fbf5e5d5f6be243.png'),
(9, 'Trịnh Văn Tiến', '0355312750', '831202213412', 'C-1232141', 'Xe bán tải', '2025-05-30 03:43:54', 'Chuyên xe tải', 1, 'uploads/drivers/driver_68433a6d8daa1_pexels-photo-777001.png'),
(10, 'Lê Minh Bình', '0912736127', '812311238912', 'C-1231256', 'Xe van', '2025-05-30 03:44:48', 'Chuyên xe tải', 1, 'uploads/drivers/driver_68433a724a1ec_cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA4L2pvYjEwMzQtZWxlbWVudC0wNS0zODUucG5n.png'),
(11, 'Nguyễn Văn Tâm', '0912736127', '123456789012', 'B2-123456', 'Xe bán tải', '2025-06-06 17:23:53', 'Có kinh nghiệm 5 năm', 1, 'uploads/drivers/driver_68432429eb090_540-5400315_facebook-teerasej-profile-ball-circle-circular-profile-picture.png');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `payment_method` enum('cod','balance') NOT NULL,
  `status` enum('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `invoices`
--

INSERT INTO `invoices` (`id`, `order_id`, `invoice_number`, `user_id`, `amount`, `payment_method`, `status`, `created_at`) VALUES
(20, 26, 'INV-000026', 26, 160526, 'cod', 'pending', '2025-06-06 14:00:18'),
(24, 30, 'INV-000030', 26, 99023, 'balance', 'paid', '2025-06-06 15:05:04'),
(25, 31, 'INV-000031', 26, 80153, 'cod', 'pending', '2025-06-06 15:05:47'),
(33, 39, 'INV-000039', 26, 58686, 'cod', 'pending', '2025-06-07 06:18:37'),
(34, 40, 'INV-000040', 26, 298379, 'cod', 'pending', '2025-06-07 07:15:32');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vehicle` varchar(50) DEFAULT NULL,
  `pickup_address` varchar(255) DEFAULT NULL,
  `pickup_address_detail` varchar(255) DEFAULT NULL,
  `sender_name` varchar(100) DEFAULT NULL,
  `sender_phone` varchar(20) DEFAULT NULL,
  `delivery_address` varchar(255) DEFAULT NULL,
  `delivery_address_detail` varchar(255) DEFAULT NULL,
  `receiver_name` varchar(100) DEFAULT NULL,
  `receiver_phone` varchar(20) DEFAULT NULL,
  `goods_type` varchar(100) DEFAULT NULL,
  `goods_value` int(11) DEFAULT NULL,
  `payment_method` enum('cod','balance') NOT NULL DEFAULT 'cod',
  `shipping_fee` int(11) NOT NULL DEFAULT 0,
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Chờ xác nhận','Đang giao','Đã nhận','Hoàn tất','Đã huỷ') DEFAULT 'Chờ xác nhận',
  `driver_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `vehicle`, `pickup_address`, `pickup_address_detail`, `sender_name`, `sender_phone`, `delivery_address`, `delivery_address_detail`, `receiver_name`, `receiver_phone`, `goods_type`, `goods_value`, `payment_method`, `shipping_fee`, `is_paid`, `created_at`, `status`, `driver_id`) VALUES
(26, 26, 'Xe Van', 'Quách Điêu, Xã Vĩnh Lộc A, Huyện Bình Chánh, Thành phố Hồ Chí Minh, 71821, Việt Nam', '', 'ádasd', '0912312312', 'Hẻm 43 Trần Bá Giao, Phường 5, Quận Gò Vấp, Thành phố Hồ Chí Minh, 71409, Việt Nam', '', 'ádasd', '0912312312', 'Đồ điện tử', 1231232, 'cod', 160526, 0, '2025-06-06 14:00:18', 'Đang giao', 2),
(30, 26, 'Xe Máy', 'Xã Vĩnh Lộc A, Huyện Bình Chánh, Thành phố Hồ Chí Minh, 71821, Việt Nam', '', 'Ân', '0912312312', 'Hẻm 265/8 Nơ Trang Long, Phường 11, Quận Bình Thạnh, Thành phố Hồ Chí Minh, 71400, Việt Nam', '', 'Đạt', '0912312312', 'Đồ điện tử', 1231232, 'balance', 99023, 1, '2025-06-06 15:05:04', 'Đã nhận', 4),
(31, 26, 'Xe Máy', 'Xã Xuân Thới Thượng, Huyện Hóc Môn, Thành phố Hồ Chí Minh, 71821, Việt Nam', '', 'Ân', '0912312312', 'Trường THCS Nguyễn Văn Trỗi, 24, Nguyễn Tuân, Phường 3, Quận Gò Vấp, Thành phố Hồ Chí Minh, 71409, Việt Nam', '', 'Minh', '0912312312', 'Khác', 1232223, 'cod', 80153, 0, '2025-06-06 15:05:47', 'Đang giao', 4),
(39, 26, 'Xe Máy', 'Xã Xuân Thới Thượng, Huyện Hóc Môn, Thành phố Hồ Chí Minh, 71717, Việt Nam', '', 'Ân', '0912312312', 'VĐ. bảo vệ sân bay, Phường 15, Quận Tân Bình, Thành phố Hồ Chí Minh, 72100, Việt Nam', '', 'Đạt', '0912312312', 'Đồ điện tử', 12312312, 'cod', 58686, 0, '2025-06-07 06:18:37', 'Chờ xác nhận', NULL),
(40, 26, 'Xe Van', 'Xã Vĩnh Lộc A, Huyện Bình Chánh, Thành phố Hồ Chí Minh, 71821, Việt Nam', '', 'Hoài Ân', '0974953122', 'Phường Phước Long B, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, 71350, Việt Nam', '', 'Đạt', '0912383712', 'Đồ điện tử', 123213, 'cod', 298379, 0, '2025-06-07 07:15:32', 'Đang giao', 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transaction_history`
--

CREATE TABLE `transaction_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('deposit','withdraw') NOT NULL,
  `amount` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `transaction_history`
--

INSERT INTO `transaction_history` (`id`, `user_id`, `type`, `amount`, `created_at`) VALUES
(6, 23, 'deposit', 100000, '2025-05-12 14:47:12'),
(7, 23, 'withdraw', 20000, '2025-05-12 14:47:18'),
(8, 26, 'deposit', 123000, '2025-05-27 10:53:07'),
(9, 26, 'withdraw', 12000, '2025-05-27 10:53:21'),
(10, 26, 'withdraw', 27585, '2025-05-27 10:54:26'),
(13, 26, 'deposit', 123000, '2025-05-27 11:29:21'),
(29, 26, 'withdraw', 166764, '2025-05-28 02:37:07'),
(30, 26, 'withdraw', 257694, '2025-05-28 05:26:23'),
(31, 26, 'withdraw', 110830, '2025-05-28 06:01:43'),
(32, 26, 'withdraw', 110662, '2025-05-28 06:27:05'),
(33, 26, 'deposit', 500000, '2025-05-29 09:52:32'),
(34, 26, 'withdraw', 137291, '2025-05-29 09:53:03'),
(35, 26, 'withdraw', 130225, '2025-05-29 14:25:03'),
(36, 26, 'deposit', 123000, '2025-06-05 06:37:00'),
(37, 26, 'withdraw', 96209, '2025-06-05 06:38:51'),
(38, 26, 'withdraw', 68239, '2025-06-05 15:05:16'),
(39, 26, 'withdraw', 154799, '2025-06-06 14:00:53'),
(40, 26, 'withdraw', 99023, '2025-06-06 15:05:04'),
(41, 26, 'withdraw', 75944, '2025-06-06 18:59:41'),
(42, 26, 'deposit', 120000, '2025-06-07 03:59:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cccd` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','employee','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `balance` int(11) DEFAULT 0,
  `status` enum('active','locked') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `full_name`, `phone_number`, `email`, `cccd`, `password`, `role`, `created_at`, `balance`, `status`) VALUES
(23, 'Huỳnh Nguyễn Thành Đạt', '0394391204', 'huynhnguyenthanhdat3@gmail.com', NULL, '$2y$10$J34avPm6wUzAq7XNzlECne.bmtYNbaliubbRE.mcO8UmWdyv70ZWK', 'user', '2025-05-12 14:39:54', 80000, 'active'),
(24, 'ADMIN', '', 'admin@gmail.com', NULL, '$2y$10$JWgB8OZFiX5ruBA02p6NJuob3mW9IOi06wlVmWTa4YwN.FmPyY4Hq', 'admin', '2025-05-12 14:40:09', 0, 'active'),
(25, 'Trịnh Kiển Đạt', '0965748370', 'kiendat@gmail.com', NULL, '$2y$10$gBG9DhSmPGSzXwcnTik7W.GHxuaT5DyZaZ.TwA7bwiS5F4608A5fK', 'employee', '2025-05-12 14:41:03', 0, 'active'),
(26, 'Hoài Ân', '0912341231', 'HoaiAn123@gmail.com', NULL, '$2y$10$5qButFSTrMLSlMWNmy2cyuW2jqAXlgaCTskOym.z7PD10obb5uOpK', 'user', '2025-05-27 10:41:56', 163793, 'active'),
(27, 'Nguyễn Minh Tường', '0912348572', 'user@gmail.com', NULL, '$2y$10$ovTCVni4Ey7mwTAgQUOZi.7k/oAq/pT0wa7psVJdwiqKspwu4x.FO', 'user', '2025-06-06 15:16:43', 0, 'active'),
(28, 'Nguyễn Văn Tâm', '0394391204', 'user2@gmail.com', NULL, '$2y$10$AiMXExTkJOodQEYu91UBo.gnBwuX3.YKYW7OW48B3hWrrR7NW.j1m', 'user', '2025-06-06 15:17:34', 0, 'active'),
(29, 'Lê Nguyễn Thanh Nam', '0929531231', 'user3@gmail.com', NULL, '$2y$10$IS5hiHHqdLA0fx/xo.vpUuRd1Psgwkivds78l7v2ryl80CtN7et02', 'user', '2025-06-06 15:18:24', 0, 'active'),
(30, 'Nguyễn Tâm An', '0912348572', 'user5@gmail.com', NULL, '$2y$10$AErdP.Z1SF/wP9oBzdUwSOU/KoFN5ZwVv2myoP1Irt.crtbskGLqa', 'user', '2025-06-06 15:19:20', 0, 'active');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vehicle_prices`
--

CREATE TABLE `vehicle_prices` (
  `vehicle_type` enum('Xe máy','Xe bán tải','Xe van') NOT NULL,
  `price_per_km` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vehicle_prices`
--

INSERT INTO `vehicle_prices` (`vehicle_type`, `price_per_km`) VALUES
('Xe máy', 5000),
('Xe bán tải', 10000),
('Xe van', 8000);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orders_users` (`user_id`);

--
-- Chỉ mục cho bảng `transaction_history`
--
ALTER TABLE `transaction_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cccd` (`cccd`);

--
-- Chỉ mục cho bảng `vehicle_prices`
--
ALTER TABLE `vehicle_prices`
  ADD PRIMARY KEY (`vehicle_type`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `drivers`
--
ALTER TABLE `drivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT cho bảng `transaction_history`
--
ALTER TABLE `transaction_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `fk_invoices_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_invoices_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `transaction_history`
--
ALTER TABLE `transaction_history`
  ADD CONSTRAINT `transaction_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
