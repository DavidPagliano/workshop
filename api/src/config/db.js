const mongoose = require('mongoose');
const config = require('../config/config');
const EventRegistration = require('../models/EventRegistration');
const PreCycleRegistration = require('../models/preCycleRegistration');
const User = require('../models/User');
const Audit = require('../models/Audit');

const connectDB = async () => {
  try {
    const db = await mongoose.connect(config.mongoDB);
    const dbName = db.connection.db?.databaseName;
    console.log(`\n✅ MongoDB Conectado: ${dbName}`);

    if (!db.connection.db) {
      throw new Error('La base de datos no está disponible');
    }

    // 1. Obtener nombres de las colecciones existentes
    const collections = await db.connection.db.listCollections().toArray();
    const existingNames = collections.map((c) => c.name);

    // 2. Mapeo de colecciones esperadas vs sus Modelos en Mongoose
    const expectedCollections = [
      { name: 'eventregistrations', model: EventRegistration },
      { name: 'precycleregistrations', model: PreCycleRegistration },
      { name: 'users', model: User },
      { name: 'audits', model: Audit },
    ];

    // 3. Crear e inicializar colecciones e índices que no existan
    const missing = expectedCollections.filter(
      (col) => !existingNames.includes(col.name)
    );

    if (missing.length > 0) {
      console.log(`🚧 Creando nuevas colecciones: ${missing.map((m) => m.name).join(', ')}`);
      for (const item of missing) {
        await item.model.init();
      }
    } else {
      console.log(`✅ Todas las colecciones ya existen en ${dbName}`);
    }

    // 4. Diagnóstico visual: contar documentos por colección en consola
    console.log(`\n📊 Estado de las colecciones en ${dbName}:\n`);
    const collectionStatus = [];

    for (const item of expectedCollections) {
      const exists = existingNames.includes(item.name) || missing.some((m) => m.name === item.name);
      let count = 0;

      if (exists) {
        count = await db.connection.db.collection(item.name).countDocuments();
      }

      collectionStatus.push({
        Colección: item.name,
        Existe: exists ? '✅ Sí' : '❌ No',
        Estado: exists
          ? count > 0
              ? '✅ Con datos'
              : '📭 Vacía'
          : '—',
        Registros: exists ? count : '—',
      });
    }

    console.table(collectionStatus);
    console.log('✅ MongoDB listo para Workshop\n');
  } catch (error) {
    console.error('❌ Error en conexión/verificación de MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;