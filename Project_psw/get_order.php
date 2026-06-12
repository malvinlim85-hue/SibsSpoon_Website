<?php
header('Content-Type: application/json');
include 'koneksi.php';

try {
    $query = "SELECT * FROM orders";
    $result = mysqli_query($koneksi, $query);
    
    if (!$result) {
        throw new Exception(mysqli_error($koneksi));
    }

    $orders = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $orders[] = $row;
    }

    echo json_encode($orders); 

} catch (Exception $e) {
    echo json_encode([]); 
}
?>