<?php
// Simple MySQL connection helper
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// Configurez ces valeurs selon votre environnement
$DB_HOST = '127.0.0.1';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'vote_electronique_db';

function get_db()
{
    global $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME;

    $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["error" => "DB connection failed: " . $conn->connect_error]);
        exit;
    }

    $conn->set_charset('utf8mb4');
    return $conn;
}

function send_json($data, $status = 200)
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}
