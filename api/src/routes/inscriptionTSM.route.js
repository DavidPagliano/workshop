const express = require('express');
const router = express.Router();
const {
  createInscriptionTSM,
  getAllInscriptionsTSM,
  getInscriptionTSMById,
  updateInscriptionTSM,
  deleteInscriptionTSM,
} = require('../controllers/inscriptionsTSM.controller');
const validateRequest = require('../middlewares/validateRequest');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  inscriptionPublicSchema,
  inscriptionSchema,
  inscriptionUpdateSchema,
} = require('../schemas/inscriptions.schema');

router.post('/', validateRequest(inscriptionPublicSchema), createInscriptionTSM);

router.post(
  '/admin',
  authenticateToken,
  authorizeRoles('admin', 'director', 'staff_bedele'),
  validateRequest(inscriptionSchema),
  createInscriptionTSM
);

router.get('/', authenticateToken, authorizeRoles('admin', 'director', 'staff_bedele'), getAllInscriptionsTSM);
router.get('/:inscriptionId', authenticateToken, authorizeRoles('admin', 'director', 'staff_bedele'), getInscriptionTSMById);
router.put(
  '/:inscriptionId',
  authenticateToken,
  authorizeRoles('admin', 'director', 'staff_bedele'),
  validateRequest(inscriptionUpdateSchema),
  updateInscriptionTSM
);

// Eliminación exclusiva de administradores
router.delete(
  '/:inscriptionId',
  authenticateToken,
  authorizeRoles('admin', 'director', 'staff_bedele'),
  deleteInscriptionTSM
);

module.exports = router;
