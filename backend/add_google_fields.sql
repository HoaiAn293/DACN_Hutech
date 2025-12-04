-- Thêm các cột cần thiết cho Google OAuth vào bảng users
-- Chạy script này trong phpMyAdmin hoặc MySQL client

ALTER TABLE `users` 
ADD COLUMN `google_id` VARCHAR(255) NULL DEFAULT NULL AFTER `password`,
ADD COLUMN `avatar` VARCHAR(500) NULL DEFAULT NULL AFTER `google_id`;

-- Tạo index cho google_id để tìm kiếm nhanh hơn
ALTER TABLE `users` 
ADD INDEX `idx_google_id` (`google_id`);

