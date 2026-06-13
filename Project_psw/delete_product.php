<?php
header('Content-Type: application/json');
require 'koneksi.php'; 


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = $_POST['product_id'];

    if (!empty($product_id)) {
        
        $sql = "DELETE FROM product WHERE product_id = '$product_id'";

        if ($koneksi->query($sql) === TRUE) {
            echo json_encode([
                "status" => "success",
                "message" => "Produk berhasil dihapus dari sistem."
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Gagal menghapus data dari database: " . $koneksi->error
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Product ID tidak ditemukan."
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
