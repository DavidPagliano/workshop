const Counter = require('../models/Counter');
const InscriptionTSM = require('../models/InscriptionTSM');
const AppError = require('../utils/AppError');

// Genera el próximo inscriptionId secuencial (ins-001, ins-002, ...)
// sincronizando el contador con el último documento realmente guardado.
const generateInscriptionTSMId = async () => {
    const lastDoc = await InscriptionTSM.findOne()
        .sort({ creado: -1 })
        .select('inscriptionId')
        .lean();

    const currentMax = lastDoc?.inscriptionId
        ? parseInt(lastDoc.inscriptionId.split('-').pop(), 10) || 0
        : 0;

    // Sincroniza la base del contador con el último registro real guardado
    // (evita saltos si hubo intentos fallidos previos) e incrementa en 1.
    await Counter.findByIdAndUpdate(
        'inscription_tsm_seq',
        { $set: { seq: currentMax } },
        { upsert: true }
    );

    const counter = await Counter.findByIdAndUpdate(
        'inscription_tsm_seq',
        { $inc: { seq: 1 } },
        { returnDocument: 'after' }
    );
    return `ins-${String(counter.seq).padStart(3, '0')}`;
};

exports.createInscriptionTSM = async (data) => {
    const existingInscriptionTSM = await InscriptionTSM.findOne({ dni: data.dni });

    if (existingInscriptionTSM) {
        throw new AppError('Ya existe una inscripción con este DNI/Pasaporte', 409);
    }

    const newInscriptionTSM = new InscriptionTSM(data);

    // Validar todos los demás campos del documento antes de generar el inscriptionId
    await newInscriptionTSM.validate(
        Object.keys(InscriptionTSM.schema.paths).filter((path) => path !== 'inscriptionId')
    );

    // Recién cuando el documento es válido y está listo para guardarse se incrementa el contador
    newInscriptionTSM.inscriptionId = await generateInscriptionTSMId();

    try {
        return await newInscriptionTSM.save();
    } catch (error) {
        // Si falla el guardado en base de datos, revertir el contador
        await Counter.findByIdAndUpdate('inscription_tsm_seq', { $inc: { seq: -1 } });
        throw error;
    }
};

exports.getAllInscriptionsTSM = async () => {
    return await InscriptionTSM.find().sort({ creado: -1 });
};

exports.getAllInscriptionsTSMPage = async ({ page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        InscriptionTSM.find().sort({ creado: -1 }).skip(skip).limit(limit),
        InscriptionTSM.countDocuments()
    ]);

    return {
        data,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
};

exports.getInscriptionTSMById = async (inscriptionId) => {
    return await InscriptionTSM.findOne({ inscriptionId });
};

exports.updateInscriptionTSM = async (inscriptionId, data) => {
    return await InscriptionTSM.findOneAndUpdate(
        { inscriptionId },
        { $set: data },
        { returnDocument: 'after', runValidators: true, context: 'query' }
    );
};

exports.deleteInscriptionTSM = async (inscriptionId) => {
    return await InscriptionTSM.findOneAndDelete({ inscriptionId });
};
