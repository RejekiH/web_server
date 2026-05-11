<?php
$host     = 'localhost';
$username = 'user_toko';
$password = 'password_toko';
$database = 'db_rejeki';
$conn = mysqli_connect($host, $username, $password, $database);
if (!$conn) {
    die('Koneksi gagal: ' . mysqli_connect_error());
}
?>
