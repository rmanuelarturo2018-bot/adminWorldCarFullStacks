# Freebuff Dashboard

Webapp React (JavaScript) con **login** y **dashboard** dividido en componentes reutilizables. Construida con **Vite** + **React 19** + **React Router 7**.

## Inicio rápido

```bash
npm install
npm run dev       # servidor de desarrollo (http://localhost:5173)
npm run build     # build de producción
npm run lint      # análisis estático (oxlint)
```

El inicio de sesión usa las credenciales registradas en la base de datos del backend.

## Backend

El backend Express está en `backend/` y la aplicación Vite reenvía las solicitudes `/api` a `http://localhost:4000`.

1. Copia `.env.example` a `.env` en la raíz y `backend/.env.example` a `backend/.env`.
2. Configura en `backend/.env` las credenciales de PostgreSQL y un secreto JWT.
3. En una terminal, instala dependencias e inicia el backend:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. En otra terminal, desde la raíz del proyecto, inicia el frontend:

   ```bash
   npm install
   npm run dev
   ```

No subas archivos `.env`: contienen credenciales privadas. Los archivos `.env.example` solo documentan las variables necesarias.

## Estructura de carpetas

```
src/
├── main.jsx                 # entrada: BrowserRouter + AuthProvider
├── App.jsx                  # definición de rutas y rutas protegidas
├── index.css                # variables CSS globales y reset
├── components/
│   ├── common/              # componentes generales reutilizables
│   │   ├── Button.jsx       # botones (variants: primary/secondary/ghost/danger)
│   │   ├── Input.jsx        # campo con label, icono y error
│   │   ├── Card.jsx         # contenedor con título y acciones
│   │   ├── Badge.jsx        # etiqueta de estado con color
│   │   ├── Spinner.jsx      # indicador de carga
│   │   └── icons.jsx        # iconos SVG compartidos
│   ├── layout/              # estructura de la aplicación
│   │   ├── AppLayout.jsx    # shell: sidebar + topbar + <Outlet/>
│   │   ├── Sidebar.jsx      # navegación lateral
│   │   └── Topbar.jsx       # búsqueda, notificaciones y perfil
│   └── dashboard/           # componentes específicos del dashboard
│       ├── StatCard.jsx     # tarjeta de indicador (KPI)
│       ├── SalesChart.jsx   # gráfico de barras (CSS puro)
│       ├── RecentOrders.jsx # tabla de pedidos con estados
│       ├── ActivityList.jsx # línea de tiempo de actividad
│       └── TopProducts.jsx  # ranking con barras de progreso
├── pages/                   # páginas (vistas)
│   ├── LoginPage.jsx        # inicio de sesión con validación
│   ├── DashboardPage.jsx    # dashboard compuesto por componentes
│   └── NotFoundPage.jsx     # 404
├── context/
│   └── AuthContext.jsx      # estado de autenticación (login/logout)
└── data/
    └── mockData.js          # datos de demostración del dashboard
```

## Convenciones

- Un archivo por componente: `Componente.jsx` + `Componente.css` (importado en el mismo componente).
- Los componentes generales y reutilizables viven en `components/common/`; los de página, en `pages/`.
- Las rutas privadas se protegen con el wrapper `ProtectedRoute` en `App.jsx`.
