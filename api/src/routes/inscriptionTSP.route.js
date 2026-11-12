const express = require('express');
const router = express.Router();
const {
  createInscription,
  getAllInscription,
  getInscriptionById,
  updateInscription,
  deleteInscription,
} = require('../controllers/inscriptionsTSP.controller');
const validateRequest = require('../middlewares/validateRequest');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  inscriptionPublicSchema,
  inscriptionSchema,
  inscriptionUpdateSchema,
} = require('../schemas/inscriptions.schema');

router.post('/', validateRequest(inscriptionPublicSchema), createInscription);
router.post(
  '/admin',
  authenticateToken,
  authorizeRoles('admin', 'director', 'staff_bedele'),
  validateRequest(inscriptionSchema),
  createInscription
);
router.get('/', authenticateToken, authorizeRoles('admin', 'director', 'staff_bedele'), getAllInscription);
router.get('/:inscriptionId', authenticateToken, authorizeRoles('admin', 'director', 'staff_bedele'), getInscriptionById);
router.put(
  '/:inscriptionId',
  authenticateToken,
  authorizeRoles('admin', 'director', 'staff_bedele'),
  validateRequest(inscriptionUpdateSchema),
  updateInscription
);
router.delete(
  '/:inscriptionId',
  authenticateToken,
  authorizeRoles('admin', 'director', 'staff_bedele'),
  deleteInscription
);

module.exports = router;
