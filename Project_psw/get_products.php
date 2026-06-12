<?php
header('Content-Type: application/json');
include 'koneksi.php';

try {
    $query = "SELECT * FROM product";
    $result = mysqli_query($koneksi, $query);
    
    if (!$result) {
        throw new Exception(mysqli_error($koneksi));
    }

    $products = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $products[] = $row;
    }

    echo json_encode($products); 

} catch (Exception $e) {
    echo json_encode([]); 
}
?>