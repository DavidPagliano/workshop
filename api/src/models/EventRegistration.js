const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
    registrarId: { type: String, required: true, unique: true },
    apellido: { type: String, required: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    dni: { type: String, required: true, unique: true, index: true },
    telefono: { type: String, required: true },
    temas: {
      type: String,
      enum: [
        "Fotografía",
        "Marketing Digital",
        "Diseño",
        "Conexión satelital",
        "Iluminación",
        "Diseño web",
        "Animación con IA",
        "Otros",
        "sin temas",
        "AI",
        "Audio",
        "video",
      ],
      default: "sin temas",
      required: true,
    },
    seRegistro: { type: Boolean, default: false },
},
{
    timestamps: { createdAt: 'creado', updatedAt: 'actualizado' },
    versionKey: false,
})

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);