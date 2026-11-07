const mongoose = require('mongoose');

const inscriptionSchema = new mongoose.Schema(
  {
    inscriptionId: { type: String, required: true, unique: true},
    apellido: {type: String, required: true},
    nombre: {type: String, required: true},
    dni: {type: String, required: true, unique: true},
    fechaNacimiento: {type: Date, required: true},
    lugarNacimiento: {type: String, required: true},
    localidad: {type: String, required: true},
    provincia: {type: String, required: true},
    telefono: {type: String, required: true},
    telefonoAlternativo: {type: String},
    email: {type: String, required: true},
    añoACursar: {type: String,enum:["1ro","2do","3ro"], required: true},
    estudiosCursados: {type: String, enum: ["secundario completo", "terciario completo", "universidad", "tecnicatura"]},
    tieneTrabajo: {type: Boolean, required: true},
    direccionLaboral: {type: String},
    concurreAlgunaIglesia: {type: Boolean, required: true},
    cualIglesia: {type: String},
    nombreDelPastor: {type: String},
    foto: {type: String, required: true},
    emergencia: {
        NombreYApellido: {type: String, required: true},
        Telefono: {type: String, required: true},
        Parentesco: {type: String, required: true},
        Dni: {type: String, required: true},
        Domicilio: {type: String, required: true},
        Localidad: {type: String, required: true},
    },
    fichaMedica: {
        apellido: {type: String, required: true},
        nombre: {type: String, required: true},
        dni: {type: String, required: true, unique: true},
        edad: {type: Number, required: true},
        fechaNacimiento: {type: Date, required: true},
        lugarNacimiento: {type: String, required: true},
        grupoSanguineo: {type: String, required: true},
        recibeAlgunTratamientoMedico: {type: Boolean, required: true},
        cualTratamiento: {type: String},
        tomasAlgunaMedicacion: {type: Boolean, required: true},
        cualMedicacion: {type: String},
        tienesAlergias: {type: Boolean, required: true},
        cualesAlergias: {type: String},
        padecesAlgunTrastornoCronico: {type: Boolean, required: true},
        caulTrastorno: {type: String},
        otrasEnfermedades: {type: String},
        EnCasoDeUnaDescomposicionComoActuar: {type: String, required: true},
        ObraSocial: {
            nombre: {type: String, required: true},
            telefono: {type: String, required: true},
            planMedico: {type: String, required: true},
            NroAfiliado: {type: String, required: true},
        },
        emergenciaMedica: {
            Nombre: {type: String, required: true},
            Telefono: {type: String, required: true},
            NroAfiliadoAEmergencia: {type: String, required: true},
        },
        familiaDeReferencia: {
            nombreYApellido: {type: String, required: true},
            domicilio: {type: String, required: true},
            localidad: {type: String, required: true},
            provincia: {type: String, required: true},
            telefono: {type: String, required: true},
            otroTelefono: {type: String},
            parentesco: {type: String, required: true},
        }
    }
},{
    versionKey: false,
    timestamps: { createdAt: 'creado', updatedAt: 'actualizado' },
})

inscriptionSchema.index({ creado: -1 });

module.exports = mongoose.model('Inscription', inscriptionSchema);