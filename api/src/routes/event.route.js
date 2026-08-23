const express = require('express');
const router = express.Router();
const { 
    createEventRegistration, 
    getAllEventRegistrations, 
    getEventRegistrationByRegistrarId,
    updateEventRegistration, 
    deleteEventRegistration,
    markAttendance } = require('../controllers/eventRegistration.controller');
const validateRequest = require('../middlewares/validateRequest');
const { eventSchema } = require('../schemas/registrationSchema');

// Zod valida -> Controlador recibe datos limpios -> Servicio ejecuta lógica -> Base de Datos
router.post('/', validateRequest(eventSchema), createEventRegistration);
router.get('/', getAllEventRegistrations);
router.get('/:registrarId', getEventRegistrationByRegistrarId);
router.put('/:registrarId', updateEventRegistration);
router.delete('/:registrarId', deleteEventRegistration);
router.patch('/:registrarId/registrado', markAttendance);

module.exports = router;