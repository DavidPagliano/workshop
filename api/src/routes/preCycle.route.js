const express = require('express');
const router = express.Router();
const { registerAspirant, getAllAspirants, getAspirantByRegistrarId, updateAspirant, deleteAspirant} = require('../controllers/preCycleRegistration.controller');
const validateRequest = require('../middlewares/validateRequest');
const { preCycleSchema } = require('../schemas/registrationSchema');

router.post('/', validateRequest(preCycleSchema), registerAspirant);
router.get('/', getAllAspirants);
router.get('/:registrarId', getAspirantByRegistrarId);
router.put('/:registrarId', updateAspirant);
router.delete('/:registrarId', deleteAspirant);

module.exports = router;