const mongoose = require('mongoose');

const preCycleRegistrationSchema = new mongoose.Schema({
    registrarId: {type: String, required: true, unique: true },
    apellido: { type: String, required: true },
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    fechaNacimiento: { type: Date, required: true },
    dni: { type: String, required: true, unique: true, index: true },
    tituloSecundario: { type: String, enum:["si","no","incompleto"],default: "no", required: true },
    telefono: { type: String, required: true },
    email: { type: String, required: true },
    foto: { type: String },
    concurreAlgunaIglesias: { type: Boolean, required: true },
    cual: { type: String },
    nombrePastor: { type: String }
},{
    timestamps: { createdAt: 'creado', updatedAt: 'actualizado' },
    versionKey: false,
});

module.exports = mongoose.model('preCycleRegistration', preCycleRegistrationSchema);