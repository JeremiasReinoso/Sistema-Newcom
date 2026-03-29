// ============================================================
// NEWCOM PRO - APPLICATION LOGIC
// ============================================================

// Global state
let appState = {
    teams: [],
    players: [],
    tournaments: [],
    matches: [],
    currentView: 'dashboard',
    subscriptions: []
};

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Newcom Pro initialized');
    
    // Update time display
    updateTime();
    setInterval(updateTime, 1000);
    
    // Load all data
    await loadAllData();
    
    // Setup real-time listeners
    setupListeners();
    
    // Update dashboard stats
    updateStats();
});

/**
 * Load all data from Firestore
 */
async function loadAllData() {
    try {
        appState.teams = await getDocuments('teams');
        appState.players = await getDocuments('players');
        appState.tournaments = await getDocuments('tournaments');
        appState.matches = await getDocuments('matches');
        
        renderAllViews();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

/**
 * Setup real-time listeners for all collections
 */
function setupListeners() {
    // Listen to teams
    appState.subscriptions.push(
        listenCollection('teams', (teams) => {
            appState.teams = teams;
            renderAllViews();
            updateStats();
        })
    );
    
    // Listen to players
    appState.subscriptions.push(
        listenCollection('players', (players) => {
            appState.players = players;
            renderAllViews();
            updateStats();
        })
    );
    
    // Listen to tournaments
    appState.subscriptions.push(
        listenCollection('tournaments', (tournaments) => {
            appState.tournaments = tournaments;
            renderAllViews();
        })
    );
    
    // Listen to matches
    appState.subscriptions.push(
        listenCollection('matches', (matches) => {
            appState.matches = matches;
            renderAllViews();
        })
    );
}

// ============================================================
// VIEW MANAGEMENT
// ============================================================

/**
 * Switch between views by tab
 */
function switchView(viewName) {
    appState.currentView = viewName;
    
    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Show selected view
    const viewEl = document.getElementById(viewName + 'View');
    if (viewEl) {
        viewEl.classList.remove('hidden');
    }
    
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target?.closest('.nav-tab')?.classList.add('active');
}

/**
 * Render all views
 */
function renderAllViews() {
    renderEquiposList();
    renderJugadoresList();
    renderTorneosList();
    renderPartidosList();
}

// ============================================================
// DASHBOARD
// ============================================================

/**
 * Update dashboard statistics
 */
function updateStats() {
    document.getElementById('statsTeams').textContent = appState.teams.length;
    document.getElementById('statsPlayers').textContent = appState.players.length;
    document.getElementById('statsTournaments').textContent = appState.tournaments.length;
    document.getElementById('statsMatches').textContent = appState.matches.length;
}

/**
 * Update time display in header
 */
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('timeDisplay').textContent = `${hours}:${minutes}`;
}

// ============================================================
// TEAMS
// ============================================================

/**
 * Create a new team
 */
async function createTeam(event) {
    event.preventDefault();
    const form = event.target;
    
    try {
        const data = {
            name: document.getElementById('teamName').value,
            category: document.getElementById('teamCategory').value
        };
        
        await createDocument('teams', data);
        form.reset();
        closeModal('teamModal');
    } catch (error) {
        console.error('Error creating team:', error);
        alert('Error al crear equipo');
    }
}

/**
 * Render teams list
 */
function renderEquiposList() {
    const container = document.getElementById('equiposList');
    if (!container) return;
    
    if (appState.teams.length === 0) {
        container.innerHTML = '<p class="text-slate-400 col-span-full text-center py-8">No hay equipos creados</p>';
        return;
    }
    
    container.innerHTML = appState.teams.map(team => `
        <div class="team-card group">
            <h3>${team.name}</h3>
            <p class="text-sm text-slate-400 mb-3">${team.category}</p>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors" 
                    onclick="deleteTeam('${team.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

/**
 * Delete a team
 */
async function deleteTeam(teamId) {
    if (confirm('¿Eliminar este equipo?')) {
        try {
            await deleteDocument('teams', teamId);
        } catch (error) {
            console.error('Error deleting team:', error);
            alert('Error al eliminar equipo');
        }
    }
}

// ============================================================
// PLAYERS
// ============================================================

/**
 * Create a new player
 */
async function createPlayer(event) {
    event.preventDefault();
    const form = event.target;
    
    try {
        const data = {
            name: document.getElementById('playerName').value,
            age: parseInt(document.getElementById('playerAge').value),
            shirtNumber: parseInt(document.getElementById('playerNumber').value),
            teamId: document.getElementById('playerTeam').value
        };
        
        if (!data.teamId) {
            alert('Selecciona un equipo');
            return;
        }
        
        await createDocument('players', data);
        form.reset();
        closeModal('playerModal');
    } catch (error) {
        console.error('Error creating player:', error);
        alert('Error al crear jugador');
    }
}

/**
 * Render players list grouped by team
 */
function renderJugadoresList() {
    const container = document.getElementById('jugadoresList');
    if (!container) return;
    
    if (appState.players.length === 0) {
        container.innerHTML = '<p class="text-slate-400 text-center py-8">No hay jugadores creados</p>';
        return;
    }
    
    const grouped = {};
    appState.players.forEach(player => {
        if (!grouped[player.teamId]) grouped[player.teamId] = [];
        grouped[player.teamId].push(player);
    });
    
    let html = '';
    Object.entries(grouped).forEach(([teamId, players]) => {
        const team = appState.teams.find(t => t.id === teamId);
        html += `
            <div class="border border-slate-700/50 rounded-lg p-4 mb-4">
                <h3 class="font-semibold text-blue-400 mb-3">${team?.name || 'Equipo desconocido'}</h3>
                <div class="space-y-2">
                    ${players.map(p => `
                        <div class="player-row">
                            <div>
                                <p class="name">Nº ${p.shirtNumber} - ${p.name}</p>
                                <p class="team">${p.age} años</p>
                            </div>
                            <button class="text-red-400 hover:text-red-300 transition-colors" 
                                onclick="deletePlayer('${p.id}')">✕</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Delete a player
 */
async function deletePlayer(playerId) {
    if (confirm('¿Eliminar este jugador?')) {
        try {
            await deleteDocument('players', playerId);
        } catch (error) {
            console.error('Error deleting player:', error);
        }
    }
}

/**
 * Populate team select in player modal
 */
function updatePlayerTeamSelect() {
    const select = document.getElementById('playerTeam');
    select.innerHTML = '<option value="">Seleccionar equipo</option>' +
        appState.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

// ============================================================
// TOURNAMENTS
// ============================================================

/**
 * Create a new tournament
 */
async function createTournament(event) {
    event.preventDefault();
    const form = event.target;
    
    try {
        const selectedTeams = Array.from(document.querySelectorAll('#tournamentTeamsList input:checked'))
            .map(el => el.value);
        
        if (selectedTeams.length < 2) {
            alert('Selecciona mínimo 2 equipos');
            return;
        }
        
        const data = {
            name: document.getElementById('tournamentName').value,
            type: document.getElementById('tournamentType').value,
            teams: selectedTeams,
            status: 'active'
        };
        
        const tournamentId = await createDocument('tournaments', data);
        
        // Generate matches
        if (data.type === 'roundRobin') {
            generateRoundRobinMatches(tournamentId, selectedTeams);
        }
        
        form.reset();
        closeModal('tournamentModal');
    } catch (error) {
        console.error('Error creating tournament:', error);
        alert('Error al crear torneo');
    }
}

/**
 * Generate round robin matches
 */
async function generateRoundRobinMatches(tournamentId, teamIds) {
    const matches = [];
    for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
            matches.push({
                tournamentId,
                teamAId: teamIds[i],
                teamBId: teamIds[j],
                setsA: 0,
                setsB: 0,
                pointsA: 0,
                pointsB: 0,
                status: 'pending'
            });
        }
    }
    
    for (const match of matches) {
        try {
            await createDocument('matches', match);
        } catch (error) {
            console.error('Error creating match:', error);
        }
    }
}

/**
 * Render tournaments list
 */
function renderTorneosList() {
    const container = document.getElementById('torneosList');
    if (!container) return;
    
    if (appState.tournaments.length === 0) {
        container.innerHTML = '<p class="text-slate-400 col-span-full text-center py-8">No hay torneos creados</p>';
        return;
    }
    
    container.innerHTML = appState.tournaments.map(tournament => {
        const matchCount = appState.matches.filter(m => m.tournamentId === tournament.id).length;
        return `
            <div class="tournament-card">
                <h3 class="text-lg font-semibold mb-2">${tournament.name}</h3>
                <p class="text-sm text-slate-400 mb-3">Tipo: ${tournament.type === 'roundRobin' ? 'Todos vs Todos' : 'Eliminación'}</p>
                <p class="text-sm text-slate-400 mb-4">Equipos: ${tournament.teams.length} | Partidos: ${matchCount}</p>
                <button class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors" 
                    onclick="deleteTournament('${tournament.id}')">Eliminar</button>
            </div>
        `;
    }).join('');
}

/**
 * Delete a tournament
 */
async function deleteTournament(tournamentId) {
    if (confirm('¿Eliminar este torneo y sus partidos?')) {
        try {
            // Delete all matches for this tournament
            const matches = appState.matches.filter(m => m.tournamentId === tournamentId);
            for (const match of matches) {
                await deleteDocument('matches', match.id);
            }
            
            // Delete tournament
            await deleteDocument('tournaments', tournamentId);
        } catch (error) {
            console.error('Error deleting tournament:', error);
        }
    }
}

/**
 * Populate tournament teams checkboxes
 */
function updateTournamentTeamsList() {
    const container = document.getElementById('tournamentTeamsList');
    container.innerHTML = appState.teams.map(team => `
        <label class="flex items-center gap-2 cursor-pointer hover:text-blue-400">
            <input type="checkbox" value="${team.id}" class="cursor-pointer" />
            <span>${team.name} (${team.category})</span>
        </label>
    `).join('');
}

// ============================================================
// MATCHES & RESULTS
// ============================================================

/**
 * Save match result
 */
async function saveMatchResult(event) {
    event.preventDefault();
    
    try {
        const matchId = document.getElementById('matchModal').dataset.matchId;
        
        const data = {
            setsA: parseInt(document.getElementById('setsA').value),
            setsB: parseInt(document.getElementById('setsB').value),
            pointsA: parseInt(document.getElementById('pointsA').value),
            pointsB: parseInt(document.getElementById('pointsB').value),
            status: 'played'
        };
        
        await updateDocument('matches', matchId, data);
        closeModal('matchModal');
    } catch (error) {
        console.error('Error saving match result:', error);
        alert('Error al guardar resultado');
    }
}

/**
 * Render matches list
 */
function renderPartidosList() {
    const container = document.getElementById('partidosList');
    if (!container) return;
    
    if (appState.matches.length === 0) {
        container.innerHTML = '<p class="text-slate-400 text-center py-8">No hay partidos</p>';
        return;
    }
    
    container.innerHTML = appState.matches.map(match => {
        const teamA = appState.teams.find(t => t.id === match.teamAId);
        const teamB = appState.teams.find(t => t.id === match.teamBId);
        
        return `
            <div class="match-card">
                <div class="flex items-center justify-between mb-3">
                    <span class="font-semibold">${teamA?.name || 'Equipo A'}</span>
                    <span class="text-lg font-bold">${match.setsA} - ${match.setsB}</span>
                    <span class="font-semibold">${teamB?.name || 'Equipo B'}</span>
                </div>
                <div class="flex gap-2">
                    <span class="badge ${match.status === 'played' ? 'badge-success' : 'badge-pending'}">
                        ${match.status === 'played' ? 'Jugado' : 'Pendiente'}
                    </span>
                    <button class="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors" 
                        onclick="openMatchResultModal('${match.id}')">Resultado</button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Open match result modal
 */
function openMatchResultModal(matchId) {
    const match = appState.matches.find(m => m.id === matchId);
    if (!match) return;
    
    const teamA = appState.teams.find(t => t.id === match.teamAId);
    const teamB = appState.teams.find(t => t.id === match.teamBId);
    
    document.getElementById('matchTeamA').textContent = teamA?.name || 'Equipo A';
    document.getElementById('matchTeamB').textContent = teamB?.name || 'Equipo B';
    
    document.getElementById('setsA').value = match.setsA;
    document.getElementById('setsB').value = match.setsB;
    document.getElementById('pointsA').value = match.pointsA;
    document.getElementById('pointsB').value = match.pointsB;
    
    document.getElementById('matchModalOverlay').dataset.matchId = matchId;
    openModal('matchModal');
}

// ============================================================
// STANDINGS
// ============================================================

/**
 * Calculate and render standings (placeholder - needs implementation)
 */
function renderTabla() {
    const container = document.getElementById('tablaContent');
    if (!container) return;
    
    container.innerHTML = '<p class="text-slate-400">Tabla de posiciones</p>';
}

// ============================================================
// MODAL MANAGEMENT
// ============================================================

/**
 * Open a modal
 */
function openModal(modalId) {
    const overlay = document.getElementById(modalId + 'Overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        
        // Update selects when opening
        if (modalId === 'playerModal') {
            updatePlayerTeamSelect();
        } else if (modalId === 'tournamentModal') {
            updateTournamentTeamsList();
        }
    }
}

/**
 * Close a modal
 */
function closeModal(modalId) {
    const overlay = document.getElementById(modalId + 'Overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

/**
 * Close modal when clicking outside
 */
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.add('hidden');
    }
});

// ============================================================
// UTILITIES
// ============================================================

/**
 * Format date for display
 */
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date.seconds * 1000);
    return d.toLocaleDateString('es-ES');
}

/**
 * Get team name by ID
 */
function getTeamName(teamId) {
    return appState.teams.find(t => t.id === teamId)?.name || 'Desconocido';
}
