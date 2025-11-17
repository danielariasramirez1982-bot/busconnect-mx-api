// models/DatosBus.js
const mongoose = require('mongoose');

const datosBusSchema = new mongoose.Schema({
  dispositivo_id: {
    type: String,
    required: true
  },
  vehiculo_id: {
    type: String,
    required: true
  },
  numero_serie: {
    type: String,
    required: true
  },
  pasajeros: {
    type: Number,
    required: true,
    min: 0
  },
  ubicacion: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  calidad_senal: {
    type: Number,
    min: 0,
    max: 31
  },
  estado_sistema: {
    type: String,
    default: 'OPERATIVO'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DatosBus', datosBusSchema);