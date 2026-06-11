// Use PHP backend served by XAMPP/Apache
const API_URL = 'http://localhost/systemVote/backend/api.php';

document.addEventListener('DOMContentLoaded', () => {
    loadCandidates();
    loadResults();

    // Soumission du formulaire de vote
    document.getElementById('vote-form').addEventListener('submit', handleVote);
});

// Charger et afficher les cartes des candidats
async function loadCandidates() {
    try {
        const response = await fetch(`${API_URL}?action=candidates`);
        const candidates = await response.json();
        
        const container = document.getElementById('candidates-container');
        const selectElement = document.getElementById('select-candidate');

        container.innerHTML = '';
        // Réinitialise la select (garder l'option par défaut)
        selectElement.innerHTML = '<option value="">-- Sélectionnez un candidat --</option>';
        
        candidates.forEach(candidate => {
            // Remplissage dynamique des cartes
            container.innerHTML += `
                <div class="card candidate-card">
                    <img src="${candidate.photo}" alt="${candidate.name}">
                    <h3>${candidate.name}</h3>
                    <p>${candidate.program}</p>
                </div>
            `;
            
            // Remplissage dynamique de la liste déroulante du formulaire
            const option = document.createElement('option');
            option.value = candidate.id;
            option.textContent = candidate.name;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur de chargement des candidats :", error);
    }
}

// Envoyer le vote au backend
async function handleVote(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('student-id').value.trim();
    const candidateId = document.getElementById('select-candidate').value;
    const msgContainer = document.getElementById('message-container');
    
    try {
        const response = await fetch(`${API_URL}?action=vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, candidateId })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            msgContainer.className = "message success";
            msgContainer.textContent = data.message;
            document.getElementById('vote-form').reset();
            loadResults(); // Actualise les statistiques instantanément
        } else {
            msgContainer.className = "message error";
            msgContainer.textContent = data.error;
        }
    } catch (error) {
        msgContainer.className = "message error";
        msgContainer.textContent = "Impossible de joindre le serveur de vote.";
    }
}

// Charger et afficher les scores globaux
async function loadResults() {
    try {
        const response = await fetch(`${API_URL}?action=results`);
        const results = await response.json();
        
        const container = document.getElementById('results-container');
        container.innerHTML = '';
        
        results.forEach(res => {
            container.innerHTML += `
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                    <strong>${res.name}</strong>
                    <span>${res.votes} vote(s)</span>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erreur de récupération des scores :", error);
    }
}