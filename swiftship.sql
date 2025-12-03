-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th10 17, 2025 lúc 04:19 AM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

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
(36, 42, 'INV-000042', 31, 21856, 'balance', 'paid', '2025-11-17 01:48:42'),
(37, 43, 'INV-000043', 31, 21469, 'balance', 'paid', '2025-11-17 03:16:39');

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
(42, 31, 'Xe Máy', 'Tan Son Nhat International Airport, Hẻm 457/14 Tân Sơn, Phường An Hội Tây, Thuận An, Ho Chi Minh City, 71509, Vietnam', '', 'Đạt', '0394391204', 'Hẻm 43R Hồ Văn Huê, Phường Đức Nhuận, Thủ Đức, Ho Chi Minh City, 72215, Vietnam', '', 'Ân', '0965748370', 'Tài liệu / Giấy tờ', 33000, 'balance', 21856, 1, '2025-11-17 01:48:42', 'Hoàn tất', 31),
(43, 31, 'Xe Máy', 'Tan Son Nhat International Airport, Nguyễn Oanh, Phường Hạnh Thông, Ho Chi Minh City, 70048, Vietnam', '', 'Thành Đạt', '0394391204', 'Hẻm 43R Hồ Văn Huê, Phường Đức Nhuận, Thủ Đức, Ho Chi Minh City, 72215, Vietnam', '', 'Kiển Đạt', '0965748370', 'Thực phẩm', 47000, 'balance', 21469, 1, '2025-11-17 03:16:39', 'Đã nhận', 110);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `driver_id` INT(11) NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT,
  `images` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `suggestions` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `driver_id` (`driver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transaction_history`
--

CREATE TABLE `transaction_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('deposit','withdraw') NOT NULL,
  `amount` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `transaction_history`
--

INSERT INTO `transaction_history` (`id`, `user_id`, `type`, `amount`, `status`, `created_at`) VALUES
(8, 26, 'deposit', 123000, 'approved', '2025-05-27 10:53:07'),
(9, 26, 'withdraw', 12000, 'approved', '2025-05-27 10:53:21'),
(10, 26, 'withdraw', 27585, 'approved', '2025-05-27 10:54:26'),
(13, 26, 'deposit', 123000, 'approved', '2025-05-27 11:29:21'),
(29, 26, 'withdraw', 166764, 'approved', '2025-05-28 02:37:07'),
(30, 26, 'withdraw', 257694, 'approved', '2025-05-28 05:26:23'),
(31, 26, 'withdraw', 110830, 'approved', '2025-05-28 06:01:43'),
(32, 26, 'withdraw', 110662, 'approved', '2025-05-28 06:27:05'),
(33, 26, 'deposit', 500000, 'approved', '2025-05-29 09:52:32'),
(34, 26, 'withdraw', 137291, 'approved', '2025-05-29 09:53:03'),
(35, 26, 'withdraw', 130225, 'approved', '2025-05-29 14:25:03'),
(36, 26, 'deposit', 123000, 'approved', '2025-06-05 06:37:00'),
(37, 26, 'withdraw', 96209, 'approved', '2025-06-05 06:38:51'),
(38, 26, 'withdraw', 68239, 'approved', '2025-06-05 15:05:16'),
(39, 26, 'withdraw', 154799, 'approved', '2025-06-06 14:00:53'),
(40, 26, 'withdraw', 99023, 'approved', '2025-06-06 15:05:04'),
(41, 26, 'withdraw', 75944, 'approved', '2025-06-06 18:59:41'),
(42, 26, 'deposit', 120000, 'approved', '2025-06-07 03:59:30'),
(48, 31, 'deposit', 100000, 'approved', '2025-11-17 01:25:40'),
(49, 31, 'withdraw', 50000, 'approved', '2025-11-17 01:33:36'),
(50, 31, 'withdraw', 49401, 'approved', '2025-11-17 01:44:58'),
(51, 31, 'deposit', 500000, 'approved', '2025-11-17 01:46:16'),
(52, 31, 'withdraw', 21856, 'approved', '2025-11-17 01:48:42'),
(53, 31, 'withdraw', 21469, 'approved', '2025-11-17 03:16:39');

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
  `role` enum('user','employee','admin','driver') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `balance` int(11) DEFAULT 0,
  `status` enum('active','locked') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `full_name`, `phone_number`, `email`, `cccd`, `password`, `role`, `created_at`, `balance`, `status`) VALUES
(24, 'ADMIN', '', 'admin@gmail.com', NULL, '$2y$10$JWgB8OZFiX5ruBA02p6NJuob3mW9IOi06wlVmWTa4YwN.FmPyY4Hq', 'admin', '2025-05-12 14:40:09', 0, 'active'),
(25, 'Trịnh Kiển Đạt', '0965748370', 'kiendat@gmail.com', NULL, '$2y$10$gBG9DhSmPGSzXwcnTik7W.GHxuaT5DyZaZ.TwA7bwiS5F4608A5fK', 'employee', '2025-05-12 14:41:03', 0, 'active'),
(26, 'Hoài Ân', '0912341231', 'HoaiAn123@gmail.com', NULL, '$2y$10$5qButFSTrMLSlMWNmy2cyuW2jqAXlgaCTskOym.z7PD10obb5uOpK', 'user', '2025-05-27 10:41:56', 163793, 'active'),
(31, 'Huỳnh Nguyễn Thành Đạt', '0394391204', 'huynhnguyenthanhdat3@gmail.com', NULL, '$2y$10$mqivybuLHjL.vCufZyTU0eCu.gZ2wPpHFivehMaemI/xiF9ZIU8Sa', 'user', '2025-11-17 01:13:45', 457274, 'active'),
(110, 'Lý Hữu Khang', '0901122002', 'lyhuukhang.driver@gmail.com', NULL, '$2y$10$42F.eoOPaJx7mURssZU1E.9TNZskVBTIlgruRAfShlZaxYLIocpMK', 'driver', '2025-11-17 03:08:02', 0, 'active'),
(111, 'Ngô Minh Trí', '0901122001', 'ngominhtri.driver@gmail.com', NULL, '$2y$10$cDdxOlsQLX/UepTGv9.eQu8crZe1TXuoVwYZBxwYbNJOma70NU1aW', 'driver', '2025-11-17 03:08:47', 0, 'active'),
(112, 'Đặng Thành Trung', '0901122003', 'dangthangtrung.driver@gmail.com', NULL, '$2y$10$tRLeykggIiWvMlyvXzP/gOBuB.QlTXfSiSqI6NSN7Zjl3tC.J4TOW', 'driver', '2025-11-17 03:09:22', 0, 'active');

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
-- AUTO_INCREMENT cho bảng `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT cho bảng `transaction_history`
--
ALTER TABLE `transaction_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

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
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_orders`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reviews_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reviews_driver`
    FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `transaction_history`
--
ALTER TABLE `transaction_history`
  ADD CONSTRAINT `transaction_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
