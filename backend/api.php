<?php
require_once __DIR__ . '/db.php';

// Allow preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Parse incoming JSON body
$input = null;
if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
}

// GET /api.php?action=candidates
if ($action === 'candidates' && $method === 'GET') {
    $conn = get_db();
    $res = $conn->query("SELECT id, name, photo, program FROM candidates");
    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $rows[] = $row;
    }
    send_json($rows);
}

// POST /api.php?action=vote
if ($action === 'vote' && $method === 'POST') {
    if (!isset($input['studentId']) || !isset($input['candidateId'])) {
        send_json(['error' => 'Tous les champs sont obligatoires.'], 400);
    }

    $studentId = $input['studentId'];
    $candidateId = (int)$input['candidateId'];

    $conn = get_db();

    // Check if student already voted
    $stmt = $conn->prepare('SELECT id FROM votes WHERE student_id = ?');
    $stmt->bind_param('s', $studentId);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        send_json(['error' => 'Vous avez déjà voté.'], 400);
    }

    $stmt->close();

    $ins = $conn->prepare('INSERT INTO votes (student_id, candidate_id) VALUES (?, ?)');
    $ins->bind_param('si', $studentId, $candidateId);
    if (!$ins->execute()) {
        send_json(['error' => $conn->error], 500);
    }

    send_json(['message' => 'Vote enregistré avec succès.'], 201);
}

// GET /api.php?action=results
if ($action === 'results' && $method === 'GET') {
    $conn = get_db();
    $sql = "SELECT c.id, c.name, COUNT(v.id) AS votes
            FROM candidates c
            LEFT JOIN votes v ON c.id = v.candidate_id
            GROUP BY c.id
            ORDER BY votes DESC";

    $res = $conn->query($sql);
    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $row['votes'] = (int)$row['votes'];
        $rows[] = $row;
    }
    send_json($rows);
}

// Unknown route
send_json(['error' => 'Route non trouvée. Utilisez ?action=candidates|vote|results'], 404);
