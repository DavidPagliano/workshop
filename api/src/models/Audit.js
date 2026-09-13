const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false,
    default: null 
  },
  accion: { type: String, required: true },
  pagina: { type: String },
  detalles: { type: String },
  device: { type: String },
  ip: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  versionKey: false
});

module.exports = mongoose.model('Audit', auditSchema);