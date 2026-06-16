Backend PHP & MySQL

1) Créer la base de données et les tables MySQL

Exécutez depuis un shell MySQL (ou importez le fichier):

```bash
mysql -u root -p < database.sql
```

2) Configurer la connexion

Éditez `db.php` et renseignez `DB_HOST`, `DB_USER`, `DB_PASS` si besoin.

3) Lancer le serveur PHP intégré (pour développement)

```bash
cd backend
php -S localhost:3000
```

4) Endpoints

- `GET http://localhost:3000/api.php?action=candidates` — liste des candidats
- `POST http://localhost:3000/api.php?action=vote` — corps JSON: `{ "studentId": "123", "candidateId": 1 }`
- `GET http://localhost:3000/api.php?action=results` — résultats triés

Note: Le frontend doit appeler ces URLs (ou ajuster les fetch vers `backend/api.php?action=...`).
