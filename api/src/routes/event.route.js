const express = require('express');
const router = express.Router();
const {
  createEventRegistration,
  getAllEventRegistrations,
  getEventRegistrationByRegistrarId,
  updateEventRegistration,
  deleteEventRegistration,
  markAttendance,
} = require('../controllers/eventRegistration.controller');
const validateRequest = require('../middlewares/validateRequest');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { eventSchema, eventUpdateSchema } = require('../schemas/registration.schema');

// Rutas públicas (registro de participantes)
router.post('/', validateRequest(eventSchema), createEventRegistration);

// Rutas protegidas por rol
router.get('/', authenticateToken, authorizeRoles('admin', 'director', 'staff_registracion'), getAllEventRegistrations);
router.get('/:registrarId', authenticateToken, authorizeRoles('admin', 'director', 'staff_registracion'), getEventRegistrationByRegistrarId);
router.put('/:registrarId', authenticateToken, authorizeRoles('admin', 'director'), validateRequest(eventUpdateSchema), updateEventRegistration);
router.patch('/:registrarId/registrado', authenticateToken, authorizeRoles('admin', 'director', 'staff_registracion'), markAttendance);
router.delete('/:registrarId', authenticateToken, authorizeRoles('admin'), deleteEventRegistration);

module.exports = router;