# 🚀 Guía Rápida - Newcom Pro

## ⚡ Instalación en 5 minutos

### 1. Clonar o Descargar
```bash
# Si estás en una carpeta
cd Sistema-Newcom
```

### 2. Configurar Firebase (5 min)
- Ve a [console.firebase.google.com](https://console.firebase.google.com)
- Crea un proyecto llamado "Newcom Pro"
- Habilita Email/Password Authentication
- Crea Firestore Database
- Copia la configuración en `js/firebase.js`

Ver detalles en: [CONFIGURACIÓN_FIREBASE.md](CONFIGURACIÓN_FIREBASE.md)

### 3. Abrir en navegador
```
Double-click en index.html
O arrastra a tu navegador favorito
```

### 4. ¡Listo!
- Registrate con tu email
- Comienza a crear torneos

---

## 📖 Uso Básico

### Crear Torneo (Paso a Paso)

#### 1️⃣ Crear Equipos
```
Navega → Equipos
Botón: "+ Nuevo Equipo"
- Nombre: "Club Atlético Central"
- Categoría: "+40"
- Crear
```

#### 2️⃣ Crear Jugadores
```
Navega → Jugadores
Botón: "+ Nuevo Jugador"
- Nombre: "Juan Pérez"
- Edad: 45
- Número: 10
- Equipo: Club Atlético Central
- Crear
```

#### 3️⃣ Crear Torneo
```
Navega → Torneos
Botón: "+ Nuevo Torneo"
- Nombre: "Torneo Senior 2024"
- Tipo: "Todos contra todos"
- Selecciona al menos 2 equipos
- Crear
```

✨ **Automáticamente se generan todos los partidos!**

#### 4️⃣ Cargar Resultados
```
Navega → Partidos
Botón: "Cargar Resultado"
- Equipo A: 2 sets, 25 puntos
- Equipo B: 1 set, 23 puntos
- Guardar
```

#### 5️⃣ Ver Tabla de Posiciones
```
En Partidos, lado derecho
Se actualiza automáticamente con cada resultado
```

---

## 🎯 Atajos de Teclado

| Acción | Teclado |
|--------|---------|
| Crear | `Ctrl + N` (en desarrollo) |
| Buscar | `Ctrl + F` (navegador) |
| Salir | `Ctrl + Alt + L` (logout) |

---

## 🎨 Personalización Rápida

### Cambiar Logo
En `index.html`, busca:
```html
<span class="text-white font-bold text-lg">N</span>
```
Reemplaza con tu logo o letra

### Cambiar Colores
En `css/styles.css`, modifica:
```css
:root {
    --primary: #3b82f6;      /* Azul */
    --secondary: #06b6d4;    /* Cyan */
    --success: #10b981;      /* Verde */
}
```

### Agregar Categorías
En `index.html`, busca el select de categoría:
```html
<option value="+68">+68 años</option>
<option value="+75">+75 años</option>  <!-- Agregar aquí -->
```

---

## 📊 Ejemplo de Datos

### Torneo de 4 equipos
```
Equipos:
├─ Club Atlético Central (+40)
├─ River Sports (+40)
├─ Deportivo Luna (+40)
└─ Athletic Club (+40)

Partidos Generados: 6
├─ CAC vs River
├─ CAC vs Deportivo Luna
├─ CAC vs Athletic
├─ River vs Deportivo Luna
├─ River vs Athletic
└─ Deportivo Luna vs Athletic

Tabla Final:
🥇 Club Atlético Central - 6 pts (2G-0P)
🥈 River Sports - 3 pts (1G-1P)
🥉 Deportivo Luna - 0 pts (0G-2P)
4. Athletic Club - 0 pts (0G-2P)
```

---

## 🔐 Credenciales de Prueba

Crea tu propia cuenta:
- Email: `tu@email.com`
- Contraseña: `MinoPassword123`

---

## 📱 Funciona en

- ✅ Chrome / Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Navegadores móviles
- ✅ Tablets

---

## 🆘 Problemas Comunes

**P: No puedo crear cuenta**
R: Verifica que Firebase Authentication esté habilitado

**P: No se guardan los datos**
R: Revisa las reglas de Firestore, deben permitir `read, write` a usuarios autenticados

**P: Los partidos no se generan**
R: Selecciona al menos 2 equipos y tipo "Todos contra todos"

**P: ¿Puedo usar en móvil?**
R: ¡Sí! Es totalmente responsive. Funciona perfecto en celular

---

## 🎓 Estructura de Datos

Visualiza esto en Firebase Console → Firestore:

```
teams/ {
  doc-id: {
    name: "Club Atlético",
    category: "+40",
    userId: "user-id"
  }
}

players/ {
  doc-id: {
    name: "Juan",
    age: 45,
    shirtNumber: 10,
    teamId: "team-id"
  }
}

tournaments/ {
  doc-id: {
    name: "Torneo 2024",
    type: "roundRobin",
    teams: ["team1", "team2"],
    status: "active"
  }
}

matches/ {
  doc-id: {
    tournamentId: "tournament-id",
    teamAId: "team1",
    teamBId: "team2",
    setsA: 2,
    setsB: 1,
    pointsA: 25,
    pointsB: 23,
    status: "played"
  }
}
```

---

## 🚀 Deploy en 2 Minutos

### Opción 1: Firebase Hosting
```bash
npm install -g firebase-tools
firebase init
firebase deploy
```

### Opción 2: Netlify
1. Sube a GitHub
2. Conecta en netlify.com
3. Deploy automático

### Opción 3: Simplemente Compartir
Sube los archivos a Drive/Cloud y abre en navegador

---

## 💡 Tips Pro

1. **Backup**: Descarga tus datos regularmente desde Firebase
2. **Móvil**: Agrega a pantalla de inicio (Instalar como app)
3. **Printing**: Presiona `Ctrl+P` en Partidos para imprimir resultados
4. **Múltiples Torneos**: Puedes gestionar varios simultáneamente
5. **Equipos Reutilizables**: Los equipos se pueden usar en varios torneos

---

## 📝 Notas Importantes

⚠️ **Antes de ir a producción**:
- Actualiza las reglas de Firestore a modo "Locked"
- Configura variables de entorno
- Prueba exhaustivamente
- Haz backup de datos

---

## 📞 Contacto

¿Preguntas? ¿Sugerencias? ¿Bugs?
Reporta en GitHub o contacta al desarrollador.

---

**Versión**: 1.0.0
**Última actualización**: Marzo 2024
**Estado**: ✅ Production Ready
