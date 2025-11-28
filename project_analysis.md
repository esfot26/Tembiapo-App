# Análisis del Proyecto TembiapoApp

## 1. Resumen del Proyecto

**TembiapoApp** es una aplicación de asistencia y productividad desarrollada con **React Native (Expo)**. Su objetivo es centralizar la gestión de tareas, archivos y eventos en una sola plataforma móvil.

### Tech Stack Principal:
- **Core**: Expo (Managed Workflow), React Native.
- **Navegación**: Expo Router (basado en archivos).
- **Estilos**: NativeWind (TailwindCSS).
- **Backend / BaaS**: Firebase (Auth, Firestore, Storage).
- **Arquitectura**: "Feature-based" (organizada por módulos funcionales en `src/features`).

### Módulos Principales:
1.  **Auth**: Inicio de sesión (Google) y gestión de sesión.
2.  **Folders**: Sistema de carpetas jerárquicas (tipo Google Drive).
3.  **Files**: Subida y visualización de archivos.
4.  **Tasks**: Lista de tareas (To-Do) con notificaciones.
5.  **Calendar**: Gestión de eventos y agenda.

---

## 2. Recomendaciones y Mejoras

Basado en la estructura actual y las mejores prácticas para este tipo de apps:

### 🚀 Arquitectura y Estado
- **TanStack Query (React Query)**: Actualmente usas `Context` y `useEffect` para traer datos. Para una app de productividad que requiere sincronización constante, **React Query** es muy superior. Maneja caché, reintentos, y estados de carga/error automáticamente, limpiando mucho tu código.
- **Zustand para Estado Global**: Si necesitas estado global complejo (que no sea data del servidor), `Zustand` es más simple y performante que `Context` puro para evitar re-renders innecesarios.

### 📱 UX/UI y Performance
- **FlashList**: Si tus listas de tareas o archivos crecen, cambia `FlatList` por `FlashList` (de Shopify) para un rendimiento mucho mejor (x5).
- **Optimistic Updates**: Al crear una tarea o carpeta, muéstrala inmediatamente en la UI antes de que el servidor responda. Esto hace que la app se sienta "instantánea".
- **Skeletons**: Usa "esqueletos" de carga en lugar de spinners circulares para una mejor percepción de velocidad.

### 🔒 Seguridad y Offline
- **Reglas de Seguridad (Firestore)**: Es CRÍTICO configurar las reglas de seguridad (`firestore.rules`) para que un usuario solo pueda leer/escribir sus propios documentos (`request.auth.uid == resource.data.userId`).
- **Persistencia Offline**: Asegúrate de habilitar la persistencia de Firestore (`enableIndexedDbPersistence` en web, o por defecto en nativo) para que la app funcione sin internet.

---

## 3. Diseño de Base de Datos (Firebase Firestore)

Firestore es una base de datos NoSQL orientada a documentos. Aquí tienes una propuesta de estructura de colecciones eficiente.

> **Nota**: En NoSQL, a veces duplicamos datos (desnormalización) para evitar lecturas extra.

### Colección: `users`
Información del perfil del usuario.
```json
{
  "uid": "user_123",
  "email": "usuario@gmail.com",
  "displayName": "Juan Perez",
  "photoURL": "https://...",
  "createdAt": "Timestamp",
  "settings": {
    "theme": "dark",
    "notificationsEnabled": true
  }
}
```

### Colección: `folders`
Sistema de carpetas. Usamos `parentId` para la jerarquía.
```json
{
  "id": "folder_abc",
  "userId": "user_123",       // 🔑 Indispensable para filtrar por usuario
  "parentId": "folder_root",  // null si es carpeta raíz
  "name": "Proyectos 2024",
  "color": "#FF5733",
  "createdAt": "Timestamp",
  "path": ["folder_root", "folder_abc"] // Opcional: ayuda en búsquedas
}
```
*Indexar por*: `userId` + `parentId` (Para listar carpetas dentro de otra).

### Colección: `files`
Archivos subidos.
```json
{
  "id": "file_xyz",
  "userId": "user_123",
  "folderId": "folder_abc",   // Carpeta donde está guardado
  "name": "Contrato.pdf",
  "mimeType": "application/pdf",
  "size": 102400,
  "storageUrl": "gs://bucket/...", // Ruta en Firebase Storage
  "downloadUrl": "https://...",
  "createdAt": "Timestamp"
}
```

### Colección: `tasks`
Tareas pendientes.
```json
{
  "id": "task_789",
  "userId": "user_123",
  "title": "Comprar dominio",
  "description": "Renovar el dominio en GoDaddy",
  "isCompleted": false,
  "dueDate": "Timestamp",     // Fecha límite
  "reminderDate": "Timestamp",// Para notificaciones
  "priority": "high",         // low, medium, high
  "tags": ["trabajo", "urgente"],
  "createdAt": "Timestamp"
}
```

### Colección: `events`
Eventos de calendario.
```json
{
  "id": "event_456",
  "userId": "user_123",
  "title": "Reunión de equipo",
  "description": "Revisión semanal",
  "startDate": "Timestamp",
  "endDate": "Timestamp",
  "location": "Zoom",
  "color": "#3B82F6"
}
```
