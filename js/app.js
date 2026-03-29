// ============================================
// NEWCOM PRO - APLICACIÓN PRINCIPAL
// ============================================

// Estado global
let currentUser = null;
let currentTournament = null;
let currentView = 'equipos';
let listeners = [];

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Observar cambios de autenticación
    auth.onAuthStateChanged(async (user) => {
        currentUser = user;

        if (user) {
            // Usuario logueado
            document.getElementById('loginView').classList.add('hidden');
            document.getElementById('userDisplay').textContent = user.email;
            currentView === 'equipos' && loadTeams();
        } else {
            // Usuario no logueado
            currentView = 'login';
            showAllViews();
            document.getElementById('loginView').classList.remove('hidden');
            hideAllContentViews();
        }
    });

    // Limpiar listeners al cerrar
    window.addEventListener('beforeunload', () => {
        listeners.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') unsubscribe();
        });
    });
});

// ============================================
// AUTENTICACIÓN
// ============================================

async function login(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        clearAuthForm();
    } catch (error) {
        showAuthError(error.message);
    }
}

async function register(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const name = document.getElementById('nameInput').value;

    if (!name || !email || !password) {
        showAuthError('Por favor completa todos los campos');
        return;
    }

    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        
        // Actualizar perfil con nombre
        await result.user.updateProfile({
            displayName: name
        });

        clearAuthForm();
    } catch (error) {
        showAuthError(error.message);
    }
}

async function logout() {
    try {
        await auth.signOut();
        listeners.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') unsubscribe();
        });
        listeners = [];
        currentUser = null;
        clearAuthForm();
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

function showAuthError(message) {
    const errorDiv = document.getElementById('authError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function clearAuthForm() {
    document.getElementById('emailInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('nameInput').value = '';
    document.getElementById('authError').style.display = 'none';
    document.getElementById('registerMode').style.display = 'none';
}

function toggleAuthMode() {
    const registerMode = document.getElementById('registerMode');
    registerMode.style.display = registerMode.style.display === 'none' ? 'block' : 'none';
}

// ============================================
// NAVEGACIÓN Y VISTAS
// ============================================

function switchView(viewName) {
    currentView = viewName;

    // Actualizar botones navbar
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    // Ocultar todas las vistas
    hideAllContentViews();

    // Mostrar vista seleccionada
    const viewId = `${viewName}View`;
    const viewElement = document.getElementById(viewId);
    if (viewElement) {
        viewElement.classList.remove('hidden');

        // Cargar datos según la vista
        switch (viewName) {
            case 'equipos':
                loadTeams();
                break;
            case 'jugadores':
                loadPlayers();
                break;
            case 'torneos':
                loadTournaments();
                break;
            case 'partidos':
                loadMatches();
                break;
        }
    }
}

function hideAllContentViews() {
    ['equiposView', 'jugadoresView', 'torneosView', 'partidosView'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
}

function showAllViews() {
    ['equiposView', 'jugadoresView', 'torneosView', 'partidosView'].forEach(id => {
        document.getElementById(id).classList.remove('hidden');
    });
}

// ============================================
// MODALES
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');

    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    overlay.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');

    modal.classList.add('hidden');

    // Verificar si hay otros modales abiertos
    if (!document.querySelector('.modal:not(.hidden)')) {
        overlay.classList.add('hidden');
        overlay.style.display = 'none';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
    document.getElementById('modalOverlay').classList.add('hidden');
    document.getElementById('modalOverlay').style.display = 'none';
}

// Cerrar modal al hacer clic en el overlay
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('modalOverlay');
    if (e.target === overlay) {
        closeAllModals();
    }
});

// ============================================
// MÓDULO DE EQUIPOS
// ============================================

async function createTeam(event) {
    event.preventDefault();

    const name = document.getElementById('teamName').value;
    const category = document.getElementById('teamCategory').value;

    if (!name || !category) {
        alert('Por favor completa todos los campos');
        return;
    }

    try {
        await createDocument('teams', {
            name,
            category
        });

        // Limpiar formulario y cerrar modal
        event.target.reset();
        closeModal('teamModal');

        // Recargar equipos
        loadTeams();
    } catch (error) {
        alert('Error al crear equipo: ' + error.message);
    }
}

async function loadTeams() {
    try {
        const teams = await getDocuments('teams');
        const teamsList = document.getElementById('teamsList');

        if (teams.length === 0) {
            teamsList.innerHTML = `
                <div class="col-span-full text-center py-12 text-gray-400">
                    <p class="text-lg">No hay equipos aún</p>
                    <p class="text-sm mt-2">Crea uno para comenzar</p>
                </div>
            `;
            return;
        }

        teamsList.innerHTML = teams.map(team => `
            <div class="card">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-semibold text-white">${escapeHtml(team.name)}</h3>
                        <p class="text-gray-400 text-sm mt-1">
                            <span class="badge badge-category">${team.category}</span>
                        </p>
                    </div>
                    <button onclick="deleteTeam('${team.id}')" class="text-red-400 hover:text-red-300 transition-colors">
                        🗑️
                    </button>
                </div>
                <div class="text-gray-500 text-xs">
                    Creado: ${formatDate(team.createdAt)}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar equipos:', error);
    }
}

async function deleteTeam(teamId) {
    if (confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
        try {
            await deleteDocument('teams', teamId);
            loadTeams();
        } catch (error) {
            alert('Error al eliminar equipo: ' + error.message);
        }
    }
}

// ============================================
// MÓDULO DE JUGADORES
// ============================================

async function createPlayer(event) {
    event.preventDefault();

    const name = document.getElementById('playerName').value;
    const age = parseInt(document.getElementById('playerAge').value);
    const shirtNumber = parseInt(document.getElementById('playerNumber').value);
    const teamId = document.getElementById('playerTeam').value;

    if (!name || !age || !shirtNumber || !teamId) {
        alert('Por favor completa todos los campos');
        return;
    }

    try {
        await createDocument('players', {
            name,
            age,
            shirtNumber,
            teamId
        });

        event.target.reset();
        closeModal('playerModal');
        loadPlayers();
    } catch (error) {
        alert('Error al crear jugador: ' + error.message);
    }
}

async function loadPlayers() {
    try {
        // Cargar equipos para el select
        const teams = await getDocuments('teams');
        const teamSelect = document.getElementById('playerTeam');

        teamSelect.innerHTML = `<option value="">Seleccionar equipo</option>` + 
            teams.map(team => `<option value="${team.id}">${escapeHtml(team.name)}</option>`).join('');

        // Cargar jugadores
        const players = await getDocuments('players');

        if (players.length === 0) {
            document.getElementById('playersList').innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <p class="text-lg">No hay jugadores aún</p>
                </div>
            `;
            return;
        }

        // Agrupar por equipo
        const playersByTeam = {};
        for (const player of players) {
            const team = await getDocument('teams', player.teamId);
            const teamName = team ? team.name : 'Equipo desconocido';

            if (!playersByTeam[teamName]) {
                playersByTeam[teamName] = [];
            }
            playersByTeam[teamName].push(player);
        }

        let html = '';
        for (const [teamName, teamPlayers] of Object.entries(playersByTeam)) {
            html += `
                <div class="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
                    <h3 class="text-lg font-semibold mb-4 text-blue-400">${escapeHtml(teamName)}</h3>
                    <div class="space-y-2">
                        ${teamPlayers.map(player => `
                            <div class="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                                <div>
                                    <p class="font-semibold text-white">
                                        #${player.shirtNumber} - ${escapeHtml(player.name)}
                                    </p>
                                    <p class="text-gray-400 text-sm">${player.age} años</p>
                                </div>
                                <button onclick="deletePlayer('${player.id}')" class="text-red-400 hover:text-red-300">
                                    🗑️
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        document.getElementById('playersList').innerHTML = html;
    } catch (error) {
        console.error('Error al cargar jugadores:', error);
    }
}

async function deletePlayer(playerId) {
    if (confirm('¿Estás seguro?')) {
        try {
            await deleteDocument('players', playerId);
            loadPlayers();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// ============================================
// MÓDULO DE TORNEOS
// ============================================

async function createTournament(event) {
    event.preventDefault();

    const name = document.getElementById('tournamentName').value;
    const type = document.getElementById('tournamentType').value;
    const teamsCheckboxes = document.querySelectorAll('#tournamentTeams input:checked');
    const selectedTeams = Array.from(teamsCheckboxes).map(cb => cb.value);

    if (!name || !type || selectedTeams.length === 0) {
        alert('Por favor completa todos los campos y selecciona al menos 2 equipos');
        return;
    }

    try {
        const tournamentId = await createDocument('tournaments', {
            name,
            type,
            teams: selectedTeams,
            status: 'draft'
        });

        // Generar fixture automáticamente
        if (type === 'roundRobin') {
            await generateRoundRobinFixture(tournamentId, selectedTeams);
        }

        event.target.reset();
        closeModal('tournamentModal');
        document.getElementById('tournamentTeams').innerHTML = '';
        loadTournaments();
        alert('Torneo creado exitosamente!');
    } catch (error) {
        alert('Error al crear torneo: ' + error.message);
    }
}

async function loadTournaments() {
    try {
        const teams = await getDocuments('teams');

        // Cargar select de equipos
        const teamsContainer = document.getElementById('tournamentTeams');
        teamsContainer.innerHTML = teams.map(team => `
            <label class="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer">
                <input type="checkbox" value="${team.id}" class="w-4 h-4 rounded cursor-pointer">
                <span class="text-gray-300">${escapeHtml(team.name)} <span class="text-gray-500">(${team.category})</span></span>
            </label>
        `).join('');

        // Cargar torneos
        const tournaments = await getDocuments('tournaments');

        if (tournaments.length === 0) {
            document.getElementById('tournamentsList').innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <p class="text-lg">No hay torneos aún</p>
                </div>
            `;
            return;
        }

        let html = '';
        for (const tournament of tournaments) {
            const tournamentTeams = await Promise.all(
                tournament.teams.map(teamId => getDocument('teams', teamId))
            );

            const teamsNames = tournamentTeams.map(t => t ? t.name : 'Desconocido').join(', ');

            html += `
                <div class="bg-gray-900 rounded-xl border border-gray-800 p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-2xl font-semibold text-white">${escapeHtml(tournament.name)}</h3>
                            <p class="text-gray-400 text-sm mt-2">
                                Tipo: <span class="text-blue-400 font-semibold">
                                    ${tournament.type === 'roundRobin' ? 'Todos contra todos' : 'Eliminación directa'}
                                </span>
                            </p>
                            <p class="text-gray-400 text-sm mt-1">
                                Equipos: <span class="text-cyan-400">${tournament.teams.length}</span>
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="setCurrentTournament('${tournament.id}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                Ver Partidos
                            </button>
                            <button onclick="deleteTournament('${tournament.id}')" class="text-red-400 hover:text-red-300">
                                🗑️
                            </button>
                        </div>
                    </div>
                    <div class="text-gray-500 text-sm">
                        <p>Equipos: ${teamsNames}</p>
                    </div>
                </div>
            `;
        }

        document.getElementById('tournamentsList').innerHTML = html;
    } catch (error) {
        console.error('Error al cargar torneos:', error);
    }
}

async function deleteTournament(tournamentId) {
    if (confirm('¿Estás seguro? Se eliminarán todos los partidos asociados.')) {
        try {
            // Eliminar partidos del torneo
            const matches = await queryDocuments('matches', 'tournamentId', '==', tournamentId);
            for (const match of matches) {
                await deleteDocument('matches', match.id);
            }

            // Eliminar torneo
            await deleteDocument('tournaments', tournamentId);
            loadTournaments();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// ============================================
// GENERADOR DE FIXTURE - ALGORITMO ROUND ROBIN
// ============================================

async function generateRoundRobinFixture(tournamentId, teamIds) {
    try {
        const matches = generateRoundRobinMatches(teamIds);

        // Guardar partidos en Firestore
        for (const match of matches) {
            await createDocument('matches', {
                tournamentId,
                teamAId: match[0],
                teamBId: match[1],
                setsA: 0,
                setsB: 0,
                pointsA: 0,
                pointsB: 0,
                status: 'pending'
            });
        }

        console.log(`✓ ${matches.length} partidos generados para el torneo`);
    } catch (error) {
        console.error('Error al generar fixture:', error);
        throw error;
    }
}

/**
 * Algoritmo Round Robin - Genera todos los enfrentamientos posibles
 * Cada equipo juega contra cada otro equipo exactamente una vez
 */
function generateRoundRobinMatches(teamIds) {
    const matches = [];

    for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
            matches.push([teamIds[i], teamIds[j]]);
        }
    }

    return matches;
}

// ============================================
// MÓDULO DE PARTIDOS Y TABLA DE POSICIONES
// ============================================

function setCurrentTournament(tournamentId) {
    currentTournament = tournamentId;
    switchView('partidos');
}

async function loadMatches() {
    try {
        const tournaments = await getDocuments('tournaments');

        if (!currentTournament && tournaments.length > 0) {
            currentTournament = tournaments[0].id;
        }

        if (!currentTournament || tournaments.length === 0) {
            document.getElementById('matchesList').innerHTML = `
                <p class="text-gray-500">No hay torneos disponibles</p>
            `;
            document.getElementById('standingsContainer').innerHTML = `
                <p class="text-gray-500 text-center py-8">Crea un torneo para ver partidos</p>
            `;
            return;
        }

        // Selector de torneo
        const tournamentSelect = tournaments.map(t => `
            <option value="${t.id}" ${t.id === currentTournament ? 'selected' : ''}>
                ${escapeHtml(t.name)}
            </option>
        `).join('');

        let matchesHtml = `
            <div class="mb-6">
                <label class="block text-gray-300 text-sm font-medium mb-2">Seleccionar Torneo</label>
                <select onchange="currentTournament = this.value; loadMatches()" class="input-field w-full">
                    ${tournamentSelect}
                </select>
            </div>
        `;

        // Obtener partidos del torneo
        const matches = await queryDocuments('matches', 'tournamentId', '==', currentTournament);

        if (matches.length === 0) {
            matchesHtml += `<p class="text-gray-500">No hay partidos en este torneo</p>`;
        } else {
            // Agrupar partidos por estado
            const pending = matches.filter(m => m.status === 'pending');
            const played = matches.filter(m => m.status === 'played');

            // Mostrar partidos pendientes
            if (pending.length > 0) {
                matchesHtml += `<h4 class="text-lg font-semibold text-yellow-400 mb-4">⏳ Pendientes (${pending.length})</h4>`;
                for (const match of pending) {
                    const teamA = await getDocument('teams', match.teamAId);
                    const teamB = await getDocument('teams', match.teamBId);

                    matchesHtml += `
                        <div class="bg-gray-800 rounded-lg p-4 mb-3 border-l-4 border-yellow-500">
                            <div class="flex justify-between items-center">
                                <div class="flex-1">
                                    <p class="font-semibold text-white">${escapeHtml(teamA?.name || 'Equipo?')} vs ${escapeHtml(teamB?.name || 'Equipo?')}</p>
                                    <p class="text-gray-400 text-sm">Pendiente</p>
                                </div>
                                <button onclick="openMatchModal('${match.id}')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                    Cargar Resultado
                                </button>
                            </div>
                        </div>
                    `;
                }
            }

            // Mostrar partidos jugados
            if (played.length > 0) {
                matchesHtml += `<h4 class="text-lg font-semibold text-green-400 mb-4 mt-6">✓ Jugados (${played.length})</h4>`;
                for (const match of played) {
                    const teamA = await getDocument('teams', match.teamAId);
                    const teamB = await getDocument('teams', match.teamBId);

                    const isWinner = (match.setsA > match.setsB);
                    const teamAWins = match.setsA > match.setsB ? 'text-green-400' : 'text-gray-300';
                    const teamBWins = match.setsB > match.setsA ? 'text-green-400' : 'text-gray-300';

                    matchesHtml += `
                        <div class="bg-gray-800 rounded-lg p-4 mb-3 border-l-4 border-green-500">
                            <div class="flex justify-between items-center">
                                <div class="flex-1">
                                    <p class="font-semibold text-white mb-1">
                                        <span class="${teamAWins}">${escapeHtml(teamA?.name || 'Equipo?')}</span> 
                                        vs 
                                        <span class="${teamBWins}">${escapeHtml(teamB?.name || 'Equipo?')}</span>
                                    </p>
                                    <p class="text-cyan-400 font-bold text-lg">
                                        ${match.setsA} sets, ${match.pointsA} pts. vs ${match.setsB} sets, ${match.pointsB} pts.
                                    </p>
                                </div>
                                <button onclick="openMatchModal('${match.id}')" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                                    Editar
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        }

        document.getElementById('matchesList').innerHTML = matchesHtml;

        // Cargar tabla de posiciones
        await loadStandings();
    } catch (error) {
        console.error('Error al cargar partidos:', error);
    }
}

async function openMatchModal(matchId) {
    const match = await getDocument('matches', matchId);
    const teamA = await getDocument('teams', match.teamAId);
    const teamB = await getDocument('teams', match.teamBId);

    const html = `
        <div class="fixed inset-0 flex items-center justify-center z-50">
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <h3 class="text-2xl font-bold mb-6">
                    ${escapeHtml(teamA.name)} vs ${escapeHtml(teamB.name)}
                </h3>

                <form onsubmit="saveMatchResult(event, '${matchId}')" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-gray-300 text-sm font-medium mb-2">${escapeHtml(teamA.name)}</label>
                            <div class="space-y-2">
                                <div>
                                    <input type="number" id="setsA" min="0" max="3" value="${match.setsA}" class="input-field" placeholder="Sets">
                                </div>
                                <div>
                                    <input type="number" id="pointsA" min="0" value="${match.pointsA}" class="input-field" placeholder="Puntos">
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-300 text-sm font-medium mb-2">${escapeHtml(teamB.name)}</label>
                            <div class="space-y-2">
                                <div>
                                    <input type="number" id="setsB" min="0" max="3" value="${match.setsB}" class="input-field" placeholder="Sets">
                                </div>
                                <div>
                                    <input type="number" id="pointsB" min="0" value="${match.pointsB}" class="input-field" placeholder="Puntos">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button type="submit" class="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all">
                            Guardar
                        </button>
                        <button type="button" onclick="closeMatchModal()" class="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all">
                            Cerrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const matchModal = document.createElement('div');
    matchModal.id = 'matchModalTemp';
    matchModal.innerHTML = html;
    document.body.appendChild(matchModal);
}

function closeMatchModal() {
    const modal = document.getElementById('matchModalTemp');
    if (modal) modal.remove();
}

async function saveMatchResult(event, matchId) {
    event.preventDefault();

    const setsA = parseInt(document.getElementById('setsA').value) || 0;
    const setsB = parseInt(document.getElementById('setsB').value) || 0;
    const pointsA = parseInt(document.getElementById('pointsA').value) || 0;
    const pointsB = parseInt(document.getElementById('pointsB').value) || 0;

    try {
        await updateDocument('matches', matchId, {
            setsA,
            setsB,
            pointsA,
            pointsB,
            status: 'played'
        });

        closeMatchModal();
        loadMatches();
    } catch (error) {
        alert('Error al guardar resultado: ' + error.message);
    }
}

// ============================================
// TABLA DE POSICIONES
// ============================================

async function loadStandings() {
    try {
        if (!currentTournament) {
            document.getElementById('standingsContainer').innerHTML = `
                <p class="text-gray-500 text-center">Selecciona un torneo</p>
            `;
            return;
        }

        const tournament = await getDocument('tournaments', currentTournament);
        const matches = await queryDocuments('matches', 'tournamentId', '==', currentTournament);
        const playedMatches = matches.filter(m => m.status === 'played');

        // Inicializar estadísticas
        const standings = {};

        for (const teamId of tournament.teams) {
            standings[teamId] = {
                played: 0,
                wins: 0,
                losses: 0,
                setsFor: 0,
                setsAgainst: 0,
                pointsFor: 0,
                pointsAgainst: 0,
                points: 0
            };
        }

        // Calcular estadísticas
        for (const match of playedMatches) {
            standings[match.teamAId].played++;
            standings[match.teamBId].played++;

            standings[match.teamAId].setsFor += match.setsA;
            standings[match.teamAId].setsAgainst += match.setsB;
            standings[match.teamBId].setsFor += match.setsB;
            standings[match.teamBId].setsAgainst += match.setsA;

            standings[match.teamAId].pointsFor += match.pointsA;
            standings[match.teamAId].pointsAgainst += match.pointsB;
            standings[match.teamBId].pointsFor += match.pointsB;
            standings[match.teamBId].pointsAgainst += match.pointsA;

            if (match.setsA > match.setsB) {
                standings[match.teamAId].wins++;
                standings[match.teamAId].points += 3;
                standings[match.teamBId].losses++;
            } else {
                standings[match.teamBId].wins++;
                standings[match.teamBId].points += 3;
                standings[match.teamAId].losses++;
            }
        }

        // Ordenar por puntos y luego por diferencia de sets
        const sortedTeams = tournament.teams.sort((a, b) => {
            if (standings[b].points !== standings[a].points) {
                return standings[b].points - standings[a].points;
            }
            const diffA = standings[a].setsFor - standings[a].setsAgainst;
            const diffB = standings[b].setsFor - standings[b].setsAgainst;
            return diffB - diffA;
        });

        // Construir HTML
        let html = '<div class="space-y-2">';

        for (let i = 0; i < sortedTeams.length; i++) {
            const teamId = sortedTeams[i];
            const team = await getDocument('teams', teamId);
            const stats = standings[teamId];

            const medalEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;

            html += `
                <div class="bg-gray-800 rounded-lg p-3 text-sm">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2 flex-1">
                            <span class="font-bold text-lg w-8">${medalEmoji}</span>
                            <span class="font-semibold text-white flex-1">${escapeHtml(team.name)}</span>
                        </div>
                        <div class="text-right">
                            <div class="font-bold text-blue-400">${stats.points} pts</div>
                            <div class="text-gray-400 text-xs">${stats.played}J ${stats.wins}G</div>
                        </div>
                    </div>
                    <div class="text-gray-500 text-xs mt-2">
                        Sets: ${stats.setsFor} - ${stats.setsAgainst} | Pts: ${stats.pointsFor} - ${stats.pointsAgainst}
                    </div>
                </div>
            `;
        }

        html += '</div>';
        document.getElementById('standingsContainer').innerHTML = html;
    } catch (error) {
        console.error('Error al cargar tabla de posiciones:', error);
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Escapa caracteres HTML para evitar inyección
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Formatea fecha para mostrar
 */
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada no manejada:', event.reason);
});
