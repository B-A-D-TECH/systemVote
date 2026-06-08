CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    photo TEXT NOT NULL,
    program TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    candidate_id INTEGER,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

INSERT INTO candidates (name, photo, program)
VALUES
(
    'Amine Bennani',
    'images/istockphoto-1462023934-1024x1024.jpg',
    'Pour une digitalisation complète des supports de cours.'
),
(
    'Sara El Fassi',
    'images/istockphoto-1830126474-1024x1024.jpg',
    'Amélioration des espaces de coworking et des hackathons.'
);