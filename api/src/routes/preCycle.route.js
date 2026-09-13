const express = require('express');
const router = express.Router();
const { registerAspirant, getAllAspirants, getAspirantByRegistrarId, updateAspirant, deleteAspirant} = require('../controllers/preCycleRegistration.controller');
const validateRequest = require('../middlewares/validateRequest');
const { preCycleSchema, preCycleUpdateSchema } = require('../schemas/registration.schema');

router.post('/', validateRequest(preCycleSchema), registerAspirant);
router.get('/', getAllAspirants);
router.get('/:registrarId', getAspirantByRegistrarId);
router.put('/:registrarId', validateRequest(preCycleUpdateSchema), updateAspirant);
router.delete('/:registrarId', deleteAspirant);

module.exports = router;