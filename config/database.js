// config/database.js - VERSIÓN FINAL (cuando whitelist esté activa)
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ BusConnect MX - MongoDB Atlas Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error conectando MongoDB Atlas:', error.message);
    console.log('💡 Verifica que tu IP esté en la whitelist de MongoDB Atlas');
    process.exit(1);
  }
};

module.exports = connectDB;