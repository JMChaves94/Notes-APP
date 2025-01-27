const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const notesRoutes = require('./routes/notesRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes'); // Importar rutas de categorías
const { pool } = require('./db/database');

const app = express();
const PORT = 3000;

app.use(morgan('combined'));
app.use(cors());
app.use(express.json());


// Configuración de Swagger
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
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/notesRoutes.js', './routes/categoriesRoutes.js'], // Agregar categorías a Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use('/notes', notesRoutes); // Rutas de notas
app.use('/categories', categoriesRoutes); // Rutas de categorías

// Ruta inicial
app.get('/', (req, res) => {
  res.send('Welcome to Notes API');
});

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Manejar cierre de procesos
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

module.exports = { app, server, pool };
