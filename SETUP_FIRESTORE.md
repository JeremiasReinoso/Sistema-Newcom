#!/bin/bash
# NEWCOM PRO - SETUP FIRESTORE
# Copia y pega estos comandos en Firestore Console (ruleset)

# ============================================================
# FIRESTORE SECURITY RULES - Modo Desarrollo (Abierto)
# ============================================================
# ADVERTENCIA: Estas reglas permiten acceso total
# Para producción, implementa autenticación y validaciones propias

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir todo durante desarrollo
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

# ============================================================
# CREAR COLECCIONES EN FIRESTORE
# ============================================================
# 
# 1. Ve a Firebase Console
# 2. Firestore Database > Crear Base de Datos
# 3. Selecciona modo "prueba" (desarrollo)
# 4. Crea cada colección con estos documentos de ejemplo:
#

# COLLECTION: teams
# Sample Document:
{
  "name": "Club Atlético Central",
  "category": "+50",
  "createdAt": timestamp
}

# COLLECTION: players  
# Sample Document:
{
  "name": "Juan Pérez",
  "age": 52,
  "shirtNumber": 10,
  "teamId": "teams/doc_id",
  "createdAt": timestamp
}

# COLLECTION: tournaments
# Sample Document:
{
  "name": "Torneo Senior 2024",
  "type": "roundRobin",
  "teams": ["teams/id1", "teams/id2"],
  "status": "active",
  "createdAt": timestamp
}

# COLLECTION: matches
# Sample Document:
{
  "tournamentId": "tournaments/doc_id",
  "teamAId": "teams/id1",
  "teamBId": "teams/id2",
  "setsA": 2,
  "setsB": 1,
  "pointsA": 25,
  "pointsB": 23,
  "status": "played",
  "createdAt": timestamp
}

# ============================================================
# ÍNDICES (Si todo está lento)
# ============================================================
# Firestore sugerirá crear índices automáticamente
# Los índices recomendados son:
#
# - Collection: teams, Field: createdAt (Descending)
# - Collection: players, Field: teamId, createdAt (Desc)
# - Collection: tournaments, Field: status, createdAt (Desc)
# - Collection: matches, Field: tournamentId, status

# ============================================================
# BACKUP/EXPORT DE DATOS
# ============================================================
# 1. En Firebase Console > Firestore Database
# 2. Botón "..." > Exportar/descargar datos
# 3. Guarda en Google Storage
#
# Para RESTAURAR:
# 1. Botón "..." > Importar/cargar datos
# 2. Selecciona el archivo

# ============================================================
# ACCESO A DATOS
# ============================================================
# Desde index.html (una vez configurado):
# 
# 1. Abre Las Developer Tools (F12)
# 2. Abre la pestana "Console"
# 3. Prueba:
#
#    await getDocuments('teams')
#    // Devuelve array de equipos
#
#    await createDocument('teams', {name: 'Test', category: '+60'})
#    // Crea un nuevo equipo
#

# ============================================================
# LÍMITES Y CUOTAS FIRESTORE (Prueba - GRATIS)
# ============================================================
# - Lectura: 50,000/día
# - Escritura: 20,000/día
# - Eliminación: 20,000/día
# - Almacenamiento: 1GB
#
# Perfectamente suficiente para pruebas y torneos locales
