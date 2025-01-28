const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const notesRoutes = require('./routes/notesRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const { pool } = require('./db/database');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS para permitir solicitudes desde el frontend
const corsOptions = {
  origin: 'http://127.0.0.1:5500', // Origen permitido (frontend)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(morgan('combined'));
app.use(cors(corsOptions));
app.use(express.json());

// Configuración de Swagger para documentación de la API
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes API',
      version: '1.0.0',
      description: 'API for managing notes and categories',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`, // Usar puerto dinámico
      },
    ],
  },
  apis: ['./routes/notesRoutes.js', './routes/categoriesRoutes.js'], // Rutas para la documentación
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/notes', notesRoutes); // Rutas de notas
app.use('/categories', categoriesRoutes); // Rutas de categorías

// Ruta inicial para comprobar que el servidor funciona
app.get('/', (req, res) => {
  res.send('Welcome to Notes API');
});

// Exportar la aplicación para pruebas o uso modular
module.exports = { app, pool };

// Iniciar el servidor solo si este archivo se ejecuta directamente
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Manejar cierre de procesos (limpiar recursos)
  process.on('SIGTERM', async () => {
    console.log('Shutting down server...');
    server.close(() => {
      console.log('Express server closed');
    });

    try {
      await pool.end();
      console.log('PostgreSQL pool closed');
    } catch (error) {
      console.error('Error disconnecting PostgreSQL pool:', error);
    }
  });
}
