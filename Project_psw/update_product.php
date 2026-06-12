<?php
header('Content-Type: application/json');
require 'koneksi.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id   = $_POST['product_id'];
    $product_name = $_POST['product_name'];
    $price        = $_POST['price'];
    $description  = $_POST['description'];

    if (!empty($product_id) && !empty($product_name) && !empty($price)) {
        
        $sql = "UPDATE product SET 
                product_name = '$product_name', 
                price = '$price', 
                description = '$description' 
                WHERE product_id = '$product_id'";

        if ($koneksi->query($sql) === TRUE) {
            echo json_encode([
                "status" => "success",
                "message" => "Data produk berhasil diperbarui secara real-time."
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Gagal memperbarui database: " . $koneksi->error
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Data input tidak lengkap."
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Metode request tidak diizinkan."
    ]);
}

$koneksi->close();
?>