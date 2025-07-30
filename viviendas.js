// viviendas.js

const express = require('express');
const mysql = require('mysql2');

//
// 1) Creamos un Router de Express (no una app completa):
//
const router = express.Router();

//
// 2) Configuramos la conexión a la base de datos MySQL
//    (igual que antes, pero ahora dentro de este módulo)
//
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'luimi2025',
  database: 'miapp_db'
});

// (Opcional) Verificar conexión a MySQL al iniciar este módulo:
// db.connect(err => {
//   if (err) {
//     console.error('❌ Error al conectar a MySQL en viviendas.js:', err.message);
//   } else {
//     console.log('✔️  Conectado a MySQL desde viviendas.js');
//   }
//});


/**
 * GET /viviendas
 * Devuelve todas las viviendas
 */
router.get('/', (req, res) => {
  const query = 'SELECT * FROM viviendas';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al consultar viviendas:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


/**
 * GET /viviendas/:id
 * Devuelve una sola vivienda por su ID
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM viviendas WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al consultar vivienda por ID:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: `Vivienda con id=${id} no encontrada` });
    }
    res.json(results[0]);
  });
});


/**
 * POST /viviendas
 * Crea una nueva vivienda
 */
router.post('/', (req, res) => {
  const {
    codigo,
    id_pais,
    id_departamento,
    id_municipio,
    corregimiento,
    vereda,
    localidad,
    id_barrio,
    direccion_vivienda,
    carrera,
    sector,
    calle,
    manzana,
    lote,
    punto_referencia,
    conjunto,
    urbanizacion,
    latitude,
    longitude,
    w3w,
    vivienda_localizada,
    id_usuario
  } = req.body;

  // Validación mínima: id_usuario es obligatorio
  if (!id_usuario) {
    return res.status(400).json({ error: 'El campo id_usuario es obligatorio' });
  }

  const query = `
    INSERT INTO viviendas (
      codigo,
      id_pais,
      id_departamento,
      id_municipio,
      corregimiento,
      vereda,
      localidad,
      id_barrio,
      direccion_vivienda,
      carrera,
      sector,
      calle,
      manzana,
      lote,
      punto_referencia,
      conjunto,
      urbanizacion,
      latitude,
      longitude,
      w3w,
      
      id_usuario
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    codigo || null,
    id_pais || null,
    id_departamento || null,
    id_municipio || null,
    corregimiento || null,
    vereda || null,
    localidad || null,
    id_barrio || null,
    direccion_vivienda || null,
    carrera || null,
    sector || null,
    calle || null,
    manzana || null,
    lote || null,
    punto_referencia || null,
    conjunto || null,
    urbanizacion || null,
    latitude || null,
    longitude || null,
    w3w || null,
    
    id_usuario
  ];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('❌ Error al insertar vivienda:', err.message);
      return res.status(500).json({ error: err.message });
    }

    // Una vez insertada, devolvemos la fila creada
    const nuevaId = result.insertId;
    db.query('SELECT * FROM viviendas WHERE id = ?', [nuevaId], (err2, rows) => {
      if (err2) {
        console.error('❌ Error al obtener vivienda recién creada:', err2.message);
        return res.status(500).json({ error: err2.message });
      }
      res.status(201).json({ mensaje: 'Vivienda creada', vivienda: rows[0] });
    });
  });
});


/**
 * PUT /viviendas/:id
 * Actualiza una vivienda existente
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    codigo,
    id_pais,
    id_departamento,
    id_municipio,
    corregimiento,
    vereda,
    localidad,
    id_barrio,
    direccion_vivienda,
    carrera,
    sector,
    calle,
    manzana,
    lote,
    punto_referencia,
    conjunto,
    urbanizacion,
    latitude,
    longitude,
    w3w,
    vivienda_localizada,
    id_usuario
  } = req.body;

  // Validación mínima: id_usuario es obligatorio
  if (!id_usuario) {
    return res.status(400).json({ error: 'El campo id_usuario es obligatorio' });
  }

  const query = `
    UPDATE viviendas SET
      codigo = ?,
      id_pais = ?,
      id_departamento = ?,
      id_municipio = ?,
      corregimiento = ?,
      vereda = ?,
      localidad = ?,
      id_barrio = ?,
      direccion_vivienda = ?,
      carrera = ?,
      sector = ?,
      calle = ?,
      manzana = ?,
      lote = ?,
      punto_referencia = ?,
      conjunto = ?,
      urbanizacion = ?,
      latitude = ?,
      longitude = ?,
      w3w = ?,
      
      id_usuario = ?
    WHERE id = ?
  `;

  const params = [
    codigo || null,
    id_pais || null,
    id_departamento || null,
    id_municipio || null,
    corregimiento || null,
    vereda || null,
    localidad || null,
    id_barrio || null,
    direccion_vivienda || null,
    carrera || null,
    sector || null,
    calle || null,
    manzana || null,
    lote || null,
    punto_referencia || null,
    conjunto || null,
    urbanizacion || null,
    latitude || null,
    longitude || null,
    w3w || null,
    vivienda_localizada || null,
    id_usuario,
    id
  ];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar vivienda:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Vivienda con id=${id} no encontrada` });
    }

    // Devolver la fila ya actualizada
    db.query('SELECT * FROM viviendas WHERE id = ?', [id], (err2, rows) => {
      if (err2) {
        console.error('❌ Error al obtener vivienda actualizada:', err2.message);
        return res.status(500).json({ error: err2.message });
      }
      res.json({ mensaje: 'Vivienda actualizada', vivienda: rows[0] });
    });
  });
});


/**
 * DELETE /viviendas/:id
 * Elimina una vivienda por su ID
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM viviendas WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar vivienda:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Vivienda con id=${id} no encontrada` });
    }
    res.json({ mensaje: `Vivienda con id=${id} eliminada` });
  });
});


//
// 3) Exportamos el Router para que index.js lo pueda montar con app.use(...)
// en (...) se indican los parámetros 
// necesarios para dar inicio a la aplicación/aplicativo
//
module.exports = router;

