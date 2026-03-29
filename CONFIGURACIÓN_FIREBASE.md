# 🔧 Guía Completa de Configuración Firebase para Newcom Pro

Sigue estos pasos exactos para configurar Firebase correctamente.

## PASO 1: Crear Proyecto en Firebase

1. Abre [console.firebase.google.com](https://console.firebase.google.com)
2. Haz clic en **"Crear proyecto"**
3. Nombre del proyecto: `Newcom Pro` (o el que prefieras)
4. Desmarca la opción de Google Analytics (opcional)
5. Haz clic en **Crear proyecto** y espera

## PASO 2: Crear una App Web

1. En el panel principal, haz clic en el icono `</>` (Web)
2. Nombre de la app: `Newcom Pro Web`
3. Marca la opción "También debo configurar Firebase Hosting" (opcional)
4. Haz clic en **Registrar app**
5. **COPIA TODO EL CÓDIGO** que aparece en la pantalla siguiente

## PASO 3: Copiar Configuración

Deberías ver algo como esto:

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// ... más código

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "newcom-pro-xxxxx.firebaseapp.com",
  projectId: "newcom-pro-xxxxx",
  storageBucket: "newcom-pro-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstu"
};
```

**Extrae solo los valores en este formato:**

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "newcom-pro-xxxxx.firebaseapp.com",
    projectId: "newcom-pro-xxxxx",
    storageBucket: "newcom-pro-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnopqrstu"
};
```

## PASO 4: Pegar en firebase.js

1. Abre el archivo `js/firebase.js`
2. Reemplaza el bloque `firebaseConfig` completo con tus datos
3. Guarda el archivo

**ANTES:**
```javascript
const firebaseConfig = {
    apiKey: "REEMPLAZAR_CON_TU_API_KEY",
    authDomain: "REEMPLAZAR_CON_TU_AUTH_DOMAIN",
    projectId: "REEMPLAZAR_CON_TU_PROJECT_ID",
    storageBucket: "REEMPLAZAR_CON_TU_STORAGE_BUCKET",
    messagingSenderId: "REEMPLAZAR_CON_TU_MESSAGING_SENDER_ID",
    appId: "REEMPLAZAR_CON_TU_APP_ID"
};
```

**DESPUÉS:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "newcom-pro-xxxxx.firebaseapp.com",
    projectId: "newcom-pro-xxxxx",
    storageBucket: "newcom-pro-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnopqrstu"
};
```

## PASO 5: Habilitar Authentication (Email/Password)

1. Ve a la consola Firebase
2. En el menú izquierdo, ve a **"Creación → Authentication"**
3. Haz clic en **"Comenzar"** (o "Get Started")
4. En la pestaña **"Sign-in method"** haz clic en **Email/Password**
5. Activa **"Email/Contraseña"**
6. Haz clic en **Guardar**

✅ **Listo**: Ahora puedes registrar usuarios en la app

## PASO 6: Crear Firestore Database

1. En el menú izquierdo, ve a **"Creación → Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Ubicación: **Sud América (São Paulo)** (o la más cercana a ti)
4. Modo de inicio: **Comenzar en modo de prueba** (para desarrollo)
5. Haz clic en **Crear**

✅ **Listo**: Firestore está creada y lista

## PASO 7: Configurar Reglas de Firestore (MUY IMPORTANTE)

1. En Firestore Database, ve a la pestaña **"Reglas"**
2. Reemplaza TODO el texto con esto:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo permite lectura/escritura a usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == resource.data.userId;
    }
    
    // Permitir crear nuevos documentos
    match /{collection}/{document=**} {
      allow create: if request.auth != null &&
                       request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Haz clic en **Publicar**

✅ **Importante**: Sin estas reglas, cualquiera puede ver los datos

## PASO 8: Probar la Configuración

1. Abre `index.html` en tu navegador
2. Intenta crear una cuenta
3. Si funciona, ve a la consola Firebase → Firestore
4. Debería ver una nueva colección creada

## ❌ Si No Funciona

### Error: "firebaseConfig is not defined"
- Verifica que copiaste correctamente la configuración en `firebase.js`
- Guarda el archivo
- Recarga la página

### Error: "User not authenticated"
- Asegúrate de que Firebase Authentication está habilitado
- Verifica las reglas de Firestore

### No aparecen datos guardados
- Verifica en Firestore Console que existan las colecciones
- Comprueba que estés logueado
- Abre la consola del navegador (F12) para ver errores

## 🎯 Checklist Final

- [ ] Proyecto creado en Firebase
- [ ] App Web registrada
- [ ] firebaseConfig copiado en `js/firebase.js`
- [ ] Authentication Email/Password habilitado
- [ ] Firestore Database creada
- [ ] Reglas de Firestore publicadas
- [ ] `index.html` abierto y funciona el login
- [ ] Puedo crear un equipo y aparece en Firestore

## 📚 Recursos Útiles

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)

## 🚀 Próximos Pasos

Una vez que todo funciona:

1. Crea algunos equipos de prueba
2. Agrega jugadores
3. Crea un torneo
4. Verifica que los partidos se generen automáticamente
5. Carga algunos resultados
6. Observa la tabla de posiciones en tiempo real

¡Listo! Ahora tienes un sistema profesional funcionando.
