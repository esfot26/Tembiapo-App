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
git clone https://github.com/usuario/asistente-academico.git
cd asistente-academico

# Instalar dependencias
npm install

# Ejecutar app
npx expo start
```

---

## ✅ Estado del Proyecto  
- [ ] Autenticación con Google  
- [ ] Gestión de carpetas y archivos  
- [ ] Módulo To-Do List  
- [ ] Pruebas y despliegue  

---

## 👨‍💻 Autor  
**Enzo Ortiz Tilleria** – Licenciatura en Análisis de Sistemas Informáticos  
