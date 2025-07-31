// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());               // Permitir peticiones cross‐origin
app.use(express.json());       // Parsear JSON en body
// Servir estático desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Datos de ejemplo en memoria
const actividades = [
  { id: 1, nombre: 'Tour histórico', precio: 50 },
  { id: 2, nombre: 'Clase de cocina', precio: 30 },
  { id: 3, nombre: 'Paseo en bote', precio: 40 },
];

const reservas = [];

/**
 * GET /api/actividades
 * Devuelve la lista de actividades disponibles
 */
app.get('/api/actividades', (req, res) => {
  res.json(actividades);
});

/**
 * POST /api/reservar
 * Recibe { actividadId, nombreCliente, fecha }
 * Crea una reserva y la devuelve
 */
app.post('/api/reservar', (req, res) => {
  const { actividadId, nombreCliente, fecha } = req.body;
  // Validar
  if (!actividadId || !nombreCliente || !fecha) {
    return res.status(400).json({ error: 'Faltan datos en la petición' });
  }
  const actividad = actividades.find(a => a.id === actividadId);
  if (!actividad) {
    return res.status(404).json({ error: 'Actividad no encontrada' });
  }
  // Crear reserva
  const reserva = {
    id: reservas.length + 1,
    actividad,
    nombreCliente,
    fecha
  };
  reservas.push(reserva);
  res.status(201).json(reserva);
});

/**
 * Para cualquier otra ruta GET, servir index.html
 * (útil si en el futuro montas routing en el frontend)
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API en puerto ${PORT}`);
});
