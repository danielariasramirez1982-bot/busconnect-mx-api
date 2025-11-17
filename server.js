// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/busconnect', require('./routes/busconnect'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚍 BusConnect MX API - Healthy',
    timestamp: new Date().toISOString()
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '🚍 BusConnect MX API - Funcionando!',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      registrar_dispositivo: 'POST /api/busconnect/registrar-dispositivo',
      enviar_datos: 'POST /api/busconnect/datos',
      obtener_flota: 'GET /api/busconnect/flota'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor BusConnect MX en puerto ${PORT}`);
});