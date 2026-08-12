const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
    registrarId: {type: string, required: true, unique: true },
    apellido: { type: String, required: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true },
    temas: { type: Enumerator, required: true },
    seRegistro: { type: Boolean, default: false },
    creado: { type: Date, default: Date.now },
    actualizado: { type: Date, default: Date.now },
},
{
    timestamps: true,
    versionKey: false,
})