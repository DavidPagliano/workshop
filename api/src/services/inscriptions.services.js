const Counter = require('../models/Counter');
const Inscription = require('../models/Inscription');
const AppError = require('../utils/AppError');

// Genera el próximo inscriptionId secuencial (ins-001, ins-002, ...)
const generateInscriptionId = async () => {
    // Si el contador no existe aún, inicializarlo con el máximo actual de la colección
    const existing = await Counter.findById('inscription_seq');
    if (!existing) {
        const lastDoc = await Inscription.findOne()
            .sort({ creado: -1 })
            .select('inscriptionId')
            .lean();
        const currentMax = lastDoc?.inscriptionId
            ? parseInt(lastDoc.inscriptionId.split('-').pop(), 10) || 0
            : 0;
        await Counter.findByIdAndUpdate(
            'inscription_seq',
            { $setOnInsert: { seq: currentMax } },
            { upsert: true }
        );
    }

    const counter = await Counter.findByIdAndUpdate(
        'inscription_seq',
        { $inc: { seq: 1 } },
        { returnDocument: 'after' }
    );
    return `ins-${String(counter.seq).padStart(3, '0')}`;
};

exports.createInscription = async(data) => {
    const existingInscription = await Inscription.findOne({ dni: data.dni});

    if(existingInscription) {
        throw new AppError('Ya existe una inscripción con este DNI/Pasaporte', 409);
    }

    // Generar inscriptionId en el servidor
    data.inscriptionId = await generateInscriptionId();

    const newInscription = new Inscription(data);
    return await newInscription.save();
}

exports.getAllInscriptions = async() => {
    return await Inscription.find().sort({ creado: -1 });
}

exports.getAllInscriptionsPage = async({ page = 1, limit = 10} = {}) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        Inscription.find().sort({ creado: -1 }).skip(skip).limit(limit),
        Inscription.countDocuments()
    ]);

    return {
        data,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
}

exports.getInscriptionById = async(inscriptionId) => {
    return await Inscription.findOne({inscriptionId})
}

exports.updateInscription = async(inscriptionId, data) => {
    return await Inscription.findOneAndUpdate(
        { inscriptionId },
        { $set: data },
        { returnDocument: 'after', runValidators: true, context: 'query' }
    )
}

exports.deleteInscription = async(inscriptionId) => {
    return await Inscription.findOneAndDelete({ inscriptionId });
}
