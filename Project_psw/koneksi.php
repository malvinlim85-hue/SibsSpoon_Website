<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "sibs_spoons"; 

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode([
        "status" => "error", 
        "message" => "Gagal terhubung ke database. Cek apakah XAMPP MySQL sudah menyala."
    ]));
}
?>