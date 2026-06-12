<?php
header('Content-Type: application/json');
require 'koneksi.php'; 

$inputData = json_decode(file_get_contents('php://input'), true);

$customer_name = isset($_POST['customer_name']) ? $_POST['customer_name'] : ($inputData['customer_name'] ?? '');
$total_price   = isset($_POST['total_price']) ? $_POST['total_price'] : ($inputData['total_price'] ?? '');

if (empty($customer_name) || empty($total_price)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "message" => "Data kiriman dari frontend tidak lengkap atau kosong.",
        "debug_data_terima" => ["customer_name" => $customer_name, "total_price" => $total_price]
    ]);
    exit();
}

$customer_name = mysqli_real_escape_string($koneksi, $customer_name);
$total_price   = intval($total_price);

$sql = "INSERT INTO orders (customer_name, total_price, order_date) VALUES ('$customer_name', '$total_price', NOW())";

if (mysqli_query($koneksi, $sql)) {
    echo json_encode([
        "status" => "success", 
        "message" => "Pesanan berhasil disimpan."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Gagal menyimpan data ke database: " . mysqli_error($koneksi)
    ]);
}

mysqli_close($koneksi);
?>