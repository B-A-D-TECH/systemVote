-- MySQL-compatible schema for the voting app
CREATE DATABASE IF NOT EXISTS vote_electronique_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vote_electronique_db;

CREATE TABLE IF NOT EXISTS candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    photo VARCHAR(255) NOT NULL,
    program TEXT NOT NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL UNIQUE,
    candidate_id INT,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE SET NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO candidates (name, photo, program)
VALUES
('Amine Bennani','images/istockphoto-1462023934-1024x1024.jpg','Pour une digitalisation complète des supports de cours.'),
('Sara El Fassi','images/istockphoto-1830126474-1024x1024.jpg','Amélioration des espaces de coworking et des hackathons.');