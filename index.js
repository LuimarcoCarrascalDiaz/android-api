// index.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// 1) Crear la app principal
const app = express();
app.use(cors());
app.use(express.json());

// 2) Conectar a la base de datos (index.js maneja usuarios, pero en viviendas.js hay otra conexión propia)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'luimi2025',
  database: 'miapp_db'
});

// (Opcional) Probar si MySQL se conecta bien aquí:
 db.connect(err => {
   if (err) {
    console.error('❌ No se pudo conectar a MySQL en index.js:', err.message);
     process.exit(1);
  }
  console.log('✔️  Conectado a MySQL desde index.js');
 });

// 3) Importar el router de viviendas
const viviendasRouter = require('./viviendas');

// 4) Rutas “globales” para usuarios (dentro de index.js)
app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, result) => {
    if (err) {
      console.error('❌ Error al consultar usuarios:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

app.post('/usuarios', (req, res) => {
  const { nombre, correo, clave } = req.body;

  if (!nombre || !correo || !clave) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const query = 'INSERT INTO usuarios (nombre, correo, clave) VALUES (?, ?, ?)';
  db.query(query, [nombre, correo, clave], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar en DB:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ mensaje: 'Usuario registrado', id: result.insertId });
  });
});

// 5) Montar el router de viviendas en /viviendas
//    Ahora viviendasRouter es realmente un Router, no una “app” entera.
app.use('/viviendas', viviendasRouter);

// 6) Iniciar el servidor en el puerto 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// 7) Montar el router de integrantes desde archivo separado
const integrantesRouter = require('./integrantes')(db);
app.use('/integrantes', integrantesRouter);

