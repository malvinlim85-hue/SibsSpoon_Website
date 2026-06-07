<?php
header('Content-Type: application/json');
require 'koneksi.php'; 

$inputData = json_decode(file_get_contents('php://input'), true);

if (!isset($inputData['customer_name']) || !isset($inputData['total_price'])) {
    echo json_encode(["status" => "error", "message" => "Data kiriman tidak lengkap."]);
    exit();
}

$customer_name = $conn->real_escape_string($inputData['customer_name']);
$total_price   = intval($inputData['total_price']);

$sql = "INSERT INTO orders (customer_name, total_price, order_date) VALUES ('$customer_name', '$total_price', NOW())";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Pesanan berhasil disimpan."]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal menyimpan data: " . $conn->error]);
}

$conn->close();
?>