# Fitness App Mobile

App móvil para seguimiento de entrenamientos. Frontend en React Native conectado a API REST.

## Demo

Conecta con el backend en:
- **API:** https://fitness-app-backend-production-f14c.up.railway.app

---

## Stack

| Categoría | Tecnología |
|-----------|------------|
| Framework | React Native |
| Plataforma | Expo SDK 57 |
| Lenguaje | TypeScript |
| Navegación | React Navigation |
| Almacenamiento | AsyncStorage |

---

## Pantallas

| Pantalla | Descripción |
|----------|-------------|
| LoginScreen | Inicio de sesión con JWT |
| RegisterScreen | Registro de usuario |
| HomeScreen | Lista de workouts del usuario |
| CreateWorkoutScreen | Formulario para crear workout |
| WorkoutDetailScreen | Detalle con ejercicios |

---

## Estructura del proyecto

fitness-app-mobile/
├── App.tsx # Navegación principal
├── src/
│ ├── screens/
│ │ ├── LoginScreen.tsx
│ │ ├── RegisterScreen.tsx
│ │ ├── HomeScreen.tsx
│ │ ├── CreateWorkoutScreen.tsx
│ │ └── WorkoutDetailScreen.tsx
│ └── services/
│ └── api.ts # Conexión con backend


---

## Configuración local

### Requisitos

- Node.js 18+
- Expo CLI
- npm o yarn

### 1. Clonar

```bash
git clone https://github.com/NicolasNsap/fitness-app-mobile.git
cd fitness-app-mobile
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar

```bash
npx expo start --web
```

Abre `http://localhost:8081` en el navegador.

---

## Configuración de API

En `src/services/api.ts`, la URL del backend:

```ts
const API_URL = 'https://fitness-app-backend-production-f14c.up.railway.app/api';
```

Para desarrollo local, cambia a:

```ts
const API_URL = 'http://localhost:8080/api';
```

---

## Funcionalidades

- [x] Autenticación JWT
- [x] Registro de usuario
- [x] Login/Logout
- [x] Listar workouts
- [x] Crear workout
- [x] Ver detalle de workout
- [ ] Agregar ejercicios
- [ ] Editar workout
- [ ] Eliminar workout

---

## Relacionado

- [Backend Repository](https://github.com/NicolasNsap/fitness-app-backend)

---

## Autor

**Nicolás Abarca**

- [LinkedIn](https://www.linkedin.com/in/nicolás-abarca)
- [GitHub](https://github.com/NicolasNsap)
