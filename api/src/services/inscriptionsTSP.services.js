const Counter = require('../models/Counter');
const Inscription = require('../models/InscriptionTSP');
const AppError = require('../utils/AppError');

const COUNTER_ID = 'inscription_tsp_seq';

const generateInscriptionId = async () => {
    const lastDoc = await Inscription.findOne()
        .sort({ creado: -1 })
        .select('inscriptionId')
        .lean();

    const currentMax = lastDoc?.inscriptionId
        ? parseInt(lastDoc.inscriptionId.split('-').pop(), 10) || 0
        : 0;

    await Counter.findByIdAndUpdate(
        COUNTER_ID,
        { $set: { seq: currentMax } },
        { upsert: true }
    );

    const counter = await Counter.findByIdAndUpdate(
        COUNTER_ID,
        { $inc: { seq: 1 } },
        { returnDocument: 'after' }
    );
    return `ins-${String(counter.seq).padStart(3, '0')}`;
};

exports.createInscription = async (data) => {
    const existingInscription = await Inscription.findOne({ dni: data.dni });

    if (existingInscription) {
        throw new AppError('Ya existe una inscripción con este DNI/Pasaporte', 409);
    }

    const newInscription = new Inscription(data);
    await newInscription.validate(
        Object.keys(Inscription.schema.paths).filter((path) => path !== 'inscriptionId')
    );
    newInscription.inscriptionId = await generateInscriptionId();

    try {
        return await newInscription.save();
    } catch (error) {
        await Counter.findByIdAndUpdate(COUNTER_ID, { $inc: { seq: -1 } });
        throw error;
    }
};

exports.getAllInscriptions = async () => Inscription.find().sort({ creado: -1 });

exports.getAllInscriptionsPage = async ({ page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        Inscription.find().sort({ creado: -1 }).skip(skip).limit(limit),
        Inscription.countDocuments()
    ]);

    return {
        data,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
};

exports.getInscriptionById = async (inscriptionId) => Inscription.findOne({ inscriptionId });

exports.updateInscription = async (inscriptionId, data) => Inscription.findOneAndUpdate(
    { inscriptionId },
    { $set: data },
    { returnDocument: 'after', runValidators: true, context: 'query' }
);

exports.deleteInscription = async (inscriptionId) => Inscription.findOneAndDelete({ inscriptionId });
