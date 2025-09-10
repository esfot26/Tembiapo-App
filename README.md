# 📚 Asistente Académico Móvil  

Aplicación móvil multiplataforma desarrollada con **React Native** y **Firebase**, orientada a la organización académica de estudiantes.  

---

## 🛠️ Tecnologías  

- **Frontend:** React Native (Expo)  
- **Backend:** Firebase (Authentication, Firestore, Storage, FCM)  
- **Control de versiones:** Git + GitHub  
- **Metodología:** Gitflow + Ágil (Scrum/Kanban)  

---

## 🌿 Flujo de Trabajo – Gitflow  

- **main** → Rama estable en producción.  
- **develop** → Rama de integración.  
- **feature/** → Nuevas funcionalidades (`feature/ui`, `feature/auth`).  
- **release/** → Preparación de versiones.  
- **hotfix/** → Correcciones críticas en producción.  

```bash
# Crear rama de feature
git checkout develop
git checkout -b feature/nueva-funcionalidad

# Subir cambios
git add .
git commit -m "Agrega nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Merge a develop
git checkout develop
git merge feature/nueva-funcionalidad
```

---

## ⚡ Instalación  

### Requisitos  
- Node.js >= 18  
- Expo CLI  
- Proyecto en Firebase configurado  

### Pasos  
```bash
# Clonar repositorio
git clone https://github.com/esfot26/Tembiapo-App.git
cd Tembiapo-App

# Instalar dependencias
npm install

# Ejecutar app
npx expo start
```

---

## ✅ Estado del Proyecto  
- [x] Autenticación con Firebase con correo electrónico y contraseña 
- [ ] Autenticación con Google (Funcional en la Web, debo arreglar en plataforma móvil)  
- [ ] Módulo de Gestión de carpetas y archivos  
- [x] Módulo To-Do List
- [x] Módulo de Calendario tipo Crud 
- [ ] Pruebas y despliegue  

---

## 👨‍💻 Autor  
**Enzo Ortiz Tilleria** – Licenciatura en Análisis de Sistemas Informáticos  
