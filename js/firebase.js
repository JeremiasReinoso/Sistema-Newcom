// ============================================================
// NEWCOM PRO - FIREBASE CONFIGURATION (Firestore Only)
// ============================================================

// Replace with your Firebase config from console.firebase.google.com
const firebaseConfig = {
    apiKey: "REEMPLAZAR_CON_TU_API_KEY",
    authDomain: "REEMPLAZAR_CON_TU_AUTH_DOMAIN",
    projectId: "REEMPLAZAR_CON_TU_PROJECT_ID",
    storageBucket: "REEMPLAZAR_CON_TU_STORAGE_BUCKET",
    messagingSenderId: "REEMPLAZAR_CON_TU_MESSAGING_SENDER_ID",
    appId: "REEMPLAZAR_CON_TU_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ============================================================
// FIRESTORE COLLECTIONS SCHEMA
// ============================================================

/*
teams/
  - name: string
  - category: string ("+40", "+50", "+60", "+68")
  - createdAt: timestamp

players/
  - name: string
  - age: number
  - shirtNumber: number
  - teamId: string (reference to teams)
  - createdAt: timestamp

tournaments/
  - name: string
  - type: string ("roundRobin" | "elimination")
  - teams: array[string] (team IDs)
  - status: string ("draft" | "active" | "finished")
  - createdAt: timestamp

matches/
  - tournamentId: string
  - teamAId: string
  - teamBId: string
  - setsA: number
  - setsB: number
  - pointsA: number
  - pointsB: number
  - status: string ("pending" | "played")
  - createdAt: timestamp
*/

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

/**
 * Create a new document in Firestore
 */
async function createDocument(collection, data) {
    try {
        const docRef = await db.collection(collection).add({
            ...data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error(`Error creating document in ${collection}:`, error);
        throw error;
    }
}

/**
 * Get all documents from a collection
 */
async function getDocuments(collection) {
    try {
        const snapshot = await db.collection(collection).orderBy('createdAt', 'desc').get();
        const documents = [];
        snapshot.forEach(doc => {
            documents.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return documents;
    } catch (error) {
        console.error(`Error getting documents from ${collection}:`, error);
        throw error;
    }
}

/**
 * Get a specific document
 */
async function getDocument(collection, docId) {
    try {
        const doc = await db.collection(collection).doc(docId).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (error) {
        console.error(`Error getting document:`, error);
        throw error;
    }
}

/**
 * Update a document
 */
async function updateDocument(collection, docId, data) {
    try {
        await db.collection(collection).doc(docId).update(data);
    } catch (error) {
        console.error(`Error updating document:`, error);
        throw error;
    }
}

/**
 * Delete a document
 */
async function deleteDocument(collection, docId) {
    try {
        await db.collection(collection).doc(docId).delete();
    } catch (error) {
        console.error(`Error deleting document:`, error);
        throw error;
    }
}

/**
 * Real-time listener for a collection
 */
function listenCollection(collection, callback) {
    return db.collection(collection)
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
 * Query documents by field
 */
async function queryDocuments(collection, field, operator, value) {
    try {
        const snapshot = await db.collection(collection)
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
        console.error(`Error querying:`, error);
        throw error;
    }
}
