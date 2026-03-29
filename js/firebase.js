// ============================================
// CONFIGURACIÓN FIREBASE
// ============================================

// Reemplaza estos valores con tu configuración de Firebase
// Obtén estos datos de tu proyecto en console.firebase.google.com

const firebaseConfig = {
    apiKey: "REEMPLAZAR_CON_TU_API_KEY",
    authDomain: "REEMPLAZAR_CON_TU_AUTH_DOMAIN",
    projectId: "REEMPLAZAR_CON_TU_PROJECT_ID",
    storageBucket: "REEMPLAZAR_CON_TU_STORAGE_BUCKET",
    messagingSenderId: "REEMPLAZAR_CON_TU_MESSAGING_SENDER_ID",
    appId: "REEMPLAZAR_CON_TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencias a servicios
const auth = firebase.auth();
const db = firebase.firestore();

// ============================================
// ESTRUCTURA DE COLECCIONES
// ============================================

/*
Firestore Collections:

1. teams/
   - id (auto)
   - name (string)
   - category (string: +40, +50, +60, +68)
   - createdAt (timestamp)
   - userId (string)

2. players/
   - id (auto)
   - name (string)
   - age (number)
   - shirtNumber (number)
   - teamId (string - referencia a teams)
   - createdAt (timestamp)
   - userId (string)

3. tournaments/
   - id (auto)
   - name (string)
   - type (string: roundRobin, elimination)
   - teams (array de IDs)
   - status (string: draft, active, finished)
   - createdAt (timestamp)
   - userId (string)

4. matches/
   - id (auto)
   - tournamentId (string)
   - teamAId (string)
   - teamBId (string)
   - setsA (number)
   - setsB (number)
   - pointsA (number)
   - pointsB (number)
   - status (string: pending, played)
   - createdAt (timestamp)
   - userId (string)
*/

// ============================================
// FUNCIONES AUXILIARES DE FIREBASE
// ============================================

/**
 * Obtiene el usuario actual
 */
function getCurrentUser() {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(
            user => {
                unsubscribe();
                resolve(user);
            },
            reject
        );
    });
}

/**
 * Crea un documento en Firestore
 */
async function createDocument(collection, data) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');

        const docRef = await db.collection(collection).add({
            ...data,
            userId: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        return docRef.id;
    } catch (error) {
        console.error(`Error creando documento en ${collection}:`, error);
        throw error;
    }
}

/**
 * Obtiene documentos de una colección
 */
async function getDocuments(collection, whereClause = null) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');

        let query = db.collection(collection).where('userId', '==', user.uid);

        if (whereClause) {
            query = query.where(whereClause.field, whereClause.operator, whereClause.value);
        }

        const snapshot = await query.orderBy('createdAt', 'desc').get();
        const documents = [];

        snapshot.forEach(doc => {
            documents.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return documents;
    } catch (error) {
        console.error(`Error obteniendo documentos de ${collection}:`, error);
        throw error;
    }
}

/**
 * Obtiene un documento específico
 */
async function getDocument(collection, docId) {
    try {
        const doc = await db.collection(collection).doc(docId).get();
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error(`Error obteniendo documento:`, error);
        throw error;
    }
}

/**
 * Actualiza un documento
 */
async function updateDocument(collection, docId, data) {
    try {
        await db.collection(collection).doc(docId).update(data);
    } catch (error) {
        console.error(`Error actualizando documento:`, error);
        throw error;
    }
}

/**
 * Elimina un documento
 */
async function deleteDocument(collection, docId) {
    try {
        await db.collection(collection).doc(docId).delete();
    } catch (error) {
        console.error(`Error eliminando documento:`, error);
        throw error;
    }
}

/**
 * Listening en tiempo real a una colección
 */
function listenCollection(collection, callback) {
    const user = auth.currentUser;
    if (!user) return;

    return db.collection(collection)
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const documents = [];
            snapshot.forEach(doc => {
                documents.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(documents);
        });
}

/**
 * Buscador de documentos por campo
 */
async function queryDocuments(collection, field, operator, value) {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');

        const snapshot = await db.collection(collection)
            .where('userId', '==', user.uid)
            .where(field, operator, value)
            .get();

        const documents = [];
        snapshot.forEach(doc => {
            documents.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return documents;
    } catch (error) {
        console.error(`Error en query:`, error);
        throw error;
    }
}
