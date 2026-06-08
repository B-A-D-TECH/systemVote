const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ===========================
// Connexion SQLite
// ===========================

const db = new sqlite3.Database('./vote.db', (err) => {
    if (err) {
        console.error("Erreur SQLite :", err.message);
    } else {
        console.log("Connexion SQLite réussie");
    }
});

// ===========================
// Création des tables
// ===========================

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS candidates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            photo TEXT NOT NULL,
            program TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT UNIQUE NOT NULL,
            candidate_id INTEGER,
            FOREIGN KEY(candidate_id) REFERENCES candidates(id)
        )
    `);

    // Insertion automatique des candidats
    db.get(
        "SELECT COUNT(*) AS total FROM candidates",
        [],
        (err, row) => {

            if (err) {
                console.error(err);
                return;
            }

            if (row.total === 0) {

                db.run(`
                    INSERT INTO candidates(name, photo, program)
                    VALUES
                    (
                        'Amine Bennani',
                        'images/istockphoto-1462023934-1024x1024.jpg',
                        'Pour une digitalisation complète des supports de cours.'
                    )
                `);

                db.run(`
                    INSERT INTO candidates(name, photo, program)
                    VALUES
                    (
                        'Sara El Fassi',
                        'images/istockphoto-1830126474-1024x1024.jpg',
                        'Amélioration des espaces de coworking et des hackathons.'
                    )
                `);

                console.log("Candidats ajoutés");
            }
        }
    );
});

// ===========================
// API : Liste des candidats
// ===========================

app.get('/api/candidates', (req, res) => {

    db.all(
        "SELECT * FROM candidates",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});

// ===========================
// API : Vote
// ===========================

app.post('/api/vote', (req, res) => {

    const { studentId, candidateId } = req.body;

    if (!studentId || !candidateId) {
        return res.status(400).json({
            error: "Tous les champs sont obligatoires."
        });
    }

    db.get(
        "SELECT * FROM votes WHERE student_id = ?",
        [studentId],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (row) {
                return res.status(400).json({
                    error: "Vous avez déjà voté."
                });
            }

            db.run(
                "INSERT INTO votes(student_id, candidate_id) VALUES(?, ?)",
                [studentId, candidateId],
                function(err) {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.status(201).json({
                        message: "Vote enregistré avec succès."
                    });
                }
            );
        }
    );
});

// ===========================
// API : Résultats
// ===========================

app.get('/api/results', (req, res) => {

    const sql = `
        SELECT
            c.id,
            c.name,
            COUNT(v.id) AS votes
        FROM candidates c
        LEFT JOIN votes v
        ON c.id = v.candidate_id
        GROUP BY c.id
        ORDER BY votes DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

// ===========================
// Lancement serveur
// ===========================

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});