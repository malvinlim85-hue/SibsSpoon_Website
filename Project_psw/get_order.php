<?php
header('Content-Type: application/json');
require 'koneksi.php'; 

$sql = "SELECT * FROM orders ORDER BY order_id DESC";
$result = $conn->query($sql);

$orders = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

echo json_encode($orders);
$conn->close();
?>