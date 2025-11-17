// models/Vehiculo.js
const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
  vehiculo_id: {
    type: String,
    required: true,
    unique: true
  },
  numero_economico: {
    type: String,
    required: true,
    unique: true
  },
  modelo: {
    type: String,
    required: true
  },
  año: {
    type: Number,
    required: true
  },
  capacidad_pasajeros: {
    type: Number,
    required: true
  },
  ruta_asignada: {
    type: String,
    required: true
  },
  estado_operativo: {
    type: String,
    enum: ['ACTIVO', 'INACTIVO', 'MANTENIMIENTO'],
    default: 'ACTIVO'
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehiculo', vehiculoSchema);