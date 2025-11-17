// routes/busconnect.js
const express = require('express');
const router = express.Router();
const Vehiculo = require('../models/Vehiculo');
const Dispositivo = require('../models/Dispositivo');
const DatosBus = require('../models/DatosBus');

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ 
      success: false,
      error: 'API Key inválida' 
    });
  }
};

// POST - Registrar dispositivo
router.post('/registrar-dispositivo', verifyApiKey, async (req, res) => {
  try {
    const { vehiculo_id, dispositivo_id, numero_serie, numero_economico } = req.body;

    let vehiculo = await Vehiculo.findOne({ vehiculo_id });
    if (!vehiculo) {
      vehiculo = new Vehiculo({
        vehiculo_id,
        numero_economico,
        modelo: req.body.modelo || 'Mercedes-Benz O500',
        año: req.body.año || 2024,
        capacidad_pasajeros: req.body.capacidad_pasajeros || 50,
        ruta_asignada: req.body.ruta_asignada || 'RUTA 01 - CENTRO'
      });
      await vehiculo.save();
    }

    const dispositivo = new Dispositivo({
      dispositivo_id,
      numero_serie,
      vehiculo_id,
      numero_economico,
      modelo_hardware: 'Transponder Bus v1.0',
      version_firmware: 'BC-MX-1.0.0'
    });
    await dispositivo.save();

    res.status(201).json({
      success: true,
      message: '✅ Dispositivo registrado exitosamente',
      data: { vehiculo, dispositivo }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error: ' + error.message 
    });
  }
});

// POST - Recibir datos
router.post('/datos', verifyApiKey, async (req, res) => {
  try {
    const datos = new DatosBus(req.body);
    await datos.save();

    await Dispositivo.findOneAndUpdate(
      { dispositivo_id: req.body.dispositivo_id },
      { ultima_conexion: new Date() }
    );

    res.status(201).json({
      success: true,
      message: 'Datos guardados correctamente'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error interno' 
    });
  }
});

// GET - Obtener flota
router.get('/flota', async (req, res) => {
  try {
    const flota = await Vehiculo.aggregate([
      {
        $lookup: {
          from: 'dispositivos',
          localField: 'vehiculo_id',
          foreignField: 'vehiculo_id',
          as: 'dispositivo'
        }
      },
      {
        $lookup: {
          from: 'datosbuses',
          let: { vid: '$vehiculo_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$vehiculo_id', '$$vid'] } } },
            { $sort: { timestamp: -1 } },
            { $limit: 1 }
          ],
          as: 'ultimo_dato'
        }
      }
    ]);

    res.json({
      success: true,
      sistema: 'BusConnect MX',
      total_vehiculos: flota.length,
      vehiculos_activos: flota.filter(v => v.estado_operativo === 'ACTIVO').length,
      flota: flota
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error obteniendo flota' 
    });
  }
});

module.exports = router;