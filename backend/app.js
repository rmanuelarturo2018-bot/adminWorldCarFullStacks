import express from 'express';
import dotenv from 'dotenv';
// override: true -> el .env SIEMPRE gana sobre variables ya existentes en el entorno
// (evita que un PORT del sistema pise el puerto configurado en .env)
dotenv.config({ override: true });

import cors from 'cors';

// importar routes
import accountRoutes from './src/routes/accounts.route.js';
import brandRoutes from './src/routes/brand.routes.js';
import clientRoutes from './src/routes/clients.route.js';
import adminRoutes from './src/routes/admin.route.js';
import rolesRoutes from './src/routes/roles.route.js';
import productsRoutes from './src/routes/products.route.js';
import productTypesRoutes from './src/routes/productTypes.route.js';

const app = express(); // crear una instancia de express
app.use(express.json()); // middleware para parsear el body de las peticiones como JSON
app.use(express.urlencoded({ extended: true })); // middleware para parsear el body de las peticiones como URL encoded

// CORS global: permite al frontend consumir TODOS los endpoints (/api/accounts, /api/brands, /api/clients)
// Origen configurable en .env (CORS_ORIGIN). Varios origenes separados por coma.
// Sin CORS_ORIGIN definido se acepta cualquier origen (adecuado para desarrollo local).
const CORS_ORIGINS = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOptions = {
  origin: CORS_ORIGINS.length ? CORS_ORIGINS : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};
// cors() responde los preflight OPTIONS de cualquier ruta automaticamente
app.use(cors(corsOptions));

// routes
app.use('/api/accounts', accountRoutes); // implementar las rutas de accounts.route.js en la ruta /api
app.use('/api/brands', brandRoutes); // implementar las rutas de brands.route.js en la ruta /api
app.use('/api/clients', clientRoutes); // implementar las rutas de clients.route.js en la ruta /api
app.use('/api/admin', adminRoutes); // implementar las rutas de administración (/api/admin)
app.use('/api/roles', rolesRoutes); // CRUD de roles
app.use('/api/products', productsRoutes); // CRUD de productos
app.use('/api/product-types', productTypesRoutes); // CRUD de categorías

const PORT = process.env.PORT || 3000;
//iniciar el servidor
app.listen(PORT, () => {
    console.log('Server started on ' + PORT);
});


