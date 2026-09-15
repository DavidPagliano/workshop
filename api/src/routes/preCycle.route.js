const express = require('express');
const router = express.Router();
const {
  registerAspirant,
  getAllAspirants,
  getAspirantByRegistrarId,
  updateAspirant,
  deleteAspirant,
} = require('../controllers/preCycleRegistration.controller');
const validateRequest = require('../middlewares/validateRequest');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { preCycleSchema, preCycleUpdateSchema } = require('../schemas/registration.schema');

// Ruta pública: formulario de pre-inscripción del aspirante
router.post('/', validateRequest(preCycleSchema), registerAspirant);

router.get('/', authenticateToken, authorizeRoles('admin', 'director', 'staff_bedele'), getAllAspirants);
router.get('/:registrarId', authenticateToken, authorizeRoles('admin', 'director', 'staff_bedele'), getAspirantByRegistrarId);
router.put('/:registrarId', authenticateToken, authorizeRoles('admin', 'director', 'staff_bedele'), validateRequest(preCycleUpdateSchema), updateAspirant);

// Eliminación exclusiva de administradores
router.delete(
  '/:registrarId',
  authenticateToken,
  authorizeRoles('admin'),
  deleteAspirant
);

module.exports = router;