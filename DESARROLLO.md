# 👨‍💻 Documentación Técnica - Newcom Pro

Guía completa para desarrolladores que quieran entender, modificar o extender Newcom Pro.

## 📋 Estructura del Código

```
Sistema-Newcom/
├── index.html              # Estructura HTML (SPA)
├── css/styles.css          # Estilos (Tailwind + custom)
├── js/
│   ├── firebase.js         # Configuración y funciones Firebase
│   └── app.js              # Lógica de aplicación
└── docs/
    ├── README.md           # Guía general
    ├── CONFIGURACIÓN_FIREBASE.md
    ├── GUÍA_RÁPIDA.md
    └── DESARROLLO.md       # Este archivo

```

## 🏗️ Arquitectura

Newcom Pro sigue un patrón **SPA (Single Page Application) modular**:

```
┌─────────────────────────────────────────┐
│         index.html (UI Shell)           │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────────┐    │
│  │  app.js (Lógica de Vistas)     │    │
│  ├────────────────────────────────┤    │
│  │ • switchView()                 │    │
│  │ • loadTeams/Players/etc        │    │
│  │ • createTeam/Player/etc        │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  firebase.js (Data Layer)      │    │
│  ├────────────────────────────────┤    │
│  │ • createDocument()             │    │
│  │ • getDocuments()               │    │
│  │ • updateDocument()             │    │
│  │ • listenCollection()           │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  Firestore (Database)          │    │
│  └────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔧 Funciones Principales

### firebase.js

#### `createDocument(collection, data)`
Crea un documento en Firestore con timestamp y userId automáticos.

```javascript
// Ejemplo
const teamId = await createDocument('teams', {
    name: 'Club Atlético Central',
    category: '+40'
});
```

#### `getDocuments(collection, whereClause)`
Obtiene todos los documentos de una colección del usuario.

```javascript
const teams = await getDocuments('teams');
// Con filtro
const teamsByCategory = await getDocuments('teams', {
    field: 'category',
    operator: '==',
    value: '+40'
});
```

#### `getDocument(collection, docId)`
Obtiene un documento específico por ID.

```javascript
const team = await getDocument('teams', 'team-id-123');
```

#### `updateDocument(collection, docId, data)`
Actualiza campos específicos de un documento.

```javascript
await updateDocument('matches', 'match-id-123', {
    setsA: 2,
    setsB: 1,
    status: 'played'
});
```

#### `deleteDocument(collection, docId)`
Elimina un documento.

```javascript
await deleteDocument('teams', 'team-id-123');
```

#### `listenCollection(collection, callback)`
Escucha cambios en tiempo real (listener).

```javascript
const unsubscribe = listenCollection('teams', (teams) => {
    console.log('Equipos actualizados:', teams);
});

// Para dejar de escuchar:
unsubscribe();
```

#### `queryDocuments(collection, field, operator, value)`
Búsqueda avanzada con filtros.

```javascript
const matches = await queryDocuments('matches', 'tournamentId', '==', 'tournament-123');
```

---

### app.js

#### Sistema de Autenticación

```javascript
// Login
await auth.signInWithEmailAndPassword(email, password);

// Registro
await auth.createUserWithEmailAndPassword(email, password);

// Logout
await auth.signOut();
```

#### Sistema de Navegación (SPA)

```javascript
function switchView(viewName) {
    // Cambia entre:
    // - 'equipos'
    // - 'jugadores'
    // - 'torneos'
    // - 'partidos'
}
```

#### Gestión de Modales

```javascript
openModal('teamModal');      // Abre un modal
closeModal('teamModal');     // Cierra un modal
closeAllModals();            // Cierra todos
```

#### Creación de Entidades

```javascript
// Equipos
await createTeam(event);

// Jugadores
await createPlayer(event);

// Torneos
await createTournament(event);
```

#### Generador de Fixture

```javascript
/**
 * Algoritmo Round Robin
 * Genera todos los enfrentamientos posibles
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
```

#### Tabla de Posiciones

```javascript
async function loadStandings() {
    // Calcula automáticamente:
    // - Partidos jugados
    // - Ganancias/Pérdidas
    // - Sets a favor/en contra
    // - Puntos a favor/en contra
    // - Puntos en tabla (3 por victoria)
    // - Ordenamiento por puntos y diferencia de sets
}
```

---

## 📊 Modelo de Datos

### Colecciones Firestore

#### teams
```javascript
{
    id: "auto-generated",
    name: "Club Atlético Central",
    category: "+40" | "+50" | "+60" | "+68",
    userId: "firebase-auth-uid",
    createdAt: Timestamp
}
```

#### players
```javascript
{
    id: "auto-generated",
    name: "Juan Pérez",
    age: 45,
    shirtNumber: 10,
    teamId: "reference-to-teams",
    userId: "firebase-auth-uid",
    createdAt: Timestamp
}
```

#### tournaments
```javascript
{
    id: "auto-generated",
    name: "Torneo Senior 2024",
    type: "roundRobin" | "elimination",
    teams: ["team-id-1", "team-id-2"],
    status: "draft" | "active" | "finished",
    userId: "firebase-auth-uid",
    createdAt: Timestamp
}
```

#### matches
```javascript
{
    id: "auto-generated",
    tournamentId: "reference-to-tournaments",
    teamAId: "reference-to-teams",
    teamBId: "reference-to-teams",
    setsA: 2,
    setsB: 1,
    pointsA: 25,
    pointsB: 23,
    status: "pending" | "played",
    userId: "firebase-auth-uid",
    createdAt: Timestamp
}
```

---

## 🎨 CSS y Estilos

### Clases Personalizadas

```css
/* Inputs */
.input-field

/* Botones */
.btn, .btn-primary, .btn-danger, .btn-success

/* Navegación */
.nav-btn, .nav-btn.active

/* Modales */
.modal, .modal-content

/* Tarjetas */
.card

/* Badges de estado */
.badge, .badge-success, .badge-pending, .badge-played, .badge-category

/* Animaciones */
@keyframes fadeIn, slideUp, slideIn, pulse, spin
```

### Tailwind CSS Utilities Usados

- Colores: `text-gray-X`, `bg-gray-X`, `border-gray-X`
- Spacing: `p-X`, `m-X`, `gap-X`
- Flexbox: `flex`, `justify-between`, `items-center`
- Grid: `grid`, `grid-cols-X`
- Responsive: `md:`, `lg:`

---

## 🔄 Flujo de Datos

### Crear un Equipo

```
Usuario clicks "Nuevo Equipo"
                    ↓
        openModal('teamModal')
                    ↓
    Usuario rellena formulario
                    ↓
           createTeam(event)
                    ↓
    await createDocument('teams', {...})
                    ↓
        Firestore guarda documento
                    ↓
        closeModal('teamModal')
                    ↓
            loadTeams()
    (Obtiene todos los equipos)
                    ↓
    Renderiza en DOM
```

### Crear Torneo y Partidos

```
Usuario clicks "Nuevo Torneo"
                    ↓
    Usuario selecciona equipos
                    ↓
    createTournament(event)
                    ↓
    await createDocument('tournaments', {...})
                    ↓
    await generateRoundRobinFixture()
                    ↓
    Loop: crear cada partido en Firestore
                    ↓
    Actualizar UI
                    ↓
    alert("Torneo creado exitosamente!")
```

---

## 🚀 Extensiones Comunes

### Agregar Nueva Funcionalidad: Estadísticas per Jugador

```javascript
// En app.js
async function loadPlayerStats() {
    const players = await getDocuments('players');
    const matches = await getDocuments('matches');
    
    const stats = {};
    
    // Calcular estadísticas por jugador
    matches.forEach(match => {
        // Lógica para asignar puntos a jugadores
    });
    
    return stats;
}
```

### Agregar Excel Export

```javascript
// Necesitaría library como SheetJS
// npm install xlsx

function exportTournamentToExcel(tournamentId) {
    // Exportar tabla de posiciones a Excel
    const XLSX = window.XLSX;
    // ...implementación
}
```

### Agregar PDF Report

```javascript
// Ya incluye jsPDF en requisitos
function generateFixturePDF(tournamentId) {
    const doc = new jsPDF();
    doc.text('Fixture del Torneo', 10, 10);
    // ...más contenido
    doc.save('fixture.pdf');
}
```

---

## 🧪 Testing

### Checklist de Testing Manual

- [ ] Crear cuenta nueva
- [ ] Crear equipo
- [ ] Crear jugador (verificar que se vincula al equipo)
- [ ] Crear torneo con 3+ equipos
- [ ] Verificar que se generan partidos automáticamente
- [ ] Cargar resultados de algunos partidos
- [ ] Verificar que tabla de posiciones se actualiza
- [ ] Editar resultado de un partido
- [ ] Eliminar un equipo (verificar que falla si tiene jugadores)
- [ ] Logout y login con otra cuenta (verificar aislamiento de datos)

---

## 🔒 Seguridad

### Reglas de Firestore Actuales
```firestore
allow read, write: if request.auth != null &&
                       request.auth.uid == resource.data.userId;
```

Esto garantiza que cada usuario solo vea sus propios datos.

### Mejoras Futuras
- Rate limiting en authentication
- Validación de datos más estricta
- Encryption end-to-end
- Logs de auditoría

---

## 🐛 Debugging

### Console Logs Útiles

```javascript
// En browser console (F12)

// Ver usuario actual
console.log(auth.currentUser);

// Ver todos los observadores
console.log(listeners);

// Ver estado global
console.log({currentUser, currentTournament, currentView});
```

### Common Errors

| Error | Causa | Solución |
|-------|-------|----------|
| `firebaseConfig is not defined` | Firebase no configurado | Verificar `firebase.js` |
| `User not authenticated` | No logueado | Verificar login |
| `Missing required fields` | Formulario incompleto | Validar inputs |
| `Permission denied` | Reglas Firestore restrictivas | Revisar reglas |

---

## 📈 Performance

### Optimizaciones Implementadas
- Listeners solo en vistas activas
- Re-renderización solo cuando necesario
- Queries filtradas por userId
- Desubscripción de listeners al cambiar vista

### Posibles Mejoras
- Paginación de datos grandes
- Caching local
- Service Workers para offline
- Compresión de datos

---

## 🔗 Dependencias Externas

- **Firebase SDK v10.7.0**: Authentication & Firestore
- **Tailwind CSS**: Framework CSS (via CDN)
- **JavaScript Vanilla**: Sin frameworks pesados

No necesita npm ni build process. Todo funciona con CDN.

---

## 📚 Referencias

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [JavaScript MDN Docs](https://developer.mozilla.org/es/docs/Web/JavaScript)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🤝 Contribuciones

Para contribuir:
1. Haz fork del repositorio
2. Crea una rama (`git checkout -b feature/feature-name`)
3. Commit cambios (`git commit -am 'Add feature'`)
4. Push a la rama (`git push origin feature/feature-name`)
5. Abre un Pull Request

---

## 📝 Cambios de Versión

### v1.0.0 (Actual)
- ✅ Sistema completo de gestión de torneos
- ✅ Autenticación Firebase
- ✅ Generador de fixture Round Robin
- ✅ Tabla de posiciones automática
- ✅ Diseño responsive

### v1.1.0 (Planeado)
- 🔜 Export a PDF
- 🔜 Estadísticas por jugador
- 🔜 Eliminación directa
- 🔜 Sistema de promociones y descensos

---

Última actualización: Marzo 2024
Versión: 1.0.0
