<?php
header('Content-Type: application/json');
require 'koneksi.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_input = json_decode(file_get_contents('php://input'), true);
    $order_id = isset($_POST['order_id']) ? $_POST['order_id'] : ($json_input['order_id'] ?? '');
    $order_id = str_replace('#ORD-', '', $order_id);
    $order_id = mysqli_real_escape_string($koneksi, $order_id);

    if (!empty($order_id)) {
        $sql = "DELETE FROM orders WHERE order_id = '$order_id'";
        $result = mysqli_query($koneksi, $sql);

        if ($result) {
            echo json_encode([
                "status" => "success",
                "message" => "Pesanan berhasil dihapus dari sistem."
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Gagal menghapus data dari database: " . mysqli_error($koneksi)
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Order ID tidak ditemukan atau kosong."
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Metode request tidak diizinkan."
    ]);
}

mysqli_close($koneksi);
?>