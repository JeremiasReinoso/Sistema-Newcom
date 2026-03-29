# 🏆 Newcom Pro - Sistema Profesional de Torneos

Sistema comercial moderno para gestionar torneos de newcom a nivel profesional.

## ✨ Características

- ✅ Autenticación segura con Firebase
- ✅ Gestión de equipos y categorías
- ✅ Registro de jugadores por equipo
- ✅ Creación de torneos automáticos
- ✅ Generador de fixture (algoritmo Round Robin)
- ✅ Carga de resultados en tiempo real
- ✅ Tabla de posiciones automática
- ✅ Diseño responsive (mobile + desktop)
- ✅ UI moderna con modo oscuro
- ✅ Código limpio y escalable

## 🚀 Tecnologías Usadas

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript Vanilla
- **Backend**: Firebase (Authentication + Firestore)
- **Hosting**: Estático (Netlify, Vercel, Firebase Hosting)

## 📁 Estructura del Proyecto

```
Sistema-Newcom/
├── index.html                 # Estructura HTML principal
├── css/
│   └── styles.css            # Estilos personalizados
├── js/
│   ├── firebase.js           # Configuración Firebase
│   └── app.js                # Lógica principal de la aplicación
├── README.md                 # Este archivo
└── CONFIGURACIÓN_FIREBASE.md # Guía de configuración
```

## 🔧 Configuración Inicial

### 1. Crear Proyecto en Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Haz clic en "Crear proyecto"
3. Nombre: "Newcom Pro"
4. Acepta los términos y continúa

### 2. Habilitar Authentication

1. En el panel lateral izquierdo, ve a **Authentication**
2. Haz clic en "Get Started"
3. En la pestaña "Sign-in method", habilita **Email/Password**
4. Guarda los cambios

### 3. Crear Firestore Database

1. Ve a **Firestore Database**
2. Haz clic en "Create database"
3. Selecciona **Ubicación cercana** (ej: South America - São Paulo)
4. Comienza en modo de prueba (desarrollo)
5. Crear

### 4. Obtener Configuración Firebase

1. Ve a **Project Settings** (rueda de engranaje arriba a la izquierda)
2. Encuentra la sección "Tu aplicación"
3. Haz clic en el icono `</>` para crear una app web
4. Copia la configuración Firebase

### 5. Configurar en la Aplicación

En `js/firebase.js`, reemplaza:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

## 🎮 Cómo Usar

### Acceso

1. Abre `index.html` en tu navegador
2. Crea una cuenta o inicia sesión
3. ¡Comienza a gestionar torneos!

### Flujo Típico

1. **Crear Equipos**: Navega a "Equipos" y crea los equipos
2. **Agregar Jugadores**: Ve a "Jugadores" y registra jugadores por equipo
3. **Crear Torneo**: En "Torneos", crea un nuevo torneo seleccionando equipos
4. **Automático**: El sistema genera automáticamente todos los partidos
5. **Cargar Resultados**: En "Partidos", carga los resultados de cada juego
6. **Ver Posiciones**: La tabla se actualiza automáticamente en tiempo real

## 📊 Colecciones Firestore

### `teams`
```json
{
  "name": "Club Atlético Central",
  "category": "+40",
  "createdAt": "timestamp",
  "userId": "uid"
}
```

### `players`
```json
{
  "name": "Juan Pérez",
  "age": 45,
  "shirtNumber": 10,
  "teamId": "ref-to-team",
  "createdAt": "timestamp",
  "userId": "uid"
}
```

### `tournaments`
```json
{
  "name": "Torneo Senior 2024",
  "type": "roundRobin",
  "teams": ["team-id-1", "team-id-2", ...],
  "status": "active",
  "createdAt": "timestamp",
  "userId": "uid"
}
```

### `matches`
```json
{
  "tournamentId": "ref-to-tournament",
  "teamAId": "ref-to-team-a",
  "teamBId": "ref-to-team-b",
  "setsA": 2,
  "setsB": 1,
  "pointsA": 25,
  "pointsB": 23,
  "status": "played",
  "createdAt": "timestamp",
  "userId": "uid"
}
```

## 🔐 Reglas de Firestore (Desarrollo)

Copia estas reglas en **Firestore > Rules**:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Nota**: Para producción, usa reglas más restrictivas que validen por usuario.

## 🎨 Personalización

### Colores
Los colores principales están definidos en `css/styles.css`:
```css
:root {
    --primary: #3b82f6;
    --secondary: #06b6d4;
    --success: #10b981;
    ...
}
```

### Categorías
Edita en `index.html` la sección de select categorías para agregar/quitar opciones.

## 📱 Responsive Design

La aplicación es completamente responsive:
- **Mobile**: Optimizada para pantallas pequeñas
- **Tablet**: Layout adaptativo
- **Desktop**: Vista completa con columnas

## 🐛 Troubleshooting

### No carga ningún dato
- Verifica que Firebase esté bien configurado
- Abre la consola del navegador (F12) para ver errores
- Comprueba las reglas de Firestore

### Error de autenticación
- Revisa que hayas habilitado Email/Password en Firebase Authentication
- Asegúrate de que el email y contraseña sean correctos

### Partidos no se generan
- Selecciona al menos 2 equipos al crear el torneo
- Verifica que el tipo sea "Todos contra todos"

## 📈 Algoritmo Round Robin

El sistema genera automáticamente todos los enfrentamientos posibles:

- 2 equipos → 1 partido
- 3 equipos → 3 partidos
- 4 equipos → 6 partidos
- 5 equipos → 10 partidos
- n equipos → n×(n-1)/2 partidos

## 🚢 Deploy (Opciones)

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Netlify
1. Sube los archivos a GitHub
2. Conecta el repo en Netlify
3. Deploy automático

### Vercel
Igual que Netlify, super fácil.

## 📝 Licencia

Este proyecto es de uso privado para gestión de torneos.

## 👨‍💻 Soporte

Para reportar bugs o sugerencias, contacta al desarrollador.

---

**Versión**: 1.0.0  
**Última actualización**: Marzo 2024  
**Estado**: 🟢 Producción Ready
