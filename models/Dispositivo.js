// models/Dispositivo.js
const mongoose = require('mongoose');

const dispositivoSchema = new mongoose.Schema({
  dispositivo_id: {
    type: String,
    required: true,
    unique: true
  },
  numero_serie: {
    type: String,
    required: true,
    unique: true
  },
  vehiculo_id: {
    type: String,
    required: true
  },
  numero_economico: {
    type: String,
    required: true
  },
  modelo_hardware: {
    type: String,
    default: 'Transponder Bus v1.0'
  },
  version_firmware: {
    type: String,
    default: 'BC-MX-1.0.0'
  },
  fecha_instalacion: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['OPERATIVO', 'MANTENIMIENTO', 'DESCONECTADO'],
    default: 'OPERATIVO'
  },
  ultima_conexion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Dispositivo', dispositivoSchema);