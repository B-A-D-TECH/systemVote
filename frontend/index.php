<?php
// Index PHP: duplicate of index.html so XAMPP/PHP servers serve the frontend
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Système de Vote Électronique</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Élection du Délégué de Promotion</h1>
    </header>

    <main class="container">
        <section id="candidates-section">
            <h2>Candidats disponibles</h2>
            <div id="candidates-container" class="grid-layout"></div>
        </section>

        <section id="vote-section" class="card form-card">
            <h2>Passer votre vote</h2>
            <form id="vote-form">
                <div class="form-group">
                    <label for="student-id">Identifiant Étudiant :</label>
                    <input type="text" id="student-id" required placeholder="Ex: ETU2026">
                </div>
                <div class="form-group">
                    <label for="select-candidate">Choisir un candidat :</label>
                    <select id="select-candidate" required>
                        <option value="">-- Sélectionnez un candidat --</option>
                    </select>
                </div>
                <button type="submit" class="btn">Confirmer mon vote</button>
            </form>
            <div id="message-container" class="message"></div>
        </section>

        <section id="results-section">
            <h2>Résultats en temps réel</h2>
            <div id="results-container" class="card"></div>
        </section>
    </main>

    <script src="app.js"></script>
</body>
</html>
