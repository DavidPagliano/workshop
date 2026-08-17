const express = require('express');
const router = express.Router();
const { registerAspirant, getAllAspirants, getAspirantById, updateAspirant, deleteAspirant} = require('../controllers/preCycleRegistration.controller');
const validateRequest = require('../middlewares/validateRequest');
const { preCycleSchema } = require('../schemas/registrationSchema');

router.post('/', validateRequest(preCycleSchema), registerAspirant);
router.get('/', getAllAspirants);
router.get('/:id', getAspirantById);
router.put('/:id', updateAspirant);
router.delete('/:id', deleteAspirant);

module.exports = router;