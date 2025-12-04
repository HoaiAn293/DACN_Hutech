-- Thêm cột lưu tọa độ hiện tại của tài xế vào bảng users
ALTER TABLE `users`
  ADD COLUMN `current_lat` DECIMAL(10,7) NULL DEFAULT NULL AFTER `status`,
  ADD COLUMN `current_lng` DECIMAL(10,7) NULL DEFAULT NULL AFTER `current_lat`,
  ADD COLUMN `last_location_update` TIMESTAMP NULL DEFAULT NULL AFTER `current_lng`;


