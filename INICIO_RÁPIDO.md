# NEWCOM PRO - SISTEMA MODERNO DE TORNEOS

## ✅ PROYECTO COMPLETAMENTE RECONSTRUIDO - VERSIÓN 3.0

### Estado Actual: **LISTO PARA USAR**

Newcom Pro es una **aplicación web profesional** diseñada para gestionar torneos de Newcom (voleibol adaptado) con:
- ✅ **Sin login** - Acceso directo a la aplicación
- ✅ **Diseño moderno** - Interfaz limpia, responsiva y oscura
- ✅ **Real-time** - Datos sincronizados con Firestore
- ✅ **Optimizado para celular** - Botones grandes, táctil

---

## 🚀 GUÍA RÁPIDA DE INICIO

### 1. Configurar Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Crea un nuevo proyecto
3. Habilita **Firestore** (modo prueba)
4. En "Configuración del proyecto" → "Tus apps", copia los datos de configuración
5. Abre `js/firebase.js` y reemplaza:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};
```

### 2. Abrir la aplicación

Simplemente abre `index.html` en tu navegador. ¡Se carga automaticamente!

---

## 📋 CARACTERÍSTICAS

### 📊 Dashboard
- Estadísticas en tiempo real (Equipos, Jugadores, Torneos, Partidos)
- Acciones rápidas para crear elementos

### 🏆 Gestión de Equipos
- CRUD completo
- Categorías: +40, +50, +60, +68 años
- Vista en tarjetas

### 👥 Gestión de Jugadores
- Crear jugadores con: Nombre, Edad, Nº Camiseta, Equipo
- Agrupados por equipo
- Lista con elementos eliminables

### 🎯 Torneos
- Crear torneos: Todos vs Todos o Eliminación Directa
- Generación automática de fixture (Round Robin)
- Gestión de equipos participantes

### ⚽ Partidos
- Carga de resultados: Sets y Puntos
- Estados: Pendiente / Jugado
- Vinculados a torneos

### 🏅 Tabla de Posiciones
- Validación automática
- Ordenamiento por puntos y sets

---

## 🏗️ ESTRUCTURA DE CARPETAS

```
Sistema-Newcom/
├── index.html              # Aplicación principal
├── css/
│   └── styles.css          # Estilos modernos (Tailwind + Custom)
├── js/
│   ├── firebase.js         # Configuración Firestore
│   └── app.js              # Lógica de la aplicación
└── [Documentación]
```

---

## 💾 BASE DE DATOS (Firestore)

### Colecciones

#### `teams`
```json
{
  "name": "Club Atlético Central",
  "category": "+50",
  "createdAt": "timestamp"
}
```

#### `players`
```json
{
  "name": "Juan Pérez",
  "age": 52,
  "shirtNumber": 10,
  "teamId": "team_doc_id",
  "createdAt": "timestamp"
}
```

#### `tournaments`
```json
{
  "name": "Torneo Senior 2024",
  "type": "roundRobin",
  "teams": ["team_id_1", "team_id_2"],
  "status": "active",
  "createdAt": "timestamp"
}
```

#### `matches`
```json
{
  "tournamentId": "tournament_id",
  "teamAId": "team_id_1",
  "teamBId": "team_id_2",
  "setsA": 2,
  "setsB": 1,
  "pointsA": 25,
  "pointsB": 23,
  "status": "played",
  "createdAt": "timestamp"
}
```

---

## 🎨 DISEÑO

- **Color Scheme**: Slate (Slate-950 a Slate-200)
- **Componentes**: Cards, Botones, Modales, Tabs
- **Animaciones**: Fade In, Slide Up, Pulse
- **Tipografía**: Sans-serif moderna
- **Responsivo**: Mobile-first design

---

## 🔧 DESARROLLO

### Stack Técnico
- **Frontend**: HTML5 + Tailwind CSS + JavaScript ES6+
- **Backend**: Firebase Firestore
- **Sin dependencias**: ¡Todo en CDN!

### Modificar la Aplicación

1. HTML: Edita `index.html` (estructura y modales)
2. Estilos: Edita `css/styles.css` (clases Tailwind)
3. Lógica: Edita `js/app.js` (funciones y eventos)

---

## 📱 NOTAS DE MÓVIL

✅ Diseño completamente responsive
✅ Botones grandes y fáciles de pulsar
✅ Modal de resultados en pantalla completa en móvil
✅ Tabs deslizables en navegación
✅ Optimizado para torneos en vivo

---

## ⚠️ PRIMEROS PASOS

1. **Configura Firebase** ← IMPORTANTE
2. Abre `index.html` en navegador
3. Crea un equipo
4. Agrega jugadores
5. ¡Crea un torneo!

---

## ❓ SOPORTE

- **Error de conexión**: Verifica tu Firebase config
- **Datos no se guardan**: Revisa reglas de Firestore (modo prueba por defecto)
- **Modal no abre**: Abre consola del navegador (F12) para ver errores

---

**Newcom Pro v3.0** - Desarrollado para gestionar torneos profesionales de Newcom
