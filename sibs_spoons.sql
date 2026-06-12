SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `orders` (`order_id`, `customer_name`, `total_price`, `order_date`) VALUES
(6, 'Asep', 15000.00, '2026-06-07 08:03:49');

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `product` (`product_id`, `product_name`, `price`, `description`, `image`) VALUES
(1, 'Cheezilla Frosty', 15000.00, 'Classic Pumpkin Donuts with snowy sugar, cheese, and chocolate.', 'Pumpkin Donuts.jpeg'),
(2, 'Banana Scoop Cake', 30000.00, 'Warm molten banana pudding cake served with Biscoff crunch.', 'Banana Pudding.jpeg'),
(3, 'Cheese Softcake', 30000.00, 'Soft and fluffy Cheese cake with creamy texture, balanced sweetness.', 'Cheese Softcake.jpeg'),
(4, 'Dark Choco Brownie', 55000.00, 'Soft and moist chocolate brownie topped with rich dark cocoa taste.', 'Brownie.jpeg'),
(5, 'Kunafa Cookies', 52000.00, 'Soft baked cookies filled with pistachio cream and crunchy kunafa.', 'Kunafa Pistachio Soft Cookies.jpeg'),
(6, 'Dubai Chewy Cookie', 55000.00, 'Premium chewy cookie with rich kunafa and pistachio filling.', 'Dubai Chewy Cookie.jpeg'),
(7, 'Classic Tiramisu', 50000.00, 'Italian layered tiramisu with espresso and mascarpone cream.', 'tiramisu.jpeg'),
(8, 'Dubai Donuts', 35000.00, 'Fluffy donuts topped with premium pistachio and chocolate drizzle.', 'dubai donuts.jpeg');


CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'malvin', '12345', 'customer', '2026-06-05 12:10:45'),
(2, 'asep', '67890', 'customer', '2026-06-05 12:10:45'),
(3, 'admin', 'admin123', 'admin', '2026-06-05 12:10:45');

ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;
