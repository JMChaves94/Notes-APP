const { Pool } = require('pg');

// Configuración del pool de conexión
const pool = new Pool({
  user: 'postgres', // Cambia esto por tu usuario de PostgreSQL
  host: 'localhost',
  database: 'notes_app', // Cambia esto por el nombre de tu base de datos
  password: '1234', // Cambia esto por tu contraseña
  port: 5432,
});

// Verificar la conexión inicial
pool.on('connect', () => {
  console.log('Conexión exitosa con la base de datos.');
});

pool.on('error', (err) => {
  console.error('Error en la conexión con la base de datos:', err.message);
});

// Exportar el pool correctamente para usarlo en el servicio
module.exports = pool;
