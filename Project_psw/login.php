<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$pass = "";
$db   = "sibs_spoons";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Koneksi database gagal."]);
    exit();
}

$inputData = json_decode(file_get_contents('php://input'), true);

if (!isset($inputData['username']) || !isset($inputData['password']) || !isset($inputData['role'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
    exit();
}

$username = $conn->real_escape_string($inputData['username']);
$password = $conn->real_escape_string($inputData['password']);
$role     = $conn->real_escape_string($inputData['role']);

$sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password' AND role = '$role'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode([
        "status" => "success",
        "message" => ucfirst($role) . " Login Successful!"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Username, Password, atau Role Anda salah!"
    ]);
}

$conn->close();
?>