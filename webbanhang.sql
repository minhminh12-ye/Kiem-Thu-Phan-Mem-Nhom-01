-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 19, 2026 lúc 11:48 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `webbanhang`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brands`
--

CREATE TABLE `brands` (
  `brand_id` varchar(10) NOT NULL,
  `brand_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `brands`
--

INSERT INTO `brands` (`brand_id`, `brand_name`) VALUES
('BR01', 'Apple'),
('BR02', 'Samsung'),
('BR03', 'Dell'),
('BR04', 'Sony'),
('BR05', 'Asus'),
('BR06', 'HP'),
('BR07', 'Lenovo'),
('BR08', 'Xiaomi'),
('BR09', 'Logitech'),
('BR10', 'LG');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cartitem`
--

CREATE TABLE `cartitem` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `category_id` varchar(10) NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`category_id`, `category_name`) VALUES
('CAT01', 'Điện thoại'),
('CAT02', 'Laptop'),
('CAT03', 'Máy tính bảng'),
('CAT04', 'Phụ kiện'),
('CAT05', 'Đồng hồ'),
('CAT06', 'Âm thanh'),
('CAT07', 'Màn hình'),
('CAT08', 'Máy ảnh'),
('CAT09', 'Thiết bị mạng'),
('CAT10', 'Linh kiện PC');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `address_id` int(11) NOT NULL,
  `total_price` mediumint(9) NOT NULL,
  `status` varchar(10) NOT NULL,
  `created_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order`
--

INSERT INTO `order` (`id`, `user_id`, `address_id`, `total_price`, `status`, `created_at`) VALUES
(1, 2, 101, 32000, 'Success', '2024-03-01'),
(2, 3, 102, 45000, 'Pending', '2024-03-02'),
(3, 4, 103, 8500, 'Success', '2024-03-03'),
(4, 5, 104, 1500, 'Shipping', '2024-03-04'),
(5, 6, 105, 55000, 'Success', '2024-03-05'),
(6, 7, 106, 12000, 'Pending', '2024-03-06'),
(7, 8, 107, 25000, 'Success', '2024-03-07'),
(8, 9, 108, 19000, 'Cancel', '2024-03-08'),
(9, 10, 109, 35000, 'Success', '2024-03-09'),
(10, 2, 110, 28000, 'Success', '2024-03-10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `category_id` varchar(10) NOT NULL,
  `brand_id` varchar(10) NOT NULL,
  `price` mediumint(9) NOT NULL,
  `stock` mediumint(9) DEFAULT NULL,
  `specs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specs`)),
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `category_id`, `brand_id`, `price`, `stock`, `specs`, `image_url`) VALUES
(1, 'iPhone 15 Pro Max', 'CAT01', 'BR01', 32000, 50, '{\"cpu\": \"A17 Pro\", \"screen\": \"6.7 inch\"}', 'https://picsum.photos/200/300'),
(2, 'Samsung Galaxy S24', 'CAT01', 'BR02', 28000, 40, '{\"cpu\": \"Exynos 2400\", \"screen\": \"6.2 inch\"}', 'https://picsum.photos/200/301'),
(3, 'Dell XPS 13', 'CAT02', 'BR03', 45000, 15, '{\"ram\": \"16GB\", \"ssd\": \"512GB\"}', 'https://picsum.photos/200/302'),
(4, 'MacBook Air M3', 'CAT02', 'BR01', 35000, 20, '{\"chip\": \"M3\", \"ram\": \"8GB\"}', 'https://picsum.photos/200/303'),
(5, 'Sony WH-1000XM5', 'CAT06', 'BR04', 8500, 30, '{\"type\": \"ANC\", \"battery\": \"30h\"}', 'https://picsum.photos/200/304'),
(6, 'iPad Pro M2', 'CAT03', 'BR01', 25000, 25, '{\"screen\": \"11 inch\", \"chip\": \"M2\"}', 'https://picsum.photos/200/305'),
(7, 'Asus ROG Zephyrus', 'CAT02', 'BR05', 55000, 10, '{\"gpu\": \"RTX 4070\", \"screen\": \"240Hz\"}', 'https://picsum.photos/200/306'),
(8, 'Xiaomi Mi 14', 'CAT01', 'BR08', 19000, 60, '{\"cpu\": \"Snapdragon 8 Gen 3\"}', 'https://picsum.photos/200/307'),
(9, 'Chuột Logitech G502', 'CAT04', 'BR09', 1500, 100, '{\"dpi\": \"25000\", \"type\": \"Gaming\"}', 'https://picsum.photos/200/308'),
(10, 'Màn hình LG UltraFine', 'CAT07', 'BR10', 12000, 12, '{\"res\": \"4K\", \"size\": \"27 inch\"}', 'https://picsum.photos/200/309');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role`
--

CREATE TABLE `role` (
  `roleId` tinyint(4) NOT NULL,
  `role_level` tinyint(4) NOT NULL,
  `role_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `role`
--

INSERT INTO `role` (`roleId`, `role_level`, `role_name`) VALUES
(1, 1, 'Administrator'),
(2, 2, 'Customer');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `roleId` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `email`, `password`, `roleId`) VALUES
(1, 'admin', 'admin@gmail.com', '123456', 1),
(2, 'nguyenvana', 'vana@gmail.com', '123456', 2),
(3, 'tranvanb', 'vanb@gmail.com', '123456', 2),
(4, 'lethic', 'thic@gmail.com', '123456', 2),
(5, 'phamvand', 'vand@gmail.com', '123456', 2),
(6, 'hoangthie', 'thie@gmail.com', '123456', 2),
(7, 'nguyenvanf', 'vanf@gmail.com', '123456', 2),
(8, 'dangthig', 'thig@gmail.com', '123456', 2),
(9, 'buitanh', 'tanh@gmail.com', '123456', 2),
(10, 'vothii', 'thii@gmail.com', '123456', 2);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brand_id`);

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `cartitem`
--
ALTER TABLE `cartitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cartitem_prod` (`product_id`),
  ADD KEY `fk_cartitem_cart` (`cart_id`);

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Chỉ mục cho bảng `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_user` (`user_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Chỉ mục cho bảng `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`roleId`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `roleId` (`roleId`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cartitem`
--
ALTER TABLE `cartitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cartitem`
--
ALTER TABLE `cartitem`
  ADD CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  ADD CONSTRAINT `fk_cartitem_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Các ràng buộc cho bảng `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_prod_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`),
  ADD CONSTRAINT `fk_prod_cat` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`);

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`roleId`) REFERENCES `role` (`roleId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
